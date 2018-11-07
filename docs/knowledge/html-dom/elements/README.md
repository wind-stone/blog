---
sidebarDepth: 0
---

# 元素

[[toc]]

## 元素分类

### 块级元素

- 总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示
- 宽度(`width`)、高度(`height`)、内边距(`padding`)和外边距(`margin`)都可控制

### 行内元素

行内元素，又称为内联元素，分为替换元素和非替换元素。

#### 替换元素

- 替换元素（`input`、`img`、`textarea`等）和相邻的内联元素在同一行
- 宽度(`width`)、高度(`height`)、内边距(`padding`)和外边距(`margin`)都可控制

#### 非替换元素

- 和相邻的内联元素在同一行
- 宽度(`width`)、高度(`height`)、内边距的`top`/`bottom`(`padding-top`/`padding-bottom`)和外边距的`top`/`bottom`(`margin-top`/`margin-bottom`)都不可改变（也就是`padding`和`margin`的`left`和`right`是可以设置的）

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

因为`vertical-align`默认取值为`baseline`的原因，幽灵空白节点经常会导致同级的内联元素底部出现空隙。

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
