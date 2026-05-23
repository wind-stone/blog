# click 延迟

[[toc]]

## 延迟原因

谷歌的开发者文档《300ms tap delay, gone away》如是说：

> For many years, mobile browsers applied a 300-350ms delay between touchend and click while they waited to see if this was going to be a double-tap or not, since double-tap was a gesture to zoom into text.

最早的 iPhone 的 Safari 浏览器中，为了实现触屏中双击放大的效果，当用户点击屏幕后会判断在 300ms 内是否有第二次点击，如果有，就理解成双击，若没有就是单击，就会触发`click`事件。

当你点击移动设备的屏幕时，可以分解成多个事件，这些事件都是按顺序依次触发的。

`touchstart` --> `touchmove` --> `touchend` --> `click`

## 去除延迟的方法

> FastClick doesn't attach any listeners on desktop browsers.
>
> Chrome 32+ on Android with width=device-width in the viewport meta tag doesn't have a 300ms delay, therefore listeners aren't attached.
>
> `<meta name="viewport" content="width=device-width, initial-scale=1">`
> Same goes for Chrome on Android (all versions) with user-scalable=no in the viewport meta tag. But be aware that user-scalable=no also disables pinch zooming, which may be an accessibility concern.
>
> For IE11+, you can use touch-action: manipulation; to disable double-tap-to-zoom on certain elements (like links and buttons). For IE10 use -ms-touch-action: manipulation.

from: [FastClick - When it isn't needed](https://github.com/ftlabs/fastclick#when-it-isnt-needed)

## tap 事件

### 实现原理

有些第三方库如`zepto`、`fastclick`等实现了`tap`事件，用于替代移动端的`click`事件，解决点击延迟的问题。

`zepto`和`fastclick`都是在`touchend`触发之后立即触发事件，不同的是：

- `zepto`：手动触发自定义的`tap`事件
- `fastclick`：`touchend`事件触发后，使用`document.createEvent`手动生成`click`事件并触发，再取消浏览器触发的`click`事件

这里有一个关键的问题是，不能每次`touchend`之后都触发`tap`事件，因为有可能用户是在上下滑动而不是在点击（否则可以直接通过监听`touchstart`事件就可以了）。

因此，如何判定用户是在点击还是在上下滑动呢？

- `zepto`：通过判断位移偏差，即记录下`touchstart`时的初始位移，用`touchend`时的位移减掉初始位移的偏差，如果这个差值在`30`以内，则认为用户是点击，否则认为是滑动。
- `fastclick`：通过判断时间偏差，分别记录`touchstart`和`touchend`的时间戳，如果它们的时间差大于`700`毫秒，则认为是滑动操作，否则是点击操作。

如何像`jQuery`/`Zepto`一样，实现一个简单的`tap`事件？请参考：[前端早读课-【第1005期】从移动端click到摇一摇](http://mp.weixin.qq.com/s/NBSPIKpRQH3Re3P6rDykFA)

### zepto 的 tap 事件点击穿透问题

#### 现象

遮罩层中有一标签绑定了`tap`事件，触发时遮罩层消失，该标签正下方有以下的元素之一：

- 绑定了`click`事件的元素、`click`时会触发事件（`focus`/`focusout`）的元素
- 点击时有默认行为的元素，如超链接`a`
- `input`（会出系统键盘的`type`类型）

此时点击上层的标签，同时也会触发下层元素的`click`事件，出现穿透的现象。

#### 原理

当触发`tap`事件，上层遮罩层关闭后，此时事件只进行到`touchend`事件，而大概 300ms 后才触发`click`事件，当`click`事件触发时，上面的遮罩层已消失，就相当于点击到了下层的元素。

#### 解决方案

- 引入`fastclick.js`
  - 存在的问题：
- 用`touchend`代替`tap`事件并阻止掉`touchend`的默认行为`e.preventDefault()`
  - 存在的问题：在很远的区域滑动到目标元素，然后松开，会触发`touchend`事件
- 以`click`事件代替`tap`事件或者使用`tap`事件并且添加延迟一定时间（300ms+）来处理事件
  - 存在的问题：需要延时处理事件回调

```js
$("#cbFinish").on("tap", function (event) {
    setTimeout(function(){
        //很多处理比如隐藏什么的
    },320);
});
```

#### zepto 为何不使用 e.preventDefault() 来解决穿透问题？

因为`zepto`的`tap`事件统一是在`document`的`touchend`时触发的，若在这里使用`e.preventDefault()`，那页面上所有元素在`touchend`后触发的事件都不会被执行了。

Reference:

- [前端早读课-【第1005期】从移动端click到摇一摇](http://mp.weixin.qq.com/s/NBSPIKpRQH3Re3P6rDykFA)
