# 页面首次渲染

[[toc]]

页面首次渲染的时机，会根据 HTML 里内容的不同以及内容的放置顺序不同而有所区别。

浏览器里，渲染进程的主线程负责解析 HTML，解析会按照由上而下的顺序进行。

讨论页面的首次渲染之前，我们应该明白几个前提知识：

> - 预加载扫描器会在后台预先请求资源，不需要等解析到外链 CSS、JavaScript 文件所在行才去请求资源
> - 外链 CSS 文件的加载，不会阻塞其后 HTML 内容的**解析**
> - 外链 CSS 文件的加载，会阻塞其后外链 JavaScript 文件的执行

## JavaScript 阻塞和 CSS 阻塞

### CSS 阻塞

- CSS 文件的加载不会阻塞其后 DOM 的解析
- CSS 文件的加载会阻塞其后 DOM 的渲染

#### CSS 文件的加载会阻塞其后 JavaScript 的执行

CSS 文件的加载，会阻塞其后 JavaScript 的执行，因为**JavaScript 经常用于查询元素的 CSS 属性**。详见：[MDN - 渲染页面：浏览器的工作原理 - 预加载扫描器](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E9%A2%84%E5%8A%A0%E8%BD%BD%E6%89%AB%E6%8F%8F%E5%99%A8)

### 再问一次：CSS 文件的加载会阻塞 DOM 树的解析吗？

答案是：可能会！

鉴于 CSS 文件的加载会阻塞其后 JavaScript 的执行，而 JavaScript 的执行会阻塞其后 DOM 树的解析。

因此，若 CSS 文件之后存在 JavaScript 代码，JavaScript 代码后存在 DOM，则 CSS 文件的加载会间接阻塞 DOM 树的解析。

鉴于此，若 HTML 里的结构是这样的：

```html
<link rel="stylesheet" type="text/css" href="index.css" />
<script>
    console.log('JavaScript after link css');
</script>
<div class="content">内容</div>
```

此时，`index.css`的加载会阻塞其后`script`的执行，进而间接地阻塞了 DOM 的解析。

## 页面解析过程

### head 标签

当解析到`head`标签时，`head`标签内的外部资源主要是外链 JavaScript 文件和外链 CSS 文件。

若解析到外链 JavaScript 文件，则主线程会停止解析之后的 HTML 内容，等待该 JavaScript 文件下载并执行；执行完成后，继续解析之后的 HTML 内容。因此，`head`标签里外链 JavaScript 文件的加载和执行，会阻塞其后 HTML 内容的解析，进而阻塞页面的首次渲染，但不会影响后面资源的下载（预加载扫描器会在后台预先请求资源）。

若解析到外链 CSS 文件，主线程会继续解析之后的 HTML 内容，即`head`标签里的外链 CSS 文件不会阻塞其后 HTML 内容的解析，但是会阻塞页面的首次渲染。

### body 标签

当解析到`body`标签时，`body`里可能会有 DOM 元素、外链 JavaScript/CSS 文件。根据不同的内容，浏览器的解析机制也会不同。

本章节之后的示例代码都以如下 HTML 为模板，示例的代码都放置在如下 HTML 的`body`标签里。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <!-- 示例代码都放置在这里 -->
    </body>
</html>
```

`red-color.css`:

```css
div {
    color: red;
}
```

`blue-color.css`:

```css
div {
    color: blue;
}
```

`index.js`:

```js
console.log('index.js 已执行');
```

#### 情况一：只有 DOM 元素

若只有 DOM 元素，则等 DOM 树构建完成后，结合 CSSOM 树生成 Render 树，**页面首次渲染**。

#### 情况二：有 DOM 元素和外链 JavaScript 文件

当解析到外链 JavaScript 时，若该 JavaScript 文件尚未加载完成，则该 JavaScript 文件之前已构建（但不完整）的 DOM 树会与 CSSOM 树会生成 Render 树，进行**页面首次渲染**。

此时，主线程会等待该 JavaScript 文件的加载和执行，并停止解析其后 HTML 内容。

```html
<div>尝试阻塞 index.js 文件的加载，此处的文字会先渲染出来</div>
<script src="./index.js"></script>
<!-- 此时，即使添加如下 CSS 文件（index.js 阻塞了解析，主线程还没解析到该 CSS 文件），第一行文案依然会先渲染出来，原因见下一小节 -->
<link type="text/css" rel="stylesheet" href="./red-color.css" />
<div>index.js 加载并执行完成之后，此处的文字才会渲染出来</div>
```

#### 情况三：有 DOM 元素和外链 CSS 文件

若 HTML 里仅包含 DOM 元素和外链 CSS 文件，**CSS 文件与 DOM 元素的位置会影响页面首次渲染的时机**。

外链 CSS 文件在 DOM 元素之前，若 CSS 文件没加载完成，会阻塞其后 DOM 元素的渲染（但不会阻塞其后 DOM 元素的解析）。也就是说，在这种情况下，只有等待 CSS 文件加载完成，页面才会首次渲染。

```html
<link type="text/css" rel="stylesheet" href="./red-color.css" />
<div>red-color.css 没加载完成之前，此处的文字不会渲染出来</div>
```

外链 CSS 文件在 DOM 元素之后，即使 CSS 文件没加载完成，也不会影响该 CSS 文件之前的 DOM 元素的渲染，但是会阻塞其之后 DOM 元素的渲染。

```html
<div>FIRST: red-color.css 没加载完成之前，此处的文字会先渲染出来，但颜色是默认的黑色</div>
<link type="text/css" rel="stylesheet" href="./red-color.css" />
<div>SECOND: red-color.css 加载完成之后，此处的文字才会渲染出来，且颜色是红色，FIRST 也会变成红色</div>
```

#### 情况四：有 DOM 元素、外链 JavaScript 和 CSS 文件

```html
<div>
    FIRST:
    阻塞 index.js 文件和 red-color.css、blue-color.css 的加载，
    此处的文字会先渲染且为黑色。
</div>
<link type="text/css" rel="stylesheet" href="./red-color.css" />
<div>
    SECOND:
    先让 red-color.css 完成加载，此处的文字才会渲染出来且为红色，
    FIRST 也会重新渲染成红色（red-color.css 生效了）。
</div>
<script src="./index.js"></script>
<div>
    THIRD:
    再让 index.js 完成加载，此处的文字才会渲染出来且为红色。
</div>
<link type="text/css" rel="stylesheet" href="./blue-color.css" />
<div>
    FOURTH:
    再让 blue-color.css 完成加载，此处的文字才会渲染出来且为蓝色，
    且之前所有的文字都重新渲染成蓝色
</div>
```

页面的渲染顺序已经在上述 HTML 里说明了，从这个结果上来看，可以总结出：

- 若外链 CSS 文件未加载完成，则该 CSS 文件之前的 DOM 元素会渲染出来，但其之后的 DOM 元素不会渲染出来
- 若 DOM 元素之前存在外链的 CSS 文件，只有等这些 CSS 文件加载完成，该 DOM 元素才会渲染出来

此外，若是先让`index.js`加载完成并执行，主线程会继续往下解析 HTML 内容并完成整个 DOM 树的构建。若此时`red-color.css`仍在加载，则`red-color.css`之后的 DOM 元素仍然无法渲染。

### 为什么 DOM/CSSOM 树不完整时也会渲染？

参考文档：[掘金 - 对浏览器首次渲染时间点的探究](https://juejin.cn/post/6844903829528543240)

从以上的实验结果可以看出，即使 DOM 树不完整、CSSOM 树也不完整，但页面里外链 CSS 文件之前的 DOM 元素依然进行了渲染。

为什么会出现这种情况呢？总结来说：

> An end tag whose tag name is "script"
>
> ...
>
> 1. Let the script be the pending parsing-blocking script. There is no longer a pending parsing-blocking script.
> 2. Start the speculative HTML parser for this instance of the HTML parser.
> 3. Block the tokenizer for this instance of the HTML parser, such that the event loop will not run tasks that invoke the tokenizer.
> 4. If the parser's Document has a style sheet that is blocking scripts or the script's "ready to be parser-executed" flag is not set: spin the event loop until the parser's Document has no style sheet that is blocking scripts and the script's "ready to be parser-executed" flag is set.
> 5. If this parser has been aborted in the meantime, return.
>
> ...

当浏览器主线程解析到`</script>`标签时，若当前文档存在**阻碍 JS 执行的 CSS**或者**当前的脚本不处于`ready to be parser-executed`状态**，则`spin the event loop`，直到不再存在阻碍 JS 执行的 CSS 且该段脚本处于`ready to be parser-executed`。

我们知道，外链 CSS 文件的加载会阻塞其后 JavaScript 文件的执行。而脚本不处于`ready to be parser-executed`状态是指脚本还没加载完。如果出现这两种情况，脚本就没法立即执行，需要等待外链 CSS 文件加载完成或者外链 JavaScript 文件加载完成。此时，浏览器会`spin the event loop`，该操作即为：

> （简单翻译，待修改）
>
> 1. 暂存此时正在执行的 task 或 microtask
> 2. 暂存此时的 js 执行上下文堆栈
> 3. 清空 js执行上下文堆栈
> 4. 如果当前正在执行的是 task，执行 microtask checkpoint
> 5. 停止执行当前的 task/microtask。继续执行 eventloop 的主流程。
> 6. 当满足条件时，重新添加之前暂存的 task/microtask，恢复暂存的 js 执行上下文堆栈，继续执行。

简单说就是，让`event loop`中断并暂存当前正在执行的`task`/`microtask`，保持`event loop`继续执行，待一段时间之后满足条件了再恢复之前的`task`/`microtask`。

因此，这个问题的答案就出来了：如果在 HTML 解析过程中，解析到了某个脚本但这个脚本被 CSS 阻塞住了或者还没下载完，则会中断暂存当前的解析`task`，继续执行`event loop`，网页被渲染。如果 JavaScript 全部是内联的或者网速好，在解析到`</script>`时脚本全都已下载完了，则解析`task`不会被中断，也就不会出现渲染情况了。

## 资源的放置顺序

### 为什么要将外链 JavaScript 文件放在文档底部

先说结论：JavaScript 的加载和执行，会阻塞 JavaScript 之后 DOM 节点的解析和渲染，但不会影响其之前 DOM 节点的解析和渲染，因此要将外链 JavaScript 文件放到页面尽可能底部的地方。

但是要完全弄明白这个问题，就要深究以上的结论。

首先，JavaScript 的加载和执行，为什么会阻塞其之后 DOM 节点的解析和渲染呢？这完全是历史原因。以前的 JavaScript 经常在执行的时候运行`document.write`（往文档里插入内容），这可能会导致其后 DOM 节点完全发生变化，因此无法安全地在 JavaScript 执行的同时来渲染 DOM 节点。

::: tip 相关知识点
`document.write`方法将一个文本字符串写入一个由`document.open()`打开的文档流（document stream）。

若向一个已经加载且没有调用过`document.open()`的文档写入数据时，会自动调用`document.open`。一旦完成了数据写入，建议调用`document.close()`，以告诉浏览器当前页面已经加载完毕。写入的数据会被解析到文档结构模型（DOM）里，完全覆盖当面的文档（即`<html>`标签内的内容都被替换）。

若`document.write`是在页面的`<script></script>`里同步调用的（说明当前文档还未完成加载），则它将不会自动调用`document.open()`，且此时通过`document.write`写入的内容会追加在当前文档里。
:::

现在的浏览器都支持`async`或者`defer`属性了，说明脚本非阻塞其实一点问题都没有，而脚本阻塞就是历史原因导致的兼容性问题。

正是因为 JavaScript 的加载和执行会阻塞其后 DOM 节点的解析和渲染，因此若是将外链 JavaScript 文件置于文档顶部会导致首屏白屏时间增加；置于文档中部，可能会导致页面只渲染一部分 DOM 后阻塞渲染后一部分 DOM。因此，将外链 JavaScript 文件置于文档尽可能底部的地方是最优的方式。

### 为什么要将 CSS 放在 head 标签里

若是将 CSS（包括`style`标签内的内部样式和外链 CSS 样式表，下同）放在页面底部即`</body>`之前，浏览器会先解析 HTML 并构建 DOM 树，解析到文件底部 CSS 所在位置时，DOM 树基本构建完成，而此时才开始构建 CSSOM 树，导致 DOM 树的构建和 CSSOM 树的构建基本上是串行的。而且在这种情况下，底部的外链 CSS 文件加载时，浏览器会先渲染出一个没有样式的页面（内联样式不会渲染，否则等外链 CSS 文件加载好后，又要结合全部样式再渲染一次），等外链 CSS 文件加载完后会再渲染成一个有样式的页面，页面会出现明显的闪动的现象。

而将 CSS 放在`head`标签之间，CSSOM 树的构建可以更早地进行，最终页面也能更早地进行首次渲染。

## DOMContentLoaded 和 load 事件的触发时机

MDN 的解释：

> 当初始的 HTML 文档被完全加载和解析完成之后，`DOMContentLoaded`事件被触发，而无需等待样式表、图像和子框架的完成加载。注意: `DOMContentLoaded`事件必须等待其所属`script`之前的样式表加载解析完成才会触发。
>
> 整个页面加载完成之后，包括所有依赖的资源比如样式表和图片，`load`事件被触发。

MDN 的解释并不是那么地清楚，从上一节“页面首次渲染”来看:

- HTML 文档加载完毕，且 HTML 里引用的内联 JavaScript 和外链 JavaScript 文件都加载完成并执行完成之后，触发`DOMContentLoaded`事件。
  - 注意: `DOMContentLoaded`事件必须等待其所属`script`之前的样式表加载解析完成才会触发。
  - 注意: 若是外链 JavaScript 文件且存在`defer`属性，则会在该文件加载执行完成之后，才会触发`DOMContentLoaded`事件。
- HTML 文档里引用的 JavaScript 文件、CSS 文件、图片，以及 JavaScript 代码里异步加载的 JavaScript、CSS 和图片都加载完成之后，触发`load`事件。注意:
  - HTML 文档里引用的 JavaScript 代码里若是有异步加载的 JavaScript、CSS、图片，是会影响`load`事件触发的。
  - `video`、`audio`、`flash`不会影响`load`事件触发。

## 浏览器下载并发数

浏览器对同一域名下的资源并发下载数，Chrome 为 6 个。超过 6 个的话，之后的下载请求将会在队列中等待。详见[Timing breakdown phases explained](https://developers.google.com/web/tools/chrome-devtools/network/reference#timing-explanation)。

这就是为什么我们要将资源收敛到不同的域名下的原因，就是为了充分利用该机制，最大程度的并发下载所需资源，尽快的完成页面的渲染。

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

## 优化技巧

- 预解析 DNS

```html
<link rel="dns-prefetch" href="https://blog.windstone.cc">
```

- 预建立 TCP 连接

```html
<link rel="preconnect" href="https://blog.windstone.cc">
```

## 参考文章

- [MDN - 渲染页面：浏览器的工作原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)
- [掘金 - 对浏览器首次渲染时间点的探究](https://juejin.cn/post/6844903829528543240)
- [再谈 load 与 DOMContentLoaded](https://juejin.im/post/5b2a508ae51d4558de5bd5d1)

