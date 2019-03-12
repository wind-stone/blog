---
sidebarDepth: 0
---

# 元素特性

[[toc]]

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

## 超链接 rel = noopener

超链接里打开外部网站时，要在超链接上添加`res="noopener"`，详见[网站使用 rel="noopener" 打开外部锚](https://developers.google.com/web/tools/lighthouse/audits/noopener?hl=zh-cn)
