---
sidebarDepth: 0
---

# 布局

[[toc]]

## 垂直居中

- 绝对定位 + 负margin值（固定宽高度）
- 绝对定位 + transform: translate（不固定宽高度）
- table-cell法（兼容低版本浏览器最好的方法）
- inline-block + 伪元素
- Flexbox法

详见：[元素水平垂直居中方法集锦](http://blog.csdn.net/cxl444905143/article/details/41890353)

## 清除浮动

浮动元素会影响它的兄弟元素的位置和让父元素产生高度塌陷，清除浮动的方法有

- clear: both（应用在空 div 元素或者父元素的 after 伪类上）
- br 标签的 clear 属性`<br clear="all">`
- 浮动父元素（触发 BFC）
- overflow: hidden（触发 BFC）
- display: table 或 table-cells（触发 BFC，display:table  本身并不产生 BFC，而是由它产生匿名框，匿名框中包含 "display:table-cell" 的框会产 BFC）

## BFC

块级格式化上下文，Block Formatting Context

### BFC 的触发

- 浮动元素，float 除 none 以外的值
- 绝对定位元素，position（absolute，fixed）
- display 为以下其中之一的值 inline-blocks，table-cells，table-captions
- overflow 除了 visible 以外的值（hidden，auto，scroll）

### BFC 的特性

- 阻止外边距折叠
- 包含浮动的元素
- 阻止元素被浮动元素覆盖

详见：[清除浮动及 BFC（块级格式化上下文）](http://blog.csdn.net/cxl444905143/article/details/42266723)

## shrink-to-fit

shrink-to-fit，指的是块级元素只占据内容所需要的宽度。Shrink-To-Fit，字面意思就是收缩包围。五种常见的使块元素shrink-to-fit的方式：

- 通过 float 属性
- 通过 display:inline/inline-block
- 通过 position:absolute
- 通过 display:table

## fixed + transform

- [经过 transform 后的元素的子元素的 fixed 定位将以 transform 的元素为包含块进行定位，并失去固定效果](http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/)