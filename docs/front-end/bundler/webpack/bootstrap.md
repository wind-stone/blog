---
sidebarDepth: 0
---

# Webpack Bootstrap 简单分析

[[toc]]

说明：写该文章时，使用的`webpack`版本是 3.10.0

```js
{
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
    })
  ]
}
```

使用`webpack`时，如果在`webpack.config.js`里配置如上的`plugin`，则会将`webpack`的启动程序（`bootstrap`）逻辑代码分离到单独的名为`manifest`的`bundle`里，且该文件需要在其他所有`bundle`文件之前加载并执行，其他`bundle`文件的执行都将依赖于该文件里定义的函数。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
  </head>
  <body>
    <script type=text/javascript src=//xx.yy.com/zz/js/manifest.js></script>
    <script type=text/javascript src=//xx.yy.com/zz/js/vendor.js></script>
    <script type=text/javascript src=//xx.yy.com/zz/js/app.js></script>
  </body>
</html>
```

在该`bootstrap`源码里，主要定义了以下几个函数：

- `window.webpackJsonp`: 其他的`bundle`里的源码都被包裹于`webpackJsonp`函数之中，`bundle`加载完成之后，将执行`webpackJsonp()`

```js
// 其他 bundle 的内容（如 app.js）
webpackJsonp([moduleId]], [
  (function (module, exports, __webpack_require__) {
    // 模块 a
  }),
  (function (module, exports, __webpack_require__) {
    // 模块 b
  }),
  // ...
], [立即执行的 moduleId])
```

- `__webpack_require__`: 调用`__webpack_require__(moduleId)`执行对应模块，并返回执行结果

```js
const result = __webpack_require__(moduleId)
```

- `__webpack_require__.e`: 该函数用于异步加载`chunk`，即是经过`webpack`编译后代替`import()`的函数。原理是动态创建`script`元素异步加载`chunk`所在的`bundle`文件。

## bootstrap 源码

```js
(function(modules) { // webpackBootstrap
  // install a JSONP callback for chunk loading
  var parentJsonpFunction = window["webpackJsonp"];
  window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    var moduleId, chunkId, i = 0, resolves = [], result;
    for(;i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if(installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for(moduleId in moreModules) {
      if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        // 【wind-stone】moreModules[moduleId] 的值是由 webpack 包装起来的函数，里面是模块的源码
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
    while(resolves.length) {
      resolves.shift()();
    }
    if(executeModules) {
      for(i=0; i < executeModules.length; i++) {
        result = __webpack_require__(__webpack_require__.s = executeModules[i]);
      }
    }
    return result;
  };

  // The module cache
  var installedModules = {};

  // objects to store loaded and loading chunks
  var installedChunks = {
    24: 0
  };

  // The require function
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  // 【wind-stone】异步加载 chunk 的函数，该函数即 webpack 的 import()
  __webpack_require__.e = function requireEnsure(chunkId) {
    var installedChunkData = installedChunks[chunkId];
    if(installedChunkData === 0) {
      return new Promise(function(resolve) { resolve(); });
    }

    // a Promise means "currently loading".
    if(installedChunkData) {
      return installedChunkData[2];
    }

    // setup Promise in chunk cache
    var promise = new Promise(function(resolve, reject) {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    installedChunkData[2] = promise;

    // start chunk loading
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.timeout = 120000;
    script.crossOrigin = "anonymous";
    if (__webpack_require__.nc) {
      script.setAttribute("nonce", __webpack_require__.nc);
    }
    script.src = __webpack_require__.p + "js/" + ({
    // here are some other chunkId-filename key-value paires
    "22":"vendor","23":"app"}[chunkId]||chunkId) + "." + {
    // here are some other chunkId-hash key-value paires
    "22":"8a4694095de8bfd437dc","23":"5183e8213bd2da2a7410"}[chunkId] + ".js";
    var timeout = setTimeout(onScriptComplete, 120000);
    script.onerror = script.onload = onScriptComplete;
    function onScriptComplete() {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var chunk = installedChunks[chunkId];
      if(chunk !== 0) {
        if(chunk) {
          // reject(err)
          chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
        }
        installedChunks[chunkId] = undefined;
      }
    };
    head.appendChild(script);

    return promise;
  };

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if(!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        configurable: false,
        enumerable: true,
        get: getter
      });
    }
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

  // __webpack_public_path__
  __webpack_require__.p = "//xx.yy.com/zz/";

  // on error function for async loading
  __webpack_require__.oe = function(err) { console.error(err); throw err; };
})([]);
```

### bundle 文件结构说明

```js
// bundle 内容，以 app.js 为例
webpackJsonp([23],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
        // ...
/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
        // ...
/***/ }),
  // 其他模块函数
], [145]);

```

在经过`webpack`编译后得到的`app.js`的文件内容如上所示，其中的数字`/* 10 */`即为`moduleId`。

可以看到，这个模块数组里下标为`0`~`9`以及`11`的元素都是空的，这代表这些模块是定义在其他`bundle`里的（比如 vendor.js）。

## 重点逻辑说明

### webpackJsonp()

不管是在`html`通过`script`标签引入的`bundle`文件还是异步加载的`bundle`文件，在其加载完毕后都将立即执行，即立即执行`webpackJsonp()`函数，且参数依次为

- chunkId 数组
- 模块函数数组
- 需要立即执行的模块 id 数组

`webpackJsonp()`执行时，会将`bundle`文件里包含的模块，都将挂载到`modules`数组里，在需要的时候调用`__webpack_require__`执行模块并返回结果，且`modules`的下标即为对应模块的`moduleId`。如有必要，将立即执行一些模块。

### __webpack_require__.e

异步加载`chunk`所在的`bundle`文件时，会先返回该`chunk`对应的`pendding`状态的`promise`，等到`bundle`加载并执行`webpackJsonp()`时，会将该`bundle`包含的`chunk`对应的`promise`的状态改为`resolve`。如此，该`chunk`加载完毕，并将该`chunk`标记为已加载。
