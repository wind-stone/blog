# script 元素

## script 元素内的脚本执行

在页面执行`script`元素内的脚本内容时，通过`document.getElementsByTagName('script')`获取所有`script`标签，只能获得已经执行和正在执行的`script`元素，而当前正在执行的`script`元素之后的其他`script`元素都无法获取。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <title>script 测试</title>
    </head>
    <body>
        <script id="script-0">
          console.log('第一个 script');
        </script>
        <script id="script-1" type="text/javascript" data-hello="您好！" src="./outer.js"></script>
        <script id="script-2">
          console.log('inline script \n')
          var scripts2 = document.getElementsByTagName('script');

          [...scripts2].forEach(script => {
            console.log('  ', script.id)
          })
        </script>
    </body>
</html>
```

```js
// outer.js
console.log('outer script \n')
var scripts = document.getElementsByTagName('script');

[...scripts].forEach(script => {
  console.log('  ', script.id)
})
```

```js
// 页面加载并执行后的结果：

// 第一个 script
// outer script
//  script-0
//  script-1
// inline script
//  script-0
//  script-1
//  script-2
```

我们知道，浏览器里 JavaScript 脚本的执行是单线程的，而`script`元素的执行也是从上而下的。

在上面的示例里，当`outer.js`加载并执行时，获取整个文档里`script`的数量，只有 2 个，即`script-0`和`script-1`，而不能获取到内联脚本`script-2`。

这种情况，跟将`script`元素放在`body`元素内的头部位置，并在`script`里获取其之后的元素但获取不到的情况是一样的，因为此时后面的 DOM 元素还没有渲染出来。

## 获取 script 元素的特性

在示例里，我们为了打印方便，给每个`script`标签添加了`id`特性。但是在实际项目里，某个外链的`script`可能想获取到该`script`元素上的所有特性，但不是通过`id`的方式（除非第三方外链脚本强制要求调用者在`script`元素上添加特定`id`特性）。

```html
<script id="script-1" type="text/javascript" data-hello="您好！" src="./outer.js"></script>
```

针对上面这种情况，我们可以这样做:

```js
var scripts = document.getElementsByTagName('script');

var self = scripts[scripts.length - 1];

[...self.attributes].forEach(attr => {
  console.log(`name: ${attr.name}, value: ${attr.value}`)
})

// 打印结果：
// name: id, value: script-1
// name: type, value: text/javascript
// name: data-hello, value: 您好！
// name: src, value: ./log.js
```
