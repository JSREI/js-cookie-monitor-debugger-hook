/**
 * 标签页样式
 */
export const tabsStyles = `
    /* 标签页导航 */
    .jscookie-tabs-nav {
        display: flex;
        overflow-x: auto;
        background-color: #f7f8fb;
        border-bottom: 1px solid #eee;
    }
    
    /* 隐藏滚动条但保留功能 */
    .jscookie-tabs-nav::-webkit-scrollbar {
        height: 0;
    }
    
    /* 标签按钮 */
    .jscookie-tab-btn {
        padding: 12px 16px;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        transition: color 0.2s;
    }
    
    .jscookie-tab-btn:hover {
        color: #4f7dff;
    }
    
    /* 活动标签按钮 */
    .jscookie-tab-btn.active {
        color: #4f7dff;
    }
    
    /* 活动标签下划线 */
    .jscookie-tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #4f7dff;
    }
    
    /* 标签内容容器 */
    .jscookie-tabs-content {
        height: 100%;
        overflow: auto;
    }
    
    /* 标签面板 */
    .jscookie-tab-panel {
        padding: 16px 20px;
        display: none;
        height: 100%;
        overflow: auto;
    }
    
    /* 活动标签面板 */
    .jscookie-tab-panel.active {
        display: block;
    }
`; 