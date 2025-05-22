import { DebuggerRule } from '../models';
import { debuggerRules } from '../cookie-monitor/config';
import logger from '../logger/logger';

/**
 * 将规则整理为标准规则
 */
export function standardizingRules(): void {
    // 用于收集规则配置错误
    const ruleConfigErrorMessage: string[] = [];
    const newRules: DebuggerRule[] = [];
    
    while (debuggerRules.length) {
        const rule = debuggerRules.pop();

        // 字符串或正则处理
        if (typeof rule === "string" || rule instanceof RegExp) {
            newRules.push(new DebuggerRule(null, rule, null));
            continue;
        }

        // 对象处理
        if (typeof rule === "object") {
            for (let key in rule as Record<string, any>) {
                let events: string | null = null;
                let cookieNameFilter = null;
                let cookieValueFilter = null;
                
                if (key === "events") {
                    events = (rule as any)["events"] || "add | delete | update";
                    cookieNameFilter = (rule as any)["name"];
                    cookieValueFilter = (rule as any)["value"];
                } else if (key !== "name" && key !== "value") {
                    events = key;
                    cookieNameFilter = (rule as any)[key];
                    cookieValueFilter = (rule as any)["value"];
                } else {
                    continue;
                }
                
                // 名字必须配置
                if (!cookieNameFilter) {
                    ruleConfigErrorMessage.push(`必须为此条规则 ${JSON.stringify(rule)} 配置一个Cookie Name匹配条件`);
                    continue;
                }
                
                if (events) {
                    events.split("|").forEach((eventName: string) => {
                        eventName = eventName.trim();
                        if (eventName !== "add" && eventName !== "delete" && eventName !== "update") {
                            ruleConfigErrorMessage.push(`此条规则 ${JSON.stringify(rule)} 的Cookie事件名字配置错误，必须为 add、delete、update 三种之一或者|分隔的组合，您配置的是 ${eventName}，仅忽略此无效事件`);
                            return;
                        }
                        newRules.push(new DebuggerRule(eventName, cookieNameFilter, cookieValueFilter));
                    });
                }
            }
        }
    }

    // 处理错误
    if (ruleConfigErrorMessage.length) {
        let errorMessage = "以下Cookie断点规则配置错误，已忽略： \n ";
        for (let i = 0; i < ruleConfigErrorMessage.length; i++) {
            errorMessage += `${i + 1}. ${ruleConfigErrorMessage[i]}\n`;
        }
        logger.error(errorMessage);
    }

    // 将新规则添加到规则列表
    for (let rule of newRules) {
        debuggerRules.push(rule);
    }
} 