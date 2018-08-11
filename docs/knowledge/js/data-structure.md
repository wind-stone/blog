---
sidebarDepth: 0
---

# 数据结构

[[toc]]

## 数据类型分类

### 基本数据类型

数据类型 | `Object.prototype.toString().call(value)` | `typeof value`
--- | --- | ---
`Number` | `[object Number]` | `number`
`Boolean` | `[object Boolean]` | `boolean`
`String` | `[object String]` | `string`
`null` | `[object Null]` | `object`
`undefined` | `[object Undefined]` | `undefined`
`Symbol` | `[object Symbol]` | `symbol`

### 引用数据类型

数据类型 | `Object.prototype.toString().call(value)` | `typeof value`
--- | --- | ---
`Object` | `[object Object]` | `object`
`Array` | `[object Array]` | `object`
`Date` | `[object Date]` | `object`
`RegExp` | `[object RegExp]` | `object`
`Function` | `[object Function]` | `function`
`Set` | `[object Set]` | `object`
`WeakSet` | `[object WeakSet]` | `object`
`Map` | `[object Map]` | `object`
`WeakMap` | `[object WeakMap]` | `object`

### 返回给定参数的类型

```js
function getType (value) {
  let result = Object.prototype.toString.call(value)
  result = /^\[object\s(\w+)\]$/.exec(result)
  if (result[1] !== 'Object') {
    return result[1]
  }
  return value.constructor.name
}
```

注意：

- `Number`、`Boolean`、`String`类型的包装对象，会返回`"Number"`、`"Boolean"`、`"String"`
- 通过构造函数`new`出来的实例，会返回构造函数名称

### 如何判断参数的数据类型是给定类型？

如下`assertType`可验证给定参数是否是给定的类型。

可以验证的类型有：

- `Number`，包括其包装对象
- `Boolean`，包括其包装对象
- `String`，包括其包装对象
- `null`
- `undefined`
- `Symbol`
- `Object`
- `Array`
- `Date`
- `RegExp`
- `Function`
- `Set`
- `WeakSet`
- `Map`
- `WeakMap`
- 自定义类型

```js
/**
 * 返回构造函数的函数名称
 * @param {Function} fn 构造函数
 * @return {String} 构造函数名称
 */
function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/

/**
 * 判断给定参数是否是给定类型（包括给定的类型在参数的原型链上也算）
 * @param {Any} value 参数
 * @return {Function} type 构造函数
 */
function assertType (value, type) {
  if (type === null || type === undefined) {
    return {
      valid: value === type,
      expectedType: String(type)
    }
  }
  let valid
  const expectedType = getType(type)
  if (simpleCheckRE.test(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // 判断 String/Number/Boolean 的原始包装对象，比如 value = new Number(2)
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = Object.prototype.toString.call(value) === '[object Object]'
  } else if (expectedType === 'Array') {
    valid = Object.prototype.toString.call(value) === '[object Array]'
  } else {
    // 其他引用类型
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}
```

上面的代码参考 Vue 实现，如下是改进版。

```js
/**
 * 返回构造函数的函数名称
 * @param {Function} fn 构造函数
 * @return {String} 构造函数名称
 */
function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

function isType (value, type) {
  let result = Object.prototype.toString.call(value)
  result = /^\[object\s(\w+)\]$/.exec(result)
  return result[1] === type
}

// 所有的内置构造类型，不全，待补充
const buildInsCheckRE = /^(String|Number|Boolean|Function|Symbol|Object|Array|Date|RegExp|Set|WeakSet|Map|WeakMap)$/

/**
 * 判断给定参数是否是给定类型（包括给定的类型在参数的原型链上也算）
 * @param {Any} value 参数
 * @return {Function} type 构造函数
 */
function assertType (value, type) {
  if (type === null || type === undefined) {
    return {
      valid: value === type,
      expectedType: String(type)
    }
  }
  let valid
  const expectedType = getType(type)
  if (buildInsCheckRE.test(expectedType)) {
    valid = isType(value, expectedType)
  } else {
    // 其他引用类型
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}
```

测试用例

```js
function A() {}
const array = [
  [null, null],
  [undefined, undefined],
  [1, Number],
  ['1', String],
  [true, Boolean],
  [new Number('1'), Number],
  [new String(2), String],
  [new Boolean('1'), Boolean],
  [Symbol(), Symbol],
  [{}, Object],
  [[], Array],
  [new Date(), Date],
  [/111s/, RegExp],
  [function () {}, Function],
  [new Set([1, 2]), Set],
  [new WeakSet([{}]), WeakSet],
  [new Map([['name', '1']]), Map],
  [new WeakMap([[{}, 'foo']]), WeakMap],
  [Promise.resolve(), Promise],
  [new Proxy({}, {
    get: function (target, key, receiver) {
      return 1
    }
  }), Proxy],
  [new A(), A]
]

array.forEach(element => {
  console.log(assertType(element[0], element[1]))
});
```

需要注意，Proxy 实例对象实际上是`Object`类型，而不是`Proxy`类型。

## 类型转换

## Boolean() 函数

`Boolean`类型是 ECMAScript 中使用得最多的一种类型，该类型只有两个字面值：`true`和`false`。

一般在流控制语句里需要使用`Boolean`类型，所以在流控制语句里会自动执行相应的`Boolean`转换，将非`Boolean`类型的数据类型转换成`Boolean`类型，比如`if`语句、`while`语句里条件判断。

下表给出各种数据类型及其对应的转换规则。

数据类型 | 转换为`true`的值 | 转换为`false`的值
--|--|--
`Boolean` | `true` | `false`
`String` | 任何非空字符串 | "" （空字符串）
`Number` | 任何非零数字值 | `0`和`NAN`
`Object` | 任何对象 | `null`
`undefined` | not application （不适用） | `undefined`

### 逻辑非操作符（!）

逻辑非操作符由一个叹号（`!`）表示，可以应用于 ECMAScript 中的任何值。无论这个值是什么数据类型，这个操作符都会返回一个布尔值。

逻辑非操作符首先会将它的操作数转换为一个布尔值，然后再对其求反。也就是说，逻辑非操作符遵循下列规则：

- 如果操作数是一个对象，返回`false`
- 如果操作数是一个空字符串，返回`true`
- 如果操作数是一个非空字符串，返回`false`
- 如果操作数是数值`0`，返回`true`
- 如果操作数是任意非`0`数值（包括`infinity`），返回`false`
- 如果操作数是`null`，返回`true`
- 如果操作数是`NaN`，返回`true`
- 如果操作数是`undefined`，返回`true`。

下面几个例子展示了应用上述规则的结果：

```js
alert(!false);       // true
alert(!"blue");      // false
alert(!0);
// true
alert(!NaN);         // true
alert(!"");          // true
alert(!12345);
// false
```

逻辑非操作符也可以用于将一个值转换为与其对应的布尔值。而同时使用两个逻辑非操作符，实际上就会模拟`Boolean()`转型函数的行为。其中，第一个逻辑非操作会基于无论什么操作数返回一个布尔值，而第二个逻辑非操作则对该布尔值求反，于是就得到了这个值真正对应的布尔值。当然，最终结果与对这个值使用`Boolean()`函数相同，如下面的例子所示：

```js
alert(!!"blue");      //true
alert(!!0);          //false
alert(!!NaN);
//false
alert(!!"");          //false
alert(!!12345);      //true
```

### 判断 == 的过程

ECMAScript 中的相等操作符由两个等于号（==）表示，如果两个操作数相等，则返回`true`。

而不相等操作符由叹号后跟不等于号（!=）表示，如果两个操作数不相等，则返回`true`。

这两个操作符都会先转换操作数（通常称为强制转型） ，然后再比较它们的相等性。

在转换不同的数据类型时，相等和不相等操作符遵循下列基本规则：

- 如果有一个操作数是布尔值，则在比较相等性之前先将其转换为数值——`false`转换为`0`，而`true`转换为`1`
- 如果一个操作数是字符串，另一个操作数是数值，在比较相等性之前先将字符串转换为数值
- 如果一个操作数是对象，另一个操作数不是，则调用对象的`valueOf()`方法，用得到的基本类型值按照前面的规则进行比较

这两个操作符在进行比较时则要遵循下列规则：

- `null`和`undefined`是相等的
- 要比较相等性之前，不能将`null`和`undefined`转换成其他任何值
- 如果有一个操作数是 NaN，则相等操作符返回`false`，而不相等操作符返回`true`。重要提示：即使两个操作数都是`NaN`，相等操作符也返回 `false`；因为按照规则，`NaN`不等于`NaN`
- 如果两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回`true`；否则，返回`false`。

下表列出了一些特殊情况及比较结果：
表达式 | 值
--- | ---
null == undefined | true
"NaN" == NaN | false
5 == NaN | false
NaN == NaN | false
NaN != NaN | true
false == 0 | true
true == 1 | true
true == 2  | false
undefined == 0 | false
null == 0 | false
"5"==5 | true

### 对象转换成原始值

#### 对象到字符串的转换

- 如果对象具有`toString`方法，则调用这个方法。如果它返回一个原始值，javascript 将这个值转换为字符串，并返回这个字符串结果。需要注意的是，原始值到字符串的转换在下表中已经有了详细说明
- 如果对象没有`toString`方法，或者这个方法并不返回一个原始值，那么 javascript 会调用`valueOf`方法。如果存在这个方法，则 javascript 调用它。如果返回值是原始值，javascript 将这个值转换为字符串，并返回这个字符串结果。否则，javascript无法从`toString`和`valueOf`获得一个原始值，因此这时抛出一个类型错误异常。

#### 对象到数字的转换

- 如果对象具有`valueOf`方法，后者返回一个原始值，则 javascript 将这个原始值转换为数字（如果需要的话）并返回这个数字。否则，如果对象具有`toString`方法，后者返回一个原始值，则 javascript 将其转换为数字类型并返回。(见示例）否则，javascript 抛出一个类型异常。

#### 对象转化成原始值

- 日期对象：使用对象转化成字符串的转换模式
- 非日期对象：使用对象转换成数字的转换模式

注意：这里，通过`valueOf`或`toString`返回的原始值将被直接使用，而不会被强制转化成字符串或数字

## Number

### 精度

#### parseInt(0.0000008) === 8

`parseInt` 的第一个类型是字符串，所以会将传入的参数转换成字符串，但是小于`0.0000001（1e-7）`的数字转换成 String 时，会变成科学记号法，也就是`String(0.0000008)`的结果为`8e-7`。`parseInt`并没有将`e`视为一个数字，所以在转换到 8 后就停止了，最终 `parseInt(0.0000008) === 8`

Referrence: [http://justjavac.com/javascript/2015/01/08/why-parseint-0-00000008-euqal-8-in-js.html](http://justjavac.com/javascript/2015/01/08/why-parseint-0-00000008-euqal-8-in-js.html)

## Array

### 如何消除一个数组里面重复的元素？

- 方法一：`let newArray = new Set(array)`

- 方法二：`indexOf` + `splice`

```js
function deleteRepeat(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr.indexOf(arr[i]) !== i) {
      arr.splice(i, 1)
    }
  }
  return arr
}
```

- 方法三：Hash Map

```js
function deleteRepeat(array){
  let newArray = []
  let obj = {}
  let index = 0
  let len = array.length
  for(let i = 0; i < len; i++){
    const type = typeof array[i]
    const key = type + array[i]
    if(obj[key] === undefined) {
      obj[key] = true
      newArray[index++] = array[i]
    }
  }
  return newArray
}
```

以上几种方法，无法针对不同引用的对象去重。比如`array = [{a: 1}, {a: 1}]`

## RegExp

### 字符串的正则方法

#### `String.prototype.match(reg)`

- 参数
  - regexp：正则表达式（如果参数不是正则表达式，通过`RegExp()`构造函数将其转换成正则表达式）
- 返回
  - 无匹配：返回`null`
  - 正则表达式没有全局修饰符`g`，则不执行全局检索，返回数组`result`
    - `result[0]`：匹配的字符串
    - `result[1..n]`：正则表达式中用圆括号括起来的字表达式1...n
    - `result.index`：发生匹配的字符在 str 中的开始位置
    - `result.input`：所检索的字符串
  - 正则表达式有全局修饰符`g`，则执行全局检索，返回有匹配结果组成的数组 result
    - `result[0..n]`：匹配结果1..n+1

#### `String.prototype.search(reg)`

- 参数
  - reg：正则表达式（如果参数不是正则表达式，通过`RegExp()`构造函数将其转换成正则表达式）
- 返回
  - 无匹配：返回`-1`
  - 有匹配，返回第一个与之匹配的字串的起始位置（不支持全局搜索，会忽略全局修饰符 g）

#### `String.prototype.replace(reg, str)`

- 功能：执行检索和替换操作
- 在替换字符串（第二个参数）中出现了 $ 加数字，代表正则表达式中与圆括号相匹配的字表达式
- 正则表达式中是否有全局修饰符 g
  - 有：替换所有匹配的字符串
  - 没有：只替换匹配的第一个字符串

#### `String.prototype.splice(reg)`

- 参数
  - reg：正则表达式
- 返回
  - 以 reg 拆分成的各个子串的数组

### 正则表达式的字符串方法

### `RegExp.prototype.test(str)`

执行检索，查看正则表达式与指定的字符串是否匹配，返回`true`或`false`。

如果正则表达式设置了全局标志`g`，`test()`的执行会改变正则表达式`lastIndex`属性。连续的执行`test()`方法，后续的执行将会从`lastIndex`处开始匹配字符串。

#### `RegExp.prototype.exec(str)`

- 返回
  - 无匹配：返回`null`
  - 有匹配：返回`result`，结构同`String.prototype.match(reg)`方法正则无全局匹配的结果
    - `result[0]`：匹配的字符串
    - `result[1..n]`：正则表达式中用圆括号括起来的字表达式1...n
    - `result.index`：发生匹配的字符在`str`中的开始位置
    - `result.input`：所检索的字符串
    - 如果设置了全局匹配，`reg.lastIndex`将是下一次匹配开始的位置（初始为0）

#### 实例

##### 千分位表示法

```js
function thousandsFormat(str) {
    const reg = /\B(?=(?:\d{3})+$)/g
    // const reg = /(?!\b)(?=(?:\d{3})+$)/g
    return str.replace(reg, ',');
};
```

说明：

- `\B`：匹配不是单词开头或结束的位置，即非边界位置
- `(?=exp)`：零宽度正预测先行断言，如`/^Java(?=Script$)/`，匹配`JavaScript`里的`Java`，不匹配`Javascript`里的`Java`
- `(?:exp)`：匹配`exp`，但不捕获匹配的文本，也不给此分组分配组号（即仅把`exp`组合成一个整体）

非正则方法

```js
function formatCash(str) {
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev
    })
}
console.log(formatCash('1234567890')) // 1,234,567,890
```

```js
function format(num) {
  num = num + ''
  const arr = num.split('').reverse()
  for(let i = 3; i < arr.length + 1; i += 4) {
    if (arr[i] !== undefined) {
      arr.splice(i, 0, ',')
    }
  }
  return arr.reverse().join('')
}
```
