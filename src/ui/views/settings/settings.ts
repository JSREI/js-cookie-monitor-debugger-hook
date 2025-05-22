import logger from '../../../logger/logger';
import { getConsoleLogFontSize, getIgnoreUpdateButNotChanged } from '../../../cookie-monitor/config';

/**
 * 创建设置视图
 * @returns 设置视图HTML字符串
 */
export function createSettingsView(): string {
    try {
        const fontSize = getConsoleLogFontSize();
        const ignoreUnchanged = getIgnoreUpdateButNotChanged();
        
        return `
            <div class="jscookie-settings-view">
                <div class="jscookie-view-header">
                    <h3>全局设置</h3>
                    <p class="jscookie-description">
                        配置JS Cookie Monitor的全局设置。
                    </p>
                </div>
                
                <form class="jscookie-settings-form">
                    <div class="jscookie-form-section">
                        <h4>日志设置</h4>
                        
                        <div class="jscookie-form-row">
                            <label for="console-font-size">控制台日志字体大小</label>
                            <input type="number" id="console-font-size" name="fontSize" min="8" max="24" value="${fontSize}" />
                            <span class="jscookie-form-hint">px</span>
                        </div>
                        
                        <div class="jscookie-form-row">
                            <label for="log-level">日志级别</label>
                            <select id="log-level" name="logLevel">
                                <option value="debug">调试 (DEBUG)</option>
                                <option value="info" selected>信息 (INFO)</option>
                                <option value="warn">警告 (WARN)</option>
                                <option value="error">错误 (ERROR)</option>
                                <option value="none">关闭 (NONE)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="jscookie-form-section">
                        <h4>Cookie监控设置</h4>
                        
                        <div class="jscookie-form-row checkbox-row">
                            <input type="checkbox" id="ignore-unchanged" name="ignoreUnchanged" ${ignoreUnchanged ? 'checked' : ''} />
                            <label for="ignore-unchanged">忽略值未变化的Cookie更新</label>
                        </div>
                        
                        <div class="jscookie-form-row checkbox-row">
                            <input type="checkbox" id="monitor-read" name="monitorRead" />
                            <label for="monitor-read">监控Cookie读取操作</label>
                        </div>
                    </div>
                </form>
            </div>
        `;
    } catch (error) {
        logger.error('创建设置视图失败', error);
        return '<div class="jscookie-error">加载设置失败</div>';
    }
} 