import { debuggerRules } from '../cookie-monitor/config';

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
export function testDebuggerRules(setCookieOriginalValue: string, eventName: string, cookieName: string, cookieValue: string | null, cookieValueChanged?: boolean): void {
    for (let rule of debuggerRules) {
        // rule当前的值表示被什么断点规则匹配到了，可以把鼠标移动到rule变量上查看
        if (rule.test(eventName, cookieName, cookieValue)) {
            // 如果规则匹配的话则进入断点
            debugger;
        }
    }
} 