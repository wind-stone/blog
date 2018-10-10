---
sidebarDepth: 0
---

# 滚动

[[toc]]

## 滚动条隐藏但可滚动

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

## 滚动条样式

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

## 流畅的滚动

通过锚点链接来跳转到页面上的不同区块时，若想实现平滑地滚动，可添加一行代码：

```css
html {
  scroll-behavior: smooth;
}
```

目前`scroll-behavior`仅在 Chrome、 Firefox 与 Opera 上被支持，但我们希望它能被广泛支持，因为使用 CSS （比使用 JavaScript）在解决页面滚动问题时优雅得多，并更符合“渐进增强”的模式。

## `position: sticky`

`position: sticky`是结合了`position: relative`和`position: fixed`两种定位功能于一体的特殊定位，适用于一些特殊场景。

元素先按照普通文档流定位，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。而后，元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。

这个特定阈值指的是`top`，`right`，`bottom`或`left`之一，换言之，指定`top`，`right`，`bottom`或 `left`四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。

## 在视窗中显示

当你需要实现图片懒加载或者无限滚动时，需要确定元素是否出现在视窗中。这可以在事件监听器中处理，最常见的解决方案是使用`element.getBoundingClientRect()`：

```js
window.addEventListener('scroll', () => {
  const rect = elem.getBoundingClientRect();
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

## 滚动边界问题

如果你的弹框或下拉列表是可滚动的，那你务必要了解连锁滚动相关的问题：当用户滚动到（弹框或下拉列表）末尾（后再继续滚动时），整个页面都会开始滚动。

## `passive: true`

`addEventListener(type, listener[, options ])`里`options`里的`passive`参数，设置为`true`时，表明注册的`listener`内不会调用`preventDefault()`，浏览器将同时执行`listener`和浏览器的默认行为（而不是等执行`listener`结束之后再执行默认行为），且会忽略`listener`里的`preventDefault()`，使得滚动更加流畅。

Reference: [addEventListener 的第三个参数](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/6#issuecomment-404205665)

## 性能优化

### 防抖动（Debouncing）

防抖技术即是可以把多个顺序地调用合并成一次，也就是在一定时间内，规定事件被触发的次数。

```js
// 简单的防抖动函数
function debounce(func, wait, immediate) {
    // 定时器变量
    var timeout;
    return function() {
        // 每次触发 scroll handler 时先清除定时器
        clearTimeout(timeout);
        // 指定 xx ms 后触发真正想进行的操作 handler
        timeout = setTimeout(func, wait);
    };
};

// 实际想绑定在 scroll 事件上的 handler
function realFunc(){
    console.log("Success");
}

// 采用了防抖动
window.addEventListener('scroll',debounce(realFunc,500));
// 没采用防抖动
window.addEventListener('scroll',realFunc);
```

上面代码的功能就是，

- 如果 500ms 内没有连续触发两次 scroll 事件，那么才会触发我们真正想在 scroll 事件中触发的函数
- 如果 500ms 内连续出发两次 scroll 事件，以最后一次触发事件的时间作为延迟触发的开始时间

上面的示例可以更好的封装一下，增加立即执行功能。

```js
// 防抖动函数
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate &amp; !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var myEfficientFn = debounce(function() {
    // 滚动中的真正的操作
}, 250);

// 绑定监听
window.addEventListener('resize', myEfficientFn);
```

### 节流阀（Throttling）

节流函数，只允许一个函数在 X 毫秒内执行一次。

与防抖相比，节流函数最主要的不同在于它保证在 X 毫秒内至少执行一次我们希望触发的事件 handler。

与防抖相比，节流函数多了一个 mustRun 属性，代表 mustRun 毫秒内，必然会触发一次 handler ，同样是利用定时器，看看简单的示例：

```js
// 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
        startTime = new Date();

    return function() {
        var context = this,
            args = arguments,
            curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime &gt;= mustRun){
            func.apply(context,args);
            startTime = curTime;
        // 没达到触发间隔，重新设定定时器
        }else{
            timeout = setTimeout(func, wait);
        }
    };
};
// 实际想绑定在 scroll 事件上的 handler
function realFunc(){
    console.log("Success");
}
// 采用了节流函数
window.addEventListener('scroll',throttle(realFunc,500,1000));
```

### requestAnimationFrame

上面介绍的抖动与节流实现的方式都是借助了定时器 setTimeout ，但是如果页面只需要兼容高版本浏览器或应用在移动端，又或者页面需要追求高精度的效果，那么可以使用浏览器的原生方法 rAF（requestAnimationFrame）。

Reference：

- [【第1286期】滑向未来：现代 JavaScript 与 CSS 滚动实现指南](https://mp.weixin.qq.com/s/tG56t5pd1Kw_O2NBXGAk6Q)
- [使用 position:sticky 实现粘性布局](http://www.cnblogs.com/coco1s/p/6402723.html)
- [passive 的事件监听器](http://www.cnblogs.com/ziyunfei/p/5545439.html)
- [前端早读课--【第1240期】passive 事件监听](https://mp.weixin.qq.com/s/TrN50625KykugTiOZ3JVsw)
- [【前端性能】高性能滚动 scroll 及页面渲染优化 #12](https://github.com/chokcoco/cnblogsArticle/issues/12)
- [实例解析防抖动（Debouncing）和节流阀（Throttling）](http://jinlong.github.io/2016/04/24/Debouncing-and-Throttling-Explained-Through-Examples/)
