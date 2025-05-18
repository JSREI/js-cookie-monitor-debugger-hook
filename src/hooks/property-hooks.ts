import { definePropertyIsMe, getRealDocumentCookieProperty, setRealDocumentCookieProperty } from '../cookie-monitor/config';

/**
 * 安装属性钩子
 * 拦截 Object.defineProperty 和 Object.defineProperties 的调用
 */
export function installPropertyHooks(): void {
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
                        setRealDocumentCookieProperty(argArray[2] as PropertyDescriptor);
                        return;
                    }
                }
                // @ts-ignore - 允许动态参数
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
                    setRealDocumentCookieProperty(argArray[1]["cookie"] as PropertyDescriptor);
                    // 任务这个cookie的define已经执行完了，将其删除掉
                    delete argArray[1]["cookie"];
                    // 如果只有一个cookie的话，删除完没有其它的属性了，则没必要继续往下了
                    // 如果有剩余的属性的话，则需要原样继续执行
                    if (!Object.keys(argArray[1]).length) {
                        return;
                    }
                }
                // @ts-ignore - 允许动态参数
                return target.apply(thisArg, argArray);
            }
        });

        Object.defineProperties.toString = function () {
            return "function defineProperties() { [native code] }";
        }
    })();
} 