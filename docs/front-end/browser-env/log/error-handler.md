# JS 错误处理

[[toc]]

## 错误分类

## try catch

`try...catch`无法捕获异步错误和语法错误。

```js
window.onerror = err => {
    console.log('全局捕获错误', err)
}

// 测试异步错误
try {
    let x = 1;
    setTimeout(() => {
        x = x + y
    })
} catch (err) {
    console.log('异步错误', err)
}
// 抛错: Uncaught ReferenceError: y is not defined


// 测试语法错误
try {
    const a = '1;
} catch(err) {
    console.log('语法错误', err)
}

// 抛错: Uncaught SyntaxError: Invalid or unexpected token
```

## JavaScript 运行时错误

当 JavaScript 运行时错误（包括语法错误）发生时，`window`会触发一个[`ErrorEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/ErrorEvent)接口的`error`事件，并执行`window.onerror()`。

### 语法

#### window.onerror

```js
window.onerror = function(
    message,
    source,
    lineno,
    colno,
    error
) {
    // ...
}
```

- `message`：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
- `source`：发生错误的脚本URL（字符串）
- `lineno`：发生错误的行号（数字）
- `colno`：发生错误的列号（数字）
- `error`：Error对象（对象）

若该函数返回`true`，则阻止执行默认事件处理函数。

#### window.addEventListener('error')

```js
window.addEventListener('error', function(event) { ... })
```

[`ErrorEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/ErrorEvent)类型的`event`包含有关事件和错误的所有信息。

#### element.onerror

`element.onerror`使用单一[Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)参数的函数作为其处理函数。

### 注意事项

当加载自[不同域](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)的脚本中发生语法错误时，为避免信息泄露（参见[bug 363897](https://bugzilla.mozilla.org/show_bug.cgi?id=363897)），语法错误的细节将不会报告，而代之简单的"Script error."。在某些浏览器中，通过在`<script>`使用`crossorigin`属性并要求服务器发送适当的 CORS HTTP 响应头，该行为可被覆盖。一个变通方案是单独处理"Script error."，告知错误详情仅能通过浏览器控制台查看，无法通过 JavaScript 访问。

```js
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};
```

当使用行内HTML标签（`<body onerror="alert('an error occurred')">`）时，HTML规范要求传递给`onerror`的参数命名为`event`、`source`、`lineno`、`colno`、`error`。针对不满足此要求的浏览器，传递的参数仍可使用`arguments[0]`到`arguments[2]`来获取。

## Reference

- 本文主要内容 copy 自[GlobalEventHandlers.onerror](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror)
