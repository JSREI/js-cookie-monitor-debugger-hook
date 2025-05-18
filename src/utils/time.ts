/**
 * 时间工具函数集合
 * 提供了各种时间格式化、解析和操作函数
 */

/**
 * 格式化当前时间为指定格式的字符串
 * @param format 输出格式，可选值：
 *   - 'default': "[YYYY-MM-DD HH:mm:ss.SSS]"
 *   - 'date': "YYYY-MM-DD"
 *   - 'time': "HH:mm:ss"
 *   - 'datetime': "YYYY-MM-DD HH:mm:ss"
 *   - 'iso': ISO 8601格式
 * @returns 格式化后的时间字符串
 */
export function now(format: 'default' | 'date' | 'time' | 'datetime' | 'iso' = 'default'): string {
    const date = new Date();
    
    switch (format) {
        case 'date':
            return formatDate(date);
        case 'time':
            return formatTime(date);
        case 'datetime':
            return formatDateTime(date);
        case 'iso':
            return date.toISOString();
        case 'default':
        default:
            return `[${formatDateTime(date, true)}]`;
    }
}

/**
 * 格式化日期部分 (YYYY-MM-DD)
 * @param date Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
}

/**
 * 格式化时间部分 (HH:mm:ss)
 * @param date Date对象
 * @param withMilliseconds 是否包含毫秒
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: Date, withMilliseconds = false): string {
    const time = date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    return withMilliseconds 
        ? `${time}.${String(date.getMilliseconds()).padStart(3, '0')}`
        : time;
}

/**
 * 格式化日期和时间 (YYYY-MM-DD HH:mm:ss)
 * @param date Date对象
 * @param withMilliseconds 是否包含毫秒
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date, withMilliseconds = false): string {
    return `${formatDate(date)} ${formatTime(date, withMilliseconds)}`;
}

/**
 * 获取用户浏览器的当前时区偏移（分钟）
 * @returns 时区偏移（分钟）
 */
export function getTimezoneOffset(): number {
    return new Date().getTimezoneOffset();
}

/**
 * 获取用户浏览器的时区名称
 * @returns 时区名称字符串，如 "Asia/Shanghai" 或 "UTC+8"
 */
export function getTimezoneName(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        // 如果Intl API不可用，返回基于偏移量的时区名称
        const offset = -getTimezoneOffset() / 60; // 转换为小时且反转符号
        return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }
} 