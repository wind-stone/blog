# iOS

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

## iOS Safari 上 :active 不生效

iOS Safari 里，需要在按钮元素或`body`/`html`上绑定一个`touchstart`事件，才能激活`:active`状态。

```js
document.body.addEventListener('touchstart', function () {});
```
