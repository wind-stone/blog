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
            return res.slice(0, -2) + '}'
        }
        case 'Array': {
            let res = '['
            source.forEach(function (val, idx) {
                res += stringify(val) + ', '
            });
            return res.slice(0, -2) + ']'
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
