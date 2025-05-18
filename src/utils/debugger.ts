/**
 * 获取代码调用位置
 * @returns 代码位置字符串
 */
export function getCodeLocation(): string {
    // @ts-ignore - 为与原JS版本保持一致，忽略可能的undefined
    const callstack = new Error().stack.split("\n");
    while (callstack.length && callstack[0].indexOf("cc11001100") === -1) {
        callstack.shift();
    }
    callstack.shift();
    callstack.shift();

    // @ts-ignore - 为与原JS版本保持一致，忽略可能的undefined
    return callstack[0].trim();
} 