---
sidebarDepth: 0
---

# 配置相关

[[toc]]

## 配置优化

### 全局优化

- 减少目录检索范围
  - 配置 loader 的时候，添加`include: [resolve('src')]`or`exclude: /node_modules/`
- 减少检索路径
  - `resolve.alias`配置项：创建常用模块/目录的别名
- `externals`配置项，提取常用库
  - 将不常更新的框架提取出来，如`Vue`、`JQuery`等，通过 script 直接引入
    - 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
- `webpack.optimize.CommonsChunkPlugin`插件
  - 分离业务代码（app）和第三方库（vendor）
    - 分离 webapp runtime 代码（manifest）
- `webpack.optimize.DedupePlugin`插件
  - 文件去重
- `DllPlugin`和`DllReferencePlugin`预编译库文件
  - 将第三方库文件单独编译打包一次，以后的构建都不需要再编译打包第三方库
    - [使用方法](http://www.jishux.com/plus/view-681807-1.html)
- `tree shaking`
  - webpack 中实现 tree shaking 是基于 webpack 内部支持的 es2015 的模块机制，在大部分时候我们使用 babel 来编译 js 代码，而 babel 会通过自己的模块加载机制处理一遍，这导致 webpack 中的 tree shaking 处理将会失效。因此在 babel 的配置中需要关闭对模块加载的处理

  ```js
  // .babelrc
  {
    "presets": [
      [
        "env", {
          "modules": false,
        }
      ],
      "stage-0"
    ]
  }
  ```

- 局部引入
  - lodash
- 后编译
- 代码拆分/按需加载
  - `webpack.optimize.LimitChunkCountPlugin`限制 chunk 的最大数量，避免太多细小的模块
  - `webpack.optimize.MinChunkSizePlugin`限制 chunk 的最小体积

### `dev`开发环境优化

- `devtool`配置项：控制是否以及怎样生成 source map
  - eval 的性能最高，但是不能生成的 sourceMap 文件解析出来的代码，和源代码差异较大
  - source-map 的性能较差，但是可以生成原始版本的代码
  - 开发环境用`cheap-module-eval-source-map`最佳
- `webpack.HotModuleReplacementPlugin`插件：模块热替换
- `webpack.NoEmitOnErrorsPlugin`插件：编译出现错误时，使用该插件来跳过输出阶段，这样可以确保输出资源不会包含错误
- `friendly-errors-webpack-plugin`
- Build Cache
  - `babel-loader`开启`cacheDirectory`选项

### `production`生产环境优化

- `DefinePlugin`插件
  - 创建编译时可以配置的全局常量
  - 配合`UglifyJSPlugin`插件，可在生产环境去除部门的冗余代码
- `UglifyJSPlugin`插件
  - 压缩、去除冗余
- `HashedModuleIdsPlugin`插件
  - 根据模块的相对路径生成一个四位数的 hash 作为模块 id，减少因修改依赖引入的顺序导致的产出文件缓存失效
- `webpack.optimize.UglifyJsPlugin`插件
- `extract-text-webpack-plugin`插件：提取样式到 CSS 文件
- `optimize-css-assets-webpack-plugin`插件：对提取出来的 CSS 进行压缩、去重
- `script-ext-html-webpack-plugin`插件：给 js 添加属性 crossorigin: 'anonymous'

## 代码优化

### 提取 vendor 代码

```js
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    return module.context && module.context.indexOf('node_modules') !== -1
  }
}),
```

## 杂项

### resolve.alias

别名 | ① import "xyz" | ② import "xyz/file.js" | 说明
--- | --- | --- | ---
{} | /abs/node_modules/xyz/index.js | /abs/node_modules/xyz/file.js |
{ xyz: "/abs/path/to/file.js" } | /abs/path/to/file.js | error | 别名值为文件，②方式出错
{ xyz: "./dir/file.js" } | /abs/dir/file.js | error | 别名值为文件，②方式出错
{ xyz: "modu/some/file.js" } | /abs/node_modules/modu/some/file.js | error | 别名值为文件，②方式出错
{ xyz$: "/abs/path/to/file.js" } | /abs/path/to/file.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz$: "./dir/file.js" } | /abs/dir/file.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz$: "/some/dir" } | /some/dir/index.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz$: "modu" } | /abs/node_modules/modu/index.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz: "/some/dir" } | /some/dir/index.js | /some/dir/file.js |
{ xyz: "./dir" } | /abs/dir/index.js | /abs/dir/file.js |
{ xyz: "modu" } | /abs/node_modules/modu/index.js | /abs/node_modules/modu/file.js |
{ xyz: "modu/dir" } | /abs/node_modules/modu/dir/index.js | /abs/node_modules/dir/file.js | ②的结果是否有问题，丢失了 modu？
{ xyz: "xyz/dir" } | /abs/node_modules/xyz/dir/index.js | /abs/node_modules/xyz/dir/file.js |
{ xyz$: "xyz/dir" } | /abs/node_modules/xyz/dir/index.js | /abs/node_modules/xyz/file.js |

### Tree Shaking

[Webpack 是如何做到 Tree Shaking 的？](https://mp.weixin.qq.com/s/Ue0kNOMQS7mH-2-9BhYk8Q)
