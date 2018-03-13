# Babel

Babel 是处于构建时（也就是传统Java等语言的编译时），转译出来的结果在默认情况下并不包括 ES6 对运行时的扩展，例如，builtins（内建，包括 Promise、Set、Map 等）、内建类型上的原型扩展（如 ES6 对 Array、Object、String 等内建类型原型上的扩展）以及Regenerator（用于generators / yield）等都不包括在内。

- 构建时（语法层面的编译）
    - Babel
- 运行时（API，包含内建类型如`Promise`、`Set`、`Map`，及 ES6 对`Array`、`Object`、`String`等内建类型原原型上的扩展，以及 Regenerator 等）
    - core-js 标准库：提供 ES5、ES6 的 polyfills，包括 promises 、symbols、collections、iterators、typed arrays、ECMAScript 7+ proposals、setImmediate 等等
    - regenerator 运行时库：实现 ES6/ES7 中 generators、yield、async 及 await 等相关的 polyfills
    - babel-runtime 库：由 Babel 提供的 polyfill 库
        - 它本身就是由 core-js 与 regenerator-runtime 库组成
        - 除了做简单的合并与映射外，并没有做任何额外的加工
        - 使用时需要手动引入需要的模块
        - 不支持转换实例方法
        - 支持转换静态方法，但是，只支持显示调用如：`Array.from`，不支持隐式调用如`Array['from']`
    - babel-plugin-transform-runtime 插件
        - 让 Babel 发现代码中使用到 Symbol、Promise、Map 等新类型时，自动且按需进行 polyfill
        - 不会污染全局变量
        - 不会污染 prototype
        - 更适合于开发类库（library）时使用
    - babel-polyfill
        - 初衷是模拟一整套 ES2015+ 运行时环境
        - 会以全局变量的形式 polyfill Map、Set、Promise 之类的类型
        - 会以类似 Array.prototype.includes() 的方式去注入污染原型
        - 占文件空间并且无法按需定制
        - 最适合应用级开发的 polyfill

## 模块

### `__esModule`

Babel 默认是将 ES6 规范的代码转化成 CommonJS 规范的代码
（默认使用`transform-es2015-modules-commonjs`插件，通过别的插件也可以转换成其他规范的代码）。

```js
// 转化前
import { bar } from './b';
bar()
export default {
  a: 1,
  b: 2
}
```

```js
// 转换后
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _b = require('./b');

exports.default = {
  a: 1,
  b: 2
};
```

转化成 CommonJS 规范的代码里，都会在`exports`对象上添加`__esModule`属性，表明这个模块是经过 Babel 转码的符合 CommonJS 规范的模块。

而`__esModule`这个属性的作用，就是在该模块被引用时，用以判断该模块是经过 Babel 转码的模块，还是普通的 CommonJS 模块。如果是普通的 CommonJS 模块，会进行对应的处理。

```js
// 转换前
import a from './a'
import { b } from './b'
import * as c from './c'
console.log(a)
export default {
  foo: 1,
  bar: 2
}
```

```js
// 转换后
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a = require('./a');

var _a2 = _interopRequireDefault(_a);

var _b = require('./b');

var _c = require('./c');

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

### 为什么可以用 CommonJS 的`require`去引用 ES6 的模块？
    - ES6 的模块会经过 Babel 转换成 CommonJS 的模块，因此最终通过`require`引入的是 CommonJS 模块
    - 所以，如果 ES6 模块里定义了`default`，通过`require`引入后想使用`default`的值，需要显示获取`default`属性，即`require('./a').default`


### 为什么可以使用 ES6 的`import`去引用 CommonJS 定义的模块？


```js
import a from './a' // 引入 _interopRequireDefault
import * as c from './c' // 引入_interopRequireWildcard
```
ES6 的模块，最终会转换为 CommonJS 的模块，且在转换时如果遇到上面的两种 ES6 引入方式，会在转换后的代码里添加
`_interopRequireWildcard`辅助函数和`_interopRequireDefault`辅助函数，这两个函数可以将 CommonJS 模块转化为转换后的代码需要的模块形式。


## Reference:
- [知乎——Babel 编译出来还是 ES 6？难道只能上 polyfill？](https://www.zhihu.com/question/49382420)
- [import、require、export、module.exports 混合使用详解](https://github.com/ShowJoy-com/showjoy-blog/issues/39)
