#!/usr/bin/env node
/**
 * 开发头部文件生成工具
 * 
 * 这个脚本会基于userscript-headers.js文件自动生成dev-header.js，
 * 并且根据当前操作系统自动添加正确格式的本地文件路径引用。
 * 
 * 使用方法:
 * 1. 直接运行: npm run gen:dev
 * 2. 构建并生成: npm run build:dev
 * 
 * 生成的dev-header.js文件可以直接复制到Tampermonkey中创建新脚本，
 * 实现对本地开发文件的引用，方便调试。
 * 
 * 支持的系统:
 * - Windows: 使用file:///C:/path/format
 * - Mac/Linux: 使用file:///path/format
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 项目根目录路径
const rootPath = path.resolve(__dirname, '..');

// 读取userscript-headers.js内容
const headerPath = path.join(rootPath, 'userscript-headers.js');
let headerContent = fs.readFileSync(headerPath, 'utf8');

// 获取dist/index.js的绝对路径
let distFilePath = path.join(rootPath, 'dist', 'index.js');

// 根据操作系统格式化文件URL
let fileUrl;
if (os.platform() === 'win32') {
    // Windows格式: file:///C:/path/to/file.js
    fileUrl = 'file:///' + distFilePath.replace(/\\/g, '/');
} else {
    // Mac/Linux格式: file:///path/to/file.js
    // 确保路径以单个斜杠开始
    if (distFilePath.startsWith('/')) {
        fileUrl = 'file://' + distFilePath;
    } else {
        fileUrl = 'file:///' + distFilePath;
    }
}

// 在头部添加@require行
const lastHeaderLine = '// ==/UserScript==';
const requireLine = `// @require      ${fileUrl}`;

// 替换最后一行头部，添加@require和最后一行
headerContent = headerContent.replace(
    lastHeaderLine,
    `${requireLine}\n${lastHeaderLine}`
);

// 添加空函数以匹配原始dev-header.js结构
headerContent += `\n(() => {\n\n})()\n`;

// 写入到dev-header.js
const devHeaderPath = path.join(rootPath, 'dev-header.js');
fs.writeFileSync(devHeaderPath, headerContent, 'utf8');

console.log(`\x1b[32m✓\x1b[0m 已生成开发头部文件: ${devHeaderPath}`);
console.log(`\x1b[34m→\x1b[0m 使用本地文件路径: ${fileUrl}`); 