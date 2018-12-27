---
sidebarDepth: 0
---

# 总览

[[toc]]

## CSS

### 文字不可选中

[`user-select`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select)属性控制用户能否选中文本。

```css
div {
    user-select: none;
}
```

### 点击元素不显示高亮

[`-webkit-tap-highlight-color`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-tap-highlight-color)是一个没有标准化的属性，能够设置点击链接的时候出现的高亮颜色。显示给用户的高光是他们成功点击的标识，以及暗示了他们点击的元素。

```css
div {
    -webkit-tap-highlight-color: transparent;
}
```

### iOS Safari 上 :active 不生效

iOS Safari 里，需要在按钮元素或`body`/`html`上绑定一个`touchstart`事件，才能激活`:active`状态。

```js
document.body.addEventListener('touchstart', function () {});
```
