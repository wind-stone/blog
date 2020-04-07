# 浏览器

## 关于 JS 文件和 CSS 文件加载和执行是否阻塞页面解析和渲染的问题

以下讨论的 JS/CSS 文件都是指页面里同步的 JS/CSS 文件。

- CSS 文件加载会阻塞页面渲染
- JS 文件的加载和执行，会阻塞其后 DOM 节点的解析和渲染
  - `<script>`标签里的 JS 代码执行完，才会继续解析之后的 DOM；一个常见的应用是，`<script>`里的代码执行时，查询到的最后一个`<script>`标签即是代码所在的`<script>`标签对应的 DOM 节点。

```js
const scripts = document.getElementsByTagName('script');
// 当前代码所在 script 标签对应的 DOM 节点
const currentScript = scripts[scripts.length - 1];
// 获取 script 标签上的 attributes
// ...
```

### 为什么要将 JS 文件放在文档底部

先说结论：JS 文件的加载和执行，会阻塞 JS 文件之后 DOM 节点的解析和渲染，但不会影响其之前 DOM 节点的解析和渲染，因此要将 JS 文件放到页面尽可能底部的地方。

但是要完全弄明白这个问题，就要深究以上的结论。

首先，JS 文件的加载和执行，为什么会阻塞其之后 DOM 节点的解析和渲染呢？这完全是历史原因。以前的 JS 经常在执行的时候运行`document.write`（往文档里插入内容），这可能会导致其后 DOM 完全发生变化，因此无法安全地在 JS 执行的同时来渲染 DOM。

::: tip 相关知识点
`document.write`方法将一个文本字符串写入一个由`document.open()`打开的文档流（document stream）。

若向一个已经加载且没有调用过`document.open()`的文档写入数据时，会自动调用`document.open`。一旦完成了数据写入，建议调用`document.close()`，以告诉浏览器当前页面已经加载完毕。写入的数据会被解析到文档结构模型（DOM）里，完全覆盖当面的文档（即`<html>`标签内的内容都被替换）。

若`document.write`是在页面的`<script></script>`里同步调用的（说明当前文档还未完成加载），则它将不会自动调用`document.open()`，且此时通过`document.write`写入的内容会追加在当前文档里。
:::

现在的浏览器都支持`async`或者`defer`属性了，说明脚本非阻塞其实一点问题都没有，而脚本阻塞就是历史原因导致的兼容性问题。

正是因为 JS 文件的加载和执行会阻塞其后 DOM 节点的解析和渲染，因此若是将 JS 文件置于文档顶部会导致首屏白屏时间增加；置于文档中部，可能会导致页面只渲染一部分后阻塞渲染后一部分。因此，将 JS 文件置于文档尽可能底部的地方是最优的方式。

### 为什么要将 CSS 文件放在文档顶部

### CSS 的加载可能阻塞 DOM 的解析吗

```html
<html>
    <head>
        <style type="text/css" src = "theme.css" />
    </head>
    <body>
        <p>极客时间</p>
        <script>
            let e = document.getElementsByTagName('p')[0]
            e.style.color = 'blue'
        </script>
    </body>
</html>
```

当在 JavaScript 中访问了某个元素的样式，那么这时候就需要等待这个样式被下载完成才能继续往下执行，所以在这种情况下，CSS 也会阻塞 DOM 的解析。

## 异步脚本

### defer VS async

```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

`script`标签打开`defer`或`async`属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

`defer`与`async`的区别是：`defer`要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；`async`一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，`defer`是“渲染完再执行”，`async`是“下载完就执行”。另外，如果有多个`defer`脚本，会按照它们在页面出现的顺序加载，而多个`async`脚本是不能保证加载顺序的。

### ES6 模块

```js
<script type="module" src="./foo.js"></script>
```

浏览器对于带有`type="module"`的`script`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了`script`标签的`defer`属性。

如果网页有多个`<script type="module">`，它们会按照在页面出现的顺序依次执行。

`script`标签的`async`属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。

```js
<script type="module" src="./foo.js" async></script>
```

一旦使用了`async`属性，`<script type="module">`就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

## 精选文章

- [深入理解浏览器的缓存机制](https://www.jianshu.com/p/54cc04190252)
