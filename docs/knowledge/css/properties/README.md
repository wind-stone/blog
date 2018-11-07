---
sidebarDepth: 0
---

# 属性

[[toc]]

## 属性书写顺序

同一 rule set 下的属性在书写时，应按功能进行分组，并以 Formatting Model（布局方式、位置） > Box Model（尺寸） > Typographic（文本相关） > Visual（视觉效果） 的顺序书写，以提高代码的可读性。

- Formatting Model 相关属性包括：position / top / right / bottom / left / float / display / overflow 等
- Box Model 相关属性包括：border / margin / padding / width / height 等
- Typographic 相关属性包括：font / line-height / text-align / word-wrap 等
- Visual 相关属性包括：background / color / transition / list-style 等

- 另外，如果包含 content 属性，应放在最前面。

Reference：[百度-CSS 编码规范](https://github.com/fex-team/styleguide/blob/master/css.md)

## rgba() 与 opacity

- `rgba()`和`opacity`都能实现透明效果
- `opacity`作用于元素，以及元素内的所有内容的透明度
- `rgba()`只作用于元素的颜色或其背景色，子元素不会继承透明效果

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

## background 属性简写

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

## 属性值的百分比

CSS 有些属性的属性值可以使用百分比值，那么这些百分比值都是相对哪些元素的哪些属性来说的呢？

属性 | 相对元素和属性 | 说明
--- | --- | ---
`width` | 包含块宽度`width` |
`height` | 包含块高度`height` |
`padding` | 包含块的宽度`width` |
`margin` | 包含块的宽度`width` |
`vertical-align` | 该元素的`line-height` |
