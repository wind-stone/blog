# 未分类内容

[[toc]]

## 编写原生 JavaScript 插件

### 插件需要满足的条件

一个可复用的插件需要满足以下条件：

- 插件自身的作用域与用户当前的作用域相互独立，也就是插件内部的私有变量不能影响使用者的环境变量；
- 插件需具备默认设置参数；
- 插件除了具备已实现的基本功能外，需提供部分API，使用者可以通过该API修改插件功能的默认参数，从而实现用户自定义插件效果；
- 插件需提供监听入口，及针对指定元素进行监听，使得该元素与插件响应达到插件效果；
- 插件支持链式调用。

Reference:

- [原生JavaScript插件编写指南](http://geocld.github.io/2016/03/10/javascript_plugin/)
- [如何定义一个高逼格的原生JS插件](https://www.jianshu.com/p/e65c246beac1)