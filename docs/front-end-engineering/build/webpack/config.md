# Webpack - 完整 webpack.config.js 配置

[[toc]]

`webpack`版本：v4.29.6

## 导出对象

```js
const path = require('path');

module.exports = {
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  // "production" | "development" | "none"
  mode: "production", // enable many optimizations for production builds
  mode: "development", // enabled useful tools for development
  mode: "none", // no defaults

  // 基础目录，绝对路径，用于从配置中解析入口起点和 loader
  context: path.resolve(__dirname, 'app'), // 默认是当前目录，即 process.cwd()

  // string | object | array
  // 动态入口，还可以是个函数，该函数返回
  //   - 上面的三个类型之一
  //   - Promise，该 Prmise 实例再 resolve 上面的三个类型之一
  entry: "./app/entry", // 单入口起点
  entry: ["./app/entry1", "./app/entry2"], // 单入口起点，数组里的多个文件会打包到一个 bundle 里
  entry: { // 多入口起点
    a: "./app/entry-a",
    b: ["./app/entry-b1", "./app/entry-b2"]
  },

  // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你
  performance: {
    // 打开/关闭提示
    hints: false, // 不展示警告或错误提示。
    hints: "warning", // 展示一条警告，开发环境首选
    hints: "error", // 展示一条错误，生产环境首选
    // 资源的最大大小
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    // 入口点的最大大小
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    // 提供资源文件名的断言函数
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  /*
   * 控制是否生成，以及如何生成 source map
   *
   * 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
   * 牺牲了构建速度的 `source-map' 是最详细的。
   *
   * 更多选项值，请见: https://webpack.docschina.org/configuration/devtool
   */
  // 不生成 source map，这是生产环境首选，与省略 devtool 选项是相同的效果
  devtool: "none",
  // 开发环境首选
  devtool: "cheap-module-eval-source-map",
  devtool: "source-map", // enum


  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析

  /* 打包后的 bundle 的最终运行环境，更改 块加载行为(chunk loading behavior) 和 可用模块(available module) */
  target: "web", // 默认值，类浏览器环境里可用
  target: "node", // 类 Node.js 环境可用（使用 Node.js require 加载 chunk）
  target: "async-node", // 类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）
  target: "node-webkit", // Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块和 nw.gui 导入（实验性质）
  target: "webworker", // WebWorker
  target: "electron-main", // electron，主进程(main process)
  target: "electron-renderer", // electron，渲染进程(renderer process)
  target: (compiler) => { /* ... */ }, // 自定义

  // 从输出的 bundle 中排除依赖，即防止将某些 import 的包打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
  // 因此，所创建的 bundle 依赖于那些存在于用户环境中的依赖
  externals: "react", // 字符串
  externals: /^(jquery|\$)$/i, // 正则
  externals: ["react", /^@angular\//], // 多个外部依赖
  externals: /^[a-z\-]+($|\/)/, // 正则
  externals: { // 对象语法
    jquery: 'jQuery', // 以全局变量 jQuery 来作为依赖
    angular: "this angular", // this["angular"]
    react: { // UMD
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    },
    subtract : { // subtract 可以通过全局 math 对象下的属性 subtract 访问（例如 window['math']['subtract']）
      root: ['math', 'subtract']
    },
  },
  externals: (request) => { /* ... */ return "commonjs " + request }

  serve: { //object
    port: 1337,
    content: './dist',
    // ...
  },
  // 为 webpack-serve 提供选项
  stats: "errors-only",
  stats: { //object
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    // ...
  },

  plugins: [
    // ...
  ],
  // 附加插件列表
  /* 高级配置（点击展示） */
  parallelism: 1, // number
  // 限制并行处理模块的数量
  profile: true, // boolean
  // 捕获时机信息
  bail: true, //boolean
  // 在第一个错误出错时抛出，而不是无视错误。
  cache: false, // boolean
  // 禁用/启用缓存

  // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。
  // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
  watch: false, // 默认值
  watchOptions: { // 定制 Watch 模式的选项
    // 当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位
    aggregateTimeout: 300, // 默认值
    // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹
    ignored: /node_modules/, // RegExp
    ignored: ['files/**/*.js', 'node_modules'], // 使用多种 anymatch 模式
    // 启用轮询观察模式（必须用在不通知更改的文件系统中）
    // Watch 在 NFS 和 VirtualBox 机器上不适用，通过传递 true 开启 polling，或者指定毫秒为单位进行轮询
    poll: true,
    poll: 500, // 间隔单位 ms
  },
  // 控制生命周期消息的详细程度，例如 Started watching files(开始监听文件)... 日志。将 info-verbosity 设置为 verbose，还会额外在增量构建的开始和结束时，向控制台发送消息。info-verbosity 默认设置为 info
  'info-verbosity': 'info', // 默认值

  // 配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行。
  // 此功能由 webpack 内部的 NodeStuffPlugin 插件提供。如果 target 是 "web"（默认）或 "webworker"，那么 NodeSourcePlugin 插件也会被激活。
  node: {
    // Polyfills and mocks to run Node.js-
    // environment code in non-Node environments.
    console: false, // boolean | "mock"
    global: true, // 默认值，boolean | "mock"
    process: true, // 默认值，boolean
    __filename: "mock", // 默认值，boolean | "mock"
    __dirname: "mock", // 默认值，boolean | "mock"
    Buffer: true, // boolean | "mock"
    setImmediate: true // boolean | "mock" | "empty"
  },
  recordsPath: path.resolve(__dirname, "build/records.json"),
  recordsInputPath: path.resolve(__dirname, "build/records.json"),
  recordsOutputPath: path.resolve(__dirname, "build/records.json"),
  // TODO
}
```

### output

```js
module.exports = {
  output: {
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: path.resolve(__dirname, "dist"), // string
    // 在 bundle 中引入「所包含模块信息」的相关注释。此选项在 development 模式时的默认值是 true，而在 production 模式时的默认值是 false。
    pathinfo: true, // boolean

    // 「入口分块(entry chunk)」的文件名模板
    filename: "bundle.js", // string
    filename: "[name].js", // 用于多个入口点(entry point)（出口点？）
    filename: "[chunkhash].js", // 用于长效缓存

    // 生成 hash 时使用的编码方式、hash 的前缀长度、散列算法、可选的加盐值
    // hashDigest: 'hex', // 默认值
    // hashDigestLength: 20, // 默认值
    // hashFunction: 'md4', // 默认值
    // hashSalt: '',

    //资源的公共路径前缀，除了在此处声明以在编译时确定，还可以使用自有变量的形式在运行时动态设置，详见: https://github.com/webpack/webpack/issues/2776#issuecomment-233208623
    publicPath: 'https://cdn.example.com/assets/', // CDN（总是 HTTPS 协议）
    publicPath: '//cdn.example.com/assets/', // CDN（协议相同）
    publicPath: '/assets/', // 相对于服务(server-relative)
    publicPath: 'assets/', // 相对于 HTML 页面
    publicPath: '../assets/', // 相对于 HTML 页面
    publicPath: '', // 相对于 HTML 页面（目录相同）

    // 向导出容器(export wrapper)中插入注释
    // auxiliaryComment: 'Comment'
    // auxiliaryComment: {
    //   root: 'Root Comment',
    //   commonjs: 'CommonJS Comment',
    //   commonjs2: 'CommonJS2 Comment',
    //   amd: 'AMD Comment'
    // }

    // 导出库(exported library)的名称
    library: "MyLibrary", // string,
    // 导出库(exported library)的类型，注释里的 _entry_return_ 表示入口起点返回的值
    libraryTarget: "umd", // 通用模块定义
    libraryTarget: "umd2", // 通用模块定义
    libraryTarget: "commonjs2", // exported with module.exports，output.library 无作用，结果：module.exports = _entry_return_;
    libraryTarget: "commonjs", // 作为 exports 的属性导出，结果：exports['MyLibrary'] = _entry_return_;
    libraryTarget: "amd", // 使用 AMD 定义方法来定义
    libraryTarget: "this", // 在 this 上设置属性，结果：this['MyLibrary'] = _entry_return_;
    libraryTarget: "var", // 变量定义于根作用域下，结果：var MyLibrary = _entry_return_;
    libraryTarget: "assign", // 盲分配(blind assignment)，结果：MyLibrary = _entry_return_;
    libraryTarget: "window", // 在 window 对象上设置属性，结果：window['MyLibrary'] = _entry_return_;
    libraryTarget: "global", // property set to global object，结果：global['MyLibrary'] = _entry_return_;
    libraryTarget: "jsonp", // jsonp wrapper
    // 配置导出模块的哪一部分，以 libraryTarget: 'var' 为例，说明 libraryExport 的不同取值及结果
    libraryExport: 'default', // 结果：var MyDefaultModule = _entry_return_.default;
    libraryExport: 'MyModule', // 结果：var MyModule = _entry_return_.MyModule;
    libraryExport: ['MyModule', 'MySubModule'], // 结果：var MySubModule = _entry_return_.MyModule.MySubModule;
    // 当使用了 libraryTarget: "umd"，设置该值为 true，则会对 UMD 的构建过程中的 AMD 模块进行命名，否则就使用匿名的 define
    umdNamedDefine: false

    // 非入口(non-entry) chunk 文件的名称
    chunkFilename: "[id].js", // 默认值
    chunkFilename: "[chunkhash].js", // 长效缓存(/guides/caching)

    // chunk 请求到期之前的毫秒数
    chunkLoadTimeout: 120000, // 默认值

    // 启用 cross-origin 属性 加载 chunk，只用于 target 是 web，使用了通过 script 标签的 JSONP 来按需加载 chunk
    crossOriginLoading: false, // 禁用跨域加载（默认）
    crossOriginLoading: 'anonymous', // 不带凭据(credential)启用跨域加载
    crossOriginLoading: 'use-credentials', // 带凭据(credential)启用跨域加载 with credentials

    // 允许自定义 script 的类型，webpack 会将 script 标签注入到 DOM 中以下载异步 chunk
    jsonpScriptType: 'text/javascript', // 默认值
    jsonpScriptType: 'module', // 与 ES6 就绪代码一起使用。

    // 用于异步加载 chunk 的 JSONP 函数名
    // jsonpFunction: "myWebpackJsonp", // string

    // 「source map 位置」的文件名模板
    sourceMapFilename: "[file].map", // 默认值

    // 确定 output.devtoolModuleFilenameTemplate 使用的模块名称空间
    // devtoolNamespace: '', // 默认为 output.library
    // 「devtool 中模块」的文件名模板
    // devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
    // 「devtool 中模块」的文件名模板（用于冲突）
    // devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string

    umdNamedDefine: true, // boolean
    // 在 UMD 库中使用命名的 AMD 模块

    // 指定运行时如何发出跨域请求问题
    crossOriginLoading: "use-credentials", // 枚举
    crossOriginLoading: "anonymous",
    crossOriginLoading: false,

    /* 以下为专家级输出配置（自行承担风险） */
    // 为这些模块使用 1:1 映射 SourceMaps（快速）
    devtoolLineToLine: {
      test: /\.jsx$/
    },

    // 「HMR 清单」的文件名模板
    hotUpdateMainFilename: "[hash].hot-update.json", // 默认值，没必要修改
    // 「HMR 分块」的文件名模板
    hotUpdateChunkFilename: "[id].[hash].hot-update.js", // 默认值，没必要修改
    // 只在 target 是 web 时使用，用于加载热更新(hot update)的 JSONP 函数。
    // hotUpdateFunction

    // 包内前置式模块资源具有更好可读性
    // sourcePrefix: "\t", // string
  },
}
```

### module 模块

```js
module.exports = {
  // 关于模块配置
  module: {
    // 模块规则（配置 loader、解析器等选项）

    // Rule 条件，有两种输入
    //   - 以 resource（被加载文件的绝对路径）为输入
    //     - 以 Rule.resource 来配置
    //     - 以 Rule.test/Rule.include/Rule.exclude 来配置，这种是 Rule.resource 的简写方式
    //     - 上面这两种只能选择一种配置方式
    //   - 以 issuer（import 被加载文件时的模块的绝对路径，即导入时的位置）为输入
    // 可以将 resource、和 issuer 输入结合，此时要匹配二者的所有条件
    //
    // 条件可以是以下这些之一：
    // - 字符串：必须以提供的字符串开始才算匹配成功，比如绝对路径、文件的绝对路径
    // - 正则表达式：将使用 RegExp.test() 来测试输入
    // - 函数：以输入为参数调用，必须返回真值才算匹配成功
    // - 包含条件的数组：至少需要有一个条件匹配成功，才算匹配成功
    // - 对象：所有的属性都要匹配，每个属性都有一个明确的行为

    // Rule 结果，在规则条件匹配时使用，其有两种形式
    //   - 应用在 resource 上的 loader 数组
    //     - 以 Rule.use 来表明
    //     - 以 Rule.loader、Rule.options 来表明（实际上是 Rule.use([ { loader, options } ]) 的简写方式）
    //   - Parser 选项：用于为模块创建解析器的选项对象

    rules: [
      {
        // Rule 条件形式一之非简写方式，使用 Rule.resource
        resource: { and: [ /* 条件 */ ] }, // 仅当所有条件都匹配时才匹配
        resource: { or: [ /* 条件 */ ] }, // 任意条件匹配时匹配（默认为数组）
        resource: [ /* 条件 */ ], // 任意条件匹配时匹配（默认为数组）
        resource: { not: /* 条件 */ }, // 条件不匹配时匹配

        // Rule 条件形式一之简写方式
        //
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 优先级高于 test 和 include
        //
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include

        // 通常提供一个正则表达式或正则表达式数组，但不是强制的
        test: /\.jsx?$/,
        // 匹配仅在这些条件中进行，通常提供一个字符串或字符串数组，但不是强制的
        include: [
          path.resolve(__dirname, "app")
        ],
        // 不在这些条件中进行匹配，通常提供一个字符串或字符串数组，但不是强制的
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],

        // Rule 条件形式二：以 issuer（import 被加载文件时的模块的绝对路径，即导入时的位置）为输入
        // 将 loader 应用到一个特定模块或一组模块的依赖中（目前文档里还没有相关使用示例）
        issuer: { test, include, exclude },

        // Rule 结果形式一之 loader，options
        loader: "babel-loader",
        options: {
          presets: ["es2015"]
        },

        // Rule 结果形式一之 use
        // 数组形式，可以传递多个 loader，loader 的应用顺序为由右向左（最后应用第一个 loader）
        use: [
          // 元素形式一：字符串，是 UseEntry 对象形式的简写方式
          "babel-loader",
          // 元素形式二：UseEntry 对象形式
          // - 必须有一个值为字符串的 loader 属性
          // - options 属性是可选的，也可能有 query 属性，它是 options 属性的别名
          // - 它使用 loader 解析选项 resolveLoader，相对于配置中的 context 来解析
          {
            loader: "babel-loader",
            options: {
              /* ... */
            }
          },
          // 元素形式三：UseEntry 函数形式，UseEntry 可以是函数，可根据被加载模块的信息，动态返回 UseEntry 对象
          // - 接收一个对象为参数，该对象描述被加载模块的信息，包括以下属性
          //   - compiler: 当前 webpack 的 compiler，可以是 undefined
          //   - issur: 模块路径，该模块正在 import 被加载的模块
          //   - realResource: 正被加载的模块的路径
          //   - resource: 正被加载的模块的路径，通常与 realResource 相同，除非资源名称在请求字符串里通过 !=! 被重写
          // - 必须返回一个 UseEntry 对象
          (info) => ({
            loader: 'babel-loader',
            options: {
              plugins: [{
                cleanupIDs: { prefix: basename(info.resource) }
              }]
            }
          })
        ],

        // Rule 结果形式二之 parser
        parser: false, // false: 禁用解析器；true/undefined: 启用解析器；还可以根据需要配置为其他值

        // 指定 loader 种类。没有值表示是普通 loader。
        enforce: "pre",
        enforce: "post",

        // 匹配资源 query，这个选项用于测试请求字符串的 query 部分（比如问号 ? 之后的）
        // 若是你`import Foo from './foo.css?inline'`，如下的条件将匹配
        test: /\.css$/,
        resourceQuery: /inline/,
        use: 'url-loader',

        // 标示出模块的哪些部分包含外部作用(side effect)。更多详细信息，请查看 https://webpack.docschina.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
        sideEffects: [
          "./src/some-side-effectful-file.js",
          "*.css"
        ],

        // 设置匹配的模块的类型，以防止默认 rule 和它们的默认导入行为生效。比如，若是你想要通过自定义 loader 加载一个 .json 文件，你就需要设置 type 为 javascript/auto，以跳过 webpack 内置的 json 导入 loader
        // 可能的值有：'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/experimental'
        test: /\.json$/,
        type: 'javascript/auto',
        loader: 'custom-json-loader',
      },

      {
        test: /\.css$/,
        // 规则数组，当规则匹配时，只使用第一个匹配规则（按序来匹配？）
        oneOf: [
          {
            resourceQuery: /inline/, // foo.css?inline
            use: 'url-loader'
          },
          {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader'
          }
        ]
      }

      // 使用所有这些嵌套规则（合并可用条件）
      {
        test: /\.css$/,
        rules: [ /* rules */ ]
      },
    ],

    /* 高级模块配置（点击展示） */

    // 不解析模块
    noParse: /jquery|lodash/,
    noParse: [
      /special-library\.js$/
    ],
    noParse: (content) => /jquery|lodash/.test(content),

    // specifies default behavior for dynamic requests
    // 这些属性，文档里没有详细说明
    // unknownContextRequest: ".",
    // unknownContextRecursive: true,
    // unknownContextRegExp: /^\.\/.*$/,
    // unknownContextCritical: true,
    // exprContextRequest: ".",
    // exprContextRegExp: /^\.\/.*$/,
    // exprContextRecursive: true,
    // exprContextCritical: true,
    // wrappedContextRegExp: /.*/,
    // wrappedContextRecursive: true,
    // wrappedContextCritical: false,
  },
}
```

### optimization 优化

```js
module.exports = {
  optimization: {
    // 使用 TerserPlugin 压缩 bundle。production 模式下，默认为 true
    minimize: false,
    // 提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
    minimizer: [
      // const TerserPlugin = require('terser-webpack-plugin');
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
      // 或提供函数
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({ /* your config */ }).apply(compiler);
      }
    ],

    // 可能的值：
    // - true/false
    // - 'single'/'multiple'
    // - 对象，只有 name 属性，属性值可以是名称或者返回名称的函数，用于为 runtime chunks 命名
    runtimeChunk: 'single', // 创建一个在所有生成 chunk 之间共享的运行时文件，此设置是下面配置的别名
    runtimeChunk: { name: 'runtime' }, // 同 runtimeChunk: 'single'
    runtimeChunk: 'multiple' // 等同于 runtimeChunk: true，会为每个仅含有 runtime 的入口起点添加一个额外 chunk，此设置是下面配置的别名
    runtimeChunk: { name: entrypoint => `runtime~${entrypoint.name}` }, // 同 runtimeChunk: 'multiple'、runtimeChunk: true
    runtimeChunk: false, // 每个入口 chunk 中直接嵌入 runtime，

    // 对于动态导入模块，默认使用 webpack v4+ 提供的全新的通用分块策略(common chunk strategy)
    // 请在 SplitChunksPlugin 页面中查看配置其行为的可用选项。
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },

    // 告知 webpack 当选择模块 ID 时使用哪种算法
    moduleIds: 'natural', // 基于使用顺序的数字 id
    moduleIds: 'named', // 可读的 id，以便更好的调试
    moduleIds: 'hashed', // 以短 hash 作为 id，以便更好地长期缓存
    moduleIds: 'size', // 数字 id，基于最小初始的下载大小
    moduleIds: 'total-size', // 数字 id，基于最小总的下载大小
    moduleIds: false, // 默认值，不使用内置的算法，可通过 plugin 提供

    // 告知 webpack 当选择 chunk ID 时使用哪种算法
    chunkIds: 'named', // 可读的 id，以便更好的调试；当 optimization.namedChunks 启用时，此项为默认值
    chunkIds: 'total-size', // 数字 id，基于最小总的下载大小；当 optimization.occurrenceOrder 启用时，此项为默认值
    chunkIds: 'natural', // 基于使用顺序的数字 id；若不符合上面两种情况，则此项为默认值
    chunkIds: 'size', // 数字 id，基于最小初始的下载大小
    chunkIds: false, // 默认值，不使用内置的算法，可通过 plugin 提供

    // 告知 webpack 将 p rocess.env.NODE_ENV 设置为一个给定字符串，若该值不是 false，则会使用DefinePlugin
    // 默认值取决于 mode；若为 falsy 值，则会回退到 "production"
    nodeEnv: 'any string', // 任意字符串，用于设置 p rocess.env.NODE_ENV 的值
    nodeEnv: false, // 不修改、设置 p rocess.env.NODE_ENV 的值

    // 如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块。
    // 设置为 false 以禁用这项优化
    removeAvailableModules: true, // 默认值

    // 如果 chunk 为空，告知 webpack 检测或移除这些 chunk
    // 设置为 false 以禁用这项优化。
    removeEmptyChunks: true, // 默认值

    // 告知 webpack 合并含有相同模块的 chunk。
    // 设置为 false 以禁用这项优化。
    mergeDuplicateChunks: true, // 默认值

    // 告知 webpack 确定和标记出作为其他 chunk 子集的那些 chunk，其方式是在已经加载过较大的 chunk 之后，就不再去加载这些 chunk 子集。
    flagIncludedChunks: true, // 默认会在 production mode 中启用，其他情况禁用

    // 告知 webpack 计算出模块的顺序，这个顺序将导致最小的初始化 bundle
    occurrenceOrder: true, // 默认会在 production mode 中启用，其他情况禁用

    // 告知 webpack 计算出模块提供了哪些导出，以便为 export * from ... 生成更高效的代码
    providedExports: true, // 默认值

    // 告知 webpack 去确定每个模块已使用的导出，这依赖于 optimization.providedExports
    // 通过 optimization.usedExports 收集的信息将被用于其他优化或代码生成，比如不导出未使用的导出项；导出名称被压缩为单个字符标识符（当所有的使用都是兼容的）；在 minimizers 里消除无用代码也收益与此，可移除未使用的导出
    usedExports: true, // 默认会在 production mode 中启用，其他情况禁用

    // 告知 webpack 发现模块图里片段，该片段可被安全地集中到单个模块里
    // 依赖于 optimization.providedExports 和 optimization.usedExports
    concatenateModules: true, // 默认会在 production mode 中启用，其他情况禁用

    // 告知 webpack 识别出 package.json 中的 sideEffects 标志，或规则，以跳过某些被标志为当导出未使用时不包含 side effects 的模块
    // 该选项依赖于 optimization.providedExports 的启用，这个依赖会有一些构建时间开销，但是消除模块在性能方面也有积极影响，因为会生成更少的代码
    // 这个优化的效果取决有代码库，尝试使用它，以获得一些可能的性能优化
    sideEffects: true, // 默认会在 production mode 中启用，其他情况禁用

    // 告知 webpack 生成相对路径的记录，以便具有移动上下文文件夹的能力
    // 默认是禁用的，但当存在 recordsPath, recordsInputPath, recordsOutputPath 中至少一个路径选项时，则自动启用
    portableRecords: false,

    // 在设置为 true 时，告知 webpack 通过将导入修改为更短的字符串，来减少 WASM 大小。这会破坏模块和导出名称。
    mangleWasmImports: false

    // 在编译出错时，配置为 true 来跳过生成阶段。这可以确保没有生成出错误资源。而 stats 中所有 assets 中的 emitted 标记都是 false。
    noEmitOnErrors: true,

    // 告知 webpack 使用可读取模块标识符(readable module identifiers)，来帮助更好地调试
    namedModules: false, // 若没有设置此选项，默认会在 mode 为 development 时启用，为 production 时禁用。
    // 告知 webpack 使用可读取 chunk 标识符(readable chunk identifiers)，来帮助更好地调试。
    namedChunks: false, // 若没有设置此选项，默认会在 mode 为 development 时启用，为 production 时禁用。
  },
}
```

### devServer 开发服务器

```js
module.exports = {
  // 精确控制要显示的 bundle 信息
  devServer: {
    // 在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。也可以使用 iframe 模式，它在通知栏下面使用 <iframe> 标签，包含了关于构建的消息。设置为 false 切换到 iframe 模式。
    // 推荐使用 inline 模式
    inline: true, // 默认值
    // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，可设置为 0.0.0.0
    host: '0.0.0.0',
    // 指定要监听请求的端口号
    port: 8080,
    // 将同域名下发送的 API 请求，代理到其他后端服务器

    // 是否开启懒惰模式。当启用 devServer.lazy 时，dev-server 只有在请求时才编译包(bundle)。这意味着 webpack 不会监视任何文件改动
    lazy: false,
    // 在 lazy mode(惰性模式) 中，此选项可减少编译。 默认在 lazy mode(惰性模式)，每个请求结果都会产生全新的编译。使用 filename，可以只在某个文件被请求时编译。
    // lazy: true,
    filename: 'bundle.js'

    // 此路径下的打包文件可在浏览器中访问。假设服务器运行在 http://localhost:8080 并且 output.filename 被设置为 bundle.js。默认 devServer.publicPath 是 '/'，所以你的包(bundle)可以通过 http://localhost:8080/bundle.js 访问。修改 devServer.publicPath，将 bundle 放在指定目录下。现在可以通过 http://localhost:8080/assets/bundle.js 访问 bundle。
    publicPath: '/assets/',

    // 告诉服务器从哪个目录中提供内容，只有在你想要提供静态文件时才需要
    contentBase: __dirname, // 默认值
    contentBase: path.join(__dirname, 'public'),
    contentBase: false, // 禁用 contentBase
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'assets')
    ],
    // 可以用于对 contentBase 路径下提供的静态文件，进行高级选项配置。有关可能的选项，请查看 Express 文档: http://expressjs.com/en/4x/api.html#express.static
    // 这只有在使用 devServer.contentBase 是一个 string 时才有效。
    staticOptions: {
      redirect: false
    },
    // 告知 dev-server，serve(服务) devServer.contentBase 选项下的文件。开启此选项后，在文件修改之后，会触发一次完整的页面重载。
    watchContentBase: true,
    // 与监视文件相关的控制选项，更多选项请查看: https://webpack.docschina.org/configuration/watch
    watchOptions: {
      poll: true
    },

    // 在所有响应中添加首部内容
    headers: {
      'X-Custom-Foo': 'bar'
    }

    // 告知 devServer 将生成的资源写入硬盘
    writeToDisk: true,
    writeToDisk: (filePath) => { // 过滤函数
      return /superman\.css$/.test(filePath);
    },

    // 启用后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    quiet: false,
    // 在开发工具(DevTools)的控制台(console)显示消息的级别，值有 string: 'none' | 'info' | 'error' | 'warning'
    clientLogLevel: 'none', // 关闭 log
    // 告诉 dev-server 隐藏 webpack bundle 信息之类的消息。devServer.noInfo 默认禁用。
    noInfo: false, // 默认值
    noInfo: true,  // only errors & warns on hot reload
    // 精确控制要显示的 bundle 信息，值有：string: 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose'；object
    stats: 'errors-only', // 只显示错误

    // 告诉 dev-server 在 server 启动后打开浏览器。默认禁用。
    open: true, // 使用默认浏览器打开
    open: 'Chrome', // 使用 Google Chrome 打开。PS: 浏览器应用名称是平台有关的，不要在可重用的模块里硬编码。比如， Google Chrome 在 macOS 上是 'Chrome'，在 Linux 上是 'google-chrome'，在 Windows 上是 'chrome'
    // 指定打开浏览器时的导航页面
    openPage: '/different/page',

    // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    overlay: false, // 默认值
    overlay: true, // 开启，只显示编译器错误
    overlay: { // 显示警告和错误
      warnings: true,
      errors: true
    }

    // 允许浏览器使用本地 IP 打开
    useLocalIp: true,

    // 启用 webpack 的 模块热替换 功能
    hot: true, // 注意，必须有 webpack.HotModuleReplacementPlugin 才能完全启用 HMR
    // 启用 webpack 的 模块热替换 功能，并且不以页面刷新作为构建失败的回退
    hotOnly: true,

    // 默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务
    https: true, // 使用了自签名证书
    https: { // 使用提供的证书
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }

    proxy: {
      // /api/users 现在会被代理到请求 http://localhost:3000/api/users
      '/api': 'http://localhost:3000',
      // 若不想始终传递 /api
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      },
      // 默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，修改配置如下
      '/api': {
        target: 'https://other-server.example.com',
        secure: false
      },
      // 有时你不想代理所有的请求。可以基于一个函数的返回值绕过代理。
      // 在函数中你可以访问请求体、响应体和代理选项。必须返回 false 或路径，来跳过代理请求。
      // 例如：对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。你可以这样做：
      bypass: function(req, res, proxyOptions) {
        if (req.headers.accept.indexOf('html') !== -1) {
          console.log('Skipping proxy for browser request.');
          return '/index.html';
        }
      }
    },
    // 如果你想要代理多个路径特定到同一个 target 下，你可以使用由一个或多个「具有 context 属性的对象」构成的数组
    proxy: [{
      context: ['/auth', '/api'],
      target: 'http://localhost:3000',
    }],
    // 默认情况下，根请求不会被代理，要启用根代理，应该将 devServer.index 选项指定为 falsy 值
    index: '', // specify to enable root proxying
    proxy: {
      context: () => true,
      target: 'http://localhost:1234'
    },
    // 默认情况下，当代理时请求头的 Origin 会被保留为在浏览器里访问的域名；若是将 changeOrigin 设为 true 将覆盖这个默认行为，改用 target
    proxy: {
      '/api': 'http://localhost:3000',
      changeOrigin: true
    }

    // 一切服务都启用 gzip 压缩
    compress: true,

    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    // devServer.historyApiFallback 默认禁用。通过传入以下启用
    historyApiFallback: true,
    historyApiFallback: { // 传入对象，精确控制
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
      ]
    },

    // 设置为 true 时，此选项绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到 DNS 重新连接攻击。
    disableHostCheck: false,

    // 在服务内部的所有其他中间件之前， 提供执行自定义中间件的功能
    before: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    },

    // 在服务内部的所有其他中间件之后， 提供执行自定义中间件的功能。
    after: function(app, server) {
      // 做些有趣的事
    },

    /* 以下选项，只用于命令行工具 */
    info, // 输出 cli 信息，默认启用，webpack-dev-server --info=false
    progress, // 将运行进度输出到控制台，webpack-dev-server --progress
    stdin, // 在 stdin 结束时关闭服务，webpack-dev-server --stdin
    color, // 启用/禁用控制台的彩色输出，webpack-dev-server --color

    /* TODO:以下选项，不知道实际用途 */
    index: 'index.html', // 被作为索引文件的文件名
    public: 'myapp.test:80',
    bonjour: true, // 此选项在启动时，通过 ZeroConf 网络广播服务
    pfx: '/path/to/file.pfx',
    pfxPassphrase: 'passphrase', // SSL PFX文件的密码
    allowedHosts: [ // 此选项允许你添加白名单服务，允许一些开发服务器访问
      '.host.com', // 以 . 开头的值可以用作子域通配符，将会匹配 host.com, www.host.com 和 host.com 的任何其他子域名。
      'host2.com'
    ],
    socket: 'socket', // 用于监听的 Unix socket
  },
}
```

### resolve 与 resolveLoader

```js
module.exports = {
  // 解析模块请求的选项（不适用于对 loader 解析）
  resolve: {
    // 解析模块时应该搜索的目录。若使用相对路径，则搜索模块的方式类似于 Node；若使用绝对路径，则只在给定目录中搜索
    modules: [
      "node_modules", // 相对路径
      path.resolve(__dirname, "app") // 绝对路径
    ],

    /* 创建 import 或 require 的别名，来确保模块引入变得更简单 */
    alias: {
      // "module" -> "new-module"
      // "module/path/file" -> "new-module/path/file"
      "module": "new-module",
      // "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // "module" -> "./app/third/module.js"
      // "module/file" 会导致错误
      "module": path.resolve(__dirname, "app/third/module.js"),
    },
    alias: [
      {
        // 旧的请求
        name: "module",
        // 新的请求
        alias: "new-module",
        // 如果为 true，只有 "module" 是别名
        // 如果为 false，"module/inner/path" 也是别名
        onlyModule: true
      }
    ],

    // 遵循符号链接(symlinks)到新位置

    // 用于描述模块的 JSON 文件，若模块路径为文件夹，则会在该文件夹下查找该 JSON 文件
    descriptionFiles: ["package.json"],

    // 当从 npm 包中导入模块时，此选项将决定在 package.json 中使用哪个字段导入模块
    mainFields: ["browser", "module", "main"], // webpack 配置中 target 属性设置为 webworker, web 或者没有指定时的默认值
    mainFields: ["module", "main"], // webpack 配置中 target 属性设置为其他任意的 target （包括 node）时的默认值
    // 若不存在 package.json 文件或者 package.json 文件中的 resolve.mainFields 配置的字段对应的文件不是一个有效路径，则在该文件夹下按顺序查找 resolve.mainFiles 配置选项中指定的文件名
    mainFiles: ['index'],

    // 若路径不带扩展名，则依次以该项配置的扩展名来解析
    extensions: ['.wasm', '.mjs', '.js', '.json'], // 默认值
    // 若为 true，则路径必须包含扩展名，比如 require('./foo.js')；require('./foo')将不可用
    enforceExtension: false, // 默认值
    // 对模块（例如 loader）是否需要使用扩展名
    enforceModuleExtension: false, // 默认值

    // 从描述文件中读取的属性
    // 以对此 package 的请求起别名
    aliasFields: ["browser"],

    // 为解析的请求启用缓存，这是不安全，因为文件夹结构可能会改动，但是性能改善是很大的
    unsafeCache: true, // 默认值，缓存一切
    unsafeCache: /src\/utilities/, // 还可传入正则表达式或正则表达式数组，只缓存某些模块

    // 决定请求是否应该被缓存的函数。函数传入一个带有 path 和 request 属性的对象。必须返回一个 boolean 值。
    cachePredicate: (module) => {
      // additional logic
      return true;
    },

    // 应用于解析器的附加插件
    plugins: [
      // ...
    ],

    // 是否将符号链接(symlink)解析到它们的符号链接位置(symlink location)
    symlinks: true, // 默认值
  },
}
```

```js
module.exports = {
  // 独立解析 webpack 的 loader 包
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
    // 解析 loader 时，若省略了 -loader，可以配置该项来添加后缀
    // 强烈建议使用全名
    moduleExtensions: ["-loader"],
  },
}
```

### stats

```js
module.exports = {
  // 值为字符串形式，表示预设选项
  stats: 'errors-only', // 只在发生错误时输出
  stats: 'minimal', // 只在发生错误或有新的编译时输出
  stats: 'none', // 没有输出
  stats: 'normal', // 标准输出
  stats: 'verbose', // 全部输出

  // 值为对象形式，更加精细的控制各个选项，对象中的所有选项都是可选的
  // 若是想使用预设选项，比如 'minimal'，但是想覆盖其中的几个选项，可以参见源码(https://github.com/webpack/webpack/blob/master/lib/Stats.js#L1394-L1401)，将 'minimal' 的配置选项复制出来，再添加自己想要的额外选项，最后将整个对象赋给 stats
  stats: {
    // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
    all: undefined,

    // 添加资源信息
    assets: true,

    // 对资源按指定的字段进行排序
    // 你可以使用 `!field` 来反转排序。
    // Some possible values: 'id' (default), 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    assetsSort: "field",

    // 添加构建日期和构建时间信息
    builtAt: true,

    // 添加缓存（但未构建）模块的信息
    cached: true,

    // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
    cachedAssets: true,

    // 添加 children 信息
    children: true,

    // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    chunks: true,

    // 添加 namedChunkGroups 信息
    chunkGroups: true,

    // 将构建模块信息添加到 chunk 信息
    chunkModules: true,

    // 添加 chunk 和 chunk merge 来源的信息
    chunkOrigins: true,

    // 按指定的字段，对 chunk 进行排序
    // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
    // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    chunksSort: "field",

    // 用于缩短 request 的上下文目录
    context: "../src/",

    // `webpack --colors` 等同于
    colors: false,

    // 显示每个模块到入口起点的距离(distance)
    depth: false,

    // 通过对应的 bundle 显示入口起点
    entrypoints: false,

    // 添加 --env information
    env: false,

    // 添加错误信息
    errors: true,

    // 添加错误的详细信息（就像解析日志一样）
    errorDetails: true,

    // 将资源显示在 stats 中的情况排除
    // 这可以通过 String, RegExp, 获取 assetName 的函数来实现
    // 并返回一个布尔值或如下所述的数组。
    excludeAssets: "filter" | /filter/ | (assetName) => true | false |
      ["filter"] | [/filter/] | [(assetName) => true|false],

    // 将模块显示在 stats 中的情况排除
    // 这可以通过 String, RegExp, 获取 moduleSource 的函数来实现
    // 并返回一个布尔值或如下所述的数组。
    excludeModules: "filter" | /filter/ | (moduleSource) => true | false |
      ["filter"] | [/filter/] | [(moduleSource) => true|false],

    // 查看 excludeModules
    exclude: "filter" | /filter/ | (moduleSource) => true | false |
          ["filter"] | [/filter/] | [(moduleSource) => true|false],

    // 添加 compilation 的哈希值
    hash: true,

    // 设置要显示的模块的最大数量
    maxModules: 15,

    // 添加构建模块信息
    modules: true,

    // 按指定的字段，对模块进行排序
    // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
    // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    modulesSort: "field",

    // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
    moduleTrace: true,

    // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
    performance: true,

    // 显示模块的导出
    providedExports: false,

    // 添加 public path 的信息
    publicPath: true,

    // 添加模块被引入的原因
    reasons: true,

    // 添加模块的源码
    source: false,

    // 添加时间信息
    timings: true,

    // 显示哪个模块导出被用到
    usedExports: false,

    // 添加 webpack 版本信息
    version: true,

    // 添加警告
    warnings: true,

    // 过滤警告显示（从 webpack 2.4.0 开始），
    // 可以是 String, Regexp, 一个获取 warning 的函数
    // 并返回一个布尔值或上述组合的数组。第一个匹配到的为胜(First match wins.)。
    warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => true|false
  }
}
```

### 文件名模板字符串

针对`filename`/`chunkFilename`，可以接受如下占位符：

- `[name]`: 入口名称
- `[id]`: 内部的 chunk id
- `[hash]`: 每次构建过程中，生成的`hash`
- `[chunkhash]`: 基于每个`chunk`内容的`hash`，每次构建的`chunkhash`都不一样
- `[contenthash]`: 提取出的内容的`hash`（待详细了解）
- `filename`还接受一个函数，返回一个字符串，可包含上面这些模板字符串

## 其他导出类型

- 导出为一个函数
- 导出一个 Promise
- 导出多个配置对象

Reference: [Webpack 官网 - 多种配置类型](https://webpack.docschina.org/configuration/configuration-types/)
