# 用户体验

## CSS 属性

### 元素不成为鼠标事件目标

`pointer-events: none`，设置元素不成为鼠标事件的`target`。

### 滚动回弹效果

`-webkit-overflow-scrolling: touch`，iOS 上产生滚动回弹效果。

`-webkit-overflow-scrolling`属性控制元素在移动设备上是否使用滚动回弹效果.[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-overflow-scrolling)

取值如下：

- `auto`
  - Use "regular" scrolling, where the content immediately ceases to scroll when you remove your finger from the touchscreen.
  - 翻译：使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。                                                                                                                   |
- `touch`
  - Use momentum-based scrolling, where the content continues to scroll for a while after finishing the scroll gesture and removing your finger from the touchscreen. The speed and duration of the continued scrolling is proportional to how vigorous the scroll gesture was. Also creates a new stacking context.
  - 翻译：使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。 |

需要注意的是，对容器添加了`-webkit-overflow-scrolling: touch`后，可能会导致容器内使用`position:fixed;`固定定位的元素随着页面一起滚动。

### 文字不可选中

[`user-select`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select)属性控制用户能否选中文本。

若想文字不可选中，设置该属性为`none`。

```css
div {
    user-select: none;
}
```

### 点击元素不高亮显示

设置`-webkit-tap-highlight-color: transparent`，点击元素时不高亮显示。

[`-webkit-tap-highlight-color`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-tap-highlight-color)是一个没有标准化的属性，能够设置点击链接的时候出现的高亮颜色。显示给用户的高光是他们成功点击的标识，以及暗示了他们点击的元素。

```css
div {
    -webkit-tap-highlight-color: transparent;
}
```

## 其他

### iOS 页面顶部边界下拉出现白色空白

iOS 里，手指按住屏幕下拉，屏幕顶部会多出一块白色区域。手指按住屏幕上拉，底部多出一块白色区域。其原因是，在 iOS 中，手指按住屏幕上下拖动，会触发`touchmove`事件。这个事件触发的对象是整个 webview 容器，容器自然会被拖动，剩下的部分会成空白。解决方案详见：[吃透移动端 H5 与 Hybrid｜实践踩坑12种问题汇总](https://mp.weixin.qq.com/s/5qrkNYQgUunm1UbT4QPgBg)

### 页面的放大和缩小

禁止页面的放大和缩小，添加如下`meta`。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

PS: `viewport-fit=cover`是解决 iPhone X 刘海适配问题的。
