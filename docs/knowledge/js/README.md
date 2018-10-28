---
sidebarDepth: 0
---

# 总览

[[toc]]

## Function

### 将函数伪装成 Native 函数

```js
var fakerAlert = (function () {}).bind(null)
console.log(fakerAlert.toString())
// 结果：
// function () { [native code] }
```

原理是什么？

## Number

### 关于 X.toString()，X是数字直接量

- 3.toString() 会按照从左到右的顺序解析
- 3.会被计算成 3

所以 3.toString() 等同于(3)toString() ，这显然是语法有问题。

而 3..toString() 会被计算成 (3.).toString()，OK！

3...toString() 等同于 (3.)..toString()，语法问题。