/**
 * Tampermonkey API类型声明
 */

declare function GM_registerMenuCommand(caption: string, commandFunc: () => void, accessKey?: string): void;
declare function GM_setValue(name: string, value: any): void;
declare function GM_getValue(name: string, defaultValue?: any): any;
declare function GM_deleteValue(name: string): void;
declare function GM_listValues(): string[];
declare function GM_addStyle(css: string): HTMLStyleElement;
declare function GM_getResourceText(resourceName: string): string;
declare function GM_getResourceURL(resourceName: string): string;
declare function GM_openInTab(url: string, options?: { active?: boolean, insert?: boolean, setParent?: boolean }): void;
declare function GM_notification(details: any, ondone?: () => void): void;
declare function GM_xmlhttpRequest(details: any): void; 