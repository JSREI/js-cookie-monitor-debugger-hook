// 核心类型定义

// Cookie键值对类型
export interface CookiePairType {
    name: string;
    value: string | null;
    expires: number | null;
}

// 调试规则类型
export interface DebuggerRuleType {
    test(eventName: string, cookieName: string, cookieValue: string | null): boolean;
    testByEventName(eventName: string): boolean;
    testByCookieNameFilter(cookieName: string): boolean;
    testByCookieValueFilter(cookieValue: string | null): boolean;
}

// 为definePropertyIsMe创建类型扩展
export interface CustomPropertyDescriptor extends PropertyDescriptor {
    [key: string]: any;
}
// Cookie事件类型
export type CookieEventType = 'add' | 'update' | 'delete' | 'read';

// 存储事件调试是否开启的配置
export type EventDebuggerConfig = Record<CookieEventType, boolean>;

// 键值对拆分结果
export interface KeyValuePair {
    key: string;
    value: string;
} 