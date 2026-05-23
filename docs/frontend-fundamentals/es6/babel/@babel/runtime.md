# @babel/runtime

[`@babel/runtime`](https://www.babeljs.cn/docs/babel-runtime)是一个工具库，包含了 Babel 模块化的运行时辅助工具函数和`regenerator-runtime`。

## 安装

```sh
npm install --save @babel/runtime
```

另可参考[`@babel/runtime-corejs2`](https://www.babeljs.cn/docs/babel-runtime-corejs2)。

## 使用

这意味着，该插件是作为`@babel/plugin-transform-runtime`插件的运行时依赖使用的。

## Why

有些 Babel 可能会往编译输出里注入一些代码，而这些代码可能是重复的，因此存在复用这些代码的可能。

比如，`class`的转换（非`loose`模式）：

```js
class Circle {}
```

转换为：

```js
function _classCallCheck(instance, Constructor) {
  //...
}

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```

这意味着每个包含`class`的文件都会存在一个`_classCallCheck`函数。若是使用`@babel/plugin-transform-runtime`，将会把对`_classCallCheck`的引用替换为对`@babel/runtime`模块的引用。

```js
var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```

`@babel/runtime`仅是以模块化方式包含了这些函数的实现的包。
