# Babel 7

官方中文文档: [https://www.babeljs.cn/](https://www.babeljs.cn/)

## preset

## plugins

## preset 和 plugins 使用顺序

- 插件在 Presets 前运行。
- 插件顺序从前往后排列。
- Presets 顺序是颠倒的（从后往前）。

## 配置方式

配置共有三种方式：

1. 在`package.json`中设置`babel`字段。
2. `.babelrc`文件或`.babelrc.js`文件。
3. `babel.config.js`文件。

### 配置方式 1

第`1`种方式，需要在`package.json`文件里添加`babel`配置项，配置如下：

```json
{
   "name":"babel-test",
   "version":"1.0.0",
   "devDependencies": {
       "@babel/core":"^7.4.5",
       "@babel/cli":"^7.4.4",
       "@babel/preset-env":"^7.4.5"
        // ...
   },
   "babel": {
       "presets": ["@babel/preset-env"]
   }
}
```

### 配置方式 2

第`2`种方式，需要创建`.babelrc`文件或`.babelrc.js`文件。

`.babelrc`文件：

```json
{
    "presets": ["@babel/preset-env"]
}
```

或`.babelrc.js`：

```js
// Webpack 的配置文件也是这种写法
module.exports = {
    presets: ['@babel/preset-env']
};
```

该类配置文件是针对文件夹级别的配置，即项目根目录文件夹下或其子文件夹下都可以配置和应用该类配置文件，但子文件夹里的配置文件会覆盖祖先文件夹里的配置文件（TODO: 是配置对象整体覆盖还是合并配置对象覆盖相同的选项），因此通过这种方式，可以给不同的文件夹层级设置不同的规则。

### 配置方式 3

第`3`种方式，需要在项目根目录创建`babel.config.js`文件，该配置文件是针对整个项目，整个项目仅能有一个该类配置文件，且必须放置在项目根目录里。

```js
module.exports = {
    presets: ['@babel/preset-env']
};
```

需要注意的是，

- 方式`1`这种在`package.json`里添加`babel`配置项的方式，和方式`2`和`3`这种创建配置文件的方式，没有本质区别，主要看个人习惯。
- `.babelrc`文件若是放置在项目根目录，其效果跟`babel.config.js`是一致的，若两种类型的配置文件都存在，则`.babelrc`文件会覆盖`babel.config.js`文件。

## 常用插件

| 包名                            | 功能                           | 说明                                                                             |
| ------------------------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| @babel/plugin-transform-runtime | 复用工具函数                   | 非必装开发依赖，和@babel/runtime同时存在                                         |
| @babel/cli                      | 命令行执行babel命令工具        | 非必装开发依赖，packages.json的script中使用了babel命令则需安装                   |
| babel-loader                    | webpack中使用babel加载文件     | 非必装开发依赖，webpack项目中使用                                                |
| @babel/plugin-*                 | babel编译功能实现插件          | 开发依赖，按照需要的功能安装                                                     |
| @babel/preset-*                 | 功能实现插件预设               | 开发依赖，按照需要的功能安装，js语言新特性转换推荐使用preset-env                 |
| @babel/polyfill                 | 低版本浏览器兼容库             | 非必装生产依赖，已不推荐使用，推荐通过preset-env的useBuiltIns属性按需引入        |
| core-js@*                       | 低版本浏览器兼容库             | 非必装生产依赖，通过preset-env引入polyfill需安装此包，并通过corejs指定版本       |
| @babel/runtime-corejs*          | 不污染变量的低版本浏览器兼容库 | 非必装生产依赖，plugin-transform-runtime设置开启后，可以不污染变量的引入polyfill |

## @babel/core

Babel 编译的核心包，提供了一些方法如：

- `transform`/`transformSync`/`transformAsync`
- `transformFile`/`transformFile`/`transformFile`
- `transformFromAst`/`transformFromAstSync`/`transformFromAstAsync`
- `parse`/`parseSync`/`parseAsync`
- 以及其他一些高级 API

详情请见[Babel 官网 - @babel/core](https://www.babeljs.cn/docs/babel-core)。

需要注意的是，若是不使用插件或预设，则 Babel 会原封不动的将源码输出。

## @babel/runtime

[`@babel/runtime`](./@babel/runtime.md)，以模块化方式包含了 Babel 运行时辅助工具函数的实现的包，`@babel/plugin-transform-runtime`插件依赖该插件作为运行时依赖。

## @babel/plugin-transform-runtime

[@babel/plugin-transform-runtime](./@babel/plugin-transform-runtime.md)。

## TODO

- 理清 Babel 各个插件之间的关系。

以前的 babel-transform-runtime 是包含了 helpers 和 polyfill。而现在的 @babel/runtime 只包含 helper，如果需要 polyfill，则需主动安装 core-js 的 runtime版本 @babel/runtime-corejs2 。并在 @babel/plugin-transform-runtime 的插件中做配置。

- monorepos 的意义

- Babel 7 里项目根目录下配置的`babel.config.js`会对`node_modules`、`symlinks`和`monorepos`生效，详见[Upgrade to Babel 7 - Config Lookup Changes](https://babeljs.io/docs/en/v7-migration#config-lookup-changes)。但是`node_modules`下的模块一般都是编译好的，需要剔除对他们的编译。

参考：

- [一文读懂 babel7 的配置文件加载逻辑](https://segmentfault.com/a/1190000018358854)

## 常用 preset

### @vue/babel-preset-app

默认会包含以下`polyfill`：

- `es6.array.iterator`
- `es6.promise`
- `es6.object.assign`
- `es7.promise.finally`

详见[vue-cli 之 @vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app)
