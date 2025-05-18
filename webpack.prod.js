const common = require("./webpack.common.js");
const {merge} = require("webpack-merge");
module.exports = merge(common, {
    //开启这个可以在生产环境中调试代码
    devtool: "source-map",
    // 两个原因：
    // 1. 在油猴商店上架的脚本不允许混淆和压缩
    // 2. 不混淆不压缩保留注释能够稍微增加一点用户的信任度
    mode: "none"
});

