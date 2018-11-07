---
sidebarDepth: 0
---

# 选择器

[[toc]]

## CSS 选择器 效率

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

## 浏览器从右到左解析

浏览器解析选择器是从右到左的方式，以 #nav a 为例，浏览器会寻找 a 的实例（可能有很多），然后沿着 DOM 树向上查找，确定实例是否在 id 为 nav 的容器里面。

Reference：

- [为什么排版引擎解析 CSS 选择器时一定要从右往左解析？](https://www.zhihu.com/question/20185756)
- [Why do browsers match CSS selectors from right to left?](http://stackoverflow.com/questions/5797014/why-do-browsers-match-CSS-selectors-from-right-to-left)
