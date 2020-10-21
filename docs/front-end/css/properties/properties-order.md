---
sidebarDepth: 1
---

# 属性书写顺序

[[toc]]

## 属性间顺序

常规情况下，属性的排序方式有这么几种方式：

- 随机
- 按字母序
- 按属性类型
- 按属性长度

国外著名的 Web 前端专家 Andy Ford 推荐过一种按照属性类型分组排序的方式，他把 CSS 属性分为 7 大类：

- 显示与浮动（`Diplay`&`Flow`）
- 定位（`Positioning`）
- 尺寸（`Dimensions`）
- 边框相关属性（`Margins`、`Padding`、`Borders`、`Outline`）
- 字体样式（`Typographic Styles`）
- 背景（`Backgrounds`）
- 其他样式（`Opacity、Cursors、Generated Content`）

这种按照样式类型分组排列的方式不仅把功能相似的属性归类到一起，并且按照样式功能的重要性从上到下进行了排序。可以把影响元素页面布局的样式（如 `float`、`margin`、`padding`、`height`、`width`等）排到前面，而把不影响布局的样式（如`background`、`color`、`font`等）放到后面。这种主次分明的排列方式，极大地提高了代码的可维护性。可参考文档[Order of the Day: CSS Properties](http://www.dang-jian.com/bestpractice/best-practice-6-7.html)，BTW，原文链接已经失效了，这一篇应该是有人之前复制过来的。

PS：个人认为，应该将 定位 放置在 显示与浮动 之前。

```css
.example {
    /* 显示与浮动 */
    display: ;
    visibility: ;
    float: ;
    clear: ;

    /* 定位 */
    position: ;
    top: ;
    right: ;
    bottom: ;
    left: ;
    z-index: ;

    /* 尺寸 */
    box-sizing: ;
    width: ;
    min-width: ;
    max-width: ;
    height: ;
    min-height: ;
    max-height: ;
    overflow: ;

    /* 边框相关属性 */
    margin: ;
    margin-top: ;
    margin-right: ;
    margin-bottom: ;
    margin-left: ;

    padding: ;
    padding-top: ;
    padding-right: ;
    padding-bottom: ;
    padding-left: ;

    border-width: ;
    border-top-width: ;
    border-right-width: ;
    border-bottom-width: ;
    border-left-width: ;

    border-style: ;
    border-top-style: ;
    border-right-style: ;
    border-bottom-style: ;
    border-left-style: ;

    border-color: ;
    border-top-color: ;
    border-right-color: ;
    border-bottom-color: ;
    border-left-color: ;

    outline: ;
    list-style: ;

    table-layout: ;
    caption-side: ;
    border-collapse: ;
    border-spacing: ;
    empty-cells: ;

    /* 字体样式 */
    font: ;
    font-family: ;
    font-size: ;
    line-height: ;
    font-weight: ;
    text-align: ;
    text-indent: ;
    text-transform: ;
    text-decoration: ;
    letter-spacing: ;
    word-spacing: ;
    white-space: ;
    vertical-align: ;
    color: ;

    /* 背景 */
    background: ;
    background-color: ;
    background-image: ;
    background-repeat: ;
    background-position: ;

    /* 其他样式 */
    opacity: ;
    cursor: ;
    content: ;
    quotes: ;
}
```

### 浏览器厂商前缀

```css
.not-a-square {
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}
```

始终将无前缀的标注属性放置在最后，因为浏览器厂商一开始在实现带前缀的属性时可能跟标准不一致，详见[Ordering CSS3 Properties](https://css-tricks.com/ordering-css3-properties/)

## 属性内顺序

### background 属性简写

`background`简写属性在一个声明中可设置所有的背景属性。

可设置属性如下:

- `background-image`: 设置背景图像, 可以是真实的图片路径, 也可以是创建的渐变背景;
- `background-position`: 设置背景图像的位置;
- `background-size`: 设置背景图像的大小;
- `background-repeat`: 指定背景图像的铺排方式;
- `background-attachment`: 指定背景图像是滚动还是固定;
- `background-origin`: 设置背景图像显示的原点[`background-position`相对定位的原点];
- `background-clip`: 设置背景图像向外剪裁的区域;
- `background-color`: 指定背景颜色。

简写的顺序如下: bg-color || bg-image || bg-position [ / bg-size]? || bg-repeat || bg-attachment || bg-origin || bg-clip

顺序并非固定, 但是要注意:

`background-position`和`background-size`属性，之间需使用/分隔，且`background-position`值在前，`background-size`值在后。
如果同时使用`background-origin`和`background-clip`属性, `origin`属性值需在`clip`属性值之前, 如果`origin`与`clip`属性值相同, 则可只设置一个值。

需要注意的是，对于 CSS 预处理器来说，当在缩写里同时使用`background-position`和`background-size`时，中间的`/`会被当成除号对待，待找出解决办法。

### 其他

- 类似`margin`/`padding`这类具有四个值的属性，书写顺序是：上、右、下、左
