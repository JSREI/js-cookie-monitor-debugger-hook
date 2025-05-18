const path = require("path");
const webpack = require("webpack");
const webpackPackageJson = require("./package.json");
const fs = require("fs");

module.exports = {
    entry: {
        index: "./src/index.ts"  // 修改入口文件为 .ts
    },
    output: {
        // filename: "[name]-[hash].js",
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js"]  // 添加 .ts 扩展名
    },
    optimization: {},
    plugins: [
        // 在打包后的文件头插入一些banner信息，官方插件：
        // https://webpack.js.org/plugins/banner-plugin/
        new webpack.BannerPlugin({
            // 是否仅在入口包中输出 banner 信息
            entryOnly: true,
            // 保持原样
            raw: true,
            banner: () => {
                // 渲染文件头，目前只支持这些变量，有点丑，先凑活着用...
                let userscriptHeaders = fs.readFileSync("./userscript-headers.js").toString("utf-8");
                userscriptHeaders = userscriptHeaders.replaceAll("${name}", webpackPackageJson["name"] || "");
                userscriptHeaders = userscriptHeaders.replaceAll("${namespace}", webpackPackageJson["namespace"] || "");
                userscriptHeaders = userscriptHeaders.replaceAll("${version}", webpackPackageJson["version"] || "");
                userscriptHeaders = userscriptHeaders.replaceAll("${description}", webpackPackageJson["description"] || "");
                userscriptHeaders = userscriptHeaders.replaceAll("${document}", webpackPackageJson["document"] || "");
                userscriptHeaders = userscriptHeaders.replaceAll("${author}", webpackPackageJson["author"] || "");
                userscriptHeaders = userscriptHeaders.replaceAll("${repository}", webpackPackageJson["repository"] || "");

                // 如果存在 banner 的话，则读取插入
                const bannerFilePath = "./banner.txt";
                if (fs.existsSync(bannerFilePath)) {
                    let banner = fs.readFileSync(bannerFilePath).toString("utf-8");
                    banner = banner.replaceAll("${name}", webpackPackageJson["name"] || "");
                    banner = banner.replaceAll("${namespace}", webpackPackageJson["namespace"] || "");
                    banner = banner.replaceAll("${version}", webpackPackageJson["version"] || "");
                    banner = banner.replaceAll("${description}", webpackPackageJson["description"] || "");
                    banner = banner.replaceAll("${document}", webpackPackageJson["document"] || "");
                    banner = banner.replaceAll("${author}", webpackPackageJson["author"] || "");
                    banner = banner.replaceAll("${repository}", webpackPackageJson["repository"] || "");
                    userscriptHeaders += "\n" + banner.split("\n").join("\n//    ") + "\n";
                }

                return userscriptHeaders;
            }
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,  // 添加 TypeScript 文件的处理规则
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    }
};