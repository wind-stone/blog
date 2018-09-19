---
sidebarDepth: 0
---

# 知识点

[[toc]]

## 浏览器 API

### URLSearchParams

URLSearchParams API 用于处理 URL 之中的查询字符串，即问号之后的部分。

没有部署不支持这个 API 的浏览器，可以用`url-search-params`这个垫片库。

URLSearchParams 有以下方法，用来操作某个参数。

- `has()`：返回一个布尔值，表示是否具有某个参数
- `get()`：返回指定参数的第一个值
- `getAll()`：返回一个数组，成员是指定参数的所有值
- `set()`：设置指定参数
- `delete()`：删除指定参数
- `append()`：在查询字符串之中，追加一个键值对
- `toString()`：返回整个查询字符串

以`get`为例：

```js
const paramsString = 'name=jawil&age=24';
const searchParams = new URLSearchParams(paramsString);
console.log(searchParams.get('name')); // jawil
```

详情请见[利用 URLSearchParams 对象获取URL之中的查询字符串，即问号之后的部分 #31](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/31#issuecomment-422712267)

## preload/prefetch

### preload

 `<link>`元素的`rel`属性的属性值`preload`能够让你在你的HTML页面中`<head>`元素内部书写一些声明式的资源获取请求，可以指明哪些资源是在页面加载完成后即刻需要的。对于这种即刻需要的资源，你可能希望在页面加载的生命周期的早期阶段就开始获取，在浏览器的主渲染机制介入前就进行预加载。这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。

```html
<head>
  <meta charset="utf-8">
  <title>JS and CSS preload example</title>
  <link rel="preload" href="style.css" as="style">
  <link rel="preload" href="hello-world.png" as="script">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<!-- ... -->
</body>
```

通俗的解释：

- 假设在如下的 HTML 文件里，`style.css`有张背景图片`hello-world.png`
- 无`preload`时，数据请求的顺序为：HTML -> `style.css` -> `hello-world.png`
- 有针对`hello-world.png`的`preload`时，数据请求的顺序为：HTML -> `style.css`、`hello-world.png`

Reference: [通过rel="preload"进行内容预加载](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)

### prefetch

链接预取是一种浏览器机制，其利用浏览器空闲时间来下载或预取用户在不久的将来可能访问的文档。网页向浏览器提供一组预取提示，并在浏览器完成当前页面的加载后开始静默地拉取指定的文档并将其存储在缓存中。当用户访问其中一个预取文档时，便可以快速的从浏览器缓存中得到。

Reference: [Link prefetching FAQ](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)

## mouseover/mouseout 与 mouseenter/mouseleave 的区别

- mouseover、mouseout 在（鼠标）指针移入、移出元素及其子元素时触发
- mouseenter、mouseleave 仅在（鼠标）指针移入、移出元素时触发，不关心子元素

## 图片的性能优化

- 图片懒加载：在页面上的未可视区域可以添加一个滚动事件，判断图片位置与浏览器顶端的距离与页面的距离，如果前者小于后者，优先加载
- 图片预加载：幻灯片、相册等可以使用技术，将当前展示图片的前一张和后一张优先下载
- CSS Sprite，SVG Sprite，Iconfont，Base64
- 如果图片过大，可以使用特殊编码的图片，加载时会先加载一张压缩的特别厉害的缩略图，以提高用户体验
- 如果图片展示区域小于图片的真实大小，则因在服务器端根据业务需要先行进行图片压缩，图片压缩后大小与展示一致

## JS Base64 编码/解码

### Base64 编码

```js
window.btoa('zhangxinxu');
// 返回：'emhhbmd4aW54dQ=='
```

### Base64 解码

```js
window.atob('emhhbmd4aW54dQ==');
// 返回：'zhangxinxu'
```

### 中文报错

涉及到给中文编码时，会出现报错，解决方法是编码之前先`encode`编码。

```js
window.btoa(window.encodeURIComponent('嘻嘻哈哈哈哈啦啦啦啦'));
window.decodeURIComponent(window.atob('JUU1JTk4JUJCJUU1JTk4JUJCJUU1JTkzJTg4JUU1JTkzJTg4JUU1JTkzJTg4JUU1JTkzJTg4JUU1JTk1JUE2JUU1JTk1JUE2JUU1JTk1JUE2JUU1JTk1JUE2'));
```

Reference: [张鑫旭-原来浏览器原生支持JS Base64编码解码](https://www.zhangxinxu.com/wordpress/2018/08/js-base64-atob-btoa-encode-decode/)
