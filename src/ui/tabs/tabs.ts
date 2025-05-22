import { tabsStyles } from './tabs.css';
import { createTabsHTML, TabConfig } from './tabs.html';

/**
 * 标签页组件
 */
export class Tabs {
    private container: HTMLElement | null = null;
    private tabs: TabConfig[] = [];
    private activeTabId: string = '';
    
    /**
     * 创建标签页组件
     * @param container 容器元素或选择器
     * @param tabs 标签页配置数组
     */
    constructor(container: HTMLElement | string, tabs: TabConfig[] = []) {
        this.tabs = tabs;
        
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }
        
        if (!this.container) {
            throw new Error('无法找到标签页容器元素');
        }
        
        this.init();
    }
    
    /**
     * 初始化标签页
     */
    private init(): void {
        // 注入样式
        this.injectStyles();
        
        // 渲染HTML
        this.render();
        
        // 绑定事件
        this.bindEvents();
        
        // 设置初始活动标签
        const activeTab = this.tabs.find(tab => tab.active);
        if (activeTab) {
            this.activeTabId = activeTab.id;
        } else if (this.tabs.length > 0) {
            this.activeTabId = this.tabs[0].id;
        }
    }
    
    /**
     * 注入样式
     */
    private injectStyles(): void {
        if (!document.querySelector('#jscookie-tabs-styles')) {
            const style = document.createElement('style');
            style.id = 'jscookie-tabs-styles';
            style.textContent = tabsStyles;
            document.head.appendChild(style);
        }
    }
    
    /**
     * 渲染标签页HTML
     */
    private render(): void {
        if (this.container) {
            this.container.innerHTML = createTabsHTML(this.tabs);
        }
    }
    
    /**
     * 绑定事件
     */
    private bindEvents(): void {
        if (!this.container) return;
        
        // 获取所有标签按钮
        const tabButtons = this.container.querySelectorAll('.jscookie-tab-btn');
        
        // 为每个标签按钮添加点击事件
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab-id');
                if (tabId) {
                    this.activateTab(tabId);
                }
            });
        });
    }
    
    /**
     * 激活指定标签
     * @param tabId 标签ID
     */
    public activateTab(tabId: string): void {
        if (!this.container) return;
        
        // 设置当前活动标签ID
        this.activeTabId = tabId;
        
        // 获取所有标签按钮和面板
        const tabButtons = this.container.querySelectorAll('.jscookie-tab-btn');
        const tabPanels = this.container.querySelectorAll('.jscookie-tab-panel');
        
        // 取消所有标签的活动状态
        tabButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
        
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        // 激活当前标签
        const activeButton = this.container.querySelector(`.jscookie-tab-btn[data-tab-id="${tabId}"]`);
        const activePanel = this.container.querySelector(`#${tabId}`);
        
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
        }
        
        if (activePanel) {
            activePanel.classList.add('active');
            activePanel.setAttribute('aria-hidden', 'false');
        }
    }
    
    /**
     * 获取当前活动标签ID
     */
    public getActiveTabId(): string {
        return this.activeTabId;
    }
    
    /**
     * 获取容器元素
     */
    public getContainer(): HTMLElement | null {
        return this.container;
    }
}

/**
 * 导出标签页相关函数和类型
 */
export { createTabsHTML } from './tabs.html';
export type { TabConfig } from './tabs.html'; 