# Babel

[[toc]]

Babel 是处于构建时（也就是传统 Java 等语言的编译时），转译出来的结果在默认情况下并不包括 ES6 对运行时的扩展，例如，builtins（内建，包括 Promise、Set、Map 等）、内建类型上的原型扩展（如 ES6 对 Array、Object、String 等内建类型原型上的扩展）以及 Regenerator（用于 generators / yield）等都不包括在内。

以下所有内容，都是基于 Babel 6。

## babel 的三个阶段：解析，转换，生成

Babel 本身不具有任何转化功能，它把转化的功能都分解到一个个 plugin 里面。因此当我们不配置任何插件时，经过 babel 的代码和输入是相同的。

插件总共分为两种：语法插件和转译插件。

当我们添加 语法插件 之后，在解析这一步就使得 babel 能够解析更多的语法。(顺带一提，babel 内部试用的解析类库叫做 babylon，并非 babel 自行开发)。举个简单的例子，当我们定义或者调用方法时，最后一个参数之后是不允许增加逗号的，如 callFoo(param1, param2,) 就是非法的。如果源码是这种写法，经过 babel 之后就会提示语法错误。

但最近的 JS 提案中已经允许了这种新的写法(让代码 diff 更加清晰)。为了避免 babel 报错，就需要增加语法插件 babel-plugin-syntax-trailing-function-commas

当我们添加 转译插件 之后，在转换这一步把源码转换并输出。这也是我们使用 babel 最本质的需求。

比起语法插件，转译插件其实更好理解，比如箭头函数 (a) => a 就会转化为 function (a) {return a}。完成这个工作的插件叫做 babel-plugin-transform-es2015-arrow-functions。

同一类语法可能同时存在语法插件版本和转译插件版本。如果我们使用了转译插件，就不用再使用语法插件了。

## 构建时

构建时，是语法（比如箭头函数、const、let、块级作用域等）层次的编译，包括以下模块：

- babel-core：Babel 的核心，包含各个核心的 API，供 Babel 插件和打包工具使用
- babel-cli：命令行对 js 文件进行换码的工具
- babel-node：命令行 REPL，支持 ES6 的 js 执行环境
- babel-register：Babel 的一个注册器，它在底层改写了 node 的`require`方法，所有通过`require`并以`.es6`、`.es`、`.jsx`和`.js`为后缀引入的模块都会经过 Babel 的转译

## 运行时

运行时（API，包含内建类型如`Promise`、`Set`、`Map`，及 ES6 对`Array`、`Object`、`String`等内建类型原原型上的扩展，以及 Regenerator 等）

### 基础依赖库

- core-js 标准库：提供 ES5、ES6 的 polyfills，包括 promises 、symbols、collections、iterators、typed arrays、ECMAScript 7+ proposals、setImmediate 等等
- regenerator 运行时库：实现 ES6/ES7 中 generators、yield、async 及 await 等相关的 polyfills

### babel-runtime + babel-plugin-transform-runtime

- 更适合开发类库时使用
- babel-runtime 库：由 Babel 提供的 polyfill 库
  - 它本身就是由 core-js 与 regenerator-runtime 库组成，除了做简单的合并与映射外，并没有做任何额外的加工
  - 使用时需要手动引入需要的模块
  - 不会污染全局变量、不会污染 prototype
  - 不支持转换实例方法，支持转换静态方法，但是，只支持显示调用如：`Array.from`，不支持隐式调用如`Array['from']`
- babel-plugin-transform-runtime 插件
  - 让 Babel 发现代码中使用到 Symbol、Promise、Map 等新类型时，自动且按需进行 polyfill
- 使用方式：配置`.babelrc`里的`plugins`

#### babel-plugin-transform-runtime 配置

```js
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": [
    ["transform-runtime", {
      "helpers": true, //自动引入helpers
      "polyfill": true, //自动引入polyfill（core-js提供的polyfill）
      "regenerator": true, //自动引入regenerator
    }]
  ]
}
```

### babel-polyfill

- 更适合开发应用时使用
- babel-polyfill
  - 初衷是模拟一整套 ES2015+ 运行时环境
  - 会以全局变量的形式 polyfill Map、Set、Promise 之类的类型
  - 会以类似 Array.prototype.includes() 的方式去注入污染原型
  - 占文件空间并且无法按需定制
- 使用方式：在你应用程序的入口点顶部或打包配置中引入

#### babel-polyfill 配置

```js
// 应用程序的入口点顶部或打包配置中引入
import "babel-polyfill";
```

## 模块

### `__esModule`

Babel 默认是将 ES6 规范的代码转化成 CommonJS 规范的代码
（默认使用`transform-es2015-modules-commonjs`插件，通过别的插件也可以转换成其他规范的代码）。

```js
// 转化前
import { bar } from "./b";
bar();
export default {
  a: 1,
  b: 2
};
```

```js
// 转换后
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _b = require("./b");

exports.default = {
  a: 1,
  b: 2
};
```

转化成 CommonJS 规范的代码里，都会在`exports`对象上添加`__esModule`属性，表明这个模块是经过 Babel 转码的符合 CommonJS 规范的模块。

而`__esModule`这个属性的作用，就是在该模块被引用时，用以判断该模块是经过 Babel 转码的模块，还是普通的 CommonJS 模块。如果是普通的 CommonJS 模块，会进行对应的处理。

```js
// 转换前
import a from "./a";
import { b } from "./b";
import * as c from "./c";
console.log(a);
export default {
  foo: 1,
  bar: 2
};
```

```js
// 转换后
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a = require("./a");

var _a2 = _interopRequireDefault(_a);

var _b = require("./b");

var _c = require("./c");

var c = _interopRequireWildcard(_c);

// import * as c from './c'
// 上面这一句会导致转码里包含 _interopRequireWildcard 函数
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

// import a from './a'
// 上面这一句会导致转码里包含 _interopRequireDefault 函数
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

console.log(_a2.default);
exports.default = {
  foo: 1,
  bar: 2
};
```

### 为什么可以用 CommonJS 的`require`去引用 ES6 的模块

- ES6 的模块会经过 Babel 转换成 CommonJS 的模块，因此最终通过`require`引入的是 CommonJS 模块
- 所以，如果 ES6 模块里定义了`default`，通过`require`引入后想使用`default`的值，需要显示获取`default`属性，即`require('./a').default`

### 为什么可以使用 ES6 的`import`去引用 CommonJS 定义的模块

```js
import a from "./a"; // 引入 _interopRequireDefault
import * as c from "./c"; // 引入_interopRequireWildcard
```

ES6 的模块，最终会转换为 CommonJS 的模块，且在转换时如果遇到上面的两种 ES6 引入方式，会在转换后的代码里添加
`_interopRequireWildcard`辅助函数和`_interopRequireDefault`辅助函数，这两个函数可以将 CommonJS 模块转化为转换后的代码需要的模块形式。

## babel 之 webpack

### 与 webpack 有关的 Babel 配置详解

```js
// .babelrc
{
  "presets": [
    [
      "env",
      {
        "modules": false,
        "useBuiltIns": true,
        "targets": {
          "browsers": [
            "> 0.01%",
            "last 2 versions",
            "not ie <= 8"
          ]
        }
      }
    ],
    "stage-2"
  ]
}
```

#### "modules": false

webpack 2 开始引入`tree-shaking`技术，通过静态分析 ES6 语法，可以删除没有被使用的模块，但是这只对 ES6 的模块有效，所以一旦 Babel 将 ES6 的模块转换成 CommonJS 的模块，webpack 2 将无法使用这项优化。所以要使用这项技术，我们只能使用 webpack 的模块处理，加上 Babel 的 ES6 转换能力（即需要关闭模块转换`"modules": false`）

### 有些 UI 组件库比如 element-ui 和 cube-ui 可以用`import`或`require`按需引入单个模块，是如何做到的

1. 组件库发布时，webpack 等打包工具会将单个模块（如`button.js`）模块导出成 CommonJS 模块，放在 lib 目录下（如`lib/button.js`）
2. Babel 里使用`babel-plugin-component`插件或类似插件，并做一些配置
3. 用户在使用`import { Button } from 'element-ui'`引入组件时，Babel 会自引入`lib/button.js`的结果并复制给`Button`
4. 如果没有第`2`步的配置，引入的则是整个组件库

## .babelrc 配置

### 配置

```js
{
  "presets": [
    [
      "env", // 简写，即 babel-preset-env，https://babeljs.cn/docs/plugins/#pluginpreset-%E8%B7%AF%E5%BE%84
      {
        "modules": false,
        "useBuiltIns": true,
        "targets": {
          "browsers": [
            "> 0.01%",
            "last 2 versions",
            "not ie <= 8"
          ]
        }
      }
    ],
    "stage-2"
  ]
}
```

`presets`配置项，是对 Babel 构建时的配置，而 Babel 构建时只转换新语法，而不转换新的内建对象或者新的 API。

需要注意，本文里的所有配置都是 JSON 格式的，不能添加注释，示例里的注释是为了方便说明，实际使用时需要删除所有注释。

#### `babel-presets-env`

以下只对`modules`和`useBuiltIns`做详细说明，其他配置项可参考[官网](https://babeljs.cn/docs/plugins/preset-env)

#### `modules`

`"amd" | "umd" | "systemjs" | "commonjs" | false， 默认为 "commonjs".`

配置将 ES6 模块语法转换成哪一种模块类型，设置成`false`将不会转换模块（比如需要利用 webpack 的 tree-shaking 功能时）。

#### `useBuiltIns`

默认情况下，Babel 只转换新语法，不转换新的内建对象或新的 API。

如果需要转换新的内建对象或新的 API，有两种方式：

- `babel-polyfill`
  - 一次引入全部的 polyfill
  - 污染全局变量和原型
  - 适合开发应用时使用
- `babel-runtime`&`babel-plugin-transform-runtime`
  - 按需引入 polyfill
  - 不污染全局变量和原型
  - 适合开发类库时使用

以上两种方式，一般只会使用一种。

而`useBuiltIns`值为`true`时，Babel 在转换时将（通过`babel-polyfill`）应用 polyfill。其原理是启用一个新的插件来替换语句`import "babel-polyfill"`或`require("babel-polyfill")`以及基于浏览器环境的`babel-polyfill`个性化需求。

In

```js
// 这行代码是用户编码时，在应用程序的入口点顶部添加的
import "babel-polyfill";
```

Out (基于环境的不同)

```js
import "core-js/modules/es7.string.pad-start";
import "core-js/modules/es7.string.pad-end";
import "core-js/modules/web.timers";
import "core-js/modules/web.immediate";
import "core-js/modules/web.dom.iterable";
```

### 通过 package.json 使用 .babelrc

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    // my babel config here
  }
}
```

### 查找

Babel 会在正在被转录的文件的当前目录中查找一个`.babelrc`文件。
如果不存在，它会遍历目录树，直到找到一个`.babelrc`文件，或一个`package.json`文件中有`"babel": {}`。

Reference:

- [前端早读课【第 1378 期】 一口(很长的)气了解 Babel](https://mp.weixin.qq.com/s/qetiJo47IyssYWAr455xHQ)
- [babel 到底该如何配置？](https://juejin.im/post/59ec657ef265da431b6c5b03)
- [知乎——Babel 编译出来还是 ES 6？难道只能上 polyfill？](https://www.zhihu.com/question/49382420)
- [import、require、export、module.exports 混合使用详解](https://github.com/ShowJoy-com/showjoy-blog/issues/39)
