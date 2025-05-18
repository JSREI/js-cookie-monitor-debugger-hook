import { DebuggerRuleType } from '../types';
import { getEventDebuggerConfig } from '../core/config';

export class DebuggerRule implements DebuggerRuleType {
    private eventName: string | null;
    private cookieNameFilter: string | RegExp | null;
    private cookieValueFilter: string | RegExp | null;

    constructor(eventName: string | null, cookieNameFilter: string | RegExp | null, cookieValueFilter: string | RegExp | null) {
        this.eventName = eventName;
        this.cookieNameFilter = cookieNameFilter;
        this.cookieValueFilter = cookieValueFilter;
    }

    test(eventName: string, cookieName: string, cookieValue: string | null): boolean {
        return this.testByEventName(eventName) &&
            (this.testByCookieNameFilter(cookieName) || this.testByCookieValueFilter(cookieValue));
    }

    testByEventName(eventName: string): boolean {
        // 如果此类型的事件断点没有开启，则直接返回
        const enableEventDebugger = getEventDebuggerConfig();
        if (!enableEventDebugger[eventName]) {
            return false;
        }
        // 事件不设置则匹配任何事件
        if (!this.eventName) {
            return true;
        }
        return this.eventName === eventName;
    }

    testByCookieNameFilter(cookieName: string): boolean {
        if (!cookieName || !this.cookieNameFilter) {
            return false;
        }
        if (typeof this.cookieNameFilter === "string") {
            return this.cookieNameFilter === cookieName;
        }
        if (this.cookieNameFilter instanceof RegExp) {
            return this.cookieNameFilter.test(cookieName);
        }
        return false;
    }

    testByCookieValueFilter(cookieValue: string | null): boolean {
        if (!cookieValue || !this.cookieValueFilter) {
            return false;
        }
        if (typeof this.cookieValueFilter === "string") {
            return this.cookieValueFilter === cookieValue;
        }
        if (this.cookieValueFilter instanceof RegExp) {
            return this.cookieValueFilter.test(cookieValue);
        }
        return false;
    }
} 