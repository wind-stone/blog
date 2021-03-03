---
sidebarDepth: 0
---

# Webpack 4: import() and CommonJs

翻译自：[webpack 4: import() and CommonJs](https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655)

[[toc]]

`webpack 4`的`breaking changes`之一是，使用`import()`导入非 EcmaScript 模块时的行为。

实际上，当使用`import()`时，有许多问题需要考虑。让我们先从如下概念开始：

- `Source`: 包含了`import()`表达式的模块
- `Target`: 被`Source`里的`import()`表达式引用的模块

- `non-ESM`: 一个 CommonJs 或 AMD 模块，没有设置`__esModule: true`
- `transpiled-ESM`: 一个 CommonJs 模块，设置了`__esModule: true`（因为它已经被从`ESM`转换为 CommonJs）
- `ESM`: 一个常规的 EcmaScript 模块
- `strict-ESM`: 一个更加严格的 EcmaScript 模块，比如来自于一个`.mjs`文件
- `JSON`: 一个`json`文件

需要考虑如下这些情况：

- (A) `Source`: `non-ESM`, `transpiled-ESM`或`ESM`
- (B) `Source`: `strict-ESM` (`mjs`)
- (1) `Target`: `non-ESM`
- (2) `Target`: `transpiled-ESM` (`__esModule`)
- (3) `Target`: `ESM`或`strict-ESM` (`mjs`)
- (4) `Target`: `JSON`

如下示例可以让问题更加容易明白：

```js
// (A) source.js
import("./target").then(result => console.log(result));

// (B) source.mjs
import("./target").then(result => console.log(result));

// (1) target.js
exports.name = "name";
exports.default = "default";

// (2) target.js
exports.__esModule = true;
exports.name = "name";
exports.default = "default";

// (3) target.js or target.mjs
export const name = "name";
export default "default";

// (4) target.json
{ name: "name", default: "default" }
```

## A3 and B3: import(ESM)

```js
// (A) source.js
import("./target").then(result => console.log(result));

// (B) source.mjs
import("./target").then(result => console.log(result));

// (3) target.js or target.mjs
export const name = "name";
export default "default";
```

实际上这两种情况在 ESM 规格文档里已有提及，也是所有这些情况里唯一被提及的。

`import()`将解析到`Target`模块的命名空间对象。为了兼容性考虑，我们也添加一个`__esModule`标志到命名空间对象上，对于转义后的导入来说是可用的。

```js
{ __esModule: true, name: "name", default: "default" }
```

## A1: import(CJS)

```js
// (A) source.js
import("./target").then(result => console.log(result));

// (1) target.js
exports.name = "name";
exports.default = "default";
```

我们导入了一个 CommonJs 模块，`webpack 3`只解析到`module.exports`的值，而`webpack 4`将为这个 CommonJs 模块创建一个人工的命名空间对象，以便让`import()`保持一致，也解析到这个命名空间对象。

CommonJs 模块的默认导出是`module.exports`的值。`webpack`也允许通过`import { property } from "cjs"`的方式从 CommonJs 模块里导入特定的属性，因此我们也允许`import()`这么做。

注意：在这种情况下，`default`属性会被默认的`default`隐藏。

```js
// webpack 3
{ name: "name", default: "default" }

// webpack 4
{ name: "name", default: { name: "name", default: "default" } }
```

## B1: import(CJS).mjs

```js
// (B) source.mjs
import("./target").then(result => console.log(result));

// (1) target.js
exports.name = "name";
exports.default = "default";
```

在`strict-ESM`模块里，我们不允许通过`import`导入特定的属性，只允许`non-ESM`的默认导出。

```js
{ default: { name: "name", default: "default" } }
```

## A2: import(transpiled-ESM)

```js
// (A) source.js
import("./target").then(result => console.log(result));

// (2) target.js
exports.__esModule = true;
exports.name = "name";
exports.default = "default";
```

`webpack`支持`__esModule`标志，将把 CommonJs 模块升级为 ESM 模块。

```js
{ __esModule: true, name: "name", default: "default" }
```

## B2: import(transpiled-ESM).mjs

```js
// (B) source.mjs
import("./target").then(result => console.log(result));

// (2) target.js
exports.__esModule = true;
exports.name = "name";
exports.default = "default";
```

在`strict-ESM`模块里，不支持`__esModule`标志。你可以认为这是破坏性改变，但是它是与 Node.js 保持一致的。

```js
{ default: { __esModule: true, name: "name", default: "default" } }
```

## A4 and B4: import(json)

```js
// (A) source.js
import("./target").then(result => console.log(result));

// (B) source.mjs
import("./target").then(result => console.log(result));

// (4) target.json
{ name: "name", default: "default" }
```

当导入 JSON 时，导入特定属性也是支持的，即使是在`strict-ESM`模块里。JSON 也会暴露整个对象作为默认输出。

```js
{ name: "name", default: { name: "name", default: "default" } }
```

## 总结

总而言之，只有一种情况改变了。当输出一个对象时，是没有问题的。但是当使用`module.exports`导出一个非对象，就会存在问题。比如：

```js
module.exports = 42;
```

你将需要使用`default`属性。

```js
// webpack 3
42
// webpack 4
{ default: 42 }
```
