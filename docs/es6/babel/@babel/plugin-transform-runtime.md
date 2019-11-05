# @babel/plugin-transform-runtime

[`@babel/plugin-transform-runtime`](https://www.babeljs.cn/docs/babel-plugin-transform-runtime): 该插件会开启对 Babel 注入的`helper code`（`helper`可译为辅助函数）的复用，以节省代码体积。

需要注意的是，使用`@babel/plugin-transform-runtime`，不会对实例方法比如`"foobar".includes("foo")`进行转换，因为这将需要对已存在的内置对象进行修改（但你可以使用`@babel/polyfill`）。

## 安装

将该插件作为开发依赖安装。

```sh
npm install --save-dev @babel/plugin-transform-runtime
```

添加`@babel/runtime`作为生产依赖，由于它是用于运行时。

```sh
npm install --save @babel/runtime
```

该转换插件通常仅用于开发阶段，但是你部署后的代码将依赖运行时`@babel/runtime`。详见下方的示例。

## 为什么需要 @babel/plugin-transform-runtime

Babel 使用了一些很小的`helpers`作为通用函数比如`_extend`。默认情况下，这些`helpers`会被添加到需要的每一个文件里。这种代码重复有时是不需要的，尤其是你的应用分散在多个文件里。这也是`@babel/plugin-transform-runtime`插件出现的原因：所有的`helpers`将引用`@babel/runtime`模块以避免在编译输出文件里的代码重复。`@babel/runtime`将编译到构建输出文件里。

这个转换器的另一个目的是，为你的代码创建一个沙盒环境。若是你使用`@babel/polyfill`以及它提供的内置对象比如`Promise`、`Set`、`Map`，将会污染全局作用域。尽管这对于应用或者命令行工具来说没啥问题，但是若你的代码是打算发布给别人使用的库，或你无法精确地控制你代码将要运行的环境，这就会成为问题。

该转换器将使用`core-js`替换这些内置对象，因此你可以无缝地使用它们而不必一定引用`polyfill`。

## 使用

### 通过 .babelrc（推荐）

添加以下代码到你的`.babelrc`文件里：

不带参数：

```js
{
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

带参数（以下是默认值）：

```js
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

该插件默认假定所有可以`polyfill`的 API 都已经由用户提供好了。否则需要开启`corejs`选项。

### 通过 CLI

```sh
babel --plugins @babel/plugin-transform-runtime script.js
```

### 通过 Node API

```js
require("@babel/core").transform("code", {
  plugins: ["@babel/plugin-transform-runtime"],
});
```

## 选项

### corejs

`boolean`或`number`，默认是为`false`。

比如`['@babel/plugin-transform-runtime', { corejs: 2 }]`，指定一个数字将引入`corejs`来重写需要`polyfill`API 的`helpers`，这需要使用`@babel/runtime-corejs2`作为依赖，而不是`@babel/runtime`。

::: tip 译者注
若是不开启`corejs`选项，在转换时，Babel 使用的一些`helper`会假设已经存在全局的`polyfill`；开启之后，Babel 会认为全局的`polyfill`不存在，并会引入`corejs`来完成原来需要`polyfill`才能完成的工作。

指向选项的值为数字，即选择哪个版本的`@babel-runtime-corejs`:

- 配置`corejs`为`3`，需要预先安装`@babel/runtime-corejs3`
- 配置`corejs`为`2`，需要预先安装`@babel/runtime-corejs2`
- 配置`corejs`为`false`，需要预先安装`@babel/runtime`
:::

### helpers

`boolean`，默认是`true`。

切换是否要引入模块来替换内联的 Babel`helpers`（比如`classCallCheck`、`extends`等）。

::: tip 译者注
若是不开启`helpers`选项，可能每个文件都会引入同一个`helper`，导致多个文件里会存在多份同一个`helper`的代码；开启之后，是通过在每个文件里引入公共模块里的`helper`，即将`helpers`提取到了一个公共模块里。
:::

### polyfill

Babel 7 移除了该选项，将其作为默认的。

### regenerator

`boolean`，默认是`true`。

切换是否将`generator`函数转换为使用不污染全局作用的`regenerator`运行时。

### useBuiltIns

Babel 7 移除了该选项，将其作为默认的。

### useESModules

`boolean`，默认是`false`。

启用时，转换使用的`helpers`将不经过`@babel/plugin-transform-modules-commonjs`插件处理。这将在类似 Webpack 等模块系统里产生更小的构建输出，因为它不需要保留 CommonJS 的语义代码。

比如，如下是禁用了`useESModules`的`classCallCheck`：

```js
exports.__esModule = true;

exports.default = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
```

启用后：

```js
export default function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
```

### absoluteRuntime

`boolean`或`string`，默认是`false`。

这允许用户跨越整个项目来运行`transform-runtime`。默认情况下，`transform-runtime`直接从`@babel/runtime/xxx`引入，但是这要求`@babel/runtime`必须在被编译文件的`node_modules`里。因此对于嵌套的`node_modules`、`npm-linked`的模块或位于用户项目之外的命令行，以及其他一些情况下，这是有问题的。为了避免担心如何解析`runtime`模块的位置，这个选项允许用户预先一次解析`runtime`，之后将`runtime`的绝对路径插入到输出代码里。

若是文件被编译并在一段时间之后使用，则可以不必使用绝对路径。但是在文件被编译并立即使用的环境里，它们是相当有帮助的。

## 技术细节

`transform-runtime`转换器插件会做三件事：

- 当你使用`generators/async`函数时，自动引入`@babel/runtime/regenerator`（可通过`regenerator`选项切换）
- 若是需要，将使用`core-js`作为`helpers`，而不是假定用户已经使用了`polyfill`（可通过`corejs`选项切换）
- 自动移除内联的 Babel `helpers`并取而代之使用`@babel/runtime/helpers`模块（可通过`helpers`选项切换）

这到底意味着什么呢？基本上，你能无缝地使用`Promise`、`Set`、`Map`和`Symbol`等内置对象，以及所有需要使用`polyfill`的 Babel 特性，而无需导致全局污染，这尤其适合工具库（`libraries`）的开发。

注意，请确保你将`@babel/runtime`添加为了生产依赖（`dependency`）。

### regenerator 替换

当你使用`generator`或`async`函数时:

```js
function* foo() {}
```

将生成以下代码：

```js
"use strict";

var _marked = [foo].map(regeneratorRuntime.mark);

function foo() {
  return regeneratorRuntime.wrap(
    function foo$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked[0],
    this
  );
}
```

这并不理想，因为这要求已经包含了污染全局作用域的`regenerator`运行时。而用了`runtime`转换器后，这将编译为：

```js
"use strict";

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _marked = [foo].map(_regenerator2.default.mark);

function foo() {
  return _regenerator2.default.wrap(
    function foo$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked[0],
    this
  );
}
```

这意味着，你可以使用`regenerator`运行时而不污染你的当前环境。

### core-js 替换

有时你可能想使用新的内置对象如`Promise`、`Set`、`Map`等，通常你只能通过引入导致全局污染的`polyfill`来使用。

而`corejs`选项解决了这个问题。该插件会将如下的代码:

```js
var sym = Symbol();

var promise = new Promise();

console.log(arr[Symbol.iterator]());
```

转换为：

```js
"use strict";

var _getIterator2 = require("@babel/runtime-corejs2/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("@babel/runtime-corejs2/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _symbol = require("@babel/runtime-corejs2/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var sym = (0, _symbol2.default)();

var promise = new _promise2.default();

console.log((0, _getIterator3.default)(arr));
```

这意味着，你可以无缝地使用这些原生的内置对象和静态方法，而不需要担心它们是从哪里来的。

注意，实例方法比如`"foobar".includes("foo")`将不会被转换。

### helper 替换

通常 Babel 会将`helpers`放置在文件的顶部做一些通用的任务以避免在当前文件里造成代码重复。但是有时在多个文件里，这些`helpers`仍然会造成一些冗余且不必要的重复。而`runtime`转换器会以引入一个模块的方式来替换这些`helpers`。

这意味着，以下的代码：

```js
class Person {}
```

通常会转换为：

```js
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Person = function Person() {
  _classCallCheck(this, Person);
};
```

但是使用`runtime`转换器会将代码转换为下面这样：

```js
"use strict";

var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Person = function Person() {
  (0, _classCallCheck3.default)(this, Person);
};
```

## 译者总结

### 术语解释

`helper`是指 Babel 使用的一些辅助工具函数，比如`_extend`函数把一个对象的属性赋值到另一个对象上，这里的`_extend`就是`helper`。

再比如`class`的编译，编译后代码里的`_classCallCheck`就是`helper`。

```js
// Babel 编译前
class People{
}

// Babel 编译后
'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var People = function People() {
    _classCallCheck(this, People);
};
```

而`@babel/plugin-transform-runtime`的作用就是，将这些辅助工具函数转换成引入`@babel/runtime`模块的形式，进而消除掉各个文件都引入同一辅助工具函数导致的重复。

```sh
npm i @babel/runtime -S
npm i @babel/plugin-transform-runtime -D
```

```js
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime']
};
```

安装`@babel/plugin-transform-runtime`和`@babel/runtime`并配置好之后，再经过 Babel 转换的结果为：

```js
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var People = function People() {
  (0, _classCallCheck2["default"])(this, People);
};
```

`_classCallCheck2`这个辅助工具函数已经变成从`@babel/runtime`包中引入，不会再产生单独的工具函数代码。正因为该辅助工具函数是从`@babel/runtime`包中引入，所以要安装`@babel/runtime`这个生产依赖包，在项目打包的时候才不会报错。

### 使用 @babel/plugin-transform-runtime 的原因

- 若你不想污染全局内置对象
- 若你是开发工具库
- 提取出`helps`作为共用模块，进而缩小最终编译输出的体积

### 缺点

因为`@babel/plugin-transform-runtime`没有污染全局内置对象，对于实例方法如`"foobar".includes("foo")`就无法进行转换或兼容了。

### 关于 @babel/plugin-transform-runtime 和 @babel/polyfill 的区别

参考：[Babel 快速上手使用指南](https://juejin.im/post/5cf45f9f5188254032204df1)

`@babel/polyfill`是引入相关文件来模拟 ES2015+ 的环境进而实现`polyfill`，但是其会污染全局变量。

但`@babel/plugin-transform-runtime`通过配置`corejs`选项，提供一种`runtime`的`polyfill`。

```js
module.exports = {
    plugins: [['@babel/plugin-transform-runtime', { corejs: 2 }]]
};
```

这里的`corejs`与`presets`里设置的`corejs`是不同的，这里的`corejs`指定了一个`runtime-corejs`的版本，因此使用时也需要通过 NPM 安装对应的包。

```sh
npm i @babel/runtime-corejs2 -S
```

#### 示例

如下以`Array.from`静态方法为例，说明二者的差异。

```js
// Babel 编译前
const a = Array.from([1])
```

```js
// Babel 编译后（使用 @babel/polyfill）
"use strict";

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

var a = Array.from([1]);
```

```js
// Babel 编译后（使用 @babel/plugin-transform-runtime）
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

var a = (0, _from["default"])([1]);
```

经过与`@babel/polyfill`对比可以发现，`@babel/plugin-transform-runtime`并没有改变原生的内置`Array.from`方法，而是创建了一个`_from`来模拟`Array.from`的功能，编译前代码里调用`Array.from`的地方会被编译成调用`_from`方法，这样做的好处显而易见：不会污染`Array`上的静态方法`from`。`@babel/plugin-transform-runtime`提供的`runtime`形式的`polyfill`都是这种形式。

除了如`Array.prototype.includes`这样的内置对象实例方法，其他的内置函数如`Promise`、`Set`、`Map`，静态方法如`Array.from`、`Object.assign`都可以采用`@babel/plugin-transform-runtime`的这种形式。

#### 使用场景的区别

- 写类库时，使用`@babel/plugin-transform-runtime`。
- 写应用时，使用`@babel/polyfill`。

`@babel/plugin-transform-runtime`不会污染全局变量，但是会导致多个文件出现重复代码。例如你的库是使用`runtime-corejs`做 Promise 兼容，但是使用你的库的人可能用的是 bulebird 的兼容库, 这里面就有两份 Promise 代码，虽然不影响使用,但是产生了冗余了。

若是我们在写类库时，使用了`Array.prototype.includes`这类内置对象实例方法，而我们的依赖库 B 也定义了这个函数，此时若是我们全局引入`@babel/polyfill`就会出问题，其会覆盖掉依赖库 B 的`Array.prototype.includes`。若是我们使用`@babel/plugin-transform-runtime`就安全了（cxl：但是就不能使用`Array.prototype.includes`这种实例方法了呀..），会默认创建一个沙盒，这种情况 Promise 尤其明显，很多库会依赖于 bluebird 或者其他的 Promise 实现,一般写库的时候不应该提供任何的 polyfill 方案，而是在使用手册中说明用到了哪些新特性，让使用者自己去`polyfill`。
