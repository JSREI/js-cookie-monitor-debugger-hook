/**
 * 格式化当前时间为指定格式
 * @returns 格式化后的时间字符串
 */
export function now(): string {
    // 东八区专属...
    return "[" + new Date(new Date().getTime() + 1000 * 60 * 60 * 8).toJSON().replace("T", " ").replace("Z", "") + "] ";
} 