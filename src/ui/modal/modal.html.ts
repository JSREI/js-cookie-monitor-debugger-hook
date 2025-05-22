/**
 * 生成模态框HTML
 * @param title 模态框标题
 * @param content 模态框内容
 * @returns 模态框HTML字符串
 */
export function createModalHTML(title: string = 'JS Cookie Monitor 配置', content: string = ''): string {
    return `
        <div class="jscookie-modal-overlay jscookie-ui">
            <div class="jscookie-modal">
                <div class="jscookie-modal-header">
                    <h2 class="jscookie-modal-title">${title}</h2>
                    <button class="jscookie-modal-close" aria-label="关闭">×</button>
                </div>
                <div class="jscookie-modal-content">
                    ${content}
                </div>
                <div class="jscookie-modal-footer">
                    <button class="jscookie-btn jscookie-btn-secondary jscookie-cancel-btn">取消</button>
                    <button class="jscookie-btn jscookie-btn-primary jscookie-save-btn">保存</button>
                </div>
            </div>
        </div>
    `;
} 