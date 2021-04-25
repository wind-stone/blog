---
sidebarDepth: 0
---

# 模块及模块解析

[[toc]]

## 模块

- [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)

### export = 和 import = require()

`export =`和`import = require()`的写法，主要是为了兼容 CommonJS 和 AMD 里导出单个`exports`对象的语法。

注意，针对`export =`导出的模块，一定要用`import = require()`来导入。

### 可选的模块加载

> The compiler detects whether each module is used in the emitted JavaScript. If a module identifier is only ever used as part of a type annotations and never as an expression, then no require call is emitted for that module. This elision of unused references is a good performance optimization, and also allows for optional loading of those modules.

编译器会检测文件里的每一个模块是否被使用到，如果一个模块标识符只是作为类型注解的一部分被使用，而不是作为表达式被使用，则在生成文件时不会包含`require`该模块的代码。省略未引用模块对性能优化是极好的，并同时允许对这些模块的选择性加载。

## 模块解析

- [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

`typescript`的模块解析支持在编译时将`import`的模块的路径替换成另一个路径，这些功能包括

- Path Mapping
- Virtual Directories with rootDirs

此外，通过在编译时`--traceResolution`选项，可以详细看到每一个模块是如何解析路径的。

```sh
tsc --traceResolution
```
