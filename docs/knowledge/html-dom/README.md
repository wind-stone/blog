---
sidebarDepth: 0
---

# 总览

[[toc]]

## 特性

## 布尔特性（Boolean Attributes）

简言之，如下三种表示`disabled`

```html
<!--
  表示选中，其中只能如下三种，其他表示均无效
  - 仅有特性名称
  - 特性名称 + value
    - value 是跟特性名称完全一样的字符串
    - value 为空字符串
-->
<input type="checkbox" checked>
<input type="checkbox" checked="checked">
<input type="checkbox" checked="">

<!-- 表示不选中，该特性不能存在 -->
<input type="checkbox">
```

- [HTML Boolean Attributes](http://www.xiaocaoge.com/html-boolean-attributes.html)
- [Boolean attributes](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes)

## 元素分类

### 块级元素

- 总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示
- 宽度(`width`)、高度(`height`)、内边距(`padding`)和外边距(`margin`)都可控制

### 行内元素

行内元素分为替换元素和非替换元素。

#### 替换元素

- 替换元素（`input`、`img`、`textarea`等）和相邻的内联元素在同一行
- 宽度(`width`)、高度(`height`)、内边距(`padding`)和外边距(`margin`)都可控制

#### 非替换元素

- 和相邻的内联元素在同一行
- 宽度(`width`)、高度(`height`)、内边距的`top`/`bottom`(`padding-top`/`padding-bottom`)和外边距的`top`/`bottom`(`margin-top`/`margin-bottom`)都不可改变（也就是`padding`和`margin`的`left`和`right`是可以设置的）

## properties 和 attributes 的区别

当写 HTML 源代码时，你可以在 HTML 元素上定义特性 attribute。一旦浏览器解析了你的代码，将产生一个对应的 DOM 节点。这个节点是个对象，因而它具有属性 property。

例如，如下 HTML 元素：

```html
<input type="text" value="Name:">
```

有两个特性 atrribute。

一旦浏览器解析这段代码，将产生一个 HTMLInputElement 对象，并且这个对象将包含几十个属性 property，比如：accept，accessKey，align，alt，attributes，autofocus，baseURI，checked，childElementCount，childNodes，children，classList，className，clientHeight等等。

对于 DOM 节点对象来说，属性 property 是节点对象的属性 property，特性 attribute 是节点对象的 attributes 属性的元素。
（For a given DOM node object, properties are the properties of that object, and attributes are the elements of the attributes property of that object.）

对于给定的 HTML 元素，其 DOM 节点创建时，它的许多属性 property 以相同或者相似的名字与特性 attribute 相关联，但是不是一一对应的关系。例如，对于以下的 HTML 元素：

```html
<input id="the-input" type="text" value="Name">
```

与之对应的 DOM 节点会有 id、type 和 value 属性：

- id 属性映射到 id 特性：获取属性 property 时将读取特性 attribute 的值，设置属性 property 时将重写特性 attribute 的值。id 是纯映射属性，它不会修改或者限制值。
- type 属性映射到 type 特性：获取属性 property 时将读取特性 attribute 的值，设置属性 property 时将重写特性 attribute 的值。type 不是纯映射属性，因为它的取值限制于已知的值（即 input 元素 type 的有效值）。如果有`<input type="foo">`，则`theInput.getAttribute("type")`会得到`foo`，但是`theInput.type`会得到`text`。
- 相反的，value 属性不会映射到 value 特性。取而代之的是，value 属性将获得 input 的当前值。当用户手动的改变 input 输入框的 value 值，value 属性将反映出这个改变。因此如果用户输入 'John'，则：

```js
theInput.value // returns "John"
```

而

```js
theInput.getAttribute("value") // returns "Name"
```

value 属性反映出 input 输入框的当前 text-content，而 value 特性包含了 input 输入框 value 特性的初始 text-content。

因此如果你想要知道文本输入框的当前值，读取属性 property。如果你想要知道文本输入框的初始值，读取特性 attribute。或者你可以使用 defaultValue 属性，这是一个 value 特性的映射属性。

```js
theInput.value                 // returns "John"
theInput.getAttribute("value") // returns "Name"
theInput.defaultValue          // returns "Name"
```

有好几个属性时直接映射到它们对应的特性 attribute 上的，比如 rel 和 id。一些属性也是直接映射的，但是名字稍有不同，比如 htmlFor 属性映射到 for 特性，className 映射到 class 特性。还有许多属性映射到它们对应的特性，但是有限制和修改，比如 src、href、disabled、multiple等等。[这份文档](https://www.w3.org/TR/html5/infrastructure.html#reflect)包含了各种各样的映射。

翻译自：[http://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028](http://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)

### iframe 元素

若是将`src`不为空的`iframe`元素设置成`display: none;`，再次将`display`属性设置为非`none`属性值时，会导致`iframe`重新加载网页。

## 元素大小

![元素大小](./element-size.gif)

### scrollWidth/scrollHeight

包含滚动内容的元素的大小。

有些元素如`<html>`元素，即使没有执行任何代码也能自动地添加滚动条；但另外一些元素，则需要通过 CSS 的
`overflow`属性进行设置才能滚动。

以下是 4 个与滚动大小相关的属性。

- `scrollWidth`：在没有滚动条的情况下，元素内容的总宽度。
- `scrollHeight`：在没有滚动条的情况下，元素内容的总高度。
- `scrollLeft`：被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置。
- `scrollTop`：被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置。

### clientWidth/clientHeigh

元素内容及其内边距所占据的空间大小，不包括滚动条，不包括隐藏的区域

### offsetWidth/offsetHeight

包括元素在屏幕上占用的所有可见的空间。

元素的可见大小由其高度、宽度决定，包括所有内边距、滚动条和边框大小（注意，不包括外边距）。

通过下列4 个属性可以取得元素的偏移量。

- `offsetWidth`：元素在水平方向上占用的空间大小，包括元素的宽度、（可见的）垂直滚动条的宽度、左边框宽度和右边框宽度。
- `offsetHeight`：元素在垂直方向上占用的空间大小，包括元素的高度、（可见的）水平滚动条的高度、上边框高度和下边框高度。
- `offsetLeft`：元素的左外边框至包含元素的左内边框之间的像素距离。
- `offsetTop`：元素的上外边框至包含元素的上内边框之间的像素距离。

其中，`offsetLeft`和 `offsetTop`属性与包含元素有关，包含元素的引用保存在`offsetParent`属性中。`offsetParent`属性不一定与`parentNode`的值相等。例如`td`元素的`offsetParent`是作为其祖先元素的`table`元素，因为`table`是在DOM层次中距`td`最近的一个具有大小的元素。

### 元素大小和位置

IE、Firefox 3+、Safari 4+、Opera 9.5 及Chrome 为每个元素都提供了一个`getBoundingClientRect()`方法。这个方法返回会一个矩形对象，包含 6 个属性：

- `width`、`height`：元素的高度和宽度
- `left`、`top`、`right`、`bottom`：元素相对于视口左上角的位置

内联元素可能跨越了多行，可能由多个矩形组成。`getClientRects()`方法获得一个只读的类数组对象，它的每一个元素类似于`getBoundingClientRect()`返回的矩形对象。--《JavaScript 权威指南（第6版）》P392

详见：[http://blog.csdn.net/freshlover/article/details/8985887](http://blog.csdn.net/freshlover/article/details/8985887)
