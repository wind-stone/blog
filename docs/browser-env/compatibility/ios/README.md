# iOS 兼容性问题

[[toc]]

## 输入框光标问题

```html
<input type="tel" placeholder="请输入手机号" maxlength="11">
```

```css
* {
  margin: 0;
  padding: 0;
  border: 0;
}
input {
  font-size: 16px;
  line-height: 36px;
}
```

在 iOS 下，当`input`聚焦后（但还未输入），光标的长度为`input`的`line-height`的高度，而当输入内容后，光标的长度改变为从`input`顶部到文字底部的距离，导致输入前后光标长度不统一。

解决方案是，

```css
input {
  height: 26px; /** 最好加上 height **/
  padding: 5px 0; /** 也可以用 margin **/
  font-size: 16px;
  line-height: 26px;
}
```

添加`padding`或`margin`，即可解决。

此外，经测试，在 iOS 和部分 Android 浏览器上，若是不添加固定的`height`，输入内容前后`input`会有细微的高度变化，因此最好加上`height`。

## :active 不生效

iOS Safari 里，需要在按钮元素或`body`/`html`上绑定一个`touchstart`事件，才能激活`:active`状态。

```js
document.body.addEventListener('touchstart', function () {});
```

## iOS 10 上 flex item 元素的子元素的 height: 100% 未生效

详情可见：[100% height doesn't work within a flex item in a flex-item child (Chrome / Safari) #197](https://github.com/philipwalton/flexbugs/issues/197)

解决方法：将 flex item 元素也变成 flexbox 元素。

## iOS UIWebView 里滚动页面导致计时器停止

有一些 iOS 客户端内会使用 UIWebView，在 UIWebView 里滚动页面时，到导致计时器、动画等等停止。

有两种方式解决这个问题：

- 【推荐】弃用 UIWebView，改用 WKWebView（若是 WKWebView 没有坑的话）
- 使用 better-scroll 等滚动工具模拟原生的滚动

当使用`better-scroll`等类似滚动库时，通常会使用`transform`来做滚动动画的过渡，但是在`transform`元素下的`fixed`定位的子元素将以`transform`元素为包含块进行定位，并失去固定效果。因此需要注意不要将`fixed`定位的元素放在滚动元素之下。
