# 【初级】原型、构造函数、实例 之间的关系？

```js
function Fn() {}
const instance = new Fn();
```

B-能够说出 constructor、**proto**、prototype 等
A-继续追问 instanceof 实现比较明晰
S-继续追问原型链顶端相关问题明晰，原型链查找机制明晰

参考：

- 每个构造函数都有一个原型对象
- 原型对象都包含一个指向构造函数的指针
- 实例都包含一个指向原型对象的内部指针。

```js
function Fn() {}
const instance = new Fn();

Fn.prototype.constructor === Fn // true
instance.__proto__ === Fn.prototype // true
```
