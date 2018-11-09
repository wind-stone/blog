---
sidebarDepth: 0
---

# 元素

[[toc]]

## 元素分类

### 可替换元素 VS 非替换元素

#### 可替换元素

CSS 里，可替换元素（replaced element）的展现不是由 CSS 来控制的。这些元素是一类外观渲染独立于 CSS 的外部对象。 典型的可替换元素有`img`、`object`、`video`和表单元素，如`textarea`、`input`。某些元素只在一些特殊情况下表现为可替换元素，例如`audio`和`canvas`。 通过 CSS content 属性来插入的对象，被称作匿名可替换元素（anonymous replaced elements）。

CSS 在某些情况下会对可替换元素做特殊处理，比如计算外边距和一些`auto`值。

需要注意的是，一部分（并非全部）可替换元素，本身具有尺寸和基线（`baseline`），会被像`vertical-align`之类的一些 CSS 属性用到。

### 块级元素 VS 行内元素

#### 块级元素

块级元素生成一个（默认情况下）元素框，填充其父元素的内容区域，并且在其两侧不能有其他元素，即它在元素框之前和之后生成“断行”。

#### 行内元素

#### 差别

分类/比较点 | 行内元素 | 块级元素
--- | --- | ---
内容 | 一般情况下，行内元素只能包含数据和其他行内元素 | 块级元素可以包含行内元素和其他块级元素（这种结构上的包含继承区别可以使块级元素创建比行内元素更”大型“的结构）
格式 | 默认情况下，行内元素不会以新行开始，而块级元素会新起一行 | 默认情况下，块级元素会新起一行
大小 | `width`、`height`、`padding-top/bottom`、`margin-top/bottom`都不可控制，`padding-left/right`、`margin-left/right`可以控制 | `width`、`height`、`padding`、`margin`都可控制
高度 | |

## 特别的元素

### iframe 元素

若是将`src`不为空的`iframe`元素设置成`display: none;`，再次将`display`属性设置为非`none`属性值时，会导致`iframe`重新加载网页。

### 幽灵空白节点

> 在HTML5文档声明下，块状元素内部的内联元素的行为表现，就好像块状元素内部还有一个（更有可能两个-前后）看不见摸不着没有宽度没有实体的空白节点，这个假想又似乎存在的空白节点，我称之为“幽灵空白节点”。-- [张鑫旭 - CSS深入理解vertical-align和line-height的基友关系](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)

#### 影响

```html
<div class="ctn">
  <img src="./example.jpg">
</div>
```

```css
.ctn {
  background-color: red;
}
```

![幽灵空白节点导致图片下方产生空隙](./img/ghost-element.png)

幽灵空白节点会继承父元素的`font-size`和`line-height`，而默认的`line-height`取值是`normal`，一般约为`1.2`倍的`font-size`（具体取决于元素的`font-family`），导致幽灵空白节点所占据位置的最下方与节点的基线位置的距离是超过`0`的。

且内联元素`vertical-align`默认取值为`baseline`，而示例中图片作为替换元素，其`baseline`是图片的底部，幽灵空白节点的`baseline`是字符的基线，因此导致图片下方产生空隙，空隙的高度就是幽灵空白节点占据位置的最下方与节点内字符基线位置的距离。

#### 清除幽灵空白节点

清除幽灵空白节点影响的方式有如下几种：

- 让`vertical-align`失效

```css
img {
  display: block;
}
```

PS: `vertical-align`只用来指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式，对块级元素无效。

- `vertical-align`取其他值，如`top`/`middle`/`bottom`

```css
img {
  vertical-align: middle;
}
```

- 直接修改`line-height`值

```css
.ctn {
  line-height: 1px;
}
```

图片下方的空隙高度，实际上是文字计算后的行高值和字母`x`下边缘的距离。因此，只要行高足够小，实际文字占据的高度的底部就会在`x`的上面，下面没有了高度区域支撑，自然，图片就会有容器底边贴合在一起了，比如设置为`1px`或`0`。

此外，若是`.ctn`元素没有设置`line-height`属性，则`line-height`的默认值是相对于`font-size`的相对值，我们也可以设置`font-size: 0`来间接将`line-height`设置为`0`。

```css
.ctn {
  font-size: 0;
}
```

![清除幽灵节点产生的空隙](./img/ghost-element-clear.png)

#### 利用幽灵空白节点垂直居中

```css
.ctn {
  line-height: 300px;
}
img {
  vertical-align: middle;
}
```

![垂直居中](./img/ghost-element-vertical-center.png)

需要注意的是，这里的居中并不是绝对的垂直居中，会略有一些偏差，只要再给`.ctn`元素添加`font-size: 0;`就可以实现绝对的垂直居中了，原因详见[张鑫旭 - CSS深入理解vertical-align和line-height的基友关系](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)
