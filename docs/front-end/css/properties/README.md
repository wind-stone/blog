---
sidebarDepth: 0
---

# 属性

[[toc]]

## 属性书写顺序

国外著名的 Web 前端专家 Andy Ford 推荐过一种按照类型分组排序的方式，他把 CSS 属性分为 7 大类：

- 显示与浮动（`Diplay`&`Flow`）
- 定位（`Positioning`）
- 尺寸（`Dimensions`）
- 边框相关属性（`Margins`、`Padding`、`Borders`、`Outline`）
- 字体样式（`Typographic Styles`）
- 背景（`Backgrounds`）
- 其他样式（`Opacity、Cursors、Generated Content`）

这种按照样式类型分组排列的方式不仅把功能相似的属性归类到一起，并且按照样式功能的重要性从上到下进行了排序。可以把影响元素页面布局的样式（如 `float`、`margin`、`padding`、`height`、`width`等）排到前面，而把不影响布局的样式（如`background`、`color`、`font`等）放到后面。这种主次分明的排列方式，极大地提高了代码的可维护性。

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

### 其他最佳实践

- 类似`margin`/`padding`这类具有四个值的属性，书写顺序是：上、右、下、左
- 不要用`0px`，而是`0`
- 颜色值
  - 尽量使用 #XXX
  - 不要使用单词
- 小数值：不要用`0.X`，而是`.X`

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

### rgba() 与 opacity

- `rgba()`和`opacity`都能实现透明效果
- `opacity`作用于元素，以及元素内的所有内容的透明度
- `rgba()`只作用于元素的颜色或其背景色，子元素不会继承透明效果

### display: none 与 visibility: hidden

- `display: none`
  - 元素不会影响布局，不会生成`box`，即不会出现在`formatting structure`里
  - 后代元素上设置`display`不为`none`，无法覆盖这种行为
- `visibility: hidden`
  - 元素会生成`box`，但是不可见（全透明，不会绘制任何东西），会影响布局
  - 后代元素可通过设置`visibility: visible`使得后代元素可见

## z-index

现在我们来说说什么情况下会产生新的层：

- 当一个元素位于 HTML 文档的最外层（`html`元素）
- 当一个元素被设置了`opacity`，`transform`, `filters`, `css-regions`, `paged media`等属性
- 当一个元素被定位了并且拥有一个`z-index`值（不为`auto`）

在同一个层内的层叠顺序（越往后越在上面）：

- 层的根元素，处于最下面
- 设置了`position`为`relative`或者`absolute`的元素，`z-index`<`0`的元素，`z-index`越小，越在下面，相同`z-index`的情况下，按照 HTML 元素的书写顺序排列
- 层内的默认没有定位的元素，设置了`position`为`relative`或者`absolute`的元素并且没有设置`z-index`、设置了`opacity`，`transforms`，`filters`，`css-regions`，`paged media`等属性的元素（新的层），相同`z-index`的情况下，按照 HTML 元素的书写顺序排列
- 设置了`position`为`relative`或者`absolute`的元素，`z-index`>`0`的元素，`z-index`越大，越在上面（新的层）

Reference

- [http://www.qianxingzhem.com/post-1667.html](http://www.qianxingzhem.com/post-1667.html)
- [http://web.jobbole.com/82884/](http://web.jobbole.com/82884/)

原文里："你只需要给红色的标签增加一个opacity小于1" 应该改成“你只需要给红色的标签外层的div增加一个opacity小于1”

## vertical-align

CSS 的属性`vertical-align`用来指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式。

也就意味着，`vertical-align`属性对块级元素是无效的。

## 设置 perspective 之后子元素的大小

如果父元素设置了 perspective 属性，且子元素设置了 translateZ，则子元素的大小公式为：

透视距离 / （透视距离-移动距离）

perspective / (perspective - distance)

```html
<div class="container”>
  <div class="parallax-child”></div>
</div>
```

```css
.container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  perspective: 1px;
  perspective-origin: 0 0;
}
.parallax-child {
  transform-origin: 0 0;
  transform: translateZ(-2px);
}
```

以上面为例，

父元素 perspective = 1

子元素 distance = -2

则最终 子元素看来变成了原来的 1/3，此时将子元素 scale(3) 将获得跟原来一样的视图

## CSS 3 里 width 属性的新取值：max/min-content、fit-content、fill-available

CSS 3 里，`width`属性又多了几个关键字取值：

“关键字”值 | 说明
--- | ---
`fill-available` | 元素自动充满剩余的空间（类似`div`元素默认宽度为父元素的`100%`），但是其`display`属性可以取其他任意值，比如`display: inline-block`
`max-content` | 先假设容器元素有足够的宽度，其内部元素将按容器元素有足够的空间来布局，`max-content`的值就是宽度最大的那个内部元素的宽度
`min-content` | 采用内部元素最小宽度值最大的那个元素的宽度作为最终容器的宽度
`fit-content` | 类似于`shrink-to-fit`，可以实现元素收缩效果，同时能保持原本的`display`属性特性

Reference: [张鑫旭 - 理解CSS3 max/min-content及fit-content等width值
](https://www.zhangxinxu.com/wordpress/2016/05/css3-width-max-contnet-min-content-fit-content/)

## 属性值的百分比

CSS 有些属性的属性值可以使用百分比值，那么这些百分比值都是相对哪些元素的哪些属性来说的呢？

属性 | 相对元素和属性 | 说明
--- | --- | ---
`width` | 包含块宽度`width` |
`padding` | 包含块的宽度`width` |
`margin` | 包含块的宽度`width` |
`left`/`right` | 包含块的宽度`width` |
`height` | 包含块高度`height` |
`top`/`bottom` | 包含块的高度`height` |
`vertical-align` | 该元素的`line-height` |
`font-size` | 父元素`font-size` |
