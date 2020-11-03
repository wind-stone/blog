---
sidebarDepth: 0
---

# Module

[[toc]]

## ES6 VS CommonJS

- 加载方式
  - ES6 模板
    - “编译时加载”/“静态加载”，编译时就完成模块加载，效率比 CommonJS 模块的加载方式高
    - 模块导出的不是整个模块对象，而是通过`export`显示指定的代码
    - 无法引用模块自身
    - 可以做静态优化，比如“Tree Shaking”
    - 通过`import`静态加载模块，`from`后面的模块名不能是变量或表达式，必须在编译阶段能确定
  - CommonJS 模块
    - “运行时加载”
    - 模块导出的是整个模块对象，包括模块对象上的所有方法和属性
    - 运行时才能得到模块对象，无法做“静态优化”
    - 通过`require`（在运行时）动态加载模块，`require`的参数可以是变量，运行时确定

## 严格模式

ES6 的模块自动采用严格模式，无论你有没有在模块头部加上`"use strict";`

严格模式的限制主要有：

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用`with`语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀`0`表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量`delete prop`，会报错，只能删除属性`delete global[prop]`
- `eval`不会在它的外层作用域引入变量
- `eval`和`arguments`不能被重新赋值
- `arguments`不会自动反映函数参数的变化
- 不能使用`arguments.callee`、`arguments.caller`
- 禁止`this`指向全局对象
- 不能使用`fn.caller`和`fn.arguments`获取函数调用的堆栈
- 增加了保留字（比如`protected`、`static`和`interface`）

ES6 模块之中，顶层的`this`指向`undefined`，即不应该在顶层代码使用`this`。

## export 命令

`export`命令规定模块对外的接口，只有以下几种写法：

```js
// 写法一，直接在声明型语句前添加 export 关键字
export var m = 1; // var
export let n = 2; // let
export const o = 3; // const
export function fn() { // function，包括 async 和 generator
  // ...
}
export class Example { // class

}

// 写法二，独立使用 export 声明
var m = 1;
const n = 2;
let o = 3;
export {
  m,
  n as n1,
  o
};
```

### export 变量的动态绑定

`export`语句导出变量时，变量的值是动态绑定的，即通过该变量，可以取到模块内部`实时`的值。

```js
// a.mjs
export let a = 1;

setInterval(() => {
    a++;
}, 1000);
```

```js
// b.js
import { a } from './a';

setInterval(function () {
    console.log(a);
}, 1000);
```

执行`node --experimental-modules b.mjs`，会发现每隔 1s 打印出的`a`的值都会加一。这一点与 CommonJS 规范完全不同，CommonJS 模块输出的是值的缓存，不存在动态更新。

### export default 的静态绑定

```js
// a.mjs
let a = 1;

export default a;

setInterval(() => {
    a++;
}, 1000);
```

```js
// b.mjs
import a from './a';

setInterval(() => {
    console.log('a', a);
}, 1000);
```

与使用`export`直接导出变量不同，使用`export default`导出的是变量的值，以后变量的变化与导出的值就无关了。比如示例里修改变量`a`，不会使得`b`模块中引入的`default`值发生改变。

### export 命令的位置

`export`命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的`import`命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

```js
function foo() {
  export default 'bar' // SyntaxError
}
foo()
```

## import 命令

### import 输入的变量是只读的

```js
import {a} from './xxx.js'

a = {}; // Syntax Error : 'a' is read-only;
```

`import`命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。

::: warning 警告
上面的代码在原生的 ES6 模块环境里是会报错的，但若是使用 Babel，则不会报错，原因是 Babel 将是 ES6 模块转换成 ES5 代码，并不是真正的 ES6 模块的实现。
:::

但是，如果`a`是一个对象，改写`a`的属性是允许的，并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，轻易不要改变它的属性。

```js
import {a} from './xxx.js'

a.foo = 'hello'; // 合法操作
```

### import 命令提升

`import`命令具有提升效果，会提升到整个模块的头部，首先执行。

下面的代码不会报错，因为`import`的执行早于`foo`的调用。这种行为的本质是，`import`命令是编译阶段执行的，在代码运行之前。

```js
foo(); // 合法操作

import { foo } from 'my_module';
```

### import 命令不能使用表达式和变量

```js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

`import`是静态执行的，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。上面三种写法都会报错，因为它们用到了表达式、变量和`if`结构。在静态分析阶段，这些语法都是没法得到值的。

### import 命令会执行所加载的模块

```js
import 'lodash';
```

上面代码仅仅执行`lodash`模块，但是不输入任何值。

```js
import 'lodash';
import 'lodash';
```

如果多次重复执行同一句`import`语句，那么只会执行一次，而不会执行多次。

### import 语句是单例模式

```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

上面代码中，虽然`foo`和`bar`在两个语句中加载，但是它们对应的是同一个`my_module`实例。也就是说，`import`语句是 Singleton 模式。

### import 命令在模块里早于 require 执行

目前阶段，通过 Babel 转码，CommonJS 模块的`require`命令和 ES6 模块的`import`命令，可以写在同一个模块里面，但是最好不要这样做。因为`import`在静态解析阶段执行，所以它是一个模块之中最早执行的。下面的代码可能不会得到预期结果。

```js
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.promise');
import React from 'React';
```

### import 语句的静态分析

`import`命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行。

```js
// 报错
if (x === 2) {
  import MyModual from './myModual';
}
```

上面代码中，引擎处理`import`语句是在编译时，这时不会去分析或执行`if`语句，所以`import`语句放在`if`代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说，`import`和`export`命令只能在模块的顶层，不能在代码块之中（比如，在`if`代码块之中，或在函数之中）。

```js
```

## 模块的整体加载

```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

```js
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

注意，模块整体加载所在的那个对象（上例是`circle`），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。

```js
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```

## export default 命令

使用`import`命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。但是，用户肯定希望快速上手，未必愿意阅读文档，去了解模块有哪些属性和方法。

为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到`export default`命令，为模块指定默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次。

```js
// export-default.js
export default function () {
  console.log('foo');
}
```

其他模块加载该模块时，`import`命令可以为该匿名函数指定任意名字。注意，这时`import`命令后面，不使用大括号。

```js
// import-default.js
import anyName from './export-default';
anyName(); // 'foo'
```

### export default 的本质

本质上，`export default`就是输出一个叫做`default`的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```

正是因为`export default`命令其实只是输出一个叫做`default`的变量，所以它后面不能跟变量声明语句。

```js
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

同样地，因`export default`命令的本质是将后面的值，赋给`default`变量，所以可以直接将一个值写在`export default`之后。

```js
// 正确
export default 42;

// 报错
export 42;
```

### import 同时输入默认方法和其他接口

如果想在一条`import`语句中，同时输入默认方法和其他接口，可以写成下面这样。

```js
import _, { each, forEach } from 'lodash';
```

## export 与 import 的复合写法

详见[阮一峰 - ECMAScript 6 入门 - Module 的语法 - export 与 import 的复合写法](http://es6.ruanyifeng.com/#docs/module#export-%E4%B8%8E-import-%E7%9A%84%E5%A4%8D%E5%90%88%E5%86%99%E6%B3%95)

## import() 动态加载

详见[阮一峰 - ECMAScript 6 入门 - Module 的语法 - import()](http://es6.ruanyifeng.com/#docs/module#import)

## 循环加载

### CommonJS

如果发生模块的循环加载，即A加载B，B又加载A，则B将加载A的不完整版本。

```JS
// a.js
exports.x = 'a1';
console.log('a.js ', require('./b.js').x);
exports.x = 'a2';

// b.js
exports.x = 'b1';
console.log('b.js ', require('./a.js').x);
exports.x = 'b2';

// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

上面代码是三个JavaScript文件。其中，a.js加载了b.js，而b.js又加载a.js。这时，Node返回a.js的不完整版本，所以执行结果如下。

```
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
```

Reference: [阮一峰-CommonJS规范-模块的循环加载](http://javascript.ruanyifeng.com/nodejs/module.html#toc11)


### ES 2015

ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

请看下面这个例子。

```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

上面代码中，a.mjs加载b.mjs，b.mjs又加载a.mjs，构成循环加载。执行a.mjs，结果如下。

```
$ node --experimental-modules a.mjs
b.mjs
ReferenceError: foo is not defined
```

上面代码中，执行a.mjs以后会报错，foo变量未定义，这是为什么？

让我们一行行来看，ES6 循环加载是怎么处理的。首先，执行a.mjs以后，引擎发现它加载了b.mjs，因此会优先执行b.mjs，然后再执行a.js。接着，执行b.mjs的时候，已知它从a.mjs输入了foo接口，这时不会去执行a.mjs，而是认为这个接口已经存在了，继续往下执行。执行到第三行console.log(foo)的时候，才发现这个接口根本没定义，因此报错。

解决这个问题的方法，就是让b.mjs运行的时候，foo已经有定义了。这可以通过将foo写成函数来解决。

```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
function foo() { return 'foo' }
export {foo};

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo());
function bar() { return 'bar' }
export {bar};
这时再执行a.mjs就可以得到预期结果。
```

```
$ node --experimental-modules a.mjs
b.mjs
foo
a.mjs
bar
```

这是因为函数具有提升作用，在执行import {bar} from './b'时，函数foo就已经有定义了，所以b.mjs加载的时候不会报错。这也意味着，如果把函数foo改写成函数表达式，也会报错。

```
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
const foo = () => 'foo';
export {foo};
```

上面代码的第四行，改成了函数表达式，就不具有提升作用，执行就会报错。

Reference: [阮一峰-ES6 入门-Module 的加载实现](http://es6.ruanyifeng.com/#docs/module-loader#%E5%BE%AA%E7%8E%AF%E5%8A%A0%E8%BD%BD)
