/**
 * 标签页配置接口
 */
export interface TabConfig {
    id: string;
    title: string;
    content: string;
    active?: boolean;
}

/**
 * 生成标签页HTML
 * @param tabs 标签页配置数组
 * @returns 标签页HTML字符串
 */
export function createTabsHTML(tabs: TabConfig[]): string {
    // 确保至少有一个标签被设置为活动状态
    const hasActiveTab = tabs.some(tab => tab.active);
    if (!hasActiveTab && tabs.length > 0) {
        tabs[0].active = true;
    }

    return `
        <div class="jscookie-tabs">
            <div class="jscookie-tabs-nav">
                ${tabs.map(tab => `
                    <button class="jscookie-tab-btn${tab.active ? ' active' : ''}" 
                            data-tab-id="${tab.id}" 
                            aria-selected="${tab.active ? 'true' : 'false'}"
                            role="tab">
                        ${tab.title}
                    </button>
                `).join('')}
            </div>
            <div class="jscookie-tabs-content">
                ${tabs.map(tab => `
                    <div class="jscookie-tab-panel${tab.active ? ' active' : ''}" 
                         id="${tab.id}" 
                         role="tabpanel"
                         aria-hidden="${tab.active ? 'false' : 'true'}">
                        ${tab.content}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
} 