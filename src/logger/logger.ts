import { LoggerConfig, LogLevel } from './types';
import { getCodeLocation } from '../utils/debugger';
import { now } from '../utils/time';

/**
 * 默认日志配置
 */
const defaultConfig: LoggerConfig = {
    level: LogLevel.INFO,
    showTimestamp: true,
    showLogLevel: true,
    showCodeLocation: true,
    prefix: 'JS Cookie Monitor:',
    fontSize: 12
};

/**
 * 当前日志配置
 */
let config: LoggerConfig = { ...defaultConfig };

/**
 * 日志级别对应的样式
 */
const LOG_LEVEL_STYLES: Record<LogLevel, { background: string, textColor: string }> = {
    [LogLevel.DEBUG]: { background: '#E8F5E9', textColor: '#2E7D32' },
    [LogLevel.INFO]: { background: '#E3F2FD', textColor: '#1565C0' },
    [LogLevel.WARN]: { background: '#FFF8E1', textColor: '#F57F17' },
    [LogLevel.ERROR]: { background: '#FFEBEE', textColor: '#C62828' },
    [LogLevel.NONE]: { background: '#FFFFFF', textColor: '#000000' }
};

/**
 * 获取当前日志配置
 * @returns 当前日志配置
 */
export function getLoggerConfig(): LoggerConfig {
    return { ...config };
}

/**
 * 设置日志配置
 * @param newConfig 新的日志配置（部分）
 */
export function setLoggerConfig(newConfig: Partial<LoggerConfig>): void {
    config = {
        ...config,
        ...newConfig
    };
}

/**
 * 生成格式化字符串数组
 * @param partsCount 部分数量
 * @returns 格式化字符串数组拼接后的字符串
 */
function genFormatArray(partsCount: number): string {
    return Array(partsCount).fill('%c%s').join('');
}

/**
 * 构建带样式的消息
 * @param level 日志级别
 * @param message 消息内容 (可以有多个参数)
 * @returns [格式化字符串, ...样式和消息交替排列的数组]
 */
function buildStyledMessage(level: LogLevel, ...messages: any[]): [string, ...any[]] {
    const { background, textColor } = LOG_LEVEL_STYLES[level];
    const baseStyle = `color: ${textColor}; background: ${background}; font-size: ${config.fontSize}px;`;
    const boldStyle = `${baseStyle} font-weight: bold;`;
    
    const parts: any[] = [];
    
    // 添加时间戳
    if (config.showTimestamp) {
        parts.push(baseStyle, now());
    }
    
    // 添加前缀
    parts.push(baseStyle, `${config.prefix} `);
    
    // 添加日志级别
    if (config.showLogLevel) {
        parts.push(boldStyle, `[${level.toUpperCase()}]`);
        parts.push(baseStyle, ' ');
    }
    
    // 添加消息
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        // 对象和数组使用JSON格式化
        if (typeof message === 'object' && message !== null) {
            try {
                parts.push(boldStyle, JSON.stringify(message, null, 2));
            } catch (e) {
                parts.push(boldStyle, String(message));
            }
        } else {
            parts.push(i % 2 === 0 ? baseStyle : boldStyle, String(message));
        }
        
        if (i < messages.length - 1) {
            parts.push(baseStyle, ' ');
        }
    }
    
    // 添加代码位置
    if (config.showCodeLocation) {
        parts.push(baseStyle, ` [at ${getCodeLocation()}]`);
    }
    
    return [genFormatArray(parts.length / 2), ...parts];
}

/**
 * 检查是否应该打印指定级别的日志
 * @param level 日志级别
 * @returns 是否应该打印
 */
function shouldLog(level: LogLevel): boolean {
    const levels = [
        LogLevel.DEBUG,
        LogLevel.INFO,
        LogLevel.WARN,
        LogLevel.ERROR
    ];
    
    // NONE 级别不打印任何日志
    if (config.level === LogLevel.NONE) {
        return false;
    }
    
    return levels.indexOf(level) >= levels.indexOf(config.level);
}

/**
 * 打印调试日志
 * @param messages 消息参数 (可以有多个)
 */
export function debug(...messages: any[]): void {
    if (!shouldLog(LogLevel.DEBUG)) return;
    const [format, ...args] = buildStyledMessage(LogLevel.DEBUG, ...messages);
    console.log(format, ...args);
}

/**
 * 打印信息日志
 * @param messages 消息参数 (可以有多个)
 */
export function info(...messages: any[]): void {
    if (!shouldLog(LogLevel.INFO)) return;
    const [format, ...args] = buildStyledMessage(LogLevel.INFO, ...messages);
    console.log(format, ...args);
}

/**
 * 打印警告日志
 * @param messages 消息参数 (可以有多个)
 */
export function warn(...messages: any[]): void {
    if (!shouldLog(LogLevel.WARN)) return;
    const [format, ...args] = buildStyledMessage(LogLevel.WARN, ...messages);
    console.warn(format, ...args);
}

/**
 * 打印错误日志
 * @param messages 消息参数 (可以有多个)
 */
export function error(...messages: any[]): void {
    if (!shouldLog(LogLevel.ERROR)) return;
    const [format, ...args] = buildStyledMessage(LogLevel.ERROR, ...messages);
    console.error(format, ...args);
}

/**
 * 打印自定义背景颜色的日志
 * @param backgroundColor 背景颜色
 * @param textColor 文本颜色
 * @param messages 消息参数 (可以有多个)
 */
export function custom(backgroundColor: string, textColor: string, ...messages: any[]): void {
    const baseStyle = `color: ${textColor}; background: ${backgroundColor}; font-size: ${config.fontSize}px;`;
    const boldStyle = `${baseStyle} font-weight: bold;`;
    
    const parts: any[] = [];
    
    // 添加时间戳
    if (config.showTimestamp) {
        parts.push(baseStyle, now());
    }
    
    // 添加前缀
    parts.push(baseStyle, `${config.prefix} `);
    
    // 添加消息
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (typeof message === 'object' && message !== null) {
            try {
                parts.push(boldStyle, JSON.stringify(message, null, 2));
            } catch (e) {
                parts.push(boldStyle, String(message));
            }
        } else {
            parts.push(i % 2 === 0 ? baseStyle : boldStyle, String(message));
        }
        
        if (i < messages.length - 1) {
            parts.push(baseStyle, ' ');
        }
    }
    
    // 添加代码位置
    if (config.showCodeLocation) {
        parts.push(baseStyle, ` [at ${getCodeLocation()}]`);
    }
    
    console.log(genFormatArray(parts.length / 2), ...parts);
}

// 导出默认日志实例
export default {
    debug,
    info,
    warn,
    error,
    custom,
    getConfig: getLoggerConfig,
    setConfig: setLoggerConfig
}; 