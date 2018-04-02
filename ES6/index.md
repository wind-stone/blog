## 需要经常使用的方法


### 字符串

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
`str.codePointAt()` | ES6 | 返回一个字符的码点 | 能够正确处理 4 个字节储存的字符（（Unicode 码点大于`0xFFFF`的字符））
`String.fromCodePoint()` | ES6 | 从码点返回对应字符 | 可以识别大于`0xFFFF`的字符，弥补了String.fromCharCode方法的不足
`for (let ch of str)` | ES6 | 字符串的遍历器接口 |
`str.at()` | 提案 | 返回对应位置的字符 | 可以识别 Unicode 编号大于`0xFFFF`的字符，
`str.normalize()` | ES6 | 将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化 |
`str.includes()` | ES6 | 返回布尔值，表示是否找到了参数字符串 | 支持第二个参数，表示开始搜索的位置
`str.startsWith()` | ES6 | 返回布尔值，表示参数字符串是否在原字符串的头部 | 支持第二个参数，表示开始搜索的位置
`str.endsWith()` | ES6 | 返回布尔值，表示参数字符串是否在原字符串的头部 | 支持第二个参数，表示开始搜索的位置，针对前 n 个字符
`str.repeat()` | ES6 | 返回一个新字符串，表示将原字符串重复n次。 |
`str.matchAll()` | ES6 |  |
`str.padStart()` | ES2017 | 返回一个新字符串，表示将原字符串重复n次。 |
`str.padEnd()` | ES2017 | 某个字符串不够指定长度，会在头部补全 |
模板字符串 | | |
`String.raw()` | ES6 | 返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串 |


### 数值

- Number 方法上新增的静态方法

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
`Number.isFinite()` | ES6 | 检查一个数值是否为有限的（finite），即不是`Infinity` | 如果参数类型不是数值，一律返回`false`
`Number.isNaN()` | ES6 | 检查一个值是否为`NaN` | 如果参数类型不是数值，一律返回`false`
`Number.parseInt()` | ES6 | 同全局方法`parseInt()` | 减少全局性方法，使得语言逐步模块化
`Number.parseFloat()` | ES6 | 同全局方法`parseFloat()` | 减少全局性方法，使得语言逐步模块化
`Number.isInteger()` | ES6 | 判断一个数值是否为整数 | 如果参数不是数值，返回`false`
`Number.EPSILON` | ES6 | 常量，JavaScript 能够表示的最小精度 | 对于 64 位浮点数来说，就等于 2 的 -52 次方
`Number.MAX_SAFE_INTEGER` | ES6 | 常量，最大安全整数 | 值为`Math.pow(2, 53) - 1`，即 9007199254740991
`Number.MIN_SAFE_INTEGER` | ES6 | 常量，最小安全整数 | 值为`-Math.pow(2, 53) + 1`，即 -9007199254740991
`Number.isSafeInteger()` | ES6 | 判断整数是否在最大最小安全整数之间，即在`-2^53`到`2^53`之间（不含两个端点）之间 | 如果参数不是整数，一律返回`false`


- Math 方法上新增的静态方法

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
`Math.trunc()` | ES6 | 去除一个数的小数部分，返回整数部分 | 对于非数值，`Math.trunc`内部使用`Number`方法将其先转为数值；对于空值和无法截取整数的值，返回`NaN`
`Math.sign()` | ES6 | 判断一个数到底是正数、负数、还是零 | 对于非数值，会先将其转换为数值。
`Math.cbrt()` | ES6 | 计算一个数的立方根 | 对于非数值，`Math.cbrt`方法内部也是先使用`Number`方法将其转为数值
`Math.clz32()` | ES6 | 返回一个数的 32 位无符号整数形式有多少个前导 0 |
`Math.imul()` | ES6 | 返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。 |
`Math.fround() ` | ES6 | 返回一个数的 32 位单精度浮点数形式 |
`Math.hypot()` | ES6 | 返回所有参数的平方和的平方根 |
`Math.expm1()` | ES6 | 返回 `Math.exp(x) - 1` |
`Math.log1p()` | ES6 | 返回`1 + x`的自然对数，即`Math.log(1 + x)` |
`Math.log10()` | ES6 | 返回以 10 为底的 x 的对数 |
`Math.log2()` | ES6 | 返回以 2 为底的x的对数 |
`Math.sinh(x)` | ES6 | 返回 x 的双曲正弦（hyperbolic sine） |
`Math.cosh(x)` | ES6 | 返回 x 的双曲余弦（hyperbolic cosine） |
`Math.tanh(x)` | ES6 | 返回 x 的双曲正切（hyperbolic tangent） |
`Math.asinh(x)` | ES6 | 返回 x 的反双曲正弦（inverse hyperbolic sine） |
`Math.acosh(x)` | ES6 | 返回 x 的反双曲余弦（inverse hyperbolic cosine） |
`Math.atanh(x)` | ES6 | 返回 x 的反双曲正切（inverse hyperbolic tangent） |


- 新增的运算符

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
`**` | ES6 | 指数运算符 | `2 ** 2 // 4`
`**=` | ES6 | 指数运算符可以与等号结合，形成一个新的赋值运算符 | `b **= 3; // 等同于 b = b * b * b;`


### 数组

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
`Array.isArray` | ES5 | 判断参数是否是数组 |
`...`（扩展运算符） | ES6 | 将数组转为用逗号分隔的参数序列 | 注意与函数的`rest`参数区分开
`Array.from()` | ES6 | 将两类对象（类似数组的对象、可遍历的对象）转为真正的数组 | 1、可遍历的对象包括 ES6 新增的数据结构 Set 和 Map；2、该方法可以接受第二、三个参数
`Array.of()` | ES6 | 将一组值转换为数组 | `Array.of(3, 11, 8) // [3,11,8]`
`array.copyWithin()` | ES6 | 在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组 | 调用该方法会修改当前数组
`array.find(fn)` | ES6 | 找出第一个符合条件的数组成员 | 类似于`some`，但是会返回匹配的元素
`array.findIndex(fn)` | ES 2015 | 找出第一个符合条件的数组索引 | 类似于`some`，但是会返回匹配的元素的索引
`array.fill()` | ES6 | 将数组所有元素替换成给定值 | 第二、三个参数指定替换的起始结束位置
`array.entries()` | ES6 | 遍历数组的键值对，返回遍历器对象 |
`array.keys()` | ES6 | 遍历数组的键名，返回遍历器对象 |
`array.values() ` | ES6 | 遍历数组的键值，返回遍历器对象 |
`array.includes()` | ES2016 | 检测数组是否包含给定的值，返回布尔值 | 类似字符串的`includes`方法

注意：

- 使用这些方法时，请详细[查阅文档](http://es6.ruanyifeng.com/#docs/array)，方法可能存在多个参数的情况
- 数组里避免使用[空位](http://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E7%9A%84%E7%A9%BA%E4%BD%8D)


### 正则表达式

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
`new RegExp(/xyz/, 'i')` | ES6 | 构造函数第一个参数是一个正则对象，那么可以使用第二个参数指定修饰符 | 返回的正则表达式会忽略原有的正则表达式的修饰符，只使用新指定的修饰符（ES5 不允许第一个参数是正则对象时，存在第二个参数）
`RegExp.prototype[Symbol.match]` | ES6 | 对应`String.prototype.match` |
`RegExp.prototype[Symbol.replace]` | ES6 | 对应`String.prototype.replace` |
`RegExp.prototype[Symbol.search]` | ES6 | 对应`String.prototype.search` |
`RegExp.prototype[Symbol.split]` | ES6 | 对应`String.prototype.split` |
`u`修饰符 | ES6 | 正确处理四个字节的 UTF-16 编码 |
`y`修饰符 | ES6 | “粘连”（sticky）修饰符，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始 |
`reg.sticky` | ES6 | 正则对象是否设置了`y`修饰符 |
`reg.flags` | ES6 | 返回正则表达式的修饰符 |
`s`修饰符 | ES6 | `s`修饰符，使得`.`可以匹配任意单个字符 |
`(?<=)` | ES6 | 后行断言 |
`(?<!)` | ES6 | 后行否定断言 |
`\p{...}`/`\P{...}` | ES6 | 允许正则表达式匹配符合 Unicode 某种属性的所有字符 |
具名组匹配 | ES6 | 允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用 |


### 函数

项目 | ECMAScript 版本 | 用途 | 说明
--- | --- | --- | ---
函数参数的默认值 | ES6 | |
`fn.length` | ES6 | 返回没有指定默认值的参数个数 | 如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数
`...values`（`rest`参数） | ES6 | 获取函数的多余参数，`values`是参数数组 | 仅用于函数声明时，注意与数组的扩展运算符的区别
`=>`（箭头函数） | ES6 | 箭头函数没有自己的`this`，使用的是外部的`this` | 尽量使用箭头函数
`::`（双冒号运算符） | 提案 | “函数绑定”运算符，用来取代`call`、`apply`、`bind`调用 | 示例：`foo::bar;`等同于`bar.bind(foo);`
尾调用优化 | ES6 |  | ES6 第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存。
函数参数的尾逗号 | ES2017 | 函数的最后一个参数有尾逗号 |


### 对象
