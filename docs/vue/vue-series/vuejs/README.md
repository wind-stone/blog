# 总览

[[toc]]

## element-ui

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
