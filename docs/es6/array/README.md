---
sidebarDepth: 0
---

# 数组

[[toc]]

## 解构赋值

## 扩展运算符

扩展运算符（spread）是三个点（`...`）。它好比`rest`参数的逆运算，将一个数组转为用逗号分隔的参数序列。

使用特性

- 主要用于函数调用中
- 可与正常的函数参数可以结合使用
- 扩展运算符后面还可以放置表达式
- 扩展运算符后面是一个空数组，则不产生任何效果
- 可替代函数的 apply 方法

应用
- 复制数组
- 合并数组
- 与解构赋值结合
- 可将字符串转为真正的数组
- 实现了 Iterator 接口的对象
- Map 和 Set 结构，Generator 函数

```js
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

- 主要用于函数调用中

```js
function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers) // 42
```

```js
function push(array, ...items) { // 注意：这里 ...items 里的 ... 是 rest 参数，不是扩展运算符
  console.log(items) // [[2, 3, 4]]
  array.push(...items); // 这里 ...items 里的 ... 是才是扩展运算符
  console.log(array) // [1, [2, 3, 4]]
}

push([1], [2, 3, 4])
```

- 扩展运算符与正常的函数参数可以结合使用

```js
function f(v, w, x, y, z) { }
const args = [0, 1];
f(-1, ...args, 2, ...[3]);
```

- 扩展运算符后面还可以放置表达式

```js
const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];
```

- 扩展运算符后面是一个空数组，则不产生任何效果

```js
[...[], 1]
// [1]
```

- 替代函数的 apply 方法

```js
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);
```

```js
// ES5的 写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);
```

- 扩展运算符还可以将字符串转为真正的数组

```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```


## Array.from

只要是部署了 Iterator 接口的数据结构，`Array.from`都能将其转为数组


# ES5

## Array.isArray()

### Polyfill

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}
```


