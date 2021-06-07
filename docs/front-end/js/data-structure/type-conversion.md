---
sidebarDepth: 0
---

# 类型转换

[[toc]]

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

## 如何判断参数的数据类型是给定类型

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

## 基本包装类型的转换

### Boolean()/String()/Number() 函数

当`Boolean()`作为函数调用（而不是作为构造函数）时，其作用是将传入的参数转换为布尔类型，返回的结果为布尔类型。

而作为构造函数`new Boolean()`调用时，也是将参数的参数转为布尔类型，但是返回的基本包装类型的对象。`String()`/`Number()`也是如此。

### 临时转换成基本包装类型

当在基本类型`Boolean`、`String`、`Number`上调用它们的方法时，会临时先将该基本类型转换成对应的基本包装类型对象，待操作完成后，会销毁这个基本包装类型对象，再转换成基本类型。

此外，在基本类型上调用`call`/`apply`方法也会有类似的过程。

```js
const fn = function () {
    console.log(typeof this); // object
}

fn.call(1)
fn.apply(1)
```

::: warning 注意
基本类型转换成基本包装类型时，会产生临时对象，在一些对性能要求较高的场景下，我们应该尽量避免这种转换。
:::

### 完全转换成基本包装类型

- 使用内置的`Object`函数

```js
let number = Object(1);

console.log(typeof number); // object
console.log(number instanceof Number); // true
console.log(number.constructor === Number); // true
```

- 使用`call`/`apply`强制获取基本包装类型

```js
let number = (function () {
    return this;
}).call(1);

console.log(typeof number); // object
console.log(number instanceof Number); // true
console.log(number.constructor === Number); // true
```

## 逻辑非操作符（!）

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

## 判断 == 的过程

ECMAScript 中的相等操作符由两个等于号（==）表示，如果两个操作数相等，则返回`true`。

而不相等操作符由叹号后跟不等于号（!=）表示，如果两个操作数不相等，则返回`true`。

这两个操作符可能会先转换操作数（通常称为强制转型） ，然后再比较它们的相等性。

在转换不同的数据类型时，相等和不相等操作符遵循下列基本规则（按优先级排序）：

1. `undefined == null`为`true`，若其中一个操作数是`null`或`undefined`，另一个不是，则为`false`
2. 若两个操作数是相同类型（包括基本类型和引用类型），则用严格相等`===`判断
3. 若其中一个操作数`obj`是`Object`类型，则调用`obj.toString()`或`obj.valueOf()`方法将其转换成原始值，再从第 1 步开始重新判断两个操作数
4. 将两个操作符转换成`Number`类型，再用严格相等`===`判断结果

详见[MDN - 非严格相等 ==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness#%E9%9D%9E%E4%B8%A5%E6%A0%BC%E7%9B%B8%E7%AD%89)

下表列出了一些特殊情况及比较结果：
| 表达式              | 值      |
| ------------------- | ------- |
| `null == undefined` | `true`  |
| `"NaN" == NaN`      | `false` |
| `5 == NaN`          | `false` |
| `NaN == NaN`        | `false` |
| `NaN != NaN`        | `true`  |
| `false == 0`        | `true`  |
| `true == 1`         | `true`  |
| `true == 2`         | `false` |
| `undefined == 0`    | `false` |
| `null == 0`         | `false` |
| `"5"==5`            | `true`  |

## 对象转换成原始值

详见[Object to primitive conversion](https://javascript.info/object-toprimitive)，这篇文章很短但很容易理解。

### 将对象转换成字符串

使用场景：

```js
// output
alert(obj);

// using object as a property key
anotherObj[obj] = 123;
```

转换步骤：

1. 若对象`obj`存在`Symbol.toPrimitive`方法，则调用`obj[Symbol.toPrimitive]('string')`，其一定会返回一个原始值，该原始值将被转换成字符串。
2. 否则，若对象`obj`存在`toString`方法，则调用这个方法。如果返回值是原始值，该原始值将被转换成字符串。
3. 否则，若对象`obj`存在`valueOf`方法，则调用这个方法。如果返回值是原始值，该原始值将被转换成字符串。
4. 否则，JavaScript 无法从`Symbol.toPrimitive`/`toString`/`valueOf`获得一个原始值，因此这时抛出一个类型错误异常。

### 将对象转换成数值

使用场景：

```js
// explicit conversion
let num = Number(obj);

// maths (except binary plus)
let n = +obj; // unary plus
let delta = date1 - date2;

// less/greater comparison
let greater = user1 > user2;
```

1. 若对象`obj`存在`Symbol.toPrimitive`方法，则调用`obj[Symbol.toPrimitive]('number')`，其一定会返回一个原始值，该原始值将被转换成数值。
2. 否则，若对象`obj`存在`valueOf`方法，则调用这个方法。如果返回值是原始值，该原始值将被转换成数值。
3. 否则，若对象`obj`存在`toString`方法，则调用这个方法。如果返回值是原始值，该原始值将被转换成数值。
4. 否则，JavaScript 无法从`Symbol.toPrimitive`/`valueOf`/`toString`获得一个原始值，因此这时抛出一个类型错误异常。

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

### 社区解决方案

[klona](https://github.com/lukeed/klona)，A tiny (240B to 501B) and fast utility to "deep clone" Objects, Arrays, Dates, RegExps, and more!

```js
export function klona(x) {
  if (typeof x !== 'object') return x;

  var k, tmp, str=Object.prototype.toString.call(x);

  if (str === '[object Object]') {
    if (x.constructor !== Object && typeof x.constructor === 'function') {
      // 通过非 Object 的构造函数 new 出来的对象
      tmp = new x.constructor();
      for (k in x) {
        if (tmp.hasOwnProperty(k) && tmp[k] !== x[k]) {
          tmp[k] = klona(x[k]);
        }
      }
    } else {
      // 通过 Object 构造函数 new 出来的对象（包括字面量对象）
      tmp = {}; // null
      for (k in x) {
        if (k === '__proto__') {
          Object.defineProperty(tmp, k, {
            value: klona(x[k]),
            configurable: true,
            enumerable: true,
            writable: true,
          });
        } else {
          tmp[k] = klona(x[k]);
        }
      }
    }
    return tmp;
  }

  if (str === '[object Array]') {
    k = x.length;
    for (tmp=Array(k); k--;) {
      tmp[k] = klona(x[k]);
    }
    return tmp;
  }

  if (str === '[object Set]') {
    tmp = new Set;
    x.forEach(function (val) {
      tmp.add(klona(val));
    });
    return tmp;
  }

  if (str === '[object Map]') {
    tmp = new Map;
    x.forEach(function (val, key) {
      tmp.set(klona(key), klona(val));
    });
    return tmp;
  }

  if (str === '[object Date]') {
    return new Date(+x);
  }

  if (str === '[object RegExp]') {
    tmp = new RegExp(x.source, x.flags);
    tmp.lastIndex = x.lastIndex;
    return tmp;
  }

  if (str === '[object DataView]') {
    return new x.constructor( klona(x.buffer) );
  }

  if (str === '[object ArrayBuffer]') {
    return x.slice(0);
  }

  // ArrayBuffer.isView(x)
  // ~> `new` bcuz `Buffer.slice` => ref
  if (str.slice(-6) === 'Array]') {
    return new x.constructor(x);
  }

  return x;
}
```

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
