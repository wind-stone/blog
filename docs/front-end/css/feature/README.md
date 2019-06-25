# 特性集合

## pointer-events: none

设置元素不成为鼠标事件的`target`

## -webkit-overflow-scrolling: touch

控制元素在移动设备上是否使用滚动回弹效果.[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-overflow-scrolling)

取值 | 说明 | 中文
-- | -- | --
auto | Use "regular" scrolling, where the content immediately ceases to scroll when you remove your finger from the touchscreen. | 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。
touch | Use momentum-based scrolling, where the content continues to scroll for a while after finishing the scroll gesture and removing your finger from the touchscreen. The speed and duration of the continued scrolling is proportional to how vigorous the scroll gesture was. Also creates a new stacking context. | 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

## 文字不可选中

[`user-select`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select)属性控制用户能否选中文本。

```css
div {
    user-select: none;
}
```

## 点击元素不显示高亮

[`-webkit-tap-highlight-color`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-tap-highlight-color)是一个没有标准化的属性，能够设置点击链接的时候出现的高亮颜色。显示给用户的高光是他们成功点击的标识，以及暗示了他们点击的元素。

```css
div {
    -webkit-tap-highlight-color: transparent;
}
```
