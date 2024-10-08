# Number

[[toc]]

JavaScript 至今没有真正的整数，我们用的`Number`事实上是双精度浮点数，详见[JavaScript 关于 IEEE 754 双精度浮点数的实现](/js/data-types/js-number-implementation.html)。

## 精度问题

精度问题，可以先看[JavaScript 关于 IEEE 754 双精度浮点数的实现](./floating.md)了解浮点数的实现。

### parseInt(0.0000008) === 8

`parseInt` 的第一个类型是字符串，所以会将传入的参数转换成字符串，但是小于`0.0000001（1e-7）`的数字转换成 String 时，会变成科学记号法，也就是`String(0.0000008)`的结果为`8e-7`。`parseInt`并没有将`e`视为一个数字，所以在转换到 8 后就停止了，最终 `parseInt(0.0000008) === 8`

Referrence: [http://justjavac.com/javascript/2015/01/08/why-parseint-0-00000008-euqal-8-in-js.html](http://justjavac.com/javascript/2015/01/08/why-parseint-0-00000008-euqal-8-in-js.html)

### 0.1 + 0.2 = 0.3

因为浮点数运算的精度问题导致`0.1 + 0.2 = 0.3`这个等式不成立。正确的比较方法是使用 JavaScript 提供的最小精度值：

```js
console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
```

检查等式左右两边差的绝对值是否小于最小精度，才是正确的比较浮点数的方法。

### toFixed 的结果不精确

```js
2.55.toFixed(1) // 2.5
1.45.toFixed(1) // 1.4
1.55.toFixed(1) // 1.6
```

其原因是，这些数字在存储后再取出得出的数值与原先有偏差，这种偏差导致在`toFixed`时结果不精确。

```js
2.55.toPrecision(32) // 2.5499999999999998223643160599750
1.45.toPrecision(32) // 1.4499999999999999555910790149937
1.55.toPrecision(32) // 1.5500000000000000444089209850063
```

## 关于 3.toString()

JavaScript 规范中规定的数字直接量可以支持四种写法：十进制数、二进制整数、八进制整数和十六进制整数。

十进制的 Number 可以带小数，小数点前后部分都可以省略，但是不能同时省略。

```js
.01
12.
12.01
```

以上三种表示都是合法的数字字面量。因此，`3.toString()`里的`3.`会当作省略了小数点后面部分的数字，而单独看成一个整体。

所以`3.toString()`等同于`(3.)toString()`，这显然是语法有问题。

而`3..toString()`会被计算成`(3.).toString()`，OK！

`3...toString()`等同于`(3.)..toString()`，语法问题。

我们要想让点单独成为一个（词法分析里的）`token`，就要加入空格。

```js
3 .toString() // 等效于 (3).toString()
```
