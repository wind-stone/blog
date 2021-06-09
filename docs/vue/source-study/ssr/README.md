# Vue SSR

[[toc]]

## 学习记录

### createBundleRenderer

`createBundleRenderer`方法，主要是解决开发阶段编辑服务端代码后不能热更新的问题。

### 服务器端的入口文件

服务器端的入口文件，应该导出一个函数，该函数接受一个`context`对象作为参数，调用后 Promise 实例，实例需`resolve`一个`app`实例。

### vuex-router-sync

[vuex-router-sync](https://github.com/vuejs/vuex-router-sync)，用于将当前路由的状态注入到`store`里，当路由变化时，`store.state.route`也会跟着变化。
