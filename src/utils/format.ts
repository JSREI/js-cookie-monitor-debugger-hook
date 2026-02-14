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
 * 安全地解码 URI 组件
 * @param str
 * @returns 解码后的字符串
 */
function safeDecode(str: string) {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        // 出错就原样返回，避免 URI malformed
        return str;
    }
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
        key = safeDecode(keyValueArray[0].trim());
    }

    if (keyValueArray.length > 1) {
        value = safeDecode(keyValueArray.slice(1).join("=").trim());
    }

    return {
        key, value
    };
} 