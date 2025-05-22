const common = require("./webpack.common.js");
const {merge} = require("webpack-merge");
module.exports = merge(common, {
    // 禁用source map减少输出文件
    devtool: false,
    // 两个原因：
    // 1. 在油猴商店上架的脚本不允许混淆和压缩
    // 2. 不混淆不压缩保留注释能够稍微增加一点用户的信任度
    mode: "none",
    // 额外配置
    output: {
        // 设置输出为单文件
        filename: "index.js",
        // 禁止生成目录结构
        clean: true
    }
});

