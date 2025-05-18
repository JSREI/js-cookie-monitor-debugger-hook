import { getConsoleLogFontSize, getIgnoreUpdateButNotChanged } from '../core/config';
import { testDebuggerRules } from '../rules/tester';
import { genFormatArray, getCodeLocation, now } from '../utils';
import { getCurrentCookieMap, parseSetCookie } from './parser';

/**
 * 这个方法的前缀起到命名空间的作用，等下调用栈追溯赋值cookie的代码时需要用这个名字作为终结标志
 *
 * @param newValue Cookie新值
 */
export function cc11001100_onSetCookie(newValue: string): void {
    const cookiePair = parseSetCookie(newValue);
    const currentCookieMap = getCurrentCookieMap();

    // 如果过期时间为当前时间之前，则为删除，有可能没设置？虽然目前为止没碰到这样的...
    if (cookiePair.expires !== null && new Date().getTime() >= cookiePair.expires) {
        onDeleteCookie(newValue, cookiePair.name, cookiePair.value || (currentCookieMap.get(cookiePair.name)?.value || null));
        return;
    }

    // 如果之前已经存在，则是修改
    if (currentCookieMap.has(cookiePair.name)) {
        onUpdateCookie(newValue, cookiePair.name, currentCookieMap.get(cookiePair.name)!.value || "", cookiePair.value);
        return;
    }

    // 否则则为添加
    onAddCookie(newValue, cookiePair.name, cookiePair.value);
}

/**
 * 处理读取Cookie事件
 * @param cookieOriginalValue 原始Cookie字符串
 * @param cookieName Cookie名称
 * @param cookieValue Cookie值
 */
export function onReadCookie(cookieOriginalValue: string, cookieName: string, cookieValue: string): void {
    // 虽然原JS版本中这个函数是空的，但为了完整性添加实现
    // 需要触发读取Cookie功能时，取消以下代码的注释

    /*
    const valueStyle = `color: black; background: #4169E1; font-size: ${getConsoleLogFontSize()}px; font-weight: bold;`;
    const normalStyle = `color: black; background: #ADD8E6; font-size: ${getConsoleLogFontSize()}px;`;

    const message = [
        normalStyle, now(),
        normalStyle, "JS Cookie Monitor: ",
        normalStyle, "read cookie, cookieName = ",
        valueStyle, `${cookieName}`,
        normalStyle, ", value = ",
        valueStyle, `${cookieValue}`,
        normalStyle, `, code location = ${getCodeLocation()}`
    ];

    console.log(genFormatArray(message), ...message);

    testDebuggerRules(cookieOriginalValue, "read", cookieName, cookieValue, null);
    */
}

/**
 * 处理删除Cookie事件
 * @param cookieOriginalValue 原始Cookie字符串
 * @param cookieName Cookie名称
 * @param cookieValue Cookie值
 */
export function onDeleteCookie(cookieOriginalValue: string, cookieName: string, cookieValue: string | null): void {
    const valueStyle = `color: black; background: #E50000; font-size: ${getConsoleLogFontSize()}px; font-weight: bold;`;
    const normalStyle = `color: black; background: #FF6766; font-size: ${getConsoleLogFontSize()}px;`;

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
        normalStyle, `, code location = ${getCodeLocation()}`
    ];

    console.log(genFormatArray(message), ...message);

    // @ts-ignore - 保持与原JS版本一致的调用方式
    testDebuggerRules(cookieOriginalValue, "delete", cookieName, cookieValue);
}

/**
 * 处理更新Cookie事件
 * @param cookieOriginalValue 原始Cookie字符串
 * @param cookieName Cookie名称
 * @param oldCookieValue 旧Cookie值
 * @param newCookieValue 新Cookie值
 */
export function onUpdateCookie(cookieOriginalValue: string, cookieName: string, oldCookieValue: string, newCookieValue: string | null): void {
    const cookieValueChanged = oldCookieValue !== newCookieValue;
    
    // 忽略cookie更新但值没变的情况
    if (getIgnoreUpdateButNotChanged() && !cookieValueChanged) {
        return;
    }

    const valueStyle = `color: black; background: #FE9900; font-size: ${getConsoleLogFontSize()}px; font-weight: bold;`;
    const normalStyle = `color: black; background: #FFCC00; font-size: ${getConsoleLogFontSize()}px;`;

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
                    valueStyle, `${newCookieValue}`];
            } else {
                return [normalStyle, `, value = `,
                    valueStyle, `${newCookieValue}`];
            }
        })(),
        normalStyle, `, valueChanged = `,
        valueStyle, `${cookieValueChanged}`,
        normalStyle, `, code location = ${getCodeLocation()}`
    ];

    console.log(genFormatArray(message), ...message);

    testDebuggerRules(cookieOriginalValue, "update", cookieName, newCookieValue, cookieValueChanged);
}

/**
 * 处理添加Cookie事件
 * @param cookieOriginalValue 原始Cookie字符串
 * @param cookieName Cookie名称
 * @param cookieValue Cookie值
 */
export function onAddCookie(cookieOriginalValue: string, cookieName: string, cookieValue: string | null): void {
    const valueStyle = `color: black; background: #669934; font-size: ${getConsoleLogFontSize()}px; font-weight: bold;`;
    const normalStyle = `color: black; background: #65CC66; font-size: ${getConsoleLogFontSize()}px;`;

    const message = [
        normalStyle, now(),
        normalStyle, "JS Cookie Monitor: ",
        normalStyle, "add cookie, cookieName = ",
        valueStyle, `${cookieName}`,
        normalStyle, ", cookieValue = ",
        valueStyle, `${cookieValue}`,
        normalStyle, `, code location = ${getCodeLocation()}`
    ];

    console.log(genFormatArray(message), ...message);

    // @ts-ignore - 保持与原JS版本一致的调用方式
    testDebuggerRules(cookieOriginalValue, "add", cookieName, cookieValue);
} 