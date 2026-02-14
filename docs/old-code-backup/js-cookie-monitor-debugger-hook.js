// ==UserScript==
// @name         JS Cookie Monitor/Debugger Hook
// @namespace    https://github.com/CC11001100/js-cookie-monitor-debugger-hook
// @version      0.11
// @description  用于监控js对cookie的修改，或者在cookie符合给定条件时进入断点
// @document   https://github.com/CC11001100/js-cookie-monitor-debugger-hook
// @author       CC11001100
// @match       *://*/*
// @run-at      document-start
// @grant       none
// ==/UserScript==

(() => {

        // 使用文档： https://github.com/CC11001100/js-cookie-monitor-debugger-hook

        // @since v0.6 断点规则发生了向后不兼容变化，详情请查阅文档
        const debuggerRules = [];
        // example:
        // const debuggerRules = ["foo", /foo_\d+/];

        // 设置事件断点是否开启，一般保持默认即可
        const enableEventDebugger = {
            "add": true, "update": true, "delete": true, "read": true,
        }

        // 在控制台打印日志时字体大小，根据自己喜好调整
        // 众所周知，12px是宇宙通用大小
        const consoleLogFontSize = 12;

        // 使用document.cookie更新cookie，但是cookie新的值和原来的值一样，此时要不要忽略这个事件
        const ignoreUpdateButNotChanged = false;

        // 网站的开发者也可能会使用到Object.，这会与工具内置的冲突，使用这个变量持有者目标网站开发者自己设置的
        // 然后在执行的时候使其真正的生效，这样不影响原有的逻辑
        let realDocumentCookieProperty = null;

        // 用于区分是本插件自己调用的definePropertyIsMe还是外部调用的
        const definePropertyIsMe = "CC11001100-js-cookie-monitor-debugger-hook";

        // 页面内部的Object.defineProperty需要能够劫持一下
        (function () {

            // 把Object.defineProperty给拦截了
            Object.defineProperty = new Proxy(Object.defineProperty, {
                apply: function (target, thisArg, argArray) {

                    // 检查是否是自己调用的
                    const isMe = argArray && argArray.length >= 3 && argArray[2] && definePropertyIsMe in argArray[2];

                    // 检查是否是定义的document.cookie
                    const isDocumentCookie = argArray && argArray.length >= 2 && argArray[0] === document && "cookie" === argArray[1];

                    if (!isMe && isDocumentCookie) {
                        // 检查要定义访问符的是否是document.cookie这个方法的话就包装一下，保证同时多个都能被调用到
                        if (argArray && argArray.length >= 3) {
                            // 更新一下real property就不管了，
                            realDocumentCookieProperty = argArray[2];
                            return;
                        }
                    }
                    return target.apply(thisArg, argArray);
                }
            });

            Object.defineProperty.toString = function () {
                return "function defineProperty() { [native code] }";
            }

            // 把Object.defineProperties也给拦截了
            Object.defineProperties = new Proxy(Object.defineProperties, {
                apply: function (target, thisArg, argArray) {
                    // 可能会通过如下代码来调用：
                    // Object.defineProperties(document, {"cookie": {...})
                    const isDocumentCookie = argArray && argArray.length >= 2 && document === argArray[0] && "cookie" in argArray[1];
                    if (isDocumentCookie) {
                        // 把要设置的property描述符持有者
                        realDocumentCookieProperty = argArray[1]["cookie"];
                        // 任务这个cookie的define已经执行完了，将其删除掉
                        delete argArray[1]["cookie"];
                        // 如果只有一个cookie的话，删除完没有其它的属性了，则没必要继续往下了
                        // 如果有剩余的属性的话，则需要原样继续执行
                        if (!Object.keys(argArray[1]).length) {
                            return;
                        }
                    }
                    return target.apply(thisArg, argArray);
                }
            });

            Object.defineProperties.toString = function () {
                return "function defineProperties() { [native code] }";
            }

        })();

        // 此处实现的反复hook，保证页面流程能够继续往下走下去
        (function addCookieHook() {
            const handler = {
                get: () => {

                    // 先恢复原状
                    delete document.cookie;

                    try {
                        // 如果网站开发者有设置自己的属性访问符的话，则以他设置的为准，把它的返回值作为此函数最终的返回值，保持其原有逻辑
                        if (realDocumentCookieProperty && "get" in realDocumentCookieProperty) {
                            // 在网站执行者自己定义的cookie的property执行期间，我们的工具添加的hook是被下掉的，所以是没有影响的
                            // fix #13 此处的this需要绑定为document
                            return realDocumentCookieProperty["get"].apply(document, arguments);
                        } else {
                            // 如果网站开发者没有设置自己的property的话，则获取到真正的cookie值返回
                            return document.cookie;
                        }
                    } finally {
                        // 然后这么获取完之后，还是要把hook加上
                        addCookieHook();
                    }

                }, set: newValue => {

                    // 先触发相关的事件
                    cc11001100_onSetCookie(newValue);

                    // 然后恢复原状，把我们设置的hook啥的下掉
                    delete document.cookie;

                    try {
                        // 如果网站开发者有设置自己的属性访问符的话，则以他设置的为准
                        if (realDocumentCookieProperty && "set" in realDocumentCookieProperty) {
                            // 在网站执行者自己定义的cookie的property执行期间，我们的工具添加的hook是被下掉的，所以是没有影响的
                            // 不过这同时带来一个新的问题，就是如果它在这个property中进行cookie的操作我们无法感知到，那能怎么办呢？有得必有失
                            // TODO 2023-7-26 22:02:11 那，有没有比较简单的“我全都要”的方案呢？
                            // fix #13 此处的this需要绑定为document
                            realDocumentCookieProperty["set"].apply(document, [newValue]);
                        } else {
                            // 如果网站开发者没有设置property或者没有设置set的话，则还是走默认的赋值逻辑
                            document.cookie = newValue;
                        }
                    } finally {
                        // 然后再把hook设置上，加在finally里保证就算出错了也能恢复hook
                        addCookieHook();
                    }

                }, configurable: true, enumerable: false,
            };
            handler[definePropertyIsMe] = true;
            Object.defineProperty(document, "cookie", handler);
        })();

        /**
         * 这个方法的前缀起到命名空间的作用，等下调用栈追溯赋值cookie的代码时需要用这个名字作为终结标志
         *
         * @param newValue
         */
        function cc11001100_onSetCookie(newValue) {
            const cookiePair = parseSetCookie(newValue);
            const currentCookieMap = getCurrentCookieMap();

            // 如果过期时间为当前时间之前，则为删除，有可能没设置？虽然目前为止没碰到这样的...
            if (cookiePair.expires !== null && new Date().getTime() >= cookiePair.expires) {
                onDeleteCookie(newValue, cookiePair.name, cookiePair.value || (currentCookieMap.get(cookiePair.name) || {}).value);
                return;
            }

            // 如果之前已经存在，则是修改
            if (currentCookieMap.has(cookiePair.name)) {
                onUpdateCookie(newValue, cookiePair.name, currentCookieMap.get(cookiePair.name).value, cookiePair.value);
                return;
            }

            // 否则则为添加
            onAddCookie(newValue, cookiePair.name, cookiePair.value);
        }

        function onReadCookie(cookieOriginalValue, cookieName, cookieValue) {

        }

        function onDeleteCookie(cookieOriginalValue, cookieName, cookieValue) {
            const valueStyle = `color: black; background: #E50000; font-size: ${consoleLogFontSize}px; font-weight: bold;`;
            const normalStyle = `color: black; background: #FF6766; font-size: ${consoleLogFontSize}px;`;

            const message = [

                normalStyle, now(),

                normalStyle, "JS Cookie Monitor: ",

                normalStyle, "delete cookie, cookieName = ",

                valueStyle, `${cookieName}`,

                ...(() => {
                    if (!cookieValue) {
                        return [];
                    }
                    return [normalStyle, ", value = ",

                        valueStyle, `${cookieValue}`,];
                })(),

                normalStyle, `, code location = ${getCodeLocation()}`];
            console.log(genFormatArray(message), ...message);

            testDebuggerRules(cookieOriginalValue, "delete", cookieName, cookieValue);
        }

        function onUpdateCookie(cookieOriginalValue, cookieName, oldCookieValue, newCookieValue) {

            const cookieValueChanged = oldCookieValue !== newCookieValue;

            if (ignoreUpdateButNotChanged && !cookieValueChanged) {
                return;
            }

            const valueStyle = `color: black; background: #FE9900; font-size: ${consoleLogFontSize}px; font-weight: bold;`;
            const normalStyle = `color: black; background: #FFCC00; font-size: ${consoleLogFontSize}px;`;

            const message = [

                normalStyle, now(),

                normalStyle, "JS Cookie Monitor: ",

                normalStyle, "update cookie, cookieName = ",

                valueStyle, `${cookieName}`,

                ...(() => {
                    if (cookieValueChanged) {
                        return [normalStyle, `, oldValue = `,

                            valueStyle, `${oldCookieValue}`,

                            normalStyle, `, newValue = `,

                            valueStyle, `${newCookieValue}`]
                    } else {
                        return [normalStyle, `, value = `,

                            valueStyle, `${newCookieValue}`,];
                    }
                })(),

                normalStyle, `, valueChanged = `,

                valueStyle, `${cookieValueChanged}`,

                normalStyle, `, code location = ${getCodeLocation()}`];
            console.log(genFormatArray(message), ...message);

            testDebuggerRules(cookieOriginalValue, "update", cookieName, newCookieValue, cookieValueChanged);
        }

        function onAddCookie(cookieOriginalValue, cookieName, cookieValue) {
            const valueStyle = `color: black; background: #669934; font-size: ${consoleLogFontSize}px; font-weight: bold;`;
            const normalStyle = `color: black; background: #65CC66; font-size: ${consoleLogFontSize}px;`;

            const message = [

                normalStyle, now(),

                normalStyle, "JS Cookie Monitor: ",

                normalStyle, "add cookie, cookieName = ",

                valueStyle, `${cookieName}`,

                normalStyle, ", cookieValue = ",

                valueStyle, `${cookieValue}`,

                normalStyle, `, code location = ${getCodeLocation()}`];
            console.log(genFormatArray(message), ...message);

            testDebuggerRules(cookieOriginalValue, "add", cookieName, cookieValue);
        }

        function now() {
            // 东八区专属...
            return "[" + new Date(new Date().getTime() + 1000 * 60 * 60 * 8).toJSON().replace("T", " ").replace("Z", "") + "] ";
        }

        function genFormatArray(messageAndStyleArray) {
            const formatArray = [];
            for (let i = 0, end = messageAndStyleArray.length / 2; i < end; i++) {
                formatArray.push("%c%s");
            }
            return formatArray.join("");
        }

        // 解析当前代码的位置，以便能够直接定位到事件触发的代码位置
        function getCodeLocation() {
            const callstack = new Error().stack.split("\n");
            while (callstack.length && callstack[0].indexOf("cc11001100") === -1) {
                callstack.shift();
            }
            callstack.shift();
            callstack.shift();

            return callstack[0].trim();
        }

        /**
         * 将本次设置cookie的字符串解析为容易处理的形式
         *
         * @param cookieString
         * @returns {CookiePair}
         */
        function parseSetCookie(cookieString) {
            // uuid_tt_dd=10_37476713480-1609821005397-659114; Expires=Thu, 01 Jan 1025 00:00:00 GMT; Path=/; Domain=.csdn.net;
            const cookieStringSplit = cookieString.split(";");
            const {key, value} = splitKeyValue(cookieStringSplit.length && cookieStringSplit[0])
            const map = new Map();
            for (let i = 1; i < cookieStringSplit.length; i++) {
                let {key, value} = splitKeyValue(cookieStringSplit[i]);
                map.set(key.toLowerCase(), value);
            }
            // 当不设置expires的时候关闭浏览器就过期
            const expires = map.get("expires");
            return new CookiePair(key, value, expires ? new Date(expires).getTime() : null)
        }

        /**
         * 安全地解码 URI 组件
         * @param str
         * @returns {string}
         */
        function safeDecode(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                // 出错就原样返回，避免 URI malformed
                return str;
            }
        }

        /**
         * 把按照等号=拼接的key、value字符串切分开
         * @param s
         * @returns {{value: string, key: string}}
         */
        function splitKeyValue(s) {
            let key = "", value = "";
            const keyValueArray = (s || "").split("=");

            if (keyValueArray.length) {
                key = safeDecode(keyValueArray[0].trim());
            }

            if (keyValueArray.length > 1) {
                value = safeDecode(keyValueArray.slice(1).join("=").trim());
            }

            return {
                key, value
            }
        }

        /**
         * 获取当前所有已经设置的cookie
         *
         * @returns {Map<string, CookiePair>}
         */
        function getCurrentCookieMap() {
            const cookieMap = new Map();
            if (!document.cookie) {
                return cookieMap;
            }
            document.cookie.split(";").forEach(x => {
                const {key, value} = splitKeyValue(x);
                cookieMap.set(key, new CookiePair(key, value));
            });
            return cookieMap;
        }

        class DebuggerRule {

            constructor(eventName, cookieNameFilter, cookieValueFilter) {
                this.eventName = eventName;
                this.cookieNameFilter = cookieNameFilter;
                this.cookieValueFilter = cookieValueFilter;
            }

            test(eventName, cookieName, cookieValue) {
                return this.testByEventName(eventName) && (this.testByCookieNameFilter(cookieName) || this.testByCookieValueFilter(cookieValue));
            }

            testByEventName(eventName) {
                // 如果此类型的事件断点没有开启，则直接返回
                if (!enableEventDebugger[eventName]) {
                    return false;
                }
                // 事件不设置则匹配任何事件
                if (!this.eventName) {
                    return true;
                }
                return this.eventName === eventName;
            }

            testByCookieNameFilter(cookieName) {
                if (!cookieName || !this.cookieNameFilter) {
                    return false;
                }
                if (typeof this.cookieNameFilter === "string") {
                    return this.cookieNameFilter === cookieName;
                }
                if (this.cookieNameFilter instanceof RegExp) {
                    return this.cookieNameFilter.test(cookieName);
                }
                return false;
            }

            testByCookieValueFilter(cookieValue) {
                if (!cookieValue || !this.cookieValueFilter) {
                    return false;
                }
                if (typeof this.cookieValueFilter === "string") {
                    return this.cookieValueFilter === cookieValue;
                }
                if (this.cookieValueFilter instanceof RegExp) {
                    return this.cookieValueFilter.test(cookieValue);
                }
                return false;
            }

        }

        // 将规则整理为标准规则
        // 解析起来并不复杂，但是有点过于灵活，要介绍清楚打的字要远超代码，所以我文档里就随便介绍下完事有缘人会自己读代码的...
        (function standardizingRules() {

            // 用于收集规则配置错误，在解析完所有规则之后一次把事情说完
            const ruleConfigErrorMessage = [];

            const newRules = [];
            while (debuggerRules.length) {
                const rule = debuggerRules.pop();

                // 如果是字符串或者正则
                if (typeof rule === "string" || rule instanceof RegExp) {
                    newRules.push(new DebuggerRule(null, rule, null));
                    continue;
                }

                // 如果是字典对象，则似乎有点麻烦
                for (let key in rule) {
                    let events = null;
                    let cookieNameFilter = null;
                    let cookieValueFilter = null;
                    if (key === "events") {
                        events = rule["events"] || "add | delete | update";
                        cookieNameFilter = rule["name"]
                        cookieValueFilter = rule["value"];
                    } else if (key !== "name" && key !== "value") {
                        events = key;
                        cookieNameFilter = rule[key];
                        cookieValueFilter = rule["value"];
                    } else {
                        // name & value ignore
                        continue;
                    }
                    // cookie的名字是必须配置的
                    if (!cookieNameFilter) {
                        const errorMessage = `必须为此条规则 ${JSON.stringify(rule)} 配置一个Cookie Name匹配条件`;
                        ruleConfigErrorMessage.push(errorMessage);
                        continue;
                    }
                    events.split("|").forEach(eventName => {
                        eventName = eventName.trim();
                        if (eventName !== "add" && eventName !== "delete" && eventName !== "update") {
                            const errorMessage = `此条规则 ${JSON.stringify(rule)} 的Cookie事件名字配置错误，必须为 add、delete、update 三种之一或者|分隔的组合，您配置的是 ${eventName}，仅忽略此无效事件`;
                            ruleConfigErrorMessage.push(errorMessage);
                            return;
                        }
                        newRules.push(new DebuggerRule(eventName, cookieNameFilter, cookieValueFilter));
                    })
                }
            }

            // 配置错误的规则会被忽略，其它规则照常生效
            if (ruleConfigErrorMessage.length) {
                // 错误打印字号要大1.5倍，不信你注意不到
                const errorMessageStyle = `color: black; background: #FF2121; font-size: ${Math.round(consoleLogFontSize * 1.5)}px; font-weight: bold;`;
                let errorMessage = now() + "JS Cookie Monitor: 以下Cookie断点规则配置错误，已忽略： \n ";
                for (let i = 0; i < ruleConfigErrorMessage.length; i++) {
                    errorMessage += `${i + 1}. ${ruleConfigErrorMessage[i]}\n`;
                }
                console.log("%c%s", errorMessageStyle, errorMessage);
            }

            // 是否需要合并重复规则呢？
            // 还是不了，而且静态合并对于正则没办法，用户应该知道自己在做什么

            for (let rule of newRules) {
                debuggerRules.push(rule);
            }
        })();

        /**
         * 当断点停在这里时查看这个方法各个参数的值能够大致了解断点情况
         *
         *   鼠标移动到变量上查看变量的值
         *
         * @param setCookieOriginalValue 目标网站使用document.cookie时赋值的原始值是什么，这个值没有 URL decode，
         *                                  如果要分析它请拷贝其值到外面分析，这里只是提供一种可能性
         * @param eventName 本次是发生了什么事件，add增加新cookie、update更新cookie的值、delete表示cookie被删除
         * @param cookieName 本脚本对setCookieOriginalValue解析出的cookie名字，会被URL decode
         * @param cookieValue 本脚本对setCookieOriginalValue解析出的cookie值，会被URL decode
         * @param cookieValueChanged 只在update事件时有值，用于帮助快速确定本次update有没有修改cookie的值
         */
        function testDebuggerRules(setCookieOriginalValue, eventName, cookieName, cookieValue, cookieValueChanged) {
            for (let rule of debuggerRules) {
                // rule当前的值表示被什么断点规则匹配到了，可以把鼠标移动到rule变量上查看
                if (rule.test(eventName, cookieName, cookieValue)) {
                    debugger;
                }
            }
        }

        /**
         * 用于在本脚本内部表示一条cookie以方便程序处理
         * 这里只取了有用的信息，忽略了域名及路径，也许需要加上这两个限制？但现在这个脚本已经够臃肿了...
         */
        class CookiePair {

            /**
             *
             * @param name Cookie的名字
             * @param value Cookie的值
             * @param expires Cookie的过期时间
             */
            constructor(name, value, expires) {
                this.name = name;
                this.value = value;
                this.expires = expires;
            }

        }

    }

)();
