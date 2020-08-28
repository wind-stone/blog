---
sidebarDepth: 0
---

# 数据结构

[[toc]]

## 系列文章

- `Number`
  - [JavaScript 关于 IEEE 754 双精度浮点数的实现](/front-end/js/data-structure/js-number-implementation.html)

## 基本数据类型

| 数据类型    | `Object.prototype.toString().call(value)` | `typeof value` |
| ----------- | ----------------------------------------- | -------------- |
| `Number`    | `[object Number]`                         | `number`       |
| `Boolean`   | `[object Boolean]`                        | `boolean`      |
| `String`    | `[object String]`                         | `string`       |
| `null`      | `[object Null]`                           | `object`       |
| `undefined` | `[object Undefined]`                      | `undefined`    |
| `Symbol`    | `[object Symbol]`                         | `symbol`       |

## 引用数据类型

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

## 类型判断及转换

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

### Boolean()/String()/Number() 函数

当`Boolean()`作为函数调用（而不是作为构造函数）时，其作用是将传入的参数转换为布尔类型，返回的结果为布尔类型。而作为构造函数`new Boolean()`调用时，也是将参数的参数转为布尔类型，但是返回的结果是对象，即引用类型。`String()`/`Number()`也是如此。

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
| 表达式            | 值    |
| ----------------- | ----- |
| null == undefined | true  |
| "NaN" == NaN      | false |
| 5 == NaN          | false |
| NaN == NaN        | false |
| NaN != NaN        | true  |
| false == 0        | true  |
| true == 1         | true  |
| true == 2         | false |
| undefined == 0    | false |
| null == 0         | false |
| "5"==5            | true  |

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

## 浅拷贝 VS 深拷贝

### 浅拷贝

```js
function shallowClone(source) {
  const res = {}
  for (const i in source) {
    if (source.hasOwnProperty(i)) {
      res[i] = source[i]
    }
  }
}
```

### 最简单的深拷贝

```js
function clone(source) {
  if (!isObject(source) && !isArray(source)) {
    return source
  }
  let res;
  if (isArray(source)) {
    res = []
    source.forEach(function (val, idx) {
      res[idx] = clone(val)
    })
  } else {
    res = {}
    for (const i in source) {
      const val = source[i]
      if (source.hasOwnProperty(i)) {
        res[i] = clone(val)
      }
    }
  }
  return res
}

function isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]'
}
function isArray(x) {
  return Array.isArray(x)
}
```

存在的问题：

- 当数据层级过深，容易造成栈溢出
- 无法解决循环引用的问题

### JSON 深拷贝

```js
function JSONClone(source) {
  return JSON.parse(JSON.stringify(source))
}
```

存在的问题：

- 当数据层级过深，容易造成栈溢出（`JSON.stringify`内部也是使用递归的方式）
- 无法解决循环引用的问题（但是`JSON.stringify`内部会做循环引用检测，并抛错提示）

### 终极深拷贝

终极的深拷贝，做出了如下修改：

- 用循环代替递归
- 增加已拷贝检测，防止循环拷贝
- 增加拷贝前与拷贝后的关联，避免引用丢失

```js
// 保持引用关系
function cloneForce(x) {
    const uniqueList = []; // 用来去重
    let root = {};
    // 循环数组
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x,
        }
    ];
    while(loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = {};
        }

        // 数据已经存在
        let uniqueData = find(uniqueList, data);
        if (uniqueData) {
            parent[key] = uniqueData.target;
            continue; // 中断本次循环
        }

        // 数据不存在
        // 保存源数据，在拷贝数据中对应的引用
        uniqueList.push({
            source: data,
            target: res,
        });

        for(let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    // 下一次循环
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k],
                    });
                } else {
                    res[k] = data[k];
                }
            }
        }
    }

    return root;
}

function find(arr, item) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i];
        }
    }

    return null;
}
```

Reference: [颜海镜 - 深拷贝的终极探索](https://yanhaijing.com/javascript/2018/10/10/clone-deep/)

## 序列化 & 反序列化

### eval

`stringify`是将给定数据字符串化，可利用`eval`转换为原来的数据类型。

```js
function stringify(source) {
    if (source === undefined ||
        source === null ||
        // 这里不能使用 isNaN，有坑：isNaN({}) // true
        Number.isNaN(source)) {
        return String(source)
    }
    const type = getPrototypeType(source)
    switch(type) {
        case 'Boolean': {
            return Boolean(source)
        }
        case 'Number': {
            return Number(source)
        }
        case 'String': {
            return `'${String(source)}'`
        }
        case 'Object': {
            let res = '{'
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    res += `${key}: ${stringify(source[key])}, `
                }
            }
            return (res.length === 1 ? res : res.slice(0, -2)) + '}'
        }
        case 'Array': {
            let res = '['
            source.forEach(function (val, idx) {
                res += stringify(val) + ', '
            });
            return (res.length === 1 ? res : res.slice(0, -2)) + ']'
        }
        case 'RegExp': {
            return `new RegExp(${source})`
        }
        case 'Date': {
            return `new Date(${source.getTime()})`
        }
    }
}

function parse(string) {
    // 针对“对象”对面量，需要用()包起来，防止{}被当做块作用域解析
    return eval(`(${string})`)
}

const typeReg = /^\[object (\w+)\]$/
function getPrototypeType(x) {
    const type = Object.prototype.toString.call(x)
    return type.match(typeReg)[1]
}

// 验证
console.log('Number', parse(stringify(1)))
console.log('String', parse(stringify('2')))
console.log('Boolean', parse(stringify(false)))
console.log('RegExp', parse(stringify(/abc\w\n/gim)))
console.log('Date', parse(stringify(new Date())))
console.log('Undefined', parse(stringify(undefined)))
console.log('null', parse(stringify(null)))
console.log('NaN', parse(stringify(NaN)))
console.log('Object', parse(stringify({
    a: undefined,     // Undefined
    b: null,          // null
    c: 1,             // Number
    d: '2',           // String
    e: true,          // Boolean
    f: NaN,           // NaN
    g: {              // Object
        hello: 'world'
    },
    h: [1, 2, 3],     // Array
    i: /abc/img,      // RegExp
    j: new Date()     // Date
})))
console.log('Array', parse(stringify([1, 2, 3])))
```
