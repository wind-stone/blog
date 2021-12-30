# 性能优化

[[toc]]

## 加载和执行

### 优化建议

- 将所有的 script 标签放到页面底部，也就是 body 闭合标签之前，这能确保在脚本执行前页面已经完成了渲染
- 尽可能地合并脚本。页面中的 script 标签越少，加载也就越快，响应也越迅速。无论是外链脚本还是内嵌脚本都是如此
- 采用无阻塞下载 JavaScript 脚本的方法：
  - 使用 script 标签的 defer 属性（仅适用于 IE 和 Firefox 3.5 以上版本）
  - 使用动态创建的 script 元素来下载并执行代码；
  - 使用 XHR 对象下载 JavaScript 代码并注入页面中。

### 加载

- 原始情况
  - script 脚本阻塞任何资源的下载，同一时间只能下载一个 script 脚本
- 现阶段高级浏览器：
  - script 并行下载：从 IE 8、Firefox 3.5、Safari 4 和 Chrome 2 开始都允许并行下载 JavaScript 文件，script 标签在下载外部资源时不会阻塞其他 script 标签。遗憾的是，JavaScript 下载过程仍然会阻塞其他资源的下载，比如样式文件和图片。尽管脚本的下载过程不会互相影响，但页面仍然必须等待所有 JavaScript 代码下载并执行完成才能继续。因此，尽管最新的浏览器通过允许并行下载提高了性能，但问题尚未完全解决，脚本阻塞仍然是一个问题。
  - 由于脚本会阻塞页面其他资源的下载，因此推荐将所有 script 标签尽可能放到 body 标签的底部，以尽量减少对整个页面下载的影响。

### 执行

浏览器在执行脚本时会出现阻塞，其原因是：

脚本可能会改变页面或者 JavaScript 的命名空间，它们可能会对后面的页面内容造成影响，比如`document.write`。

```html
<html>
<head>
    <title>Source Example</title>
</head>
<body>
    <p>
    <script type="text/javascript">
        document.write("Today is " + (new Date()).toDateString());
    </script>
    </p>
</body>
</html>
```

当浏览器遇到 script 标签时，当前 HTML 页面无从获知 JavaScript 是否会向 p 标签添加内容，或引入其他元素，或甚至移除该标签。因此，这时浏览器会停止处理页面，先执行 JavaScript 代码，然后再继续解析和渲染页面。同样的情况也发生在使用 src 属性加载 JavaScript 的过程中，浏览器必须先花时间下载外链文件中的代码，然后解析并执行它。在这个过程中，页面渲染和用户交互完全被阻塞了。

### 异步加载执行脚本的方法

#### defer 延迟

HTML 4.0 规范，其作用是，告诉浏览器，等到 DOM+CSSOM 渲染完成，再执行指定脚本。

```html
<script defer src="xx.js"></script>
```

- 浏览器开始解析 HTML 网页
- 解析过程中，发现带有 defer 属性的 script 标签
- 浏览器继续往下解析 HTML 网页，解析完就渲染到页面上，同时并行下载 script 标签中的外部脚本
- 浏览器完成解析 HTML 网页，此时再执行下载的脚本，完成后触发 DOMContentLoaded

下载的脚本文件在 DOMContentLoaded 事件触发前执行（即刚刚读取完\<\/html>标签），而且可以保证执行顺序就是它们在页面上出现的顺序。所以 添加 defer 属性后，domReady 的时间并没有提前，但它可以让页面更快显示出来。

将放在页面上方的 script 加 defer，在 PC Chrome 下其效果相当于 把这个 script 放在底部，页面会先显示。 但对 iOS Safari 和 iOS WebView 加 defer 和 script 放底部一样都是长时间白屏

#### async 异步

HTML 5 规范，其作用是，使用另一个进程下载脚本，下载时不会阻塞渲染，并且下载完成后立刻执行。

```html
<script async src="yy.js"></script>
```

- 浏览器开始解析 HTML 网页
- 解析过程中，发现带有 async 属性的 script 标签
- 浏览器继续往下解析 HTML 网页，解析完先显示页面并触发 DOMContentLoaded，同时并行下载 script 标签中的外部脚本
- 脚本下载完成，浏览器暂停解析 HTML 网页，开始执行下载的脚本
- 脚本执行完毕，浏览器恢复解析 HTML 网页

async 属性可以保证脚本下载的同时，浏览器继续渲染。但是 async 无法保证脚本的执行顺序。哪个脚本先下载结束，就先执行那个脚本。

Reference

- 高性能
- [无线性能优化：页面可见时间与异步加载](http://taobaofed.org/blog/2016/01/20/mobile-wpo-pageshow-async/)
