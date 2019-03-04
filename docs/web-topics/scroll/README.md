---
sidebarDepth: 0
---

# 滚动

[[toc]]

## JS 相关

### 判断元素在视口内

当你需要实现图片懒加载或者无限滚动时，需要确定元素是否出现在视窗中。这可以在事件监听器中处理，最常见的解决方案是使用`element.getBoundingClientRect()`：

```js
window.addEventListener('scroll', () => {
  const rect = elem.getBoundingClientRect();
  // rect.left/top/right/bottom 是相对于视口的左上角位置而言的
  // 判断整个元素是否完全在视口之内
  const inViewport = rect.bottom > 0 && rect.right > 0 &&
                     rect.left < window.innerWidth &&
                     rect.top < window.innerHeight;
});
```

上述代码的问题在于每次调用`getBoundingClientRect`时都会触发回流，严重地影响了性能。在事件处理函数中调用（`getBoundingClientRect`）尤为糟糕，就算使用了函数节流（的技巧）也可能对性能没多大帮助。
（回流是指浏览器为局部或整体地重绘某个元素，需要重新计算该元素在文档中的位置与形状。）

在2016年后，可以通过使用 Intersection Observer 这一 API 来解决问题。它允许你追踪目标元素与其祖先元素或视窗的交叉状态。此外，尽管只有一部分元素出现在视窗中，哪怕只有一像素，也可以选择触发回调函数：

```js
const observer = new IntersectionObserver(callback, options);
observer.observe(element);
```

此 API 被广泛地支持，但仍有一些浏览器需要 polyfill。尽管如此，它仍是目前最好的解决方案。

### 文档滚动加载

```js
window.addEventListener('scroll', () => {
  // 获取文档的垂直滚动距离
  const documentScrollY = window.pageYOffset;
  // 获取文档的高度
  const documentHeight = document.body.offsetHeight;
  // 获取视口高度
  const viewPortHeight = window.innerHeight;
  // 文档底部距离视口底部的距离
  const leftDistance = documentHeight - documentScrollY - viewPortHeight;
  if (leftDistance <= 20) {
    // 文档滑动时，文档底部距离视口底部还有 20 px 时，加载新数据
  }
}
```

### 滚动穿透问题、滚动边界问题

如果你的弹框或下拉列表是可滚动的，那你务必要了解连锁滚动相关的问题：当用户滚动到（弹框或下拉列表）末尾（后再继续滚动时），整个页面都会开始滚动。

### 滚动穿透问题解决

- [移动端滚动穿透解决方案](https://juejin.im/post/5abf1c69f265da239706fcb8)
- [示例代码](/code-snippet/other/no-bg-scroll.html)

### `passive: true`

`addEventListener(type, listener[, options ])`里`options`里的`passive`参数，设置为`true`时，表明注册的`listener`内不会调用`preventDefault()`，浏览器将同时执行`listener`和浏览器的默认行为（而不是等执行`listener`结束之后再执行默认行为），且会忽略`listener`里的`preventDefault()`，使得滚动更加流畅。

Reference:

- [addEventListener 的第三个参数](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/6#issuecomment-404205665)
- [passive 的事件监听器](http://www.cnblogs.com/ziyunfei/p/5545439.html)
- [前端早读课--【第1240期】passive 事件监听](https://mp.weixin.qq.com/s/TrN50625KykugTiOZ3JVsw)

## CSS 相关

### iOS 上顺畅滚动

iOS 上若不做处理，滚动将显得不流程，此时，可添加一行代码：

```css
.scroll-area {
    -webkit-overflow-scrolling: touch;
}
```

`-webkit-overflow-scrolling`属性有两个取值：

- `auto`：使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止
- `touch`：使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文

::: warning 注意
该特性是非标准的，详情请见[MDN 之 -webkit-overflow-scrolling](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-overflow-scrolling)
:::

### `position: sticky`

`position: sticky`是结合了`position: relative`和`position: fixed`两种定位功能于一体的特殊定位，适用于一些特殊场景。

元素先按照普通文档流定位，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。而后，元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。

这个特定阈值指的是`top`，`right`，`bottom`或`left`之一，换言之，指定`top`，`right`，`bottom`或 `left`四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。

### 滚动条隐藏但可滚动

```css
/* Chrome，Safari 和 Opera */
.container::-webkit-scrollbar {
  display: none;
}

/* IE 或 Edge */
.container {
  -ms-overflow-style: none;
}
```

至于 Firefox，没有任何办法隐藏滚动条。

### 滚动条样式

IE 5.5 版本以后，允许修改滚动条的颜色。

```css
body {
  scrollbar-face-color: blue;
}
```

WebKit 的开发者在 2009 年提出了（修改滚动条）样式的方案。以下是使用 -webkit 前缀在支持相关样式的浏览器中模拟 macOS 滚动条样式的代码：

```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}
```

Chrome、Safari、Opera 甚至于 UC 浏览器或者三星自带的桌面浏览器都支持（上述 CSS）。Edge 也有计划实现它们。但三年过去了，该计划仍在中等优先级中（而尚未被实现）。

### 锚点切换时，流畅的滚动

通过锚点链接来跳转到页面上的不同区块时，若想实现平滑地滚动，可添加一行代码：

```css
html {
  scroll-behavior: smooth;
}
```

目前`scroll-behavior`仅在 Chrome、 Firefox 与 Opera 上被支持，但我们希望它能被广泛支持，因为使用 CSS （比使用 JavaScript）在解决页面滚动问题时优雅得多，并更符合“渐进增强”的模式。

Reference：

- [【第1286期】滑向未来：现代 JavaScript 与 CSS 滚动实现指南](https://mp.weixin.qq.com/s/tG56t5pd1Kw_O2NBXGAk6Q)
- [使用 position:sticky 实现粘性布局](http://www.cnblogs.com/coco1s/p/6402723.html)
