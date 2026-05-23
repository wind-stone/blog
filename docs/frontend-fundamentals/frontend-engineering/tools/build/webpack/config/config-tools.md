# 第三方配置工具

[[toc]]

## webpack-merge

[webpack-merge](<https://github.com/survivejs/webpack-merge>)提供一个`merge`函数去联结数组和合并对象，以创建一个新的对象。

- `merge(...configuration | [...configuration])`，合并配置对象
- `mergeWithCustomize({ customizeArray, customizeObject })(...configuration | [...configuration])`，自定义策略来合并配置对象
  - `customizeArray`，自定义合并数组类型的配置项
  - `customizeObject`，自定义合并对象类型的配置项
  - `unique(<field>, <fields>, field => field)`，强制使某个配置项具有唯一性，最常用于插件，可确保某个插件只有一个实例。
- `mergeWithRules`，主要用于合并`rules`

## webpack-chain

## vue.config.js

参考文档：

- [vue.config.js - configureWebpack](https://cli.vuejs.org/zh/config/#configurewebpack)
- [vue.config.js - chainwebpack](https://cli.vuejs.org/zh/config/#chainwebpack)
- [vue.config.js - webpack 相关](https://cli.vuejs.org/zh/guide/webpack.html)

`vue-cli`工具的配置文件`vue.config.js`里既可以通过`webpack-merge`也可以通过`webpack-chain`来新增/修改 Webpack 的配置项。

### configureWebpack

`configureWebpack`配置项支持两种配置方式，

1. 提供一个对象，该对象将会被`webpack-merge`合并入最终的 webpack 配置。
2. 提供一个函数，函数的第一个参数是已经解析好的配置（包含了内置的配置和调用`chainWebpack`获得的配置）。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象。

### chainWebpack

### 配置合并优先级

`configureWebpack` > `chainWebpack` > `vue-cli`内置配置

这个结论是学习`vue-cli`的源码里的[Service.init](https://github.com/vuejs/vue-cli/blob/7f3d51133635114528848b29e27084ee89d53e1c/packages/%40vue/cli-service/lib/Service.js#L58)方法和[Service.resolveWebpackConfig](https://github.com/vuejs/vue-cli/blob/7f3d51133635114528848b29e27084ee89d53e1c/packages/%40vue/cli-service/lib/Service.js#L256)方法得出的：

- `Service.init`方法里，会将`vue.config.js`里的`configureWebpack`选项`push`到`service.webpackRawConfigFns`数组，`chainWebpack`选项`push`到`service.webpackChainFns`数组
- `Service.resolveWebpackConfig`方法里，在解析 Webpack 配置时，会先执行`service.webpackChainFns`数组里的所有函数，再执行`service.webpackRawConfigFns`数组里的所有函数

因此`configureWebpack`的优先级高于`chainWebpack`。

::: warning 注意
在合并`configureWebpack`选项的配置对象之前（无论选项的值是个配置对象，还是个返回配置对象的函数），都会先将内置的`webpack-chain`的`config`对象（可能经过`chainWebpack`选项做了修改）转换为 Webpack 原生的配置对象，代码详见<https://github.com/vuejs/vue-cli/blob/7f3d51133635114528848b29e27084ee89d53e1c/packages/%40vue/cli-service/lib/Service.js#L261>。

因此，`configureWebpack`选项（值为函数时）的参数`config`与`chainWebpack`选项的参数`config`不是同一类对象。

- `chainWebpack: config => { ... }`: `config`参数是由`webpack-chain`里通过`new Config()`产生的实例对象
- `configureWebpack: config => { ... }`: `config`参数是由`webpack-chain`的`config`实例经过`config.toConfig()`产生的 Webpack 原生配置对象

:::
### 常用配置说明

```js
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    // ...
    chainWebpack: config => {
        // 注意，这里的 config 参数是 webpack-chain 里通过 new Config() 获取来的，
        // 与 configureWebpack 配置项（值为函数时）的 config 参数不一样

        // 可视化依赖分析
        config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
            {
                generateStatsFile: true
            }
        ]);

        // 关闭代码压缩（方式一），可在追查 bug 时关闭，详见 https://webpack.js.org/configuration/optimization/#optimizationminimize
        config.optimization.minimize(false);

        // 删除 ts 规则上的 cache-loader。
        // BTW，vue-cli 默认会给 .vue/.ts/.tsx 添加 cache-loader
        config.module.rule('ts').uses.delete('cache-loader');
    },

    configureWebpack: config => {
        // 注意，这里的 config 参数是个 webpack raw object，与 chainWebpack 里拿到的 config 不一样
        // 可参考 关闭代码压缩 的两种方式，比较这两个 config 的区别

        // 设置 devtool
        if (p rocess.env.NODE_ENV === 'production') {
            config.devtool = 'source-map';
            config.output.sourceMapFilename =
                '../' + process.env.UNI_PLATFORM + '/[name].js.map';
        }

        // 关闭代码压缩（方式二）
        config.optimization.minimize = false;
    },

    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    // https://cli.vuejs.org/zh/config/#transpiledependencies
    transpileDependencies: [
        'vue' // 仅示例，实际上引用 vue 之前其已经编译过
    ],
}
```
