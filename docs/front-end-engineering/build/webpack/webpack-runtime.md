# Webpack runtime 简单分析

[[toc]]

本章节内容，基于`webpack@4.29.6`，仅分析`target`为`web`的情况。

主要介绍`webpack`的运行时的内容，包括:

- `webpack`如何编译源码里的`import`和`import()`
- `webpack`如何将`chunk`加载到浏览器并执行
- `webpack`如何组织`bundle`、`chunk`和`module`

等等。

我们先由一个简单的示例开始，使用`webpack`将示例项目编译打包，对比编译前后的代码，进而分析。

## 示例项目源码

示例项目目录结构:

- `src`
  - `a.js`
  - `b.js`
  - `c.js`
  - `index.js`
- `webpack.config.js`

### 配置文件 webpack.config.js

```js
const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    // 以模块的相对路径生成一个四位数的 hash 作为模块 id，而不是以引入顺序的数字作为模块 id
    new webpack.HashedModuleIdsPlugin(),
    // 生成 html 文件
    new HtmlWebpackPlugin()
  ],
  optimization: {
    // 将所有 chunk 的运行时提取到单个文件里公用，该文件默认名为 runtime
    runtimeChunk: 'single'
  }
}
```

### 入口文件 index.js

```js
import { A } from './a'
import B from './b'
console.log(A)
B()
import(/* webpackChunkName: "c" */ './c').then(content => {
    console.log('module c: ', content)
})
```

### 模块 a.js

```js
export const A = 'A'
export const a = 'a'
```

### 模块 b.js

```js
export default function () {
  console.log('b')
}
```

### 模块 c.js

```js
export default 'C'
```

## 产出文件及结构分析

经过`webpack`编译后，主要产出了四个文件:

- `index.html`: 由`HtmlWebpackPlugin`插件生成的 HTMT 文件，其内会通过`script`标签引入了`runtime.js`和`app.js`
- `runtime.js`: `webpack`运行时`bundle`，包含了`webpack`运行时`chunk`的所有代码
- `app.js`: 入口`bundle`，包含了入口模块`index.js`及其同步加载的模块`a.js`和`b.js`
- `c.js`: 异步加载`bundle`，包含了模块`c.js`

### html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body>
    <script src="runtime.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

在`index.html`里可以看到，`runtime.js`会第一个加载执行，其次加载执行`app.js`（因为`app.js`的执行会依赖于`runtime.js`），而`c.js`会在需要时候异步加载。

### runtime bundle

`runtime.js`是`webpack`提取出来的运行时，包含了`webpack`运行时`chunk`，且分配的`chunkId`为`0`。

```js
(function(modules) { // webpackBootstrap
    // 加载 chunk（包括对应的 modules） 的 JSONP 函数
    // 注意：针对异步加载的 chunk，该函数会在 chunk 加载完成后执行
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];       // chunkId 数组
        var moreModules = data[1];    // moduleId 及 函数的对象，key 是 moduleId，value 是该 module 的函数定义
        var executeModules = data[2]; // 要执行的 module 列表（这些 module 已经位于此次加载的 chunk 里）
        // add "moreModules" to the modules object,
        // then flag all "chunkIds" as loaded and fire callback
        var moduleId, chunkId, i = 0, resolves = [];

        // 遍历 chunk 数组
        // - 若 installedChunks[chunkId] 存在（实际上其值为 [resolve, reject, promise]），说明该 chunk 之前被请求过，目前处于正在加载状态，需要将其 promise 实例的 resolve 函数加入到 resolves 数组里
        // - 设置 chunk 为已加载状态
        for(;i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if(installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }

        // 针对每一个 module，将其 module 函数加入到 modules 对象里
        for(moduleId in moreModules) {
            if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }

        // 若存在老的 window["webpackJsonp"].push 函数，则先执行之
        if(parentJsonpFunction) parentJsonpFunction(data);

        // 针对被请求过并正在等待请求结果的 chunk，触发其 promise 实例的 resolve 函数，告诉依赖该 chunk 的地方，该 chunk 已经加载完成，可以继续执行
        while(resolves.length) {
            resolves.shift()();
        }

        // add entry modules from loaded chunk to deferred list
        // 将该文件里的入口 module 添加到 deferredModules 里
        // 若是存在 executeModules，等待 bundle 加载完成后，可以自执行某些 module，不需要等到外部调用 __webpack_require__(module)
        deferredModules.push.apply(deferredModules, executeModules || []);

        // 检查并执行入口 modules
        return checkDeferredModules();
    };

    // 检查入口 modules 的依赖是否 ready，若 ready 则执行
    function checkDeferredModules() {
        var result;
        for(var i = 0; i < deferredModules.length; i++) {
            var deferredModule = deferredModules[i];
            var fulfilled = true;
            // deferredModule 的第 0 项是要执行的 module，其后的每一项是该 module 依赖的所有其他 chunk 的 chunkId
            for(var j = 1; j < deferredModule.length; j++) {
                // depId 是所依赖的 chunkId
                var depId = deferredModule[j];
                if(installedChunks[depId] !== 0) fulfilled = false;
            }
            if(fulfilled) {
                deferredModules.splice(i--, 1);
                // 调用该 module
                result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
            }
        }
        return result;
    }

    // 已安装的 modules，缓存起来，方便后续直接使用
    // key 是 module ID，value 是 module 对象（包含 module 的执行结果 module.exports）
    var installedModules = {};

    // 已加载的 chunks（包括正在加载的），key 是 chunk ID，value 有如下取值
    // - undefined: chunk 未加载
    // - null: chunk 已经 preload/prefetch
    // - [ resolve, reject, promise ] 数组: chunk 正在加载
    // - 0: chunk 已经加载
    var installedChunks = {
        // runtime.js 默认是 chunk 0，默认已加载
        0: 0
    };

    var deferredModules = [];

    // 获取 chunk 所在 bundle 的路径
    // 当 bundle 的命名更复杂时（比如增加 hash 等），这里 chundId -> bundle 路径 的映射关系也会更复杂一些
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({"2":"c"}[chunkId]||chunkId) + ".js"
    }

    // 模块 require 函数（执行 module 函数并返回结果）
    function __webpack_require__(moduleId) {

        // 若模块已加载，则取缓存结果
        if(installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }

        // 创建新的模块对象，并放入缓存中
        var module = installedModules[moduleId] = {
            i: moduleId, // module ID
            l: false,    // module 是否已经执行
            exports: {}  // module 执行结果，会将 export 出来的东西放在这个对象里
        };

        // 执行 module 函数
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // 将 module 标志为已执行
        module.l = true;

        // 返回 module 的执行结果对象
        return module.exports;
    }

    // 异步加载 chunk 的函数，返回 promise 实例；需要等待 chunk 加载完成后将 promise 实例置为 fulfilled，才能继续执行
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];

        // JSONP chunk loading for javascript

        var installedChunkData = installedChunks[chunkId];
        if(installedChunkData !== 0) { // 0 means "already installed".

            // a Promise means "currently loading".
            if(installedChunkData) {
                // 若该 chunk 正在加载，则将其 promise 实例加到 promises 数组里
                promises.push(installedChunkData[2]);
            } else {
                // setup Promise in chunk cache
                var promise = new Promise(function(resolve, reject) {
                    // 设置该 chunk 正在加载
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });

                promises.push(installedChunkData[2] = promise);

                // start chunk loading
                var script = document.createElement('script');
                var onScriptComplete;

                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute("nonce", __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);

                onScriptComplete = function (event) {
                    // avoid mem leaks in IE.
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];

                    // 注意，此处针对 chunk 加载完成的情况，不会做处理。处理的逻辑位于 chunk 所在 bundle 文件里
                    // chunk 所在 bundle 加载成功后，会立即执行，执行完成将 installedChunks[chunkId] 置为 0

                    // chunk 还未安装
                    if(chunk !== 0) {
                        // 若是 chunk 仍为 [resolve, reject, promise]，表示 chunk 所在的 bundle 加载失败（包括超时）
                        if(chunk) {
                            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                            var realSrc = event && event.target && event.target.src;
                            var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
                            error.type = errorType;
                            error.request = realSrc;
                            // 调用 reject，告知该 chunkId 加载失败
                            chunk[1](error);
                        }
                        // 设置 chunk 的状态为未加载
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function(){
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };

    // expose the modules object (__webpack_modules__)
    __webpack_require__.m = modules;

    // expose the module cache
    __webpack_require__.c = installedModules;

    // define getter function for harmony exports
    // 往模块的`exports`结果对象上添加 key 对应的 getter
    __webpack_require__.d = function(exports, name, getter) {
        if(!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    // define __esModule on exports
    // 定义这是一个 ES Module
    __webpack_require__.r = function(exports) {
        if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

    // create a fake namespace object
    // mode & 1: value is a module id, require it
    // mode & 2: merge all properties of value into the ns
    // mode & 4: return value when already ns object
    // mode & 8|1: behave like require
    __webpack_require__.t = function(value, mode) {
        if(mode & 1) value = __webpack_require__(value);
        if(mode & 8) return value;
        if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
        return ns;
    };

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    // webpack 配置文件里设置的 output.publicPath（还可使用自有变量的形式在运行时动态设置）
    __webpack_require__.p = "";

    // on error function for async loading
    __webpack_require__.oe = function(err) { console.error(err); throw err; };

    // 保存原 window["webpackJsonp"].push 的引用，并将新的 window["webpackJsonp"].push 设置为 webpackJsonpCallback
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;

    // run deferred modules from other chunks
    checkDeferredModules();
})([]);
```

### 非 runtime 的 bundle

入口`bundle`和异步`bundle`，有着同样的文件结构，包含了至少一个`chunk`。`bundle`的内容通过 JSON 函数包裹，一旦该`bundle`通过`script`标签加载到客户端，将立即执行。`bundle`可以简化为如下结构:

```js
webpackJsonpCallback([
  // 该 bundle 里包含的 chunk ID 的列表
  [
    chunkId,
    // ...
  ],

  // 该 bundle 里包含的 modules
  {
    moduleId: moduleFunction,
    // ...
  },

  // 该 bundle 里的入口 modules，及其依赖
  [
    [
      // 第一项是 moduleId，之后的各项为所依赖的 chunkId，只有所有的依赖 chunk 都加载了之后，入口 module 才会执行
      moduleId,
      depChunkId,
      // ...
    ]
  ]
])
```

#### app.js 入口 bundle

该`bundle`包含了一个`chunk`，其`chunkId`为`1`，包含的`module`是源码里的`index.js`、`a.js`、`b.js`模块。

```js
// window["webpackJsonp"].push 即 webpackJsonpCallback
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [1],

  {
    // module ID: module 函数
    "LwFN": (function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
        __webpack_require__.r(__webpack_exports__);
        // b.js
        /* harmony default export */ __webpack_exports__["default"] = (function () {
        console.log('b')
      });
    }),

    "bhxd": (function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return A; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
      // a.js
      const A = 'A'
      const a = 'a'
    }),

    "tjUo": (function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bhxd");
      /* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("LwFN");
      console.log(_a__WEBPACK_IMPORTED_MODULE_0__["A"])
      Object(_b__WEBPACK_IMPORTED_MODULE_1__["default"])()
      __webpack_require__.e(/* import() | c */ 2).then(__webpack_require__.bind(null, "pnTK")).then(content => {
          console.log('c: ', content)
      })
    })
  },

  [
    // 第一项是 module ID，之后的各项为依赖 chunk ID，只有所有的依赖 chunk 都加载了之后，module 才会执行
    ["tjUo", 0]
  ]
]);
```

#### c.js 异步 chunk

该`bundle`包含了一个`chunk`，其`chunkId`为`2`，包含的`module`是源码里的`c.js`模块。

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [2],
  {
    "pnTK": (function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */ __webpack_exports__["default"] = ('C');
    })
  }
]);
```

## 分析

### 代码生成

现在我们有了源代码，也有了经过`webpack`编译后的代码，就可以看到`webpack`是如何处理源代码里的`import`和`import()`了。

#### import 的编译

##### a.js 的编译

编译前:

```js
// 编译前的 a.js
export const A = 'A'
export const a = 'a'
```

```js
// index.js 里，引入并调用 a 模块
import { A } from './a'
console.log(A)
```

编译后:

```js
// 编译后 app.js 里 moduleId 为 bhxd 的模块函数
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return A; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
  // a.js
  const A = 'A'
  const a = 'a'
})
```

编译后，引用并调用`a`模块的代码为:

```js
// 编译后，app.js 里 moduleId 为 tjUo 的模块函数，对应编译前的 index.js
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  // ...
  var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bhxd");
  console.log(_a__WEBPACK_IMPORTED_MODULE_0__["A"])
  // ...
})
```

其中`__webpack_require__("bhxd")`会执行模块函数，返回的模块结果对象最终有两个访问器属性，`A`和`a`:

```js
{
  // 访问器器属性名称: 属性描述符
  A: {
    enumerable: true,
    get: function() { return 'A'; }
  },
  a: {
    enumerable: true,
    get: function() { return 'a'; }
  }
}
```

##### b.js 的编译

同理，关于`b.js`编译前后的对比如下。

编译前:

```js
// 编译前的 b.js
export default function () {
  console.log('b')
}
```

```js
// index.js 里，引入并调用 b 模块
import B from './b'
B()
```

编译后:

```js
// 编译后 app.js 里 moduleId 为 LwFN 的模块函数，对应编译前的 index.js
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  // b.js
  /* harmony default export */ __webpack_exports__["default"] = (function () {
    console.log('b')
  });
});
```

编译后，引用并调用`b`模块的代码为:

```js
// 编译后，app.js 里 moduleId 为 tjUo 的模块函数，对应编译前的 index.js
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  // ...
  /* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("LwFN");
  Object(_b__WEBPACK_IMPORTED_MODULE_1__["default"])()
  // ...
})
```

其中`__webpack_require__("LwFN")`会执行模块函数，返回的模块结果对象有一个`default`方法:

```js
{
  default: function () {
    console.log('b')
  }
}
```

#### import() 的编译

##### c.js 的编译

编译前:

```js
// 编译前的 c.js
export default 'C'
```

```js
// index.js 里，异步引入并调用 c 模块
import(/* webpackChunkName: "c" */ './c').then(content => {
    console.log('module c: ', content)
})
```

编译后，`c`模块会被打包成一个单独的`bundle`，仅包含了`c`模块:

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push(
  [
    [2],
    {
      "pnTK": (function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony default export */ __webpack_exports__["default"] = ('C');

      })
    }
  ]
);
```

编译后，引用并调用`c`模块的代码为:

```js
// 编译后，app.js 里 moduleId 为 tjUo 的模块函数，对应编译前的 index.js
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  // ...
  __webpack_require__.e(/* import() | c */ 2).then(__webpack_require__.bind(null, "pnTK")).then(content => {
      console.log('c: ', content)
  })
})
```

其中`__webpack_require__.e`是将 ID 为`2`的`chunk`所在的`bundle`异步加载到浏览器里（这个我们之后会详细说明）。`bundle`加载好之后，调用`__webpack_require__("pnTK")`会执行模块函数，返回的模块结果对象有一个`default`方法:

```js
{
  default: 'C'
}
```

#### import VS import()

可以发现，通过`import`和`import()`引入模块，其区别仅在于`import()`会先通过`__webpack_require__.e`异步加载到浏览器里。

### 执行过程

#### runtime bundle 的执行

作为第一个加载到浏览器的`bundle`，`runtime.js`将第一个执行。其执行的内容有:

1. 定义一些函数和属性，包括:
    - `webpackJsonpCallback`函数: JSONP 函数，用于处理新加载的`bundle`内容。非`runtime`的`bundle`的内容会用`webpackJsonpCallback`包裹，形成一个`.js`文件，该`js`文件加载到浏览器里后会自动执行
    - `checkDeferredModules`函数: 检查是否有入口`module`没有执行，若入口`module`的依赖`chunk`都已经加载，则执行入口`module`
    - `jsonpScriptSrc`函数: 根据传入的`chunkId`，返回`chunk`所在`bundle`的路径（方便后续通过`script`标签请求该`bundle`）
    - `__webpack_require__`函数: 模块的执行函数，`__webpack_require__(moduleId)`会执行该`module`的函数并返回执行结果
    - `__webpack_require__.e`函数: 根据传入的`chunkId`，返回`promise`实例，当`chunk`加载完成后，`promise`实例会被`resolved`。
      - 传入 Promise 构造函数的`executor`函数里，会判断`chunk`是否已经加载完成
        - 若`chunk`已加载完成，则将`promise`实例置为`resolved`
        - 若`chunk`未加载完成，则通过`script`标签，请求`chunk`所在的`bundle`（）
    - 其他的一些，请参见源码
2. 保留原`window["webpackJsonp"].push`的引用，并将新的`window["webpackJsonp"].push`设置为`webpackJsonpCallback`，方便以后的非`runtime`的`bundle`能在全局访问到`webpackJsonpCallback`

#### app.js bundle 的执行

页面里是在`runtime.js`之后引入`app.js`的，即`app.js`会在`runtime.js`之后执行。

`app.js`里就是调用`runtime.js`里定义的`webpackJsonpCallback`函数，并传入该`bundle`的内容，包括:

- 该`bundle`包含的`chunkId`，即`1`
- 该`bunlde`包含的模块信息，即`moduleId`（`LwFN`、`bhxd`、`tjUo`）及其`moduleFunction`
- 要执行的入口`modules`及其依赖的`chunkIds`，即入口`module`是`tjUo`，其依赖于 ID 为`0`的`chunk`（位于`runtime.js`，已加载）

`webpackJsonpCallback`函数里，会做以下操作:

- 遍历所有模块，将其加入到`modules`里
- 遍历所有`chunk`
  - 若该`chunk`之前异步请求过且正在等待请求返回，则将其`promise`设置为`resolved`（之前异步请求的回调函数会执行）
  - 将加入`installedChunks`，并设置该`chunk`的状态为已加载。
- 调用老的`window["webpackJsonp"].push`
- 将该`bunlde`里要执行的入口`modules`加入到`deferredModules`
- 遍历`deferredModules`，通过`__webpack_require__(moduleId)`执行那些所有依赖的`chunk`都已经加载了的入口`module`

因此，最后会调用`tjUo`模块，即对应编译前源的`index.js`。

```js
// tjUo 模块对应的模块函数
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bhxd");
  /* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("LwFN");


  console.log(_a__WEBPACK_IMPORTED_MODULE_0__["A"])
  Object(_b__WEBPACK_IMPORTED_MODULE_1__["default"])()
  __webpack_require__.e(/* import() | c */ 2).then(__webpack_require__.bind(null, "pnTK")).then(content => {
      console.log('c: ', content)
  })
})
```

在`tjUo`模块里，通过`__webpack_require__`依次加载`bhxd`和`LwFN`模块（应用编译前的`a`模块和`b`模块），获取到模块结果对象。

#### c.js bundle 的加载和执行

在`tjUo`函数的最后，会调用`__webpack_require__.e(2)`来加载`chunkId`为`2`的`chunk`所在的`bundle`，通过在`head`里插入`script`标签的方式。

```js
// 异步加载 chunk 的函数，返回 promise 实例
__webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];

    // JSONP chunk loading for javascript

    var installedChunkData = installedChunks[chunkId];
    if(installedChunkData !== 0) { // 0 means "already installed".

        // a Promise means "currently loading".
        if(installedChunkData) {
            // 若该 chunk 正在加载，则将其 promise 实例加到 promises 数组里
            promises.push(installedChunkData[2]);
        } else {
            // setup Promise in chunk cache
            var promise = new Promise(function(resolve, reject) {
                installedChunkData = installedChunks[chunkId] = [resolve, reject];
            });
            promises.push(installedChunkData[2] = promise);

            // start chunk loading
            var script = document.createElement('script');
            var onScriptComplete;

            script.charset = 'utf-8';
            script.timeout = 120;
            if (__webpack_require__.nc) {
                script.setAttribute("nonce", __webpack_require__.nc);
            }
            script.src = jsonpScriptSrc(chunkId);

            onScriptComplete = function (event) {
                // avoid mem leaks in IE.
                script.onerror = script.onload = null;
                clearTimeout(timeout);
                var chunk = installedChunks[chunkId];

                // chunk 还未安装
                if(chunk !== 0) {
                    // chunk 为 [resolve, reject, promise]，表示 chunk 所在的 bundle 正在加载
                    if(chunk) {
                        var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                        var realSrc = event && event.target && event.target.src;
                        var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
                        error.type = errorType;
                        error.request = realSrc;
                        // 调用 reject
                        chunk[1](error);
                    }
                    // 设置 chunk 的状态为未加载
                    installedChunks[chunkId] = undefined;
                }
            };
            var timeout = setTimeout(function(){
                onScriptComplete({ type: 'timeout', target: script });
            }, 120000);
            script.onerror = script.onload = onScriptComplete;
            document.head.appendChild(script);
        }
    }
    return Promise.all(promises);
};
```

这里需要注意，`__webpack_require__.e`最终返回的是个 Promise 实例，该实例会在`chunk`所在`bundle`成功加载到浏览器里之后被设置为`resolved`，以便异步加载该`chunk`的逻辑可以继续执行。

而在`bundle`加载到浏览器里后，`webpackJsonpCallback`函数会执行，在检查`bundle`里包含的各个`chunk`是否被请求过，若请求过，将调用该`chunk`的`resolve`函数。

```js
// 加载 chunk（包括对应的 modules） 的 JSONP 函数
function webpackJsonpCallback(data) {
    var chunkIds = data[0];       // chunk ID 数组
    var moreModules = data[1];    // module ID 及 函数的对象
    var executeModules = data[2]; // 要执行的 modules（这些 modules 已经位于此次加载的 chunk 里）
    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    var moduleId, chunkId, i = 0, resolves = [];

    // 遍历 chunk 数组
    // - 若 installedChunks[chunkId] 存在（实际上其值为 [resolve, reject, promise]），说明该 chunk 之前被请求过，目前处于正在加载状态，需要将其 promise 实例的 resolve 函数加入到 resolves 数组里
    // - 设置 chunk 为已加载状态
    for(;i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if(installedChunks[chunkId]) {
            resolves.push(installedChunks[chunkId][0]);
        }
        installedChunks[chunkId] = 0;
    }

    // ...

    // 针对被请求过并正在等待请求结果的 chunk，触发其 promise 实例的 resolve 函数，告诉请求方 chunk 已经加载完成，可以继续执行
    while(resolves.length) {
        resolves.shift()();
    }
    // ...
}
```

### 总结

经过以上的分析，我们大概了解了经过`webpack`是如何处理`import`/`import()`，以及如何将编译生成的`bundle`加载到浏览器里。这部分仅是`webpack`的编译结果如何与浏览器结合的部分，之后我们将继续了解`webpack`是如何将源代码编译打包为`bundle`的。

## 疑难点

### 为什么要保留原 window["webpackJsonp"].push 的引用

在`runtime.js`的最底部，会保留原`window["webpackJsonp"].push`的引用，并将新的`window["webpackJsonp"].push`设置为`webpackJsonpCallback`，以便能在全局范围内使用`webpackJsonpCallback`。而且在`webpackJsonpCallback`函数的最后，还会执行老的`window["webpackJsonp"].push`。

```js
(function(modules) { // webpackBootstrap
    function webpackJsonpCallback(data) {
        // ...

        // 若存在老的 window["webpackJsonp"].push 函数，则先执行之
        if(parentJsonpFunction) parentJsonpFunction(data);

        // ...
    }

    // 保存原 window["webpackJsonp"].push 的引用，并将新的 window["webpackJsonp"].push 设置为 webpackJsonpCallback
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    // ...
})([]);
```

但是为什么要保留原`window["webpackJsonp"].push`的引用呢？

在常规的项目里，可能存在多个入口，且可能存在一个页面，同时加载了`app`和`app2`，若是不通过`runtimeChunk: 'single'`将运行时提取到单个文件里，会导致每个入口文件都存在一份运行时代码，且各个运行时都有自己的局部变量。若是页面里先加载`app`再加载`app2`，会导致`app`里的`webpackJsonpCallback`被`app2`里的`webpackJsonpCallback`覆盖，最终导致无法在全局作用域下访问到`app`运行时的`webpackJsonpCallback`，由此`app`运行时再也无法加载新的`chunk`。

```js
module.exports = {
  entry: {
    app: './src/index.js',
    app2: './src/app2.js'
  },
}
```

经过保留原`window["webpackJsonp"].push`的引用，我们在新的`bundle`加载到后，会执行`app`运行时的`webpackJsonpCallback`并传入数据，进而让`app`运行时也保留一份新`bundle`的数据。
