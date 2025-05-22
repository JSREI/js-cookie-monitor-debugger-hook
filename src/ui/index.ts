import { registerMenu } from './menu';
import { showModal } from './modal';

/**
 * 初始化UI界面
 * 注册油猴菜单并准备UI组件
 */
export function initUI(): void {
    // 注册油猴菜单
    registerMenu();
    
    // 注入全局样式
    injectGlobalStyles();
}

/**
 * 注入全局样式
 */
function injectGlobalStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
        /* 重置样式 */
        .jscookie-ui * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        /* 动画 */
        @keyframes jscookie-fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// 导出所有UI组件
export { registerMenu } from './menu';
export { showModal, hideModal } from './modal'; 