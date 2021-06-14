# 选择器

[[toc]]

## 选择器优先级

CSS 标准用一个三元组`(a, b, c)`来构成一个复杂选择器的优先级。

- `id`选择器的数目记为`a`；
- 伪类选择器和`class`选择器的数目记为`b`；
- 伪元素选择器和标签选择器数目记为`c`；
- “*” 不影响优先级。

CSS 标准建议用一个足够大的进制，获取“a-b-c”来表示选择器优先级。即：

```js
specificity = base * base * a + base * b + c
```

其中，`base`是一个“足够大”的正整数。关于`base`，历史中有些趣闻，早年 IE6 采用 256 进制，于是就产生“256 个 class 优先级等于一个 id”这样的奇葩问题，后来扩大到 65536，基本避免了类似的问题。现代浏览器多采用了更大的数量，我们正常编写的 CSS 规则数量不太可能达到数万，因此我们可以认为这样的 base 就足够大了。

行内属性的优先级永远高于 CSS 规则，浏览器提供了一个“口子”，就是在选择器前加上“!important”。这个用法非常危险，因为它相当于一个新的优先级，而且此优先级会高于行内属性。

Copy from [Winter - CSS选择器：伪元素是怎么回事儿？](https://time.geekbang.org/column/article/84633)

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

## 命名规范

### BEM

BEM 是一种 CSS 类命名规范，通过 模块化和可维护的方式 编写样式。

BEM是 块（Block），元素（Element），修饰符（Modifier）的缩写。

Reference:

- [CSS使用BEM命名规范的五大理由](https://juejin.im/post/5a1c175551882535c470fe2c)
- [5 Reasons To Use BEM (a.k.a. why is BEM G.R.E.A.T.)](https://blog.elpassion.com/reasons-to-use-bem-a88738317753)
