# 【高级】回答问题，说明属性（DOM Property）和特性（HTML Attribute）的区别与联系

```html
<input id="input" type="sometype" value="1">
```

针对如上的 HTML，分别说出`type`属性/特性和`value`属性/特性的值，即

问题一：`value`的属性和特性分别是什么？如果此时用户清空输入框并输入`2`，`value`的属性/特性分别是什么？

问题二：`type`的属性和特性分别是什么？

```js
// 问题一，参考答案
input.getAttribute('value') // 1
input.value // 1

// 若用户清空输入框并输入 2
input.getAttribute('value') // 1
input.value // 1

// 问题二，参考答案
input.type // text
input.getAttribute('type') // sometype
```

B - 能回答对问题一，并能说明`value`的属性与特性的映射关系
A - 能回答对问题二，并能说明常见`type`的特性值
S - 说出属性和特性是如何映射的，并能说出一两个非一一映射的例子，比如`class`特性 vs `className`属性，`for` 特性 vs `htmlFor`属性

参考文档：

- [What is the difference between properties and attributes in HTML?](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html#answer-6004028)
- [HTML attribute 和 DOM property](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/blob/master/archives/015-dom-attributes-and-properties.md)
