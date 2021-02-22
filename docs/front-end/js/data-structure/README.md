---
sidebarDepth: 0
---

# 数据结构

[[toc]]

## 系列文章

- `Number`
  - [JavaScript 关于 IEEE 754 双精度浮点数的实现](/front-end/js/data-structure/js-number-implementation.html)

## 基本类型

| 数据类型    | `Object.prototype.toString().call(value)` | `typeof value` |
| ----------- | ----------------------------------------- | -------------- |
| `Number`    | `[object Number]`                         | `number`       |
| `Boolean`   | `[object Boolean]`                        | `boolean`      |
| `String`    | `[object String]`                         | `string`       |
| `null`      | `[object Null]`                           | `object`       |
| `undefined` | `[object Undefined]`                      | `undefined`    |
| `Symbol`    | `[object Symbol]`                         | `symbol`       |

### 基本包装类型

每一种基本类型 Number、String、Boolean、Symbol 都有对应的基本包装类型。当在基本类型上调用方法时，会临时先将该基本类型转换成对应的基本包装类型对象，待操作完成后，再销毁这个基本包装类型对象，转换成基本类型。

调用基本包装类型对象的`valueOf()`方法，会返回对应的基本类型的值。

### undefined

#### 为什么有的编程规范要求用 void 0 代替 undefined

Undefined 类型表示未定义，它的类型只有一个值，就是`undefined`。任何变量在赋值前是 Undefined 类型、值为`undefined`，一般我们可以用全局变量`undefined`（就是名为`undefined`的这个变量）来表达这个值，或者`void`运算来把任意一个表达式变成`undefined`值。

但是，因为 JavaScript 的代码`undefined`是一个变量，而并非是一个关键字，这是 JavaScript 语言公认的设计失误之一。所以，我们为了避免无意中被篡改，通常建议使用`void 0`来获取`undefined`值。BTW，在代码压缩时，`undefined`也会被替换成`void 0`。

```js
// undefined 被篡改
const test = () => {
  var undefined = 5;
  console.log(typeof undefined); // number
}

test();
```

注意，给全局的`undefined`赋值总是会失败，但是可以在函数内给声明`undefined`变量并赋值。

Undefined 跟 Null 有一定的表意差别，Null 表示的是：“定义了但是为空”。所以，在实际编程时，我们一般不会把变量赋值为`undefined`，这样可以保证所有值为`undefined`的变量，都是从未赋值的自然状态。

#### 判断变量是否已定义

一般情况下，若想判断变量是否已定义会使用`undefined`来判断，但是使用姿势可能不对。

```js
// 不推荐（函数内的 undefined 可能被改写）
function isUndefined(variable) {
  return variable === undefined;
}

// 推荐
function isUndefined(val) {
  return typeof val === 'undefined';
}
```

### null

Null 类型也只有一个值，就是`null`，它的语义表示空值，与`undefined`不同，`null`是 JavaScript 关键字，所以在任何代码中，你都可以放心用`null`关键字来获取`null`值。

## 引用类型

| 数据类型   | `Object.prototype.toString().call(value)` | `typeof value` |
| ---------- | ----------------------------------------- | -------------- |
| `Object`   | `[object Object]`                         | `object`       |
| `Array`    | `[object Array]`                          | `object`       |
| `Date`     | `[object Date]`                           | `object`       |
| `RegExp`   | `[object RegExp]`                         | `object`       |
| `Function` | `[object Function]`                       | `function`     |
| `Set`      | `[object Set]`                            | `object`       |
| `WeakSet`  | `[object WeakSet]`                        | `object`       |
| `Map`      | `[object Map]`                            | `object`       |
| `WeakMap`  | `[object WeakMap]`                        | `object`       |

### 数组

### 类数组（ArrayLike）

Reference: [https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/76](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/76)

```js
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)

// 结果
// Object(4) [empty × 2, 1, 2, splice: ƒ, push: ƒ]
//   2: 1
//   3: 2
//   length: 4
//   push: ƒ push()
//   splice: ƒ splice()
//   __proto__: Object
```

涉及知识点：

类数组（`ArrayLike`）：一组数据，由数组来存，但是如果要对这组数据进行扩展，会影响到数组原型，`ArrayLike`的出现则提供了一个中间数据桥梁，`ArrayLike`有数组的特性， 但是对`ArrayLike`的扩展并不会影响到原生的数组。

`push`方法：`push`方法有意具有通用性。该方法和`call()`或`apply()`一起使用时，可应用在类似数组的对象上。`push`方法根据`length`属性来决定从哪里开始插入给定的值。如果`length`不能被转成一个数值，则插入的元素索引为`0`，包括`length`不存在时。当`length`不存在时，将会创建它。

唯一的原生类数组对象是`Strings`，尽管如此，它们并不适用该方法，因为字符串是不可改变的。

对象转数组的方式：

`Array.from()`、`splice()`、`concat()`等

上题分析：

这个`obj`中定义了两个`key`值，分别为`splice`和`push`分别对应数组原型中的`splice`和`push`方法，因此这个`obj`可以调用数组中的`push`和`splice`方法，调用对象的`push`方法：`push(1)`，因为此时`obj`中定义`length`为`2`，所以从数组中的第二项开始插入，也就是数组的第三项（下表为`2`的那一项），因为数组是从第`0`项开始的，这时已经定义了下标为`2`和`3`这两项，所以它会替换第三项也就是下标为`2`的值，第一次执行`push`完，此时`key`为`2`的属性值为`1`，同理：第二次执行`push`方法，`key`为`3`的属性值为`2`。

因为只是定义了2和3两项，没有定义0和1这两项，所以前面会是empty。
如果将这道题改为：

```js
var obj = {
    '2': 3,
    '3': 4,
    'length': 0,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
```

此时的打印结果就是：

```js
Object(2) [1, 2, 2: 3, 3: 4, splice: ƒ, push: ƒ]
  0: 1
  1: 2
  2: 3
  3: 4
  length: 2
  push: ƒ push()
  splice: ƒ splice()
  __proto__: Object
```

原理：此时`length`长度设置为`0`，`push`方法从第`0`项开始插入，所以填充了第`0`项的`empty`。至于为什么对象添加了`splice`属性后并没有调用就会变成类数组对象这个问题，这是控制台中 DevTools 猜测类数组的一个方式：[https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/event_listeners/EventListenersUtils.js#L330](https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/event_listeners/EventListenersUtils.js#L330)

### Function

#### 将函数伪装成 Native 函数

```js
var fakerAlert = (function () {}).bind(null)
console.log(fakerAlert.toString())
// 结果：
// function () { [native code] }
```

### Date

#### 已知年月，计算该月天数

以求 2019 年 2 月有多少天为例。

- 方式一

新建日期对象传入年月日参数时，如果传入的`day`超过该月的最大天数，则日期将自动前进。

```js
new Date(2019, 1, 32).toLocaleDateString()  // 2019/3/4
```

上面示例的意思是，2019 年 2 月第 32 日，因为 2019 年 2 月只有 28 天，因此 2 月第 32 天，即是 3 月 4 日。

因此，可通过下列函数计算某年某月的天数。

```js
function getMonthCountDay (year, month) {
  return 32 - new Date(year, month, 32).getDate()
}
```

- 方式二

类似于方式一，若传入的`day`是 0 或负数，则日期将自动倒退。

```js
new Date(2019, 1, 0).toLocaleDateString()   // 2019/1/31
new Date(2019, 1, -1).toLocaleDateString()  // 2019/1/30
```

上面示例的意思是，2019 年 2 月第 0 天，即是 2019 年 1 月 31 日。2 月第 -1 天，即是 1 月 30 日。

因此，可通过下列函数计算某年某月的天数。

```js
function getMonthCountDay (year, month) {
  return new Date(year, month + 1, 0).getDate()
}
```

Date API 处理日期溢出时的规则，类似于加法进位，减法退位。

- `new Date(2019, 0, 50)`，其中0代表1月，1月只有31天，则多出来的19天会被加到2月，结果是2019年2月19日
- `new Date(2019, 20, 10)`，1年只有12个月，多出来的9个月会被加到2020年，结果是2020年9月10日
- `new Date(2019, -2, 10)`，2019年1月10日往前推2个月，结果为2018年11月10日
- `new Date(2019, 2, -2)`，2019年3月1日往前推2天，结果为2019年2月26日

Reference: [小技巧：已知年月，求该月共多少天？](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/41)
