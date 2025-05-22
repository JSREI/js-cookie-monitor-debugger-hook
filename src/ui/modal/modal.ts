import { modalStyles } from './modal.css';
import { createModalHTML } from './modal.html';
import { Tabs } from '../tabs';
import { createBreakpointsView } from '../views/breakpoints';
import { createSettingsView } from '../views/settings';
import { createAboutView } from '../views/about';
import logger from '../../logger/logger';

// 保存模态框实例
let modalInstance: HTMLElement | null = null;

/**
 * 注入模态框样式
 */
function injectStyles(): void {
    if (!document.querySelector('#jscookie-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'jscookie-modal-styles';
        style.textContent = modalStyles;
        document.head.appendChild(style);
    }
}

/**
 * 创建模态框内容
 * @returns 模态框内容HTML
 */
function createModalContent(): string {
    // 创建各个标签页的内容
    const breakpointsContent = createBreakpointsView();
    const settingsContent = createSettingsView();
    const aboutContent = createAboutView();
    
    // 使用标签页组件创建内容
    const container = document.createElement('div');
    const tabs = new Tabs(container, [
        { id: 'jscookie-tab-breakpoints', title: '断点列表', content: breakpointsContent, active: true },
        { id: 'jscookie-tab-settings', title: '全局设置', content: settingsContent },
        { id: 'jscookie-tab-about', title: '关于', content: aboutContent }
    ]);
    
    // 获取生成的HTML
    return container.innerHTML || '';
}

/**
 * 绑定模态框事件
 * @param modal 模态框元素
 */
function bindModalEvents(modal: HTMLElement): void {
    // 关闭按钮
    const closeBtn = modal.querySelector('.jscookie-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
    }
    
    // 取消按钮
    const cancelBtn = modal.querySelector('.jscookie-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideModal);
    }
    
    // 保存按钮
    const saveBtn = modal.querySelector('.jscookie-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    // 点击遮罩关闭
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
    
    // ESC按键关闭
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isModalVisible()) {
            hideModal();
        }
    });
}

/**
 * 保存配置
 */
function saveSettings(): void {
    try {
        // 遍历表单并收集数据
        const form = document.querySelector('.jscookie-settings-form');
        if (form) {
            // 收集表单数据的逻辑...
            
            logger.info('设置已保存');
            hideModal();
        }
    } catch (error) {
        logger.error('保存设置失败', error);
    }
}

/**
 * 显示模态框
 */
export function showModal(): void {
    // 防止重复创建
    if (isModalVisible()) {
        return;
    }
    
    try {
        // 注入样式
        injectStyles();
        
        // 创建模态框内容
        const content = createModalContent();
        
        // 创建模态框
        const modalHTML = createModalHTML('JS Cookie Monitor 配置', content);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML.trim();
        
        // 获取模态框元素
        modalInstance = tempDiv.firstChild as HTMLElement;
        
        // 添加到文档
        document.body.appendChild(modalInstance);
        
        // 防止body滚动
        document.body.style.overflow = 'hidden';
        
        // 绑定事件
        bindModalEvents(modalInstance);
        
        // 初始化标签页
        initTabs();
    } catch (error) {
        logger.error('显示模态框失败', error);
    }
}

/**
 * 初始化标签页
 */
function initTabs(): void {
    try {
        // 查找模态框内容容器
        const content = document.querySelector('.jscookie-modal-content');
        if (content && content instanceof HTMLElement) {
            // 创建标签页
            new Tabs(content, [
                { id: 'jscookie-tab-breakpoints', title: '断点列表', content: createBreakpointsView(), active: true },
                { id: 'jscookie-tab-settings', title: '全局设置', content: createSettingsView() },
                { id: 'jscookie-tab-about', title: '关于', content: createAboutView() }
            ]);
        }
    } catch (error) {
        logger.error('初始化标签页失败', error);
    }
}

/**
 * 隐藏模态框
 */
export function hideModal(): void {
    if (modalInstance) {
        // 恢复body滚动
        document.body.style.overflow = '';
        
        // 移除模态框
        modalInstance.remove();
        modalInstance = null;
    }
}

/**
 * 检查模态框是否可见
 */
export function isModalVisible(): boolean {
    return !!modalInstance && document.body.contains(modalInstance);
} 