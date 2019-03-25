---
sidebarDepth: 0
---

# 总览

[[toc]]

## preload、prefetch

- `preload`
  - 高优先级
  - 浏览器预先请求当前页必须需要的资源，以避免在用到的时候实时去请求
  - 应用场景：假设主 JS 文件里会动态创建`image`标签，并插入到 DOM 里
    - 不采用`preload`，则时间线是这样的：请求主 JS 文件 --> 执行主 JS 文件 --> 创建`image`标签并插入 DOM --> 请求`image`文件 --> 渲染到页面
    - 采用`preload`预加载`image`，则时间线是这样的：请求主 JS 文件、`image`文件 --> 创建`image`标签并插入 DOM（此时`image`文件已经加载好） --> 渲染到页面
  - 不会阻塞渲染，不会阻塞`window`的`onload`事件
- `prefetch`
  - 低优先级
  - 浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中

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
