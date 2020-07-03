# uni-app

## uni-app 学习记录

PS: 本人熟悉 h5 和 Vue.js 开发，不熟悉小程序和 uni-app 开发，因此如下的记录

### 为什么在 uni-app 的项目里可以直接使用 HTML 标签

出于降低 h5 应用向 uni-app 迁移成本的考虑，写成`div`、`span`也可以运行在 app 和小程序上，因为 uni-app 编译器会在编译时会把这些 HTML 标签编译为小程序标签。但不推荐这种用法，因为这样调试 H5 端时容易混乱。此外，仍然建议养成新习惯，使用 uni-app 的标签。

| HTML 标签                                              | uni-app 标签 | 转换说明                    |
| ------------------------------------------------------ | ------------ | --------------------------- |
| div/ul/li                                              | view         | -                           |
| span/font                                              | text         | -                           |
| a                                                      | navigator    | -                           |
| img                                                    | image        | -                           |
| select                                                 | picker       | -                           |
| iframe                                                 | web-view     | -                           |
| input                                                  | 没变化       | type 属性改成了 confirmtype |
| audio                                                  | 没变化       | 不再推荐使用，改成 API 方式 |
| form/button/checkbox/radio/label/textarea/canvas/video | 没变化       | -                           |

参考: [白话uni-app 【也是html、vue、小程序的区别】](https://ask.dcloud.net.cn/article/id-35657)

## 踩过的坑

### 父子组件销毁顺序

在 Vue 里，父子组件的销毁顺序是：

父组件 beforeDestroy -> 子组件 beforeDestroy -> 子组件 destroyed -> 父组件 destroyed

但是，经过测试`uni-app`里组件的销毁顺序如下：

子组件 beforeDestroy  ->  子组件 destroyed -> 父组件 beforeDestroy  -> 父组件 destroyed

猜测：小程序组件生命周期里，与组件销毁相关的钩子只有`detached`，可能是这个原因导致的。

若是子组件先`detached`、父组件后`detached`，因此没办法做到跟 Vue 一样的销毁顺序？

### 列表循环里的 key 不生效

[列表循环里的 key 不生效](./v-for-key.md)
