/**
 * 模态框样式
 */
export const modalStyles = `
    /* 模态框背景遮罩 */
    .jscookie-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: jscookie-fadeIn 0.2s ease-out;
    }
    
    /* 模态框容器 */
    .jscookie-modal {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
    }
    
    /* 模态框头部 */
    .jscookie-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
    }
    
    .jscookie-modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
    }
    
    .jscookie-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #999;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .jscookie-modal-close:hover {
        background-color: #f5f5f5;
        color: #333;
    }
    
    /* 模态框内容区 */
    .jscookie-modal-content {
        flex: 1;
        overflow: auto;
        padding: 0;
    }
    
    /* 模态框底部 */
    .jscookie-modal-footer {
        display: flex;
        justify-content: flex-end;
        padding: 16px 20px;
        border-top: 1px solid #eee;
        gap: 12px;
    }
    
    /* 按钮样式 */
    .jscookie-btn {
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s, color 0.2s;
    }
    
    .jscookie-btn-primary {
        background-color: #4f7dff;
        color: white;
    }
    
    .jscookie-btn-primary:hover {
        background-color: #3b6af8;
    }
    
    .jscookie-btn-secondary {
        background-color: #f5f5f5;
        color: #333;
    }
    
    .jscookie-btn-secondary:hover {
        background-color: #e5e5e5;
    }
    
    /* 响应式调整 */
    @media (max-width: 576px) {
        .jscookie-modal {
            width: 95%;
            max-height: 95vh;
        }
        
        .jscookie-modal-header,
        .jscookie-modal-footer {
            padding: 12px 16px;
        }
    }
`; 