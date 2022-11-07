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

| 分类/比较点 | 行内元素                                                                                                                  | 块级元素                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 内容        | 一般情况下，行内元素只能包含数据和其他行内元素                                                                            | 块级元素可以包含行内元素和其他块级元素（这种结构上的包含继承区别可以使块级元素创建比行内元素更”大型“的结构） |
| 格式        | 默认情况下，行内元素不会以新行开始，而块级元素会新起一行                                                                  | 默认情况下，块级元素会新起一行                                                                               |
| 大小        | `width`、`height`、`padding-top/bottom`、`margin-top/bottom`都不可控制，`padding-left/right`、`margin-left/right`可以控制 | `width`、`height`、`padding`、`margin`都可控制                                                               |
| 高度        |                                                                                                                           |

## 元素操作

### 查找元素

DOM 提供了查找元素的能力。比如:

- `querySelector`
- `querySelectorAll`
- `getElementById`
- `getElementsByName`
- `getElementsByTagName`
- `getElementsByClassName`

需要注意，以下的这几个 API 的性能都高于`querySelector`。

- `getElementById`
- `getElementsByName`
- `getElementsByTagName`
- `getElementsByClassName`

此外，以下的这几个 API 获取的集合并非数组，而是一个能够动态更新的集合。

- `getElementsByName`
- `getElementsByTagName`
- `getElementsByClassName`

```html
<div class="wind-stone"></div>

<script>
const divs = document.getElementsByClassName('wind-stone');
console.log(divs.length); // 1
const div = document.createElement('div');
div.setAttribute('class', 'wind-stone')
document.documentElement.appendChild(div)
console.log(divs.length); // 2
</script>
```

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

![幽灵空白节点导致图片下方产生空隙](./images/ghost-element.png)

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

![清除幽灵节点产生的空隙](./images/ghost-element-clear.png)

#### 利用幽灵空白节点垂直居中

```css
.ctn {
  line-height: 300px;
}
img {
  vertical-align: middle;
}
```

![垂直居中](./images/ghost-element-vertical-center.png)

需要注意的是，这里的居中并不是绝对的垂直居中，会略有一些偏差，只要再给`.ctn`元素添加`font-size: 0;`就可以实现绝对的垂直居中了，原因详见[张鑫旭 - CSS深入理解vertical-align和line-height的基友关系](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)

## a 标签

### 文件下载

- [前端如何实现文件下载？](https://yugasun.com/post/optimize-download-files-in-frontend.html)

#### download 属性

`download`属性无法使用重命名下载文件名

浏览器的兼容性问题：

- Firefox 考虑到安全问题，该下载文件必须是从自己的服务器或域名中的，否则将在浏览器中打开。
- 在 Chrome 和 Opear 中，如果说下载文件不是在子集的服务器或域名中，这些浏览器会忽视`download`属性，换句话来说，文件名不变。
- 其他浏览器还不支持

Reference: [`<a>`标签中download属性无法使用重命名下载文件名怎么解决?](https://www.zhihu.com/question/51032333)

#### 结合 a 标签的 download 属性 + window.open

`<a>`标签的`download`属性浏览器兼容性不好，因此可以先判断浏览器是否支持。支持的话，使用`download`属性；否则，使用`window.open`打开新页面下载。

根据以上描述，基于 Vue 2.0+ 创建了`download-link`组件，调用方式如下：

- 仅显示文本

```html
<download-link
  :url="excelTemplateUrl"
  text="素材 Excel 文件规范"
  name="素材 Excel 文件规范"
/>
```

- 显示 slot

```html
<download-link
  :url="excelTemplateUrl"
  name="素材 Excel 文件规范"
>
  <span>素材 Excel 文件规范</span>
</download-link>
```

其中，

- `url`：下载链接
- `name`：下载时默认的文件名称（`download`属性支持且不跨域，此字段才有效）
- `text`：`<a>`显示的文本

#### vue 组件

@[code vue](./download-link.vue)

## script 元素

### script 元素内的脚本执行

在页面执行`script`元素内的脚本内容时，通过`document.getElementsByTagName('script')`获取所有`script`标签，只能获得已经执行和正在执行的`script`元素，而当前正在执行的`script`元素之后的其他`script`元素都无法获取。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <title>script 测试</title>
    </head>
    <body>
        <script id="script-0">
          console.log('第一个 script');
        </script>
        <script id="script-1" type="text/javascript" data-hello="您好！" src="./outer.js"></script>
        <script id="script-2">
          console.log('inline script \n')
          var scripts2 = document.getElementsByTagName('script');

          [...scripts2].forEach(script => {
            console.log('  ', script.id)
          })
        </script>
    </body>
</html>
```

```js
// outer.js
console.log('outer script \n')
var scripts = document.getElementsByTagName('script');

[...scripts].forEach(script => {
  console.log('  ', script.id)
})
```

```js
// 页面加载并执行后的结果：

// 第一个 script
// outer script
//  script-0
//  script-1
// inline script
//  script-0
//  script-1
//  script-2
```

我们知道，浏览器里 JavaScript 脚本的执行是单线程的，而`script`元素的执行也是从上而下的。

在上面的示例里，当`outer.js`加载并执行时，获取整个文档里`script`的数量，只有 2 个，即`script-0`和`script-1`，而不能获取到内联脚本`script-2`。

这种情况，跟将`script`元素放在`body`元素内的头部位置，并在`script`里获取其之后的元素但获取不到的情况是一样的，因为此时后面的 DOM 元素还没有渲染出来。

### 获取 script 元素的特性

在示例里，我们为了打印方便，给每个`script`标签添加了`id`特性。但是在实际项目里，某个外链的`script`可能想获取到该`script`元素上的所有特性，但不是通过`id`的方式（除非第三方外链脚本强制要求调用者在`script`元素上添加特定`id`特性）。

```html
<script id="script-1" type="text/javascript" data-hello="您好！" src="./outer.js"></script>
```

针对上面这种情况，我们可以这样做:

```js
var scripts = document.getElementsByTagName('script');

var self = scripts[scripts.length - 1];

[...self.attributes].forEach(attr => {
  console.log(`name: ${attr.name}, value: ${attr.value}`)
})

// 打印结果：
// name: id, value: script-1
// name: type, value: text/javascript
// name: data-hello, value: 您好！
// name: src, value: ./log.js
```

## meta 标签

### theme-color 设置浏览器导航栏背景颜色

```html
<meta name="theme-color" content="#ff6633">
```

### charset 设置文档编码方式

```html
<meta charset="UTF-8">
```

添加了`charset`属性的`meta`标签无需再有`name`和`content`。`charset`属性描述了 HTML 文档自身的编码形式。因此，建议将这个标签放在`head`的第一个。这样，浏览器读到这个标签之前，处理的所有字符都是 ASCII 字符，众所周知，ASCII 字符是 UTF-8 和绝大多数字符编码的子集，所以，在读到`meta`之前，浏览器把文档理解多数编码格式都不会出错，这样可以最大限度地保证不出现乱码。

一般情况下，HTTP 服务端会通过 HTTP 头来指定正确的编码方式，但是有些特殊的情况如使用`file`协议打开一个 HTML 文件，则没有 HTTP 头，这种时候，`charset`的`meta`就非常重要了。
