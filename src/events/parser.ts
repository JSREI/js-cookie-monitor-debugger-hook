import { CookiePairType } from '../types';
import { CookiePair } from '../models';
import { splitKeyValue } from '../utils';

/**
 * 将本次设置cookie的字符串解析为容易处理的形式
 *
 * @param cookieString 原始Cookie字符串
 * @returns 解析后的Cookie对象
 */
export function parseSetCookie(cookieString: string): CookiePairType {
    // uuid_tt_dd=10_37476713480-1609821005397-659114; Expires=Thu, 01 Jan 1025 00:00:00 GMT; Path=/; Domain=.csdn.net;
    const cookieStringSplit = cookieString.split(";");
    // @ts-ignore - 与原JS版本保持一致的短路操作
    const {key, value} = splitKeyValue(cookieStringSplit.length && cookieStringSplit[0]);
    const map = new Map<string, string>();
    for (let i = 1; i < cookieStringSplit.length; i++) {
        const {key, value} = splitKeyValue(cookieStringSplit[i]);
        map.set(key.toLowerCase(), value);
    }
    // 当不设置expires的时候关闭浏览器就过期
    const expires = map.get("expires");
    return new CookiePair(key, value, expires ? new Date(expires).getTime() : null);
}

/**
 * 获取当前所有已经设置的cookie
 *
 * @returns Cookie映射表
 */
export function getCurrentCookieMap(): Map<string, CookiePairType> {
    const cookieMap = new Map<string, CookiePairType>();
    if (!document.cookie) {
        return cookieMap;
    }
    document.cookie.split(";").forEach(x => {
        const {key, value} = splitKeyValue(x);
        // @ts-ignore - 保持与原JS版本一致，不传第三个参数
        cookieMap.set(key, new CookiePair(key, value));
    });
    return cookieMap;
} 