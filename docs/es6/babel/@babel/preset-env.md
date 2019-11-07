# @babel/preset-env

[@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)是一个灵活的预设，你可以无需管理目标环境需要的语法转换或浏览器`polyfill`，就可以使用最新的 JavaScript。这将让你的生活更简单，也会让 JavaScript 打包文件更小。

## 安装

```sh
# with npm
npm install --save-dev @babel/preset-env
```

```sh
# with yarn
yarn add @babel/preset-env --dev
```

## 它如何工作

`@babel/preset-env`是基于一些优秀的开源项目，比如[browserslist](https://github.com/browserslist/browserslist)、[compat-table](https://github.com/kangax/compat-table)、[electron-to-chromium](https://github.com/Kilian/electron-to-chromium)，要是没有它们，也就没有`@babel/preset-env`。

我们利用这些数据源来维护一些映射表：

- 我们支持的设备环境的哪个版本需要获得哪些 JavaScript 语法或浏览器特性的支持的映射
- 这些语法和特性到 Babel 转换插件和`core-js`的`polyfill`的映射

::: warning 注意
尤其需要注意的是，`@babel/preset-env`不支持`stage-x`的插件。
:::

`@babel/preset-env`拿到你指定的目标环境，检查这些映射表来编译一系列的插件并传给 Babel。

## Browserslist 集成

针对基于浏览器的或`Electron-based`的项目，我们推荐使用[.browserslistrc](https://github.com/browserslist/browserslist)文件来指定目标环境。你可能已经有了这个配置文件，因为它会被生态系统里的许多工具用到，比如[autoprefixer](https://github.com/postcss/autoprefixer)、[stylelint](https://stylelint.io/)、[eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)等等。

若是没设置`targets`或`ignoreBrowserslistConfig`配置项，`@babel/preset-env`默认会使用[browserslist config sources](https://github.com/browserslist/browserslist#queries)。

比如，仅仅包含`>0.25%`市场份额浏览器的那些`polyfill`和代码转换：

Options:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        // 原文档是这样的
        // "useBuiltIns": "entry",

        // 实际上应该是这样
        "targets": "> 0.25%, not dead"
      }
    ]
  ]
}
```

browserslist:

```txt
> 0.25%
not dead
```

或`package.json`:

```json
{
    "browserslist": "> 0.25%, not dead"
}
```

## Options

关于更多设置预设的配置项，可参考[preset options](https://www.babeljs.cn/docs/presets#preset-options)文档。

### targets

`string | Array<string> | { [string]: string }`，默认为`{}`。

描述你项目支持的目标环境。

这可以使用[browserslist-compatible](https://github.com/browserslist/browserslist)形式的`query`：

```json
{
  "targets": "> 0.25%, not dead"
}
```

或者支持的最小环境版本的对象：

```json
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

这些环境可以是：

- `chrome`
- `opera`
- `edge`
- `firefox`
- `safari`
- `ie`
- `ios`
- `android`
- `node`
- `electron`

若是没有指定环境，`@babel/preset-env`默认将转换所有的 ECMAScript 2015+ 代码。

```json
{
  "presets": ["@babel/preset-env"]
}
```

::: warning 注意
我们不推荐使用`preset-env`时不指定环境，因为这样就无法发挥它指定目标浏览器能力的优势。
:::

#### targets.esmodules

`boolean`

你要支持的目标浏览器可能支持[ES 模块](https://www.ecma-international.org/ecma-262/6.0/#sec-modules)。当指定该选项，指定的目标浏览器将被忽略。你可以结合`<script type="module"></script>`来使用这样方式，这样就会产生更小的脚本文件（[https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility](https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility)）。

::: warning 注意
请注意，当指定`esmodules`后，将忽略浏览器目标环境。
:::

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true
        }
      }
    ]
  ]
}
```

#### targets.node

`string | "current" | true`

若是你想要针对当前`node`版本编译，你可以指定`"node": true`或`"node": "current"`，这与`"node": process.versions.node`是一样的。

#### targets.safari

`string | "tp"`

若是你想要针对 Safari 的 technology preview 版本编译，你可以指定`"safari": "tp"`。

#### targets.browsers

即将在下个版本移除。

### spec

`boolean`,  默认为`false`。

Enable more spec compliant, but potentially slower, transformations for any plugins in this preset that support them.

### loose

`boolean`,  默认为`false`。

开启["loose" transformations](https://2ality.com/2015/12/babel6-loose-mode.html)，针对预设里允许`loose`转换的任何插件。

### modules

`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`，默认为`"auto"`。

Enable transformation of ES6 module syntax to another module type.

开启将 ES6 模块语法转换为其他模块语法。设置为`false`将不转换模块。

`cjs`是`commonjs`的别名。

### debug

`boolean`,  默认为`false`。

将使用的插件/目标环境以及[plugin data version](https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugins.json)指定的版本输入到`console.log`。

### include

`Array<string|RegExp>`,  默认为`[]`。

插件数组，这些插件总是被使用（即使目标环境不需要）。

有效的选项包括：

- Babel 插件，带前缀或不带前缀都支持，比如`@babel/plugin-transform-spread`或`plugin-transform-spread`。
- 内置对象，比如`es6.map`、`es6.set`、或`es6.object.assign`。

插件名称可以全部或部分指定（或使用正则表达式）。

可接受的输入有：

- 全部名称，`string`：`"es6.math.sign"`
- 部分名称，`string`：`"es6.math.*"`（解析为所有以`es6.math`为前缀的插件）
- `RegExp`对象：`/^transform-.*$/`或`new RegExp("^transform-modules-.*")`

注意，上面的`.`是`RegExp`的一部分，等同于任何字符，而不是实际的字符`.`。另外注意在`RegExp`里使用`.*`匹配任何字符，类似于`glob`格式里的`*`。

若是原生实现里有`bug`，或者只实现了特性的一部分时，这个配置项将尤其有用。

比如，Node 4 支持原生的类但是不支持函数参数的扩展运算符。若是调用`super`时使用扩展运算符，则需要引入`@babel/plugin-transform-classes`进行转换。

::: warning 注意
注意，`include`和`exclude`选项仅能作用于包含在预设里的插件。因此，若是使用`include`包含`@babel/plugin-proposal-do-expressions`插件或是使用`exclude`排除`@babel/plugin-proposal-function-bind`，都会抛错。若是想使用不包含在预设里的插件，可以直接添加在`plugins`里。
:::

### exclude

`Array<string|RegExp>`，默认为`[]`。

插件数组，这些插件将不会被使用（即使目标环境需要）。

可能的选项与`include`相同。

该选项设置了一个转换插件的黑名单，比如不使用`@babel/plugin-transform-regenerator`，若是你不使用生成器函数`generators`以及不想包含`regeneratorRuntime`（当使用`useBuiltIns`时）或使用另一个插件比如[fast-async](https://github.com/MatAtBread/fast-async)而不是[Babel 的`async-to-gen`](https://www.babeljs.cn/docs/babel-plugin-proposal-async-generator-functions)。

### useBuiltIns

`"usage"` | `"entry"` | `false`，默认是`false`。

::: warning 注意
该选项会直接添加对`core-js`模块的引用。因此`core-js`将相对于文件自身进行解析，这要求`core-js`是可访问的。在你的项目，若是没有`core-js`依赖或是有多个版本，你可能需要指定`core-js@2`作为顶级依赖。
:::

这选项配置`@babel/preset-env`如何处理`polyfill`。

#### useBuiltIns: 'entry'

::: warning 注意
整个项目里能且仅能有一次使用`require("@babel/polyfill");`。多次引入`@babel/polyfill`将抛错，因为这将导致全局冲突以及其他难以追踪的问题。我们推荐创建一个单独的入口你文件，仅仅包含`require`语句。
:::

该选项启用一个新的插件，该插件将基于你环境单独引入`core-js`的各个文件，以此来替换掉`import "@babel/polyfill"`或`require("@babel/polyfill")`语句。

```js
npm install @babel/polyfill --save
```

输入：

```js
import "@babel/polyfill";
```

输出（基于环境而不同）：

```js
import "core-js/modules/es7.string.pad-start";
import "core-js/modules/es7.string.pad-end";
```

这对直接引入`core-js`也是有效的（`import "core-js";`或`require('core-js');`）。

#### useBuiltIns: 'usage'（实验性的）

添加对每个文件中使用的特定的`polyfill`的引入。我们利用了“一个打包文件将只加载一次相同的`polyfill`”这一事实。

输入：

```js
// a.js
var a = new Promise();
```

```js
// b.js
var b = new Map();
```

输出（若是环境不支持）：

```js
import "core-js/modules/es6.promise";
var a = new Promise();
```

```js
import "core-js/modules/es6.map";
var b = new Map();
```

输出（若是环境支持）：

```js
var a = new Promise();
```

```js
var b = new Map();
```

#### useBuiltIns: false

每个文件里不自动添加`polyfill`，或不将`import "@babel/polyfill"`转换为单独的`polyfill`。

### forceAllTransforms

`boolean`，默认为`false`。

有了 Babel 7 的[Javascipt config file](https://www.babeljs.cn/docs/config-files#javascript)支持，若是`env`被设置为`product`，你可以强制使用所有的转换。

```js
module.exports = function(api) {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            chrome: 59,
            edge: 13,
            firefox: 50,
          },
          // for uglifyjs...
          forceAllTransforms: api.env("production"),
        },
      ],
    ],
  };
};
```

::: warning 注意
`targets.uglify`已经废弃并将在下个主版本移除。
:::

默认情况下，这个预设将会按需运行目标环境需要的所有转换。若是你想要运行所有的转换（而忽略目标环境是否需要），则需要开启该选项，这对于输出代码在 UglifyJS 上或仅支持 ES5 的环境上运行来说将是非常有用的。

::: warning 注意
Uglify 有一个在建的"Harmony"分支来设法解决 ES6 支持缺失的问题，但是这还不太稳定。你可以在[UglifyJS2 issue #448](https://github.com/mishoo/UglifyJS2/issues/448)关注这个进度。如果你想要一个支持 ES6 语法的可选的压缩工具，我们推荐使用[babel-minify](https://www.babeljs.cn/docs/babel-preset-minify)
:::

### configPath

`string`，默认为`process.cwd()`。

搜索 Browserslist 配置的开始点，会基于此开始点向上搜索到系统根目录，直到发现配置文件。

### ignoreBrowserslistConfig

`boolean`，默认为`false`。

切换是否使用[browserslist config sources](https://github.com/browserslist/browserslist#queries)，这将决定是否要搜索任何的 Browserslist 配置文件或`package.json`里的`browserslist`选项。当项目里存在 Browserslist 配置文件但是不用于 Babel 编译时，这将非常有用。

### shippedProposals

切换是否开启对处于提案中的且浏览器已经实现的内置对象/特性的支持。若是你的目标环境已经有了对某提案特性的原生支持，将开启与其相匹配的解析器语法插件，而不是执行任何的转换。注意，这不会开启与[@babel/preset-stage-3](https://www.babeljs.cn/docs/babel-preset-stage-3)相同的转换，因为这些提案在正式落地到浏览器之前还会继续改变。

当前以下内容是支持的：

Builtins

- [es7.array.flat-map](https://github.com/tc39/proposal-flatMap)

Features

- None
