---
sidebarDepth: 0
---

# web components

[[toc]]

## 背景

组件框架目前无序、缺乏标准以及低效复用方面的问题需要通过组件标准化来解决，而 Web Components 则是标准化的一个很好的选择。

Web Components 的标准化只规范接口，而底层的实现是完全自由的，自由到你可以使用 Web 技术来实现也可以使用 Native技术。

Reference: [http://fex.baidu.com/blog/2014/05/web-components-future-oriented/](http://fex.baidu.com/blog/2014/05/web-components-future-oriented/)

## 详细内容

### template

[HTML's New Template Tag](https://www.html5rocks.com/en/tutorials/webcomponents/template/)

### Custom Element

- 自定义属性默认：`display: inline`

[自定义元素 v1：可重用网络组件](https://developers.google.cn/web/fundamentals/web-components/customelements)

### Shadow DOM

[Shadow DOM v1：独立的网络组件](https://developers.google.cn/web/fundamentals/web-components/shadowdom?hl=zh-cn)

#### CSS contain 属性

[CSS性能优化新属性 contain 的语法、作用及使用场景](http://www.webhek.com/post/css-contain-property.html)

### HTML Import

[HTML Imports](https://www.html5rocks.com/en/tutorials/webcomponents/imports/)

Reference

- [阮一峰 Web Components](http://javascript.ruanyifeng.com/htmlapi/webcomponents.html)

## 总结

- HTML template 规范
  - 可以编写可复用的 HTML 模板，包括 CSS 和 JavaScript
  - 但是模板里的样式和脚本是作用于整个页面。
- 自定义元素
  - 继承自 HTMLElement 类，有自己的方法和生命周期
  - 可以往自定义元素内插入子节点，作为自定义元素的内容，就跟`div`元素的子节点一样，外部可以访问自定义元素内部的元素
  - 外部的样式能影响自定义元素内部的元素，自定义元素内部的样式能影响外部元素
  - 外部的脚本能访问到自定义元素内部的元素，自定义元素内部的脚本（包括自定义组件里的方法）能访问外部的元素
  - 可以将 template 里内容作为自定义元素的子节点，但是 template 里的样式还是作用于整个页面
  - 自定义元素一旦绑定了 shadow DOM
    - 就不能再作为 light DOM，就无法添加子元素了（或者添加了没有效果）
    - 只能操作 shadow Root，将内容插入到 shadow Root 下
  - 自定义元素的方法内既能通过`this.shadowRoot`访问到 Shadow Dom，又能访问外部的`document`、`window`等对象
  - 自定义元素标签也是 Light Dom 里常规的标签，默认`display: inline`
- Shadow Dom
  - 不止自定义元素有 Shadow Dom，常规元素也有
  - Shadow DOM ”能够隔离 CSS 和 JavaScript
  - 当元素绑定 Shadow Dom 后，元素的内容会作为 slot 传入到 Shadow Dom 内对应的位置，即有插槽功能
  - 外部更改自定义组件内部 Shadow Dom 样式的方法
    - 通过 CSS 变量的方式更改：自定义组件内部声明 CSS 变量，且可以动态修改 CSS 变量的值；自定义组件 Shadow Dom 内部使用 CSS 变量
    - 通过`::part()`和`::theme()`伪选择器

总结参考的文档来源于一组译文：

1. [Web Components简介](https://juejin.im/post/6844903807734775816)
2. [编写可以复用的 HTML 模板](https://juejin.im/post/6844903813116067853)
3. [从 0 创建自定义元素](https://github.com/xitu/gold-miner/blob/master/TODO1/creating-a-custom-element-from-scratch.md)
4. [使用 Shadow DOM 封装样式和结构](https://github.com/xitu/gold-miner/blob/master/TODO1/encapsulating-style-and-structure-with-shadow-dom.md)
