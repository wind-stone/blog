---
sidebarDepth: 0
---

# Webpack 知识点

[[toc]]

## 优秀文章

- [Webpack 是如何做到 Tree Shaking 的？](https://mp.weixin.qq.com/s/Ue0kNOMQS7mH-2-9BhYk8Q)

## 插件

### 分析依赖关系

`webpack-bundle-analyzer`

## 概念名词

### module、chunk、bundle、asset

- `asset`: 经过`webpack`编译处理后的图片、字体、媒体等文件，主要用于网站和应用，这些通常会添加到`output`目录下成为单个文件，但也可以通过`style-loader`或`url-loader`等内联
- `module`: 离散的功能块，提供比完整程序更小的接触面。写得好的模块提供了可靠的抽象和封装边界，达到条理清晰的设计和明确的目的
- `chunk`
  - 这是`webpack`特有的术语，用于在`webpack`内部管理打包过程。`bundle`由`chunk`组成，`chunk`有好几种类型，比如入口`chunk`和子`chunk`。通常`chunk`直接对应着输出的`bundle`文件，但是有一些配置并不会产生一对一的关系。
  - `Code Splitting`: 指将代码分离到各个不同的`bundle`/`chunk`，之后可以按需加载，而不是加载一个包含全部代码的单个`bundle`
- `bundle`
  - 由一系列不同的模块组成，`bundle`包含了源文件的最终版本，这些源文件已经经过加载和编译
  - `bundle`分离: 这一过程提供了一种优化构建的方式，允许`webpack`为单个应用生成多个`bundle`。最终效果是，每个`bundle`是相互独立的，单个`bundle`改变不会影响其他的`bundle`，可减少代码重新发布以及浏览器重新下载（利用浏览器缓存）的次数

若是在`webpack`编译时生成了包含依赖图和其他编译信息等统计数据的 JSON 文件，就可以更清晰地了解这些术语的区别和联系。以下是 JSON 文件的内容。

#### JSON 文件结构

```js
{
  "version": "1.4.13", // Version of webpack used for the compilation
  "hash": "11593e3b3ac85436984a", // Compilation specific hash
  "time": 2469, // Compilation time in milliseconds
  "filteredModules": 0, // A count of excluded modules when exclude is passed to the toJson method
  "outputPath": "/", // path to webpack output directory
  "assetsByChunkName": {
    // Chunk name to emitted asset(s) mapping
    "main": "web.js?h=11593e3b3ac85436984a",
    "named-chunk": "named-chunk.web.js",
    "other-chunk": [
      "other-chunk.js",
      "other-chunk.css"
    ]
  },
  "assets": [
    // A list of asset objects
  ],
  "chunks": [
    // A list of chunk objects
  ],
  "modules": [
    // A list of module objects
  ],
  "errors": [
    // A list of error strings
  ],
  "warnings": [
    // A list of warning strings
  ]
}
```

#### chunk 对象

每个`chunk`对象代表了一组`module`，其结构如下。

```js
{
  "entry": true, // Indicates whether or not the chunk contains the webpack runtime
  "files": [
    // An array of filename strings that contain this chunk
  ],
  "filteredModules": 0, // See the description in the top-level structure above
  "id": 0, // The ID of this chunk
  "initial": true, // Indicates whether this chunk is loaded on initial page load or on demand
  "modules": [
    // A list of module objects
    "web.js?h=11593e3b3ac85436984a"
  ],
  "names": [
    // An list of chunk names contained within this chunk
  ],
  "origins": [
    // See the description below...
  ],
  "parents": [], // Parent chunk IDs
  "rendered": true, // Indicates whether or not the chunk went through Code Generation
  "size": 188057 // Chunk size in bytes
}
```

`chunk`对象的`origins`属性，包含了一系列`origin`对象，描述了该`chunk`是如何创造出来的，其结构如下。

```js
{
  "loc": "", // Lines of code that generated this chunk
  "module": "(webpack)\test\browsertest\lib\index.web.js", // Path to the module
  "moduleId": 0, // The ID of the module
  "moduleIdentifier": "(webpack)\test\browsertest\lib\index.web.js", // Path to the module
  "moduleName": "./lib/index.web.js", // Relative path to the module
  "name": "main", // The name of the chunk
  "reasons": [
    // A list of the same reasons found in module objects
  ]
}
```

#### asset 对象

`asset`，资源，每一个`asset`对象代表经过编译添加到`output`目录下的一个文件。资源对象包括的信息有：

```js
{
  "chunkNames": [], // The chunks this asset contains
  "chunks": [ 10, 6 ], // The chunk IDs this asset contains
  "emitted": true, // Indicates whether or not the asset made it to the output directory
  "name": "10.web.js", // The output filename
  "size": 1058 // The size of the file in bytes
}
```

#### module 对象

依赖图表中的模块都可以表示成以下的形式。

```js
{
  "assets": [
    // A list of asset objects
  ],
  "built": true, // Indicates that the module went through Loaders, Parsing, and Code Generation
  "cacheable": true, // Whether or not this module is cacheable
  "chunks": [
    // IDs of chunks that contain this module
  ],
  "errors": 0, // Number of errors when resolving or processing the module
  "failed": false, // Whether or not compilation failed on this module
  "id": 0, // The ID of the module (analogous to module.id)
  "identifier": "(webpack)\test\browsertest\lib\index.web.js", // A unique ID used internally
  "name": "./lib/index.web.js", // Path to the actual file
  "optional": false, // All requests to this module are with try... catch blocks (irrelevant with ESM)
  "prefetched": false, // Indicates whether or not the module was prefetched
  "profile": {
    // Module specific compilation stats corresponding to the --profile flag (in milliseconds)
    "building": 73, // Loading and parsing
    "dependencies": 242, // Building dependencies
    "factory": 11 // Resolving dependencies
  },
  "reasons": [
    // See the description below...
  ],
  "size": 3593, // Estimated size of the module in bytes
  "source": "// Should not break it...
if(typeof...", // The stringified raw source
  "warnings": 0 // Number of warnings when resolving or processing the module
}
```

特别注意`chunks`属性，这意味着多个`chunk`可能包含着同一个`module`。

每个模块都包含了一组`resons`对象，来描述为什么该模块被包含进依赖图里。每个`reason`对象类似于`chunk`对象里的`origins`。

```js
{
  "loc": "33:24-93", // Lines of code that caused the module to be included
  "module": "./lib/index.web.js", // Relative path to the module based on context
  "moduleId": 0, // The ID of the module
  "moduleIdentifier": "(webpack)\test\browsertest\lib\index.web.js", // Path to the module
  "moduleName": "./lib/index.web.js", // A more readable name for the module (used for "pretty-printing")
  "type": "require.context", // The type of request used
  "userRequest": "../../cases" // Raw string used for the import or require request
}
```

`reason`对象里的`type`和`userRequest`属性，分别描述了该模块是以什么方式被请求的，以及请求时的路径（会被解析为具体的文件位置）。

## 容易忽视的点

### loader

- `loader`可以使你在`import`或"加载"模块时预处理文件，这是`webpack`特有的功能，其他打包程序或任务执行器可能并不支持
- `loader`除了在`webpack.config.js`指定外，还可以在每个`import`语句中显示指定`loader`
- `loader`从右到左地取值(`evaluate`)/执行(`execute`)

#### 常用的 loader

- `file-loader`
  - 处理`import MyImage from './my-image.png'`里的图片，将图片添加到`output`目录，并返回处理后的`url`
  - 以与图片类似的方式，处理字体文件
- `html-loader`
  - 采用与`file-loader`类似的方式处理 HTML 里`<img src="./my-image.png" />`里的图片
- `css-loader`
  - 采用与`file-loader`类似的方式处理 CSS 里的`background: url('./icon.png');`里的图片

### plugin

#### 常用的 plugin

- `clean-webpack-plugin`: 清理文件夹
- `html-webpack-plugin`: 将`js`等资源插入到 HTML 里

### HMR 模块热替换

- `webpack`的`compiler`会发出`update`
- 需要模块实现 HMR 接口
- 需要 HMR runtime

### 模块

`webpack`会对代码里的`import`和`export`进行`transpile`（转译），但不会更改代码中除`import`和`export`之外的部分。

### chunk

#### 产生 chunk 的几种方式

- 通过`import()`异步加载的`chunk`
- 通过插件`SplitChunksPlugin`分离出的`chunk`

### Tree Shaking

想要使用 Tree Shaking 功能，必须注意以下几点：

- 必须使用 ES2015 模块语法（即`import`和`export`）
- 确保没有`compiler`将 ES2015 模块语法转换为 CommonJS 模块（这也是流行的 Babel `preset`中`@babel/preset-env`的默认行为）。
- 在项目`package.json`文件中，添加一个`"sideEffects"`属性。
- 通过将`mode`选项设置为`production`，启用`minification`(代码压缩)和`tree shaking`。

## 优化

### 配置优化

#### 全局优化

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

##### loader

对最少数量的必要模块使用`loader`，使用`include`字段仅将`loader`应用在实际需要将其转换的模块所处路径。

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        // 添加这一行，仅针对 src 目录下的 js 文件进行 babel 转译
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ]
  }
};
```

##### 解析

以下步骤可以提高解析速度:

- 减少`resolve.modules`, `resolve.extensions`, `resolve.mainFiles`, `resolve.descriptionFiles`中`items`数量，因为他们会增加文件系统调用的次数。
- 如果你不使用`symlinks`（例如`npm link`或者`yarn link`），可以设置`resolve.symlinks: false`。
- 如果你使用自定义`resolve plugin`规则，并且没有指定`context`上下文，可以设置`resolve.cacheWithContext: false`。

#### dev 开发环境优化

- `devtool`配置项：控制是否以及怎样生成 source map
  - eval 的性能最高，但是不能生成的 sourceMap 文件解析出来的代码，和源代码差异较大
  - source-map 的性能较差，但是可以生成原始版本的代码
  - 开发环境用`cheap-module-eval-source-map`最佳
- `webpack.HotModuleReplacementPlugin`插件：模块热替换
- `webpack.NoEmitOnErrorsPlugin`插件：编译出现错误时，使用该插件来跳过输出阶段，这样可以确保输出资源不会包含错误
- `friendly-errors-webpack-plugin`
- Build Cache
  - `babel-loader`开启`cacheDirectory`选项

（针对`v4.29.6`）避免使用以下工具：

- `TerserPlugin`
- `ExtractTextPlugin`
- `[hash]/[chunkhash]`
- `AggressiveSplittingPlugin`
- `AggressiveMergingPlugin`
- `ModuleConcatenationPlugin`

#### production 生产环境优化

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

### 代码优化

##### 使用 preload、prefetch、dns-fetch
