/**
 * 创建关于视图
 * @returns 关于视图HTML字符串
 */
export function createAboutView(): string {
    const version = '0.11';
    
    return `
        <div class="jscookie-about-view">
            <div class="jscookie-view-header">
                <h3>关于</h3>
            </div>
            
            <div class="jscookie-about-content">
                <div class="jscookie-about-logo">
                    <div class="jscookie-logo">🍪</div>
                    <h2>JS Cookie Monitor/Debugger Hook</h2>
                    <div class="jscookie-version">v${version}</div>
                </div>
                
                <p class="jscookie-about-description">
                    JS Cookie Monitor/Debugger Hook是一个用于监控和调试网页中JavaScript对Cookie操作的工具。
                    它可以帮助开发人员跟踪Cookie的读取、添加、修改和删除操作，并支持在特定条件下设置断点。
                </p>
                
                <div class="jscookie-about-section">
                    <h4>主要功能</h4>
                    <ul>
                        <li>实时监控Cookie的添加、修改和删除操作</li>
                        <li>支持根据Cookie名称和值设置断点</li>
                        <li>支持使用正则表达式匹配Cookie</li>
                        <li>彩色日志输出，便于区分不同操作</li>
                        <li>支持配置忽略值未变化的Cookie更新</li>
                    </ul>
                </div>
                
                <div class="jscookie-about-section">
                    <h4>使用说明</h4>
                    <p>
                        通过油猴菜单或快捷键（Ctrl/Cmd + Shift + J）打开配置面板，
                        在"断点列表"标签页中添加或管理断点规则，在"全局设置"中调整工具配置。
                    </p>
                </div>
                
                <div class="jscookie-about-footer">
                    <p>
                        作者: <a href="https://github.com/CC11001100" target="_blank">CC11001100</a> |
                        <a href="https://github.com/CC11001100/js-cookie-monitor-debugger-hook" target="_blank">GitHub仓库</a>
                    </p>
                    <p class="jscookie-copyright">© 2023 CC11001100. MIT License.</p>
                </div>
            </div>
        </div>
    `;
} 