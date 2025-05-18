import { EventDebuggerConfig } from '../types';

// @ts-ignore - 为与原JS版本保持一致，忽略类型检查
export const debuggerRules: Array<any> = [];
// example:
// const debuggerRules = ["foo", /foo_\d+/];

// 设置事件断点是否开启，一般保持默认即可
const enableEventDebugger: EventDebuggerConfig = {
    "add": true, "update": true, "delete": true, "read": true,
};

// 在控制台打印日志时字体大小，根据自己喜好调整
// 众所周知，12px是宇宙通用大小
const consoleLogFontSize = 12;

// 使用document.cookie更新cookie，但是cookie新的值和原来的值一样，此时要不要忽略这个事件
const ignoreUpdateButNotChanged = false;

// 网站的开发者也可能会使用到Object.，这会与工具内置的冲突，使用这个变量持有者目标网站开发者自己设置的
// 然后在执行的时候使其真正的生效，这样不影响原有的逻辑
let realDocumentCookieProperty: PropertyDescriptor | null = null;

// 用于区分是本插件自己调用的definePropertyIsMe还是外部调用的
export const definePropertyIsMe = "CC11001100-js-cookie-monitor-debugger-hook";

// 导出获取配置的函数
export function getEventDebuggerConfig(): EventDebuggerConfig {
    return enableEventDebugger;
}

export function getConsoleLogFontSize(): number {
    return consoleLogFontSize;
}

export function getIgnoreUpdateButNotChanged(): boolean {
    return ignoreUpdateButNotChanged;
}

export function getRealDocumentCookieProperty(): PropertyDescriptor | null {
    return realDocumentCookieProperty;
}

export function setRealDocumentCookieProperty(property: PropertyDescriptor): void {
    realDocumentCookieProperty = property;
} 