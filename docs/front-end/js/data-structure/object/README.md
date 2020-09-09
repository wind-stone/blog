---
sidebarDepth: 0
---

# 对象

[[toc]]

## 属性的可枚举性

四个操作会忽略`enumerable`为`false`的属性。

- `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性。

## 属性的遍历

### 遍历方法

ES6 一共有 5 种方法可以遍历对象的属性。

| 方式                             | 不可枚举属性 | 继承属性 | Symbol 属性 |
| -------------------------------- | ------------ | -------- | ----------- |
| `for...in`                       | ×            | √        | ×           |
| `Object.keys()`                  | ×            | ×        | ×           |
| `Object.getOwnPropertyNames()`   | √            | ×        | ×           |
| `Object.getOwnPropertySymbols()` | √            | ×        | √           |
| `Reflect.ownKeys()`              | √            | √        | √           |

### 遍历顺序

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列。

## 对象的方法是特殊的属性

对象只有数据属性和访问器属性，而对象的方法其实是对象的数据属性。

```js
const obj = {
    fn: () => {}
};

Object.getOwnPropertyDescriptor(obj, 'fn')

// {
//     configurable: true
//     enumerable: true
//     value: () => {}
//     writable: true
//     __proto__: Object
// }
```
