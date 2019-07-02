---
sidebarDepth: 0
---

# preload、prefetch

## preload

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

## prefetch

链接预取是一种浏览器机制，其利用浏览器空闲时间来下载或预取用户在不久的将来可能访问的文档。网页向浏览器提供一组预取提示，并在浏览器完成当前页面的加载后开始静默地拉取指定的文档并将其存储在缓存中。当用户访问其中一个预取文档时，便可以快速的从浏览器缓存中得到。

Reference: [Link prefetching FAQ](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)

## 对比

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
