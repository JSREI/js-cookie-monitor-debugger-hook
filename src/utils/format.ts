import { KeyValuePair } from '../types';

/**
 * 生成日志输出的格式化数组
 * @param messageAndStyleArray 消息和样式数组
 * @returns 格式化数组
 */
export function genFormatArray(messageAndStyleArray: string[]): string {
    const formatArray: string[] = [];
    for (let i = 0, end = messageAndStyleArray.length / 2; i < end; i++) {
        formatArray.push("%c%s");
    }
    return formatArray.join("");
}

/**
 * 把按照等号=拼接的key、value字符串切分开
 * @param s 包含键值对的字符串
 * @returns 切分后的键值对对象
 */
export function splitKeyValue(s: string): KeyValuePair {
    let key = "", value = "";
    const keyValueArray = (s || "").split("=");

    if (keyValueArray.length) {
        key = decodeURIComponent(keyValueArray[0].trim());
    }

    if (keyValueArray.length > 1) {
        value = decodeURIComponent(keyValueArray.slice(1).join("=").trim());
    }

    return {
        key, value
    };
} 