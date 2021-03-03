---
sidebarDepth: 0
---

# Tapable

[[toc]]

`tapable`库提供了各式各样的钩子类（`hook classes`），实例化这些钩子类将创建钩子。

每一个钩子上，都可以注册多个插件（`plugin`）函数。当钩子触发时，这些插件函数就会执行，而插件的执行顺序、入参、返回值是否传入下一个插件函数等，都取决于钩子的类型。

针对要开发工具库的开发者来说，他们依赖并使用`tapable`库创建一批钩子，并将这些钩子分别安放在该工具库流水线作业上的各个关键路径上，并将这些钩子和启用流水线作业的方法一起暴露给使用该工具库的用户。

而对使用工具库的用户来说，他们可以在工具库暴露出来的各个钩子上安装插件，最后启动工具库的流水线作业。当执行到工具库流水线上的关键路径上时，会触发该路径上的钩子，进而执行用户在该钩子上注册的插件函数。

## 系列文章

### tapable 官网 README 翻译

[tapable 官网 README 翻译](./tapable-readme.md)

### tapable 实现

## 详细使用

### 注册插件及触发钩子

- `hook.tap(pluginName, pluginFn)`: 注册同步插件
- `hook.tapAsync(pluginName, (arg1, arg2, ..., callback) => { /* ... */ })`: 注册基于回调的异步插件
- `hook.tapPromise(pluginName, () => { return promise } )`: 注册基于回调的异步插件

### 触发钩子

- `hook.call()`: 执行钩子上通过`hook.tap`注册的插件
- `hook.callAsync()`: 执行钩子上通过`hook.tapAsync`注册的插件
- `hook.promise()`: 执行钩子上通过`hook.promise`注册的插件

### 触发钩子时的返回值及后续操作

- `SyncHook`/`SyncBailHook`/`SyncLoopHook`: 调用`hook.call()`触发钩子，无返回值
- `SyncWaterfallHook`: 调用`hook.call()`触发钩子，其返回值是最后一个插件的返回值
- `AsyncSeriesHook`
  - 调用`hook.callAsync(arg1, arg2, ..., callback)`触发钩子
    - 无返回值
    - 在所有插件执行完成后会调用`callback`
  - 调用`hook.promise(arg1, arg2, ...).then(res => { ... })`触发钩子
    - 返回`promise`实例
    - 在所有插件执行完成后会将该`promise`实例置为`resolved`
    - `res`为有数组，数组的项是各个插件`resolve`的值
- `AsyncParallelHook`
  - 调用`hook.callAsync(arg1, arg2, ..., callback)`触发钩子
    - 无返回值
    - 在所有插件执行完成后会调用`callback`
  - 调用`hook.promise(arg1, arg2, ...).then(res => { ... })`触发钩子
    - 返回`promise`实例
    - 在所有插件执行完成后会将该`promise`实例置为`resolved`
    - `res`为`undefined`
