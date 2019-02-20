---
sidebarDepth: 0
---

# 总览

[[toc]]

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

## Vue UI 库

### element-ui

### el-input 支持 enter 事件

- 方法一：[el-input 响应 v-on:keyup.enter](https://github.com/ElemeFE/element/issues/2333)
- 方法二：`@change`方法自动支持`enter`事件

```html
<el-input
  suffix-icon="el-icon-search"
  v-model="form.input"
  @change="inputChange">
</el-input>
```
