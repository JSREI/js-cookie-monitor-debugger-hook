import { showModal } from '../modal';
import logger from '../../logger/logger';

/**
 * 注册油猴菜单
 */
export function registerMenu(): void {
    try {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            // 注册主菜单项 - 打开配置面板
            GM_registerMenuCommand('打开配置面板', () => {
                showModal();
            });
            
            // 注册调试菜单项
            GM_registerMenuCommand('开启/关闭调试日志', toggleDebugMode);
            
            logger.info('油猴菜单注册成功');
        } else {
            logger.warn('当前环境不支持GM_registerMenuCommand，无法注册油猴菜单');
            
            // 备用方案：添加键盘快捷键唤起界面
            addKeyboardShortcut();
        }
    } catch (error) {
        logger.error('注册油猴菜单失败', error);
    }
}

/**
 * 切换调试模式
 */
function toggleDebugMode(): void {
    // 实现调试模式切换逻辑
    const isDebugEnabled = localStorage.getItem('jscookie-debug-mode') === 'true';
    localStorage.setItem('jscookie-debug-mode', (!isDebugEnabled).toString());
    
    logger.info(`调试模式已${!isDebugEnabled ? '开启' : '关闭'}`);
}

/**
 * 添加键盘快捷键
 * 在不支持GM_registerMenuCommand的环境下使用
 */
function addKeyboardShortcut(): void {
    document.addEventListener('keydown', (event) => {
        // Ctrl/Cmd + Shift + J 打开配置面板
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'j') {
            showModal();
            event.preventDefault();
        }
    });
    
    logger.info('已添加键盘快捷键: Ctrl/Cmd + Shift + J 打开配置面板');
} 