# 数据类型分类

## 基本数据类型

数据类型 | `Object.prototype.toString().call(value)` | `typeof value`
--- | --- | ---
`Number` | `[object Number]` | `number`
`Boolean` | `[object Boolean]` | `boolean`
`String` | `[object String]` | `string`
`null` | `[object Null]` | `object`
`undefined` | `[object Undefined]` | `undefined`
`Symbol` | `[object Symbol]` | `symbol`


## 引用数据类型

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


## 返回给定参数的类型

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


## 如何判断参数的数据类型是给定类型？

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
