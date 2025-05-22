import { debuggerRules } from '../../../cookie-monitor/config';
import logger from '../../../logger/logger';

/**
 * 创建断点列表视图
 * @returns 断点列表HTML字符串
 */
export function createBreakpointsView(): string {
    try {
        return `
            <div class="jscookie-breakpoints-view">
                <div class="jscookie-view-header">
                    <h3>Cookie断点规则配置</h3>
                    <p class="jscookie-description">
                        在这里配置触发断点的Cookie规则，支持字符串匹配和正则表达式。
                    </p>
                </div>
                
                <div class="jscookie-breakpoint-list">
                    ${generateBreakpointsList()}
                </div>
                
                <div class="jscookie-breakpoint-form">
                    <div class="jscookie-form-row">
                        <button class="jscookie-btn jscookie-btn-primary jscookie-add-breakpoint-btn">
                            添加新规则
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        logger.error('创建断点列表视图失败', error);
        return '<div class="jscookie-error">加载断点列表失败</div>';
    }
}

/**
 * 生成断点规则列表HTML
 * @returns 断点规则列表HTML字符串
 */
function generateBreakpointsList(): string {
    if (!debuggerRules || debuggerRules.length === 0) {
        return `
            <div class="jscookie-empty-list">
                <p>暂无断点规则，点击下方按钮添加。</p>
            </div>
        `;
    }
    
    const ruleItems = debuggerRules.map((rule, index) => {
        let ruleDisplayText = '';
        
        // 根据规则类型生成显示文本
        if (typeof rule === 'string') {
            ruleDisplayText = `Cookie名称包含: "${rule}"`;
        } else if (rule instanceof RegExp) {
            ruleDisplayText = `Cookie名称匹配正则: ${rule.toString()}`;
        } else if (typeof rule === 'object') {
            // 对象类型规则
            ruleDisplayText = formatObjectRule(rule);
        }
        
        return `
            <div class="jscookie-breakpoint-item" data-index="${index}">
                <div class="jscookie-breakpoint-content">
                    ${ruleDisplayText}
                </div>
                <div class="jscookie-breakpoint-actions">
                    <button class="jscookie-btn jscookie-btn-secondary jscookie-edit-rule-btn" data-index="${index}">
                        编辑
                    </button>
                    <button class="jscookie-btn jscookie-btn-secondary jscookie-delete-rule-btn" data-index="${index}">
                        删除
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="jscookie-breakpoint-items">
            ${ruleItems}
        </div>
    `;
}

/**
 * 格式化对象类型的规则为可读文本
 * @param rule 规则对象
 * @returns 格式化后的规则文本
 */
function formatObjectRule(rule: any): string {
    try {
        const parts: string[] = [];
        
        // 检查事件类型
        if (rule.events) {
            parts.push(`事件: ${rule.events}`);
        }
        
        // 检查Cookie名称
        if (rule.name) {
            if (typeof rule.name === 'string') {
                parts.push(`Cookie名称: "${rule.name}"`);
            } else if (rule.name instanceof RegExp) {
                parts.push(`Cookie名称匹配: ${rule.name.toString()}`);
            }
        }
        
        // 检查Cookie值
        if (rule.value) {
            if (typeof rule.value === 'string') {
                parts.push(`Cookie值: "${rule.value}"`);
            } else if (rule.value instanceof RegExp) {
                parts.push(`Cookie值匹配: ${rule.value.toString()}`);
            }
        }
        
        return parts.join(', ');
    } catch (error) {
        return '无效规则';
    }
} 