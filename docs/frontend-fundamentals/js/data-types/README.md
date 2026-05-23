# 数据类型

[[toc]]

## 类型划分方式

类型的划分方式是**该类型是否可以表示为固定长度**。

比如`Undefined`，`Null`，`Boolean`，`String`，`Number`这些可以有固定长度，因此是基本类型，并且保存到了栈（`Stack`）上。

`Object`由于不可预知长度，并且可以修改，因此是引用类型，会被分配到另一块区域，我们称之为堆（`Heap`）。

::: tip
字符串是不可变的，因此被认为有固定长度。
:::

此外，我们所说的类型指的是值的类型，不是变量的类型，这是动态语言和静态语言的差异。对于静态语言来说，我们可以限定一个变量的类型。但是对于 JS 这种动态类型的语言来说，我们无法给变量限定类型，变量的类型是可变的。

## 基本类型

| 数据类型    | `Object.prototype.toString.call(value)` | `typeof value` |
| ----------- | --------------------------------------- | -------------- |
| `Number`    | `[object Number]`                       | `number`       |
| `Boolean`   | `[object Boolean]`                      | `boolean`      |
| `String`    | `[object String]`                       | `string`       |
| `Null`      | `[object Null]`                         | `object`       |
| `Undefined` | `[object Undefined]`                    | `undefined`    |
| `Symbol`    | `[object Symbol]`                       | `symbol`       |

`Symbol`是 ES6 里新增的基本类型。

### typeof

- 对函数进行`typeof`运算后，得到的是`function`

```js
const fn = function() {}
typeof fn // function
```

- 对`null`进行`typeof`运算后，得到的是`object`

```js
typeof null // object
```

- `typeof`不能区分“未定义”还是“定义了但是没有值”，两者都会返回`undefined`

```js
function test() {
    var a;
    console.log(typeof a) // undefined
    console.log(typeof b) // undefined，注意这里不会触发 Reference Error
}
test()
```

- 对一个未定义的变量进行`typeof`运算，不会触发`Reference Error`，如上例所示

### 基本包装类型

每一种基本类型`Number`、`String`、`Boolean`、`Symbol`都有对应的基本包装类型。当在基本类型上调用方法时，会临时先将该基本类型转换成对应的基本包装类型对象，待操作完成后，再销毁这个基本包装类型对象，转换成基本类型。

调用基本包装类型对象的`valueOf()`方法，会返回对应的基本类型的值。

### Null

`Null`类型也只有一个值，就是`null`，它的语义表示空值，与`undefined`不同，`null`是 JavaScript 关键字，所以在任何代码中，你都可以放心用`null`关键字来获取`null`值。

### Undefined

#### 为什么有的编程规范要求用 void 0 代替 undefined

`Undefined`类型表示未定义，它的类型只有一个值，就是`undefined`。任何变量在赋值前是`Undefined`类型、值为`undefined`，一般我们可以用全局变量`undefined`（就是名为`undefined`的这个变量）来表达这个值，或者`void`运算来把任意一个表达式变成`undefined`值。

但是，JavaScript 的`undefined`是一个变量，而并非是一个关键字，这是 JavaScript 语言公认的设计失误之一。所以，我们为了避免无意中被篡改，通常建议使用`void 0`来获取`undefined`值。BTW，在代码压缩时，`undefined`也会被替换成`void 0`。

```js
// undefined 被篡改
const test = () => {
  var undefined = 5;
  console.log(typeof undefined); // number
}

test();
```

注意，给全局的`undefined`赋值总是会失败，但是可以在函数内给声明`undefined`变量并赋值。

`Undefined`跟`Null`有一定的表意差别，`Null`表示的是：“赋值了但是为空”。所以，在实际编程时，我们一般不会把变量赋值为`undefined`，这样可以保证所有值为`undefined`的变量，都是从未赋值的自然状态。

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
