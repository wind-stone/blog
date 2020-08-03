# 微信小程序接口返回数据包含行分隔符导致 JSON.parse 解析错误问题的探究

## 背景

我们知道，`wx.request`请求参数里的`dataType`默认是`json`，意味着我们期望接口返回的数据格式是`json`，且系统会对返回的数据进行一次`JSON.parse`。如果接口返回的是个 JSON 的`object`，那么最终我们拿到的`res.data`应该是个 JavaScript 对象。

假设微信小程序项目里有以下代码: 请求`http://windstone.cc/test`接口，且假设接口返回的数据里包含了行分隔符（`U+2028`）。

```js
wx.request({
    url: 'http://windstone.cc/test',
    success(res) {
        let data = res.data;
        console.log('typeof data', typeof data);
        if (typeof data === 'string') {
          for(let i = 0; i < data.length; i++) {
            console.log('字符是 ', data[i], 'Unicode 是 ', data[i].codePointAt(0).toString(16));
          }
        }
    }
})
```

为了模拟接口返回里包含行分隔符的场景，我们将`http://windstone.cc/test`请求通过 Charles 的 Map Local 功能映射到如下所示的本地 JSON 文件上。其中`x`属性的值是个仅包含单个行分隔符的字符串，该行分隔符的 Unicode 表示为`U+2028`。PS: 行分隔符是不可见字符，你可能看到的是个乱码字符，或者是个换行。

```json
{"x":" "}
```

在微信开发者工具中运行以上代码，会打印出如下数据:

```js
typeof data object
```

这表明接口返回的数据经过系统的`JSON.parse`后，`success`回调里接收到的`res.data`是个 JavaScript 对象，这完全符合我们的预期。

同样，我们在 iOS 手机中运行以上代码，结果却打印出了如下数据:

```js
typeof res.data string
字符是  { Unicode 是  7b
字符是  " Unicode 是  22
字符是  x Unicode 是  78
字符是  " Unicode 是  22
字符是  : Unicode 是  3a
字符是  " Unicode 是  22
字符是
Unicode 是  a
字符是  " Unicode 是  22
字符是  } Unicode 是  7d
```

`res.data`返回的竟是个字符串！更加诡异的是，这个字符串居然跟接口返回的 JSON 数据有稍微的不同：字符串里的行分隔符（`U+2028`）不见了，原先行分隔符对应的位置上，新出现了个换行符！（行分隔符的 Unicode 表示为`U+000A`，其码位的 16 进制表示为`a`，而行分隔符的码位的 16 进制表示为`2028`）

这似乎与我们以前的开发经验有些相悖，而在此场景里，唯一与我们以前的开发场景不一样的地方是：接口返回的数据里包含了行分隔符。

于是，我们将返回数据修改成`{"x":1}`以验证是否是行分隔符搞的鬼。结果正如我们所预期的，修改之后，无论是在微信开发者工具上还是 iOS 手机上，打印的都是`typeof data object`。

## 进一步探究

基于以上的测试，我们猜测，若接口返回数据里包含了行分隔符，则在将返回数据进行自动`JSON.parse`时会出错，导致最终返回的`res.data`为未经解析的字符串，且该字符串里的行分隔符会被替换为换行符（Unicode 表示为`U+000A`）。

为了进一步探究出现这种情况的原因以及验证我们的猜测，我们将`wx.request`的代码稍加修改，将返回的数据格式由默认的`json`改为`text`，如此系统就不会自动对返回的数据进行`JSON.parse`。此外，我们再添加一些代码，来尝试手动进行`JSON.parse`并打印一些调试信息。

```js
wx.request({
    url: 'http://windstone.cc/test',
    dataType: 'text', // 设置返回的数据格式为 text
    success(res) {
        let data = res.data;
        console.log('typeof data', typeof data);
        if (typeof data === 'string') {
          for(let i = 0; i < data.length; i++) {
            console.log('字符是 ', data[i], 'Unicode 是 ', data[i].codePointAt(0).toString(16));
          }

          // 尝试进行 JSON.parse
          try {
            data = JSON.parse(data);
            console.log('JSON.parse 解析成功', data);
            console.log('x 值的 Unicode 是 ', data.x.codePointAt(0).toString(16));
          } catch(err) {
            console.log('JSON.parse 解析失败', err);
          }
        }
    }
})
```

运行以上代码，在微信开发者工具中，会打印出如下数据:

```js
typeof res.data string
字符是  { Unicode 是  7b
字符是  " Unicode 是  22
字符是  x Unicode 是  78
字符是  " Unicode 是  22
字符是  : Unicode 是  3a
字符是  " Unicode 是  22
字符是   Unicode 是  2028
字符是  " Unicode 是  22
字符是  } Unicode 是  7d
JSON.parse 解析成功 {x: " "}
x 值的 Unicode 是  2028
```

通过打印结果可以发现，微信开发者工具中，返回的`text`格式数据里的行分隔符并没有被替换，且能正常进行`JSON.parse`，解析后的对象里，`x`的值仍是个包含单个行分隔符的字符串。

但是在 iOS 手机中，会打印出如下数据:

```js
typeof res.data string
字符是  { Unicode 是  7b
字符是  " Unicode 是  22
字符是  x Unicode 是  78
字符是  " Unicode 是  22
字符是  : Unicode 是  3a
字符是  " Unicode 是  22
字符是
Unicode 是  a
字符是  " Unicode 是  22
字符是  } Unicode 是  7d
JSON.parse 解析失败 <SyntaxError: JSON Parse error: Unterminated string>
```

打印结果显示，iOS 手机中，返回的`text`格式数据`res.data`里的行分隔符被替换成了换行符，而且`JSON.parse`也会失败。

这个实验验证了，当我们拿到`res.data`时，返回数据里的行分隔符已经被替换成了换行符，而之所以`JSON.parse`解析失败，也是因为要解析的字符串里包含了换行符。

鉴于此，我们还要继续弄清楚两个问题:

1. 为什么 iOS 手机上接口返回的数据里，行分隔符会被替换为换行符?
2. 为什么包含了换行符的字符串在进行`JSON.parse`时会报错？

弄清楚这两个问题之后，我们还需要解决一个问题，如何将`res.data`进行正确的`JSON.parse`？

## 原理解析

### 行分隔符被替换成换行符

针对第一个问题，[ECMAScript Language Specification Edition 3 Final](https://www-archive.mozilla.org/js/language/E262-3.pdf)的`7.3 Line Terminators`章节描述如下：

> Like white space characters, line terminator characters are used to improve source text readability and to separate
tokens (indivisible lexical units) from each other. However, unlike white space characters, line terminators have
some influence over the behaviour of the syntactic grammar. In general, line terminators may occur between any
two tokens, but there are a few places where they are forbidden by the syntactic grammar. A line terminator cannot
occur within any token, not even a string. Line terminators also affect the process of automatic semicolon insertion
(section 7.8.5).
>
> The following characters are considered to be line terminators:

| Code Point Value | Name                | Formal Name |
| ---------------- | ------------------- | ----------- |
| `\u000A`         | Line Feed           | `<LF>`      |
| `\u000D`         | Carriage Return     | `<CR>`      |
| `\u2028`         | Line separator      | `<LS>`      |
| `\u2029`         | Paragraph separator | `<PS>`      |

ES3 规范里说，`U+2028`和`U+2029`是行终止符，不能位于任何`token`之内，也不能出现在字符串之内。

[Javascript parse error on '\u2028' unicode character](https://stackoverflow.com/questions/2965293/javascript-parse-error-on-u2028-unicode-character)这篇文章里提到，JavaScript parser 针对任何未编码的`U+2028`和`U+2029`，都以换行符对待。

目前我还没找到 iOS 系统里的 JavaScriptCore 将`U+2028`和`U+2029`替换为换行符的规格文档，但是在[ECMAScript Language Specification Edition 3 Final](https://www-archive.mozilla.org/js/language/E262-3.pdf)的`7.8.4 String Literals`章节底部，有这么一句话:

> **NOTE** A LineTerminator character cannot appear in a string literal, even if preceded by a backslash \. The correct way to cause
a line terminator character to be part of the string value of a string literal is to use an escape sequence such as \n or \u000A.

根据这句话，JavaScriptCore 将`U+2028`和`U+2029`替换为换行符也是说得通的。

因此，iOS 系统里的 JavaScriptCore 可能仍然是按 ES3 的规范来处理行分隔符的，将其替换成了换行符，而且是在我们拿到`res.data`字符串之前。所以我们拿到`res.data`字符串时，字符串里已经没有行分隔符了，有的只是换行符。

::: tip 提示
在最新的[ECMA-262 11th Edition](https://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)规范里，为了与 JSON 保持一致，允许`U+2028`和`U+2029`出现在字符串里。
:::

参考文档:

- [ECMAScript Language Specification Edition 3 Final](https://www-archive.mozilla.org/js/language/E262-3.pdf)
- [ECMA-262 11th Edition](https://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
- [Javascript parse error on '\u2028' unicode character](https://stackoverflow.com/questions/2965293/javascript-parse-error-on-u2028-unicode-character)
- [JSON: The JavaScript subset that isn't](http://timelessrepo.com/json-isnt-a-javascript-subset)
- [MDN - JSON.stringify - Issue with plain JSON.stringify for use as JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Issue_with_plain_JSON.stringify_for_use_as_JavaScript)

### 含有换行符的字符串 JSON.parse 出错

既然 JavaScriptCore 已经将行分隔符替换为了换行符，为什么仍然不可以`JSON.parse`呢？

查看 JSON 规范可知，JSON 字符串里的值可以是`object`、`array`、`number`、`string`、`true`、`false`、`null`。

接口返回的字符串经过上一步的替换后变成这样: `{"x":"↵"}`。（`↵`仅作为换行符的示意，实际上换行符是不可见的控制字符，无法显示在页面上）

如果`{"x":"↵"}`这个字符串是个有效的能被解析的 JSON 字符串，则整个字符串是就个 JSON 的`object`，`object`里有个`x`属性，其是个包含了单个换行符`string`。但是，问题就出在这里，`"↵"`不是个有效的 JSON `string`。

![JSON string](./images/json-string.png)

> A string is a sequence of Unicode code points wrapped with quotation marks (U+0022). All code points may be placed within the quotation marks except for the code points that must be escaped: quotation mark(U+0022), reverse solidus (U+005C), and the control characters U+0000 to U+001F. There are two-character escape sequence representations of some characters.
>
> `\"` represents the quotation mark character (U+0022).
>
> `\\` represents the reverse solidus character (U+005C).
>
> `\/` represents the solidus character (U+002F).
>
> `\b` represents the backspace character (U+0008).
>
> `\f` represents the form feed character (U+000C).
>
> `\n` represents the line feed character (U+000A).
>
> `\r` represents the carriage return character (U+000D).
>
> `\t` represents the character tabulation character (U+0009).

按照[Standard ECMA-404 The JSON Data Interchange Syntax](https://www.ecma-international.org/publications/standards/Ecma-404.htm)里的规定，有效的 JSON `string`要求放置在两个`"`之间，且：

- `"`和`\`不能单独出现在两个`"`之内，需要使用`\`对其进行转义，比如`\"`表示单个`"`字符，`\\`表示单个`\`字符。
- `\`后紧跟着`/`、`b`、`f`、`n`、`r`、`t`也都各自表示特殊的字符。
- 两个`"`之内不能出现控制字符（Unicode 表示在`U+0000`~`U+001F`区间）

而 Unicode 表示为`U+000A`的换行符`↵`就是控制字符。因此，`"↵"`不是个有效的 JSON `string`，进而`{"x":"↵"}`不是个有效的 JSON `object`，最终导致 JSON.parse 失败。

说了这么多，不如用更简单的方式验证一下，在浏览器控制台输入以下代码观看结果:

```js
const a = '{"x":"\n"}'
JSON.parse(a)
// Uncaught SyntaxError: Unexpected token
// in JSON at position 6
//     at JSON.parse (<anonymous>)
//     at <anonymous>:2:6
```

由于字符串字面量要经过一层 JavaScript 解析，因此`{"x":"\n"}'`经过 JavaScript 解析后，就变成了字符串`{"x":"↵"}`，而在将其`JSON.parse`时就报错了，提示`↵`是个不期望出现的`token`。

因此，之所以在对包含换行符的字符串进行`JSON.parse`时会出错，是因为换行符属于控制字符，包含换行符的字符串不是有效的 JSON 字符串，不能被成功解析。

现在，现象与原理我们都弄清楚了，下一步要做的就是如何正确地包含换行符的返回数据进行`JSON.parse`了。

## 解决方案

再次查看下 JSON 规范里的`string`，其不允许两个`"`之间出现控制字符，但其又说`\n`代表的是个换行符，这也就说，`\n`会在`JSON.parse`时被解析成换行符。

因此，我们在`JSON.parse`之前，先通过正则匹配到换行符，将换行符替换为`\n`，就可以顺利进行`JSON.parse`了。

```js
wx.request({
    url: 'http://windstone.cc/test',
    dataType: 'text', // 设置返回的数据格式为 text
    success(res) {
        let data = res.data;
        if (typeof data === 'string') {
          data = data.replace(/\n/g, '\\n'); // 此处将换行符替换成 \\n，即可顺利解析
          try {
            data = JSON.parse(data);
          } catch(err) {
            console.log('JSON.parse 解析失败', err);
          }
        }
    }
})
```

这里要注意的是，`\\n`是个字符串字面量，会先被 JavaScript 解析得到`\n`，再替换换行符。替换后的`data`即为`{"x":"\n"}`，经过`JSON.parse`之后，即可得到 JavaScript 对象`{x: '↵'}`

## 环境说明

- 本文里测试的 iOS 手机是 iPhone XS MAX 和 iPhone 11 Pro MAX，微信版本都是 7.0.14。
- 本文描述的问题只出现在 iOS 手机上，Android 手机没问题。
