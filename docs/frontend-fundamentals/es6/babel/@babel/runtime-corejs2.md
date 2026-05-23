# @babel/runtime-corejs2

[`@babel/runtime-corejs2`](https://www.babeljs.cn/docs/babel-runtime-corejs2)类似于[`@babel/runtime`](./runtime.md)，但是增加了`polyfill`的功能。

因此，该插件可以代替`polyfill`，将 Promise 或 Symbol 转换为引用`core-js`库里的函数 ，但不能对内置对象的实例方法进行转换。

```js
Promise;
```

转换为：

```js
var _Promise = require("@babel/runtime-corejs2/core-js/promise.js");
```

Babel 的辅助工具函数`helpers`也是这么转换的。
