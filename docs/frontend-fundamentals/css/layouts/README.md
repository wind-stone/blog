# 布局

[[toc]]

## 流类型

- `normal flow`，常规流/标准流/普通流，包含：
  - `block formatting`，BFC 即为`block formatting context`
  - `inline formatting`，IFC 即为`inline formatting context`
  - `relative positioning`
- `floats`，浮动
- `absolute positioning`，绝对定位

## 垂直居中

- 绝对定位 + 负margin值（固定宽高度）
- 绝对定位 + transform: translate（不固定宽高度）
- table-cell法（兼容低版本浏览器最好的方法）
- inline-block + 伪元素
- Flexbox法

详见：[元素水平垂直居中方法集锦](http://blog.csdn.net/cxl444905143/article/details/41890353)

## 外边距折叠

### 为什么会出现外边距折叠

主要为了排版的需要，因为在多数情况下，折叠垂直外边距可以在视觉上显得更美观，也更贴近设计师的预期。

## 清除浮动

浮动元素会影响它的兄弟元素的位置和让父元素产生高度塌陷，清除浮动的方法有

- clear: both（应用在空 div 元素或者父元素的 after 伪类上）
- br 标签的 clear 属性`<br clear="all">`
- 浮动父元素（触发 BFC）
- overflow: hidden（触发 BFC）
- display: table 或 table-cells（触发 BFC，display:table  本身并不产生 BFC，而是由它产生匿名框，匿名框中包含 "display:table-cell" 的框会产 BFC）

## shrink-to-fit

`shrink-to-fit`，指的是块级元素只占据内容所需要的宽度。`shrink-to-fit`，字面意思就是收缩包围。五种常见的使块元素`shrink-to-fit`的方式：

- 通过`float`属性
- 通过`display:inline/inline-block`
- 通过`position: absolute`
- 通过`display: table`

## box

`box`是 CSS 布局的对象和基本单位，直观点说就是一个页面是由很多个`box`组成的，元素的类型和`display`属性决定了`box`的类型。

### 块级元素/块级盒

块级元素（`block-level elements`）: 这些元素在源文档里视觉上格式化呈现为块，比如段落元素`p`、`div`等等，这些块级元素将生成一个块级主盒（`block-level principal box`）。除了这些原生的块级元素

- 块级盒（`block-level boxes`）
  - 当元素的`display`属性的值为`block`/`list-item`/`table`时，则元素是块级的`block-level`
  - 视觉上，块级元素（比如`p`）呈现为块，竖直排列
  - 每一个块级元素至少生成一个块级盒`block-level box`来参与 BFC，称为主要块级盒（`principal block-level box`）。有一些元素，比如`li`，会生成额外的盒来放置项目符号，不过多数元素只生成一个主要块级盒
- `inline-level boxes`: 行内级盒，也称为行内框
  - 当元素 CSS 的`display`属性的计算值为`inline`/`inline-block`或`inline-table`时，称它为行内级`inline-level`元素
  - 视觉上，行内级元素将其内容与其它行内级元素排列为多行。典型的如段落的内容，有文本或图片，都是行内级元素
  - 行内级元素生成行内级盒（`inline-level boxes`)，参与行内格式化上下文 IFC
- `flex container`
  - 当元素 CSS 的`display`属性的计算值为`flex`或`inline-flex`，称它为弹性容器
  - `display: flex`这个值会导致一个元素生成一个块级`block-level`弹性容器框
  - `display: inline-flex`这个值会导致一个元素生成一个行内级`inline-level`弹性容器框
- `grid container`
  - 当元素 CSS 的`display`属性的计算值为`grid`或`inline-grid`，称它为栅格容器
  - 栅格盒模型值，是一个仍处于实验中的属性

### 块容器盒（block container box）

符合以下的情况之一的盒子，即称为块容器盒（`block container box`），

- 只包含其他块级盒（`block-level boxes`）
- 生成一个行内格式化上下文 IFC，只包含行内盒（`inline-level boxes`）

若元素的主盒`principal box`是块容器盒，则该元素就是块容器元素`block container element`。

若是将非替换元素的`display`设置为`block`/`list-item`/`inline-block`，将会为该元素生成一个块容器盒。

不是所有的块容器盒都是块级盒（`block-level boxes`），

块级盒和块容器盒的区别在于：

- 块级盒（`block-level box`）是描述元素跟它的父元素与兄弟元素之间的表现。
- 块容器盒（`block container box`）描述元素跟它的后代之间的影响。

### 块盒

若块级盒，同时也是块容器盒，则称之为块盒（`block boxes`）

### 行盒

行盒(`line box`)，又称为行框，由行内格式化上下文 IFC 产生的盒，用于表示一行。在块盒里面，行盒从块盒一边排版到另一边。当有浮动时, 行盒从左浮动的最右边排版到右浮动的最左边。
