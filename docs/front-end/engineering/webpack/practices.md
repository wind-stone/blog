# Webpack 实践配置

## vue-cli 3.0 Webpack 使用相关

```js
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    // ...
    chainWebpack: config => {
        // 可视化依赖分析
        config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
            {
                generateStatsFile: true
            }
        ]);

        // 关闭代码压缩，可在追查 bug 时关闭，详见 https://webpack.js.org/configuration/optimization/#optimizationminimize
        config.optimization.minimize(false);
    },

    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    // https://cli.vuejs.org/zh/config/#transpiledependencies
    transpileDependencies: [
        'vue' // 仅示例，实际上引用 vue 之前其已经编译过
    ],
}
```
