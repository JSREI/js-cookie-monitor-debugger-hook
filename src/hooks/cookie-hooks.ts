import { CustomPropertyDescriptor } from '../types';
import { definePropertyIsMe, getRealDocumentCookieProperty } from '../cookie-monitor/config';
import { cc11001100_onSetCookie } from '../events/handlers';

/**
 * 安装Cookie钩子
 * 拦截document.cookie属性的访问和设置
 */
export function installCookieHooks(): void {
    // 此处实现的反复hook，保证页面流程能够继续往下走下去
    (function addCookieHook() {
        const handler: CustomPropertyDescriptor = {
            get: () => {
                // 先恢复原状
                // @ts-ignore - 允许delete操作
                delete document.cookie;

                try {
                    // 如果网站开发者有设置自己的属性访问符的话，则以他设置的为准，把它的返回值作为此函数最终的返回值，保持其原有逻辑
                    const realProperty = getRealDocumentCookieProperty();
                    if (realProperty && "get" in realProperty && realProperty["get"]) {
                        // 在网站执行者自己定义的cookie的property执行期间，我们的工具添加的hook是被下掉的，所以是没有影响的
                        // fix #13 此处的this需要绑定为document
                        // @ts-ignore - 允许将IArguments传递给apply方法
                        return realProperty["get"].apply(document, arguments);
                    } else {
                        // 如果网站开发者没有设置自己的property的话，则获取到真正的cookie值返回
                        return document.cookie;
                    }
                } finally {
                    // 然后这么获取完之后，还是要把hook加上
                    addCookieHook();
                }

            }, set: (newValue: string) => {
                // 先触发相关的事件
                cc11001100_onSetCookie(newValue);

                // 然后恢复原状，把我们设置的hook啥的下掉
                // @ts-ignore - 允许delete操作
                delete document.cookie;

                try {
                    // 如果网站开发者有设置自己的属性访问符的话，则以他设置的为准
                    const realProperty = getRealDocumentCookieProperty();
                    if (realProperty && "set" in realProperty && realProperty["set"]) {
                        // 在网站执行者自己定义的cookie的property执行期间，我们的工具添加的hook是被下掉的，所以是没有影响的
                        // 不过这同时带来一个新的问题，就是如果它在这个property中进行cookie的操作我们无法感知到，那能怎么办呢？有得必有失
                        // TODO 2023-7-26 22:02:11 那，有没有比较简单的"我全都要"的方案呢？
                        // fix #13 此处的this需要绑定为document
                        realProperty["set"].apply(document, [newValue]);
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
} 