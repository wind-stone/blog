# 字符串

## JavaScript 中字符串的转义

### 背景

在 JavaScript 中，字符串字面量是由单引号或双引号括起来的字符序列。单引号括起来的字符串字面量内可以包含双引号，但不能包含单引号；双引号括起来的字符串字面量内可以包含单引号，但不能包含双引号。

那么，如果我们想要在单引号字符串内包含单引号，或者双引号字符串内包含双引号，应该怎么做呢？

比如，我们想定义这样一个字符串，`' is a single quote, and " is a double quote.`，该字符串无论是用单引号括起来还是用双引号括起来，都会有问题。

```js
const strA = "' is a single quote, and " is a double quote."
const strB = '' is a single quote, and " is a double quote.'
```

### 特殊字符及转义

鉴于此，针对像单引号和双引号这些特殊用途的字符，或者像换行符这种非打印字符，JavaScript 允许其通过以`\`开头的转义序列的形式来代表单个字符，可以放在字符串字面量内的任意位置。

反斜线`\`在 JavaScript 字符串里具有特殊用途，它与其后的字符结合之后，就不再表示该字符的字面含义了。比如`\n`，表示的是换行符。

| 转义序列                 | 所表示的字符                      |
| ------------------------ | --------------------------------- |
| `\0`                     | 空字符                            |
| `\'`                     | 单引号                            |
| `\"`                     | 双引号                            |
| `\\`                     | 反斜杠                            |
| `\n`                     | 换行                              |
| `\r`                     | 回车                              |
| `\v`                     | 垂直制表符                        |
| `\t`                     | 水平制表符                        |
| `\b`                     | 退格                              |
| `\f`                     | 换页                              |
| `\xXX`                   | Latin-1 字符(`x`小写)             |
| `\uXXXX`                 | Unicode 基本多文种平面里的字符    |
| `\u{X}` ... `\u{XXXXXX}` | Unicode 所有 Code Point（实验性） |

`\xXX`是指在`\x`后紧跟着两个十六进制数`XX`，代表一个字符，`XX`是字符的 Unicode 码位，取值范围是`00`~`FF`，因此能输出 256 种字符，即[Latin-1 字符](https://zh.wikipedia.org/wiki/ISO/IEC_8859-1)。

`\uXXXX`是指在`\u`后紧跟着四个十六进制数`XXXX`，代表一个字符，`XXXX`是字符的 Unicode 码位，取值范围`0000`~`FFFF`，能输出[Unicode 基本多文种平面](https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%B9%B3%E9%9D%A2%E6%98%A0%E5%B0%84#%E5%9F%BA%E6%9C%AC%E5%A4%9A%E6%96%87%E7%A7%8D%E5%B9%B3%E9%9D%A2)里的字符。

举例: （可将输入复制到浏览器控制台里，打印出结果查看）

| 输入（以单引号包裹的字符串字面量） | 输出（以双引号包裹的 JavaScript 字符串） | 说明                              |
| ---------------------------------- | ---------------------------------------- | --------------------------------- |
| `'\0'`                             | `""`                                     | -                                 |
| `'\''`                             | `"'"`                                    | -                                 |
| `'\"'`                             | `"""`                                    | -                                 |
| `'\\'`                             | `"\"`                                    | -                                 |
| `'\n'`                             | `"↵"`                                    | 不可见的非打印字符，`↵`仅用于示例 |
| `'\v'`                             | `""`                                    | 不可见的非打印字符                |
| `'\t'`                             | `"	"`                                    | 不可见的非打印字符                |
| `'\x79'`                           | `"y"`                                    | -                                 |
| `'\u0079'`                         | `"y"`                                    | -                                 |
| `'\uD87E\uDC04'`                   | `"你"`                                    | -                                 |

由此可知，我们可以如下这样声明之前的那个字符串:

```js
const str = '\' is a single quote, and \" is a double quote.'
```

### JavaScript 是如何转义字符串的

上一节说明了我们可以将一些特殊字符以转义序列的形式放置在字符串中，那么 JavaScript 是如何对这类字符串进行转义的呢？

JavaScript 引擎会对代码里定义的每一个字符串字面量进行转义，将字符串字面量里的转义序列转换成其所表示的字符，最终将字符串字面量解析为 JavaScript 里字符串类型的值。

那 JavaScript 是如何处理字符串字面量里的每个字符以得到最终的 JavaScript 字符串的呢？主要分为以下几种情况。

第一种，若字符前没有反斜杠`\`，则该字符即为其本身。

```js
> 'world'
< "world"
```

第二种，若字符前有反斜杠`\`，且`\`能与该字符（或者其后多个字符）能组合成上表里的转义序列，则将`\`和该字符串转义为其所表示的字符。

```js
> 'hello, \'world\''
< "hello, 'world'"

> '\x61bcd'
< "abcd"

> '\u4f60好'
< "你好"
```

第三种，若字符串前有反斜杠`\`，且`\`与该字符（或者其后多个字符）不能组合成上表里的转义序列，且该字符不是`u`或者`x`，则将`\`和该字符串转义为该字符本身。

```js
> 'hello, \world'
< "hello, world"
```

第四种，若字符串前有反斜杠`\`，且`\`与该字符（或者其后多个字符）不能组合成上表里的转义序列，且该字符是`u`或者`x`，则会导致语法错误。

```js
> '\u'
× Uncaught SyntaxError: Invalid Unicode escape sequence

> '\u12'
× Uncaught SyntaxError: Invalid Unicode escape sequence

> '\x'
× Uncaught SyntaxError: Invalid hexadecimal escape sequence
```

以上几种情况，是笔者参考规范和实验得出的结果，其他更多的不同情况，需要详细翻阅规范和阅读 JavaScript Parser 的源码。

#### 哪些情况不需要 JavaScript 转义

之前的章节里，我们经常提到`字符串字面量`，`字符串字面量`和 JavaScript 字符串还是略有区别的。因为在字符串字面量允许使用转义序列来代表另一个字符，因此在将字符串

### 哪些场景会遇到字符串字面量的转义问题

### JSON 字符串

有效的 JSON 字符串，不能包含控制字符，否则无法通过`JSON.parse`解析。

```js
const a = '\n';
JSON.parse(`"${a}"`)
// Uncaught SyntaxError: Unexpected token
//   in JSON at position 1
//     at JSON.parse (<anonymous>)
//     at <anonymous>:1:6
```

字符串字面量`\n`经过 JavaScript 转义之后，变成单个字符即换行符`↵`（此处的字符仅用于示意，实际上换行符是不可打印字符），Unicode 码位是`\u000A`，属于控制字符。

当使用`JSON.parse`解析包含控制字符的 JSON 字符串时会报错，因为包含控制字符的字符串不是有效的 JSON 字符串。

### JSON.stringify 无法转换控制字符

参考规范文档[ECMA 262 - JSON.stringify - QuoteJSONString](https://tc39.es/ecma262/#sec-quotejsonstring)，`JSON.stringify`可以将换行符转换为`"\n"`，但是不能将行分隔符转成类似的形式，而是保持字符不变，结果为`" "`。

以下操作可以直观地看到这一事实。

```js
> a = '\n'
< "
  "
> b = JSON.stringify(a)
< ""\n""
> b.charCodeAt(0).toString(16)
< "22"
> b.charCodeAt(1).toString(16)
< "5c"
> b.charCodeAt(2).toString(16)
< "6e"
> b.charCodeAt(3).toString(16)
< "22"
```

```js
> a = '\u2028'
< " "
> b = JSON.stringify(a)
< "" ""
> b.length
< 3
> b.charCodeAt(0).toString(16)
< "22"
> b.charCodeAt(1).toString(16)
< "2028"
> b.charCodeAt(2).toString(16)
< "22"
```

注意，码位为`\u2028`的字符是非打印字符，我们能看到的可能是个类似乱码的符号。

### JSON 转义

- 通过`new RegExp(str)`构造正则表达式时
- 通过`JSON.parse(str)`解析 JSON 字符串时

参考:

- [从一个 JSON.parse 错误深入研究 JavaScript 的转义字符](https://zhuanlan.zhihu.com/p/31030352)
- [从 RegExp 构造器看 JS 字符串转义设计](https://cloud.tencent.com/developer/article/1186832)
- [ECMA 262 - JSON.stringify - QuoteJSONString](https://tc39.es/ecma262/#sec-quotejsonstring)
- [ECMA 262 - JSON.parse](https://tc39.es/ecma262/#sec-json.parse)
- [Standard ECMA-404 The JSON Data Interchange Syntax](https://www.ecma-international.org/publications/standards/Ecma-404.htm)
