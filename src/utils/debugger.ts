/**
 * 获取代码调用位置
 * @returns 代码位置字符串
 */
export function getCodeLocation(): string {
    try {
        const callstack = new Error().stack?.split("\n") || [];
        
        // 尝试查找包含特定标识的行
        const index = callstack.findIndex(line => line && line.indexOf("cc11001100") !== -1);
        
        if (index !== -1 && index + 2 < callstack.length) {
            // 如果找到标识，返回标识后的第三行
            return callstack[index + 2]?.trim() || "未知位置";
        }
        
        // 如果没找到标识或堆栈不足，返回堆栈中有意义的一行
        for (let i = 0; i < callstack.length; i++) {
            const line = callstack[i];
            if (line && !line.includes("getCodeLocation") && !line.includes("Error") && !line.includes("at Object.") && !line.includes("at Module.")) {
                return line.trim();
            }
        }
        
        // 如果实在找不到合适的行，至少返回堆栈的第一行
        return callstack[0]?.trim() || "未知位置";
    } catch (e) {
        // 出错时返回安全值
        return "位置获取失败";
    }
} 