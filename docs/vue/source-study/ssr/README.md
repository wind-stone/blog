# Vue SSR

[[toc]]

## SSR 的优势和劣势

优势：

- 更好的 SEO
- 更快的内容到达时间 (`time-to-content`)

劣势：

- 只调用`created`及之前的生命周期钩子函数，一些外部扩展库(`external library`)可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 涉及构建设置和部署的更多要求，需要处于 Node.js server 运行环境。
- 更多的服务器端负载，比如 CPU

## 学习记录

### createBundleRenderer

`createBundleRenderer`方法，主要是解决开发阶段编辑服务端代码后不能热更新的问题。

### 服务器端的入口文件

服务器端的入口文件，应该导出一个函数，该函数接受一个`context`对象作为参数，调用后 Promise 实例，实例需`resolve`一个`app`实例。

### vuex-router-sync

[vuex-router-sync](https://github.com/vuejs/vuex-router-sync)，用于将当前路由的状态注入到`store`里，当路由变化时，`store.state.route`也会跟着变化。
