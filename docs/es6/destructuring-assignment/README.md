---
sidebarDepth: 0
---

# 解构赋值

[[toc]]

注意点：

- 默认值生效的条件是，属性值严格等于`undefined`
- 解构的默认值是表达式，则表达式会惰性求值

## 数值和布尔值的解构赋值

- 解构赋值时，如果等号右边是数值和布尔值，则会先转为对象

```js
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

## 数组的解构赋值

- 解构的默认值是表达式，则表达式会惰性求值

```js
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
```

上面的代码等价于

```js
let x;
// [1][0] 是指数组 [1] 的下标为 0 的元素
if ([1][0] === undefined) {
  x = f();
} else {
  x = [1][0];
}
```

## Set 的解构赋值、具有 Iterator 接口的数据结构的解构赋值

对于 Set 结构，也可以使用数组的解构赋值。

```js
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

```js
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

## 对象的解构赋值

- 对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者

```js
let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined
```

- 解构赋值的变量可以是 对象属性

```js
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```

- 注意区分`模式`和`变量`

```js
const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

let { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}
```

上面代码有三次解构赋值，分别是对`loc`、`start`、`line`三个属性的解构赋值。
注意，最后一次对`line`属性的解构赋值之中，只有`line`是变量，`loc`和`start`都是模式，不是变量。

- 解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错

```js
// 报错
let {foo: {bar}} = {baz: 'baz'};
```

- 已经声明的变量用于解构赋值，必须非常小心

```js
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error
```

上面代码的写法会报错，因为 JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

```js
// 正确的写法
let x;
({x} = {x: 1});
```

- 解构赋值允许等号左边的模式之中，不放置任何变量名

```js
({} = [true, false]);
({} = 'abc');
({} = []);
```

上面的表达式虽然毫无意义，但是语法是合法的，可以执行。

- 数组本质是特殊的对象，因此可以对数组进行对象属性的解构

```js
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

## 字符串的解构赋值

```js
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5
```

## 函数参数的解构赋值

- 函数参数解构赋值，默认值位置不同，效果不同

```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

```js
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

## 注意事项

**如果要将一个已经声明的变量用于解构赋值，必须非常小心。**

```js
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error
```

上面代码的写法会报错，因为 JavaScript 引擎会将`{x}`理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

```js
// 正确的写法
let x;
({x} = {x: 1});
```

上面代码将整个解构赋值语句，放在一个圆括号里面，就可以正确执行。

**解构赋值允许等号左边的模式之中，不放置任何变量名**。因此，可以写出非常古怪的赋值表达式。

```js
({} = [true, false]);
({} = 'abc');
({} = []);
```

上面的表达式虽然毫无意义，但是语法是合法的，可以执行。
