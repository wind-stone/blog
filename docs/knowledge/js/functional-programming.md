---
sidebarDepth: 0
---

# 函数式编程

[[toc]]

## 纯函数（Pure Function）

纯函数仅针对它们的输入参数进行操作，比如

```js
function add(x, y) {
    return x + y;
}
```

### 纯函数特性

- 纯函数针对给定相同的输入，总是产生相同的输出
- 纯函数没有函数副作用

## 高阶函数（Higher-order Function）

高阶函数可以接收函数作为参数，或者返回一个函数结果，或者两者同时具备

## 引用透明

纯函数可以被它的表达式安全地替换

## 函数式编程的特性

- 函数式编程中没有变量
- 函数式编程中，通过递归实现循环

```js
// simple loop construct
var acc = 0;
for (var i = 0; i <= 10; i++) {
    acc += i;
}
console.log(acc);  // prints 55

// without loop construct or variable (recursion)
function sumRange(start, end, acc) {
    if (start > end) {
        return acc;
    }
    sumRange(start + 1, end, acc + start);
}
console.log(sumRange(1, 10, 0)); // prints 55
```

## 为什么函数式编程要求函数必须是纯的，不能有副作用？

因为它是一种数学运算，原始目的就是求值，不做其他事情，否则就无法满足函数运算法则了。

## 函数式编程基本运算

- 合成
- 柯里化
