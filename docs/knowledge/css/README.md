---
sidebarDepth: 0
---

# 总览

[[toc]]

## 选择器篇

### CSS 选择器 效率

CSS 选择器效率从高到低的排序如下：

- ID选择器，比如 #header
- 类选择器，比如 .promo
- 元素选择器，比如 div
- 兄弟选择器，比如 h2 + p
- 子选择器，比如 li > ul
- 后代选择器，比如 ul a
- 通用选择器，比如 *
- 属性选择器，比如 type = “text”
- 伪类/伪元素选择器，比如 a:hover

Reference：[编写高效的 CSS 选择器](http://blog.jobbole.com/35339/)

### 浏览器从右到左解析

浏览器解析选择器是从右到左的方式，以 #nav a 为例，浏览器会寻找 a 的实例（可能有很多），然后沿着 DOM 树向上查找，确定实例是否在 id 为 nav 的容器里面。

Reference：

- [为什么排版引擎解析 CSS 选择器时一定要从右往左解析？](https://www.zhihu.com/question/20185756)
- [Why do browsers match CSS selectors from right to left?](http://stackoverflow.com/questions/5797014/why-do-browsers-match-CSS-selectors-from-right-to-left)

## 布局篇

### 垂直居中

- 绝对定位 + 负margin值（固定宽高度）
- 绝对定位 + transform: translate（不固定宽高度）
- table-cell法（兼容低版本浏览器最好的方法）
- inline-block + 伪元素
- Flexbox法

详见：[元素水平垂直居中方法集锦](http://blog.csdn.net/cxl444905143/article/details/41890353)

### 清除浮动

浮动元素会影响它的兄弟元素的位置和让父元素产生高度塌陷，清除浮动的方法有

- clear: both（应用在空 div 元素或者父元素的 after 伪类上）
- br 标签的 clear 属性`<br clear="all">`
- 浮动父元素（触发 BFC）
- overflow: hidden（触发 BFC）
- display: table 或 table-cells（触发 BFC，display:table  本身并不产生 BFC，而是由它产生匿名框，匿名框中包含 "display:table-cell" 的框会产 BFC）

### BFC

块级格式化上下文，Block Formatting Context

#### BFC 的触发

- 浮动元素，float 除 none 以外的值
- 绝对定位元素，position（absolute，fixed）
- display 为以下其中之一的值 inline-blocks，table-cells，table-captions
- overflow 除了 visible 以外的值（hidden，auto，scroll）

#### BFC 的特性

- 阻止外边距折叠
- 包含浮动的元素
- 阻止元素被浮动元素覆盖

详见：[清除浮动及 BFC（块级格式化上下文）](http://blog.csdn.net/cxl444905143/article/details/42266723)

### shrink-to-fit

shrink-to-fit，指的是块级元素只占据内容所需要的宽度。Shrink-To-Fit，字面意思就是收缩包围。五种常见的使块元素shrink-to-fit的方式：

- 通过 float 属性
- 通过 display:inline/inline-block
- 通过 position:absolute
- 通过 display:table

## 属性篇

### `rgba()`与`opacity`

- `rgba()`和`opacity`都能实现透明效果
- `opacity`作用于元素，以及元素内的所有内容的透明度
- `rgba()`只作用于元素的颜色或其背景色，子元素不会继承透明效果

### 关于 z-index

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

### fixed + transform

- [经过 transform 后的元素的子元素的 fixed 定位将以 transform 的元素为包含块进行定位，并失去固定效果](http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/)

### 设置 perspective 之后子元素的大小

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

### CSS 3 里 width 属性的新取值：max/min-content、fit-content、fill-available

CSS 3 里，`width`属性又多了几个关键字取值：

“关键字”值 | 说明
--- | ---
`fill-available` | 元素自动充满剩余的空间（类似`div`元素默认宽度为父元素的`100%`），但是其`display`属性可以取其他任意值，比如`display: inline-block`
`max-content` | 先假设容器元素有足够的宽度，其内部元素将按容器元素有足够的空间来布局，`max-content`的值就是宽度最大的那个内部元素的宽度
`min-content` | 采用内部元素最小宽度值最大的那个元素的宽度作为最终容器的宽度
`fit-content` | 类似于`shrink-to-fit`，可以实现元素收缩效果，同时能保持原本的`display`属性特性

Reference: [张鑫旭 - 理解CSS3 max/min-content及fit-content等width值
](https://www.zhangxinxu.com/wordpress/2016/05/css3-width-max-contnet-min-content-fit-content/)

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

## 问答篇

### CSS 中可以通过哪些属性定义，使得一个DOM元素不显示在浏览器可视范围内？

- 设置`display: none`
- 设置`visibility: hidden`
- 设置`width: 0; height: 0;`
- 设置`opacity: 0`
- 设置`z-index: -1000` (小于`0`)
- 其父元素`overflow:hidden`，该元素`margin-left: -9999px`
- 若是文本元素，设置`text-indent: -9999px`
- ...

### 如何实现自适应的正方形？

#### 解决思路一：`padding-top/bottom`百分比取值

`padding-top/bottom`取值为百分比时，是相对父元素的宽度进行计算的，因此可以这样：

```css
/* 方式一：设置 `padding-top/bottom`撑开容器 */
.placeholder {
    width: 100%;
    height: 0;  /* 不设置此项时，增加内容会增加 height；设置为 0，可保证元素为正方形 */
    padding-bottom: 100%;
}
```

但是以上也有弊端：无法设置元素的`max-height`（因为元素的`height`都为`0`，更不谈`max-height`了..）

```css
/* 方式二：利用伪元素的 margin/padding-top/bottom 撑开容器 */
.placeholder {
    width: 100%;
    max-height: 100px; /* 此时可以愉快的设置 max-height */
    overflow: hidden; /* 使用 margin-top/bottom 时需要触发 BFC，消除 margin 重叠 */
}
.placeholder:after {
    content: '';
    display: block;
    margin-top: 100%;
}
```

但是，在`.placeholder`元素里添加内容，依然会增加`height`，可以将内容单独放在其他标签内，并绝对定位

#### 解决思路二：CSS3 vw 单位

CSS3 中新增了一组相对于可视区域百分比的长度单位`vw`, `vh`, `vmin`, `vmax`。其中`vw`是相对于视口宽度百分比的单位，1`vw` = 1% viewport width，`vh`是相对于视口高度百分比的单位，1`vh` = 1% viewport height；`vmin`是相对当前视口宽高中`较小`的一个的百分比单位，同理`vmax`是相对当前视口宽高中`较大`的一个的百分比单位。

利用`vw`单位，我们可以很方便做出自适应的正方形：

```css
.placeholder {
    width: 100%; /* 假设 100% 是指屏幕宽度 */
    height: 100vw;
}
```
