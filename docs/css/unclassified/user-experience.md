# 用户体验

[[toc]]

## 元素不成为鼠标事件目标

`pointer-events: none`，设置元素不成为鼠标事件的`target`。

## 禁用文字选中

[`user-select`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select)属性控制用户能否选中文本。

若想文字不可选中，设置该属性为`none`。

```css
div {
    user-select: none;
}
```

## 禁用 iOS 长按图片预览

```css
* {
    -webkit-touch-callout: none;
}
```

详见：[MDN - -webkit-touch-callout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-touch-callout)

## 点击元素不高亮显示

设置`-webkit-tap-highlight-color: transparent`，点击元素时不高亮显示。

[`-webkit-tap-highlight-color`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-tap-highlight-color)是一个没有标准化的属性，能够设置点击链接的时候出现的高亮颜色。显示给用户的高光是他们成功点击的标识，以及暗示了他们点击的元素。

```css
div {
    -webkit-tap-highlight-color: transparent;
}
```

## 类似电话号码的数字不可点击拨号

在`<head>`标签里添加：

```html
<meta name="format-detection" content="telephone=no">
```

## 网页置灰

一般遇到国家公祭日、国难日或者默哀日等情况，都需要将整个页面置灰。这可通过`filter: grayscale(1)`来实现。

若是想要全站都置灰，直接在文档根元素`html`上添加滤镜。

```css
html {
  -webkit-filter: grayscale(100%); /* webkit */
  -moz-filter: grayscale(100%); /*firefox*/
  -ms-filter: grayscale(100%); /*ie9*/
  -o-filter: grayscale(100%); /*opera*/
  filter: grayscale(100%);
  filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
  filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter:gray; /*ie9- */
}
```

尤其需要注意的是，若是将这段 CSS 应用到`body`而不是`html`上，会导致页面里使用`position: fixed/absolute`定位的元素，会以`body`为包含框进行定位（换句话说，就是固定定位可能失效了），其原因是：

> A value other than none for the filter property results in the creation of a containing block for absolute and fixed positioned descendants unless the element it applies to is a document root element in the current browsing context. The list of functions are applied in the order provided. -- [filter-effects 规格文档](https://drafts.fxtf.org/filter-effects/#FilterProperty)

若是不想子孙元素的`fix/absolute`定位元素以这个添加了`filter`属性的元素为基准来定位，就需要将`filter`属性应用到当前文档的根元素即`html`上。

若是想局部页面置灰，比如某个路由页面，则需要给页面上的元素单独添加`filter: grayscale(1)`，且不要给`fixed/absolute`的祖先元素添加。

参考文档：

- [Stack Overflow - CSS-Filter on parent breaks child positioning](https://stackoverflow.com/questions/52937708/css-filter-on-parent-breaks-child-positioning)
- [掘金 - 明天全国哀悼日，一段css让全站变灰](https://juejin.im/post/5e86e221e51d4546ce27b99c)
- [filter-effects 规格文档](https://drafts.fxtf.org/filter-effects/#FilterProperty)
- [MDN - filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

## 其他

### iOS 页面顶部边界下拉出现白色空白

iOS 里，手指按住屏幕下拉，屏幕顶部会多出一块白色区域。手指按住屏幕上拉，底部多出一块白色区域。其原因是，在 iOS 中，手指按住屏幕上下拖动，会触发`touchmove`事件。这个事件触发的对象是整个 webview 容器，容器自然会被拖动，剩下的部分会成空白。解决方案详见：[吃透移动端 H5 与 Hybrid｜实践踩坑12种问题汇总](https://mp.weixin.qq.com/s/5qrkNYQgUunm1UbT4QPgBg)

### 页面的放大和缩小

禁止页面的放大和缩小，添加如下`meta`。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

PS: `viewport-fit=cover`是解决 iPhone X 刘海适配问题的。
