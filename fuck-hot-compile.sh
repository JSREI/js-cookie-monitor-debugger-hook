#!/bin/bash

# 自动安装依赖的热更新脚本
# 使用方式：chmod +x ./fuck-hot-compile.sh && ./fuck-hot-compile.sh

# 检测包管理器并安装依赖
init_project() {
    if command -v yarn &> /dev/null; then
        echo "使用 yarn 安装依赖..."
        yarn install --frozen-lockfile
    elif command -v npm &> /dev/null; then
        echo "使用 npm 安装依赖..."
        npm ci
    else
        echo "错误：未检测到 yarn 或 npm，请先安装 Node.js"
        exit 1
    fi
}

# 获取构建命令
detect_build_command() {
    if [ -f yarn.lock ]; then
        echo "yarn build"
    else
        echo "npm run build"
    fi
}

# ---------- 主流程 ----------
init_project
build_command=$(detect_build_command)

echo "启动热更新监听..."
while true; do
    echo "[$(date +'%T')] 开始构建..."
    if $build_command; then
        echo "[$(date +'%T')] 构建成功 ✅"
    else
        echo "[$(date +'%T')] 构建失败 ❌，10秒后重试..."
        sleep 10
    fi
    sleep 1
done