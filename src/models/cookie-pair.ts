import { CookiePairType } from '../types';

/**
 * 用于在本脚本内部表示一条cookie以方便程序处理
 * 这里只取了有用的信息，忽略了域名及路径，也许需要加上这两个限制？但现在这个脚本已经够臃肿了...
 */
export class CookiePair implements CookiePairType {
    name: string;
    value: string | null;
    expires: number | null;

    /**
     *
     * @param name Cookie的名字
     * @param value Cookie的值
     * @param expires Cookie的过期时间
     */
    constructor(name: string, value: string | null, expires: number | null = null) {
        this.name = name;
        this.value = value;
        this.expires = expires;
    }
} 