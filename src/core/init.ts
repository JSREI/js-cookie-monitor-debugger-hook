import { installPropertyHooks, installCookieHooks } from '../hooks';
import { standardizingRules } from '../rules';

/**
 * 初始化Cookie监控器
 * 安装钩子并标准化规则
 */
export function initCookieMonitor(): void {
    // 使用文档： https://github.com/CC11001100/js-cookie-monitor-debugger-hook

    // 安装属性钩子
    installPropertyHooks();
    
    // 安装Cookie钩子
    installCookieHooks();
    
    // 标准化规则配置
    standardizingRules();
} 