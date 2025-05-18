const common = require("./webpack.common.js");
const {merge} = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");

module.exports = env => {
    return merge(common, {
        mode: "none",
        //开启这个可以在开发环境中调试代码
        devtool: "source-map",
        devServer: {
            static: false,
            allowedHosts: "all",
            compress: false,
            port: 10086,
            hot: true
        },
        plugins: [
            //这两个插件用于开发环境时，修改保存代码之后页面自动刷新
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}
