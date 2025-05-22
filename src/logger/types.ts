/**
 * 日志级别枚举
 */
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    NONE = 'none'
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
    /**
     * 日志级别，低于该级别的日志将不会输出
     */
    level: LogLevel;

    /**
     * 是否显示时间戳
     */
    showTimestamp: boolean;

    /**
     * 是否显示日志级别
     */
    showLogLevel: boolean;

    /**
     * 是否显示代码位置
     */
    showCodeLocation: boolean;

    /**
     * 脚本标识前缀
     */
    prefix: string;

    /**
     * 字体大小(px)
     */
    fontSize: number;
} 