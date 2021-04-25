---
sidebarDepth: 0
---

# 编译

[[toc]]

## 编译时将包含哪些 ts 文件

- `files`、`include`选项涉及到的文件
- 默认情况下，TypeScript 将导入`node_modules/@types`目录下所有包的类型声明文件，即使有些包并没有`import`到我们的源码里。
- 将`import`语句涉及到的包导入

TypeScript 在将`.ts`文件编译为`.js`文件时，只会针对语法层面做转换，而不会添加`polyfills`。比如当将`target`设置为`ES5`时，会将`let`转换成`var`，也会将箭头函数转成常规的函数表达式，但是不会处理`Promise`，`Promise`会保留在最终的产出文件里。因此需要我们在运行时自己添加`polyfills`。

## 重难点说明

### 在声明文件里有声明但在运行时里不一定有对应实现

```ts
// my-file.ts

// append global `Number` interface
interface Number {
  isEven(): boolean;
}

const num = 10;

num.isEven()
```

上面的代码通过对全局`Number`进行扩展，添加了`isEven`方法，因此`num.isEven()`不会引起 TypeScript 的报错。

但是上面的源码经过 TypeScript 编译后，变成：

```js
"use strict";
const num = 10;
// 上面通过对全局 Number 进行扩展
num.isEven();
```

在实际运行时，因为并没有实现`Number`上的`isEven`方法，会导致运行时报错。

### 为什么 TypeScript 文件里的 import 即可以导入模块的实现也能导入模块的类型声明文件？

TypeScript 编译器在处理`import`模块时，只会`import`这个模块的`.ts`文件或`.d.ts`（类型声明文件），而不会导入这个模块具体的实现文件。当经过 TypeScript 编译后的文件被执行时，才会导入模块具体的实现文件。

假设项目结构是这样的：

```txt
project
├── program.ts
└── box/
   ├── index.d.ts
   ├── index.js
   └── package.json
```

我们先来看一下`box`目录下的各个文件。

```js
// box/index.js
"use strict";
exports.__esModule = true;
exports["default"] = 'hello';
```

```ts
// box/index.d.ts
declare const _default: "box";
export default _default;
```

这里需要说明的是，尽管我们在`box`模块的类型声明文件里声明了该模块会存在默认导出，导出的值是字符串类型的`box`，但是在`box/index.js`里我们实现的是默认导出`hello`。

```json
// box/package.json
{
    "name": "box",
    "version": "1.0.0",
    "main": "index.js", // 供 Node.js 导入，以执行该文件并返回结果（运行时）
    "typings": "index.d.ts" // 供 TypeScript 编译器或 IDE 导入，以了解该模块的 API（静态分析）
}
```

之后，我们在`program.ts`里导入`box`模块。

```ts
// program.ts
import box from './box';

console.log(box)
```

最后，我们执行`tsc program.ts`得到`program.js`文件。

```js
// program.js
"use strict";
exports.__esModule = true;
var box_1 = require("./box");
console.log(box_1["default"]);
```

我们发现，最终产出的`program.js`文件里是通过`require("./box")`来导入`box`模块的，且模块的路径仍为`./box`。

```sh
node program.js

# 输出: hello
```

只是当我们通过`node program.js`执行编译后的文件，当遇到`require('./box')`语句时，Node.js 的模块解析系统会找到`box/index.js`文件进行执行并获得执行结果，因此最终的输出的结果是`hello`。

这也说明，TypeScript 编译器在导入模块时，只导入该模块的`.ts`或`.d.ts`文件（而不关心该模块的`main`或`module`指向的文件是怎么实现该模块的），并在编译时将原先的`import`语句转换成对应模块系统的导入语句（比如针对 CommonJS 来说，变成了`require`）并保持模块路径不变。

在最终执行编译后的文件时，再根据执行环境对应的模块系统的解析规则去解析出该模块的入口文件具体是哪个。针对 CommonJS 来说，会使用`main`指向的文件；针对 ES Module 来说，会使用`module`指向的文件。

### 为什么 TypeScript 代码里的 import 语句即可以引入值也可以引入类型声明?

```ts
import axios, { Method } from 'axios';
```

以上面的代码为例，引入的`axios`是个值，引入的`Method`是个枚举类型的类型声明。

我们打开`axios`的类型声明文件`node_modules/axios/index.d.ts`。

```ts
// ...
export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

// ...

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  isCancel(value: any): boolean;
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
}

declare const Axios: AxiosStatic;

export default Axios;


export const helloWorld; // 新增的常量声明
```

从类型声明文件可知，默认导出的`Axios`（项目里引入时命名为`axios`）已经声明为一个常量，其类型为`AxiosStatic`，而导出的`Method`是个类型声明。

在静态分析时，`import`语句能引入什么内容，值或是类型，完全取决于该模块的类型声明文件里会导出哪些内容，这与运行时是否存在导入的这些内容无关。

举个例子，我们在`axios`的类型声明文件`node_modules/axios/index.d.ts`里新增一条声明`export const helloWorld`，而这个常量`helloWorld`并没有在运行时实现。但是我们可以在代码里`import`进来并打印出来，在 TypeScript 做静态分析时这并不会报错，但是在运行时一定会报错。

```ts
// 额外引入 helloWorld 并打印
import axios, { Method, helloWorld } from 'axios';

console.log(helloWorld);
```

由此我们可以发现，实际上 TypeScript 在做静态分析时，是通过`import`语句去查找模块的类型声明文件`.d.ts`，并检查导入进来的这些值或类型声明是否存在于类型声明文件里，若不存在则报错提示，否则导入正常。

在 TypeScript 做静态分析时，完全不涉及到运行时，若导入的值已在模块的类型声明文件里声明过，则 TypeScript 就认为该值在运行时也会存在。
