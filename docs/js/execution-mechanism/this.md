# this

[[toc]]

## 函数有哪几种调用方式可以导致 this 不同？

- 作为普通函数调用
- 作为方法调用
- 作为构造函数调用
- 通过`apply`、`call`、`bind`显示绑定`this`进行调用
- 箭头函数

## 作为普通函数调用

- 在严格模式下声明的函数，`this`会绑定到`undefined`上

```js
(() => {
  "use strict"
  function foo() {
    console.log(this.name);
  };
  var name = "bar";
  foo();
})();

// Uncaught TypeError: Cannot read property 'name' of undefined at foo
```

- 在非严格模式下声明的函数，`this`会绑定到`window`（或`global`）上

```js
var name = 'bar';
function foo() {
  console.log(this.name);
};

(() => {
  "use strict"
  foo(); // bar
})();
```

```js
var name = 'bar';
function foo() {
  console.log(this.name);
}

foo(); // bar
```

## new fn() 的过程

使用 new 操作符调用构造函数创建新对象的过程

- 创建一个新对象
- 新对象的 __proto__指向 fn.prototype
- 将构造函数的作用域赋给新对象（因此this 就指向了这个新对象）
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新对象（如果fn执行后不返回，则默认返回新对象；如果返回了其他对象，则返回值为其他对象）

## apply 和 call 方法

### apply 与 call 的区别

`apply`和`call`的第 1 个参数都是将要绑定的`this`对象，不同的是：

- `apply`第 2 个是数组，数组里的每一项将作为函数的参数
- `call`第 2 ~ n 个参数，依次作为函数的第 1 ~ n-1 个参数

### 性能对比

`call`的性能比`apply`的性能更好，详见[call和apply的性能对比 #6](https://github.com/noneven/__/issues/6)

### 常用示例

- 如何将伪数组转换成数组？
  - `Array.prototype.slice.call(arg)`
- 如何判断一个参数是对象？
  - `Object.prototype.toString.call(obj)`
