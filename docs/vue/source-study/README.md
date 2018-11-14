---
sidebarDepth: 0
---

# General

[[toc]]

## 待学习/梳理的内容

- slot 的实现
- vue create API
- 函数式组件与常规组件的区别
- 模板编译
  - v-model 实现

## Vue 版本

该源码学习系列文章，都是基于 Vue.js 2.5.16 版本

## 名词解释

### 组件选项对象

```js
const options = {
  el: '...',
  props: '...',
  data: '...',
  computed: {
    // ...
  },
  created: () = {}
  // ...
}
```
