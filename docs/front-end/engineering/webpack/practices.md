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

### 审查项目的 webpack 配置

`vue-cli-service inspect`命令可以用于审查一个 Vue CLI 项目的 Webpack 配置。

- 可通过`--mode`参数指定不同的环境模式（比如`production`/`development`，默认是`development`）。
- 可将配置输出到文件里方便查阅

```sh
# 查看 production 模式的配置，并将结果输出到 output.js 里
vue inspect --mode production > output.js

# 或
npx vue-cli-service inspect --mode development > output.js
```

参考:

- [随笔 - 1079, 文章 - 1, 评论 - 8, 引用 - 0
使用 vue-cli-service inspect 来查看一个 Vue CLI 3 项目的 webpack 配置信息（包括：development、production）](https://www.cnblogs.com/cag2050/p/10523096.html)
- [Vue CLI - vue-cli-service inspect](https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-inspect)
- [Vue CLI - 审查项目的 webpack 配置](https://cli.vuejs.org/zh/guide/webpack.html#%E5%AE%A1%E6%9F%A5%E9%A1%B9%E7%9B%AE%E7%9A%84-webpack-%E9%85%8D%E7%BD%AE)
