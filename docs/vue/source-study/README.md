# 整体说明

[[toc]]

## Vue 版本

该源码学习系列文章，都是基于 Vue.js 2.5.16 版本

## 技巧

[[toc]]

### 判断深层次的属性是否存在

业务代码里经常会碰到要判断某个对象的深层次的属性，比如接口返回的对象`res`：

```js
{
  errno: 0,
  aaaaaaaaaa: {
    bbbbbbbbbb: {
      cccccccccc: true
    }
  }
}
```

现在要根据`res.aaaaaaaaaa.bbbbbbbbbb.cccccccccc`的值来区分进行哪项操作，常规的做法是：

```js
if (res.errno === 0) {
  if (res.aaaaaaaaaa && res.aaaaaaaaaa.bbbbbbbbbb && res.aaaaaaaaaa.bbbbbbbbbb.cccccccccc) {
    console.log(res.aaaaaaaaaa.bbbbbbbbbb.cccccccccc)
  }
}
```

Vue 源码里学习到的方法：

```js
if (res.errno === 0) {
  let i
  if ((i = res.aaaaaaaaaa) && (i = i.bbbbbbbbbb) && (i = i.cccccccccc)) {
    console.log(i)
  }
}
```

可以发现，针对对象属性的层次很深时，且每一层属性的`key`都较长并都需要判断是否存在时，使用不断给`i`赋值的方式，要方便许多，尤其是在判断存在后获取最后一层属性值时。

### 代码格式

#### 三元运算符

```js
const result = firstCondition
        ? thisIsFirstResultOfTheFirstCondition
        : secondCondition
          ? thisIsFirstRusultOfTheSecondCondition
          : thisIsSecondRusultOfTheSecondCondition
```

PS：三元运算符是右结合的，上下这两个表达式结果是相同的。

```js
const result = firstCondition
        ? thisIsFirstResultOfTheFirstCondition
        : (secondCondition
          ? thisIsFirstRusultOfTheSecondCondition
          : thisIsSecondRusultOfTheSecondCondition)
```

#### 并排的条件语句

```js
if (
  a &&
  b && (
    c || d
  )
) {
  // ...
}
```

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
