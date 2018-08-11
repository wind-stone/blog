---
sidebarDepth: 0
---

# this

[[toc]]

## 函数有哪几种调用方式可以导致 this 不同？

- 作为普通函数调用
- 作为方法调用
- 作为构造函数调用
- 作为 apply、call 调用

## new fn() 的过程

使用 new 操作符调用构造函数创建新对象的过程

- 创建一个新对象
- 新对象的 __proto__指向 fn.prototype
- 将构造函数的作用域赋给新对象（因此this 就指向了这个新对象）
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新对象（如果fn执行后不返回，则默认返回新对象；如果返回了其他对象，则返回值为其他对象）

## apply 和 call 方法

### apply 与 call 的区别

apply 和 call 的第1个参数都是将要绑定的 this 对象，不同的是：

- apply 第2个是数组，数组里的每一项将作为函数的参数
- call 第2~第n个参数，依次作为函数的第1~第n-1个参数

### 常用示例

- 如何将伪数组转换成数组？
  - `Array.prototype.slice.call(arg)`
- 如何判断一个参数是对象？
  - `Object.prototype.toString.call(obj)`
