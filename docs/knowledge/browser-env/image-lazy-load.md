---
sidebarDepth: 0
---

# 图片懒加载

[[toc]]

图片的懒加载其实就是延迟加载图片，仅当图片出现在可视区域内（或离可视区域有一定距离时）才开始加载图片。

对于有大量图片的网页来说，懒加载可以避免在打开网页时同时加载过多资源，起到性能优化的作用。

## 原理

初始加载时不设置`img`的`src`属性（或者`src`属性设置成占位图片地址），将真实的图片地址放置在 `data-src`属性里，后续当图片进入到页面的可视区域后，将`data-src`属性值取出赋值给`src`属性，此时再去请求图片

## 相关插件

## 如何判断图片处于页面可视区域？

### 方法一：getBoundingClientRect （推荐）

`Element.getBoundingClientRect()`方法返回一个`DOMRect`对象，该对象包含的属性包括`Element`元素的大小（`width`、`height`）及其相对于视口左上角的位置（`top`、`left`、`right`、`bottom`）

```js
function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  const viewportSize = getViewportSize()
  const vpHeight = viewportSize.width
  const vpWidth = viewportSize.height

  return 0 < rect.bottom && rect.top < vpHeight ||
         0 < rect.right && rect.left < vpWidth
}
```

### 方法二：offsetTop/offsetLeft、scrollTop/srollLeft

```js
function isInViewport(el) {
  const scrollOffset = getScrollOffset()
  const scrollTop = scrollOffset.scrollTop
  const scrollLeft = scrollOffset.scrollLeft

  const viewportSize = getViewportSize()
  const vpHeight = viewportSize.height
  const vpWidth = viewportSize.width

  const height = el.offsetHeight
  const width = el.offsetWidth

  const elPos = getElementPosition(el)
  const offsetLeft = elPos.offsetLeft
  const offsetTop = elPos.offsetTop

  return -height < offsetTop - scrollTop && offsetTop - scrollTop < vpHeight ||
         -width < offsetLeft - scrollLeft && offsetLeft - scrollLeft < vpWidth
}
```

### 方法三：原生 IntersectionObserver 函数

Referrence:

- [justjavac：IntersectionObserver #10](https://github.com/justjavac/the-front-end-knowledge-you-may-dont-know/issues/10)
- [阮一峰：IntersectionObserver API 使用教程](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
- [原生JS实现最简单的图片懒加载](https://segmentfault.com/a/1190000010744417)

### 工具函数

```js
// 获取视口尺寸
function getViewportSize(win = window) {
  if (win.innerWidth !== undefined) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
  const doc = win.document
  if (doc.compatMode === 'CSS1Compat') {
    // 标准模式下的 IE（或任何浏览器）
    return {
      width: doc.documentElement.clientWidth,
      height: doc.documentElement.clientHeight
    }
  }

  // 怪异模式下的浏览器
  return {
    width: doc.body.clientWidth,
    height: doc.body.clientHeight
  }
}

// 获取元素距离文档的距离
function getElementPosition(el) {
  let offsetLeft = 0, offsetTop = 0
  while(el !== undefined) {
    offsetLeft += el.offsetLeft
    offsetTop += el.offsetTop
    el = el.offsetParent
  }
  return {
    offsetLeft
    offsetTop
  }
}

// 获取文档的滚动距离
function getScrollOffset(win = window) {
  if (win.pageXOffset !== undefined) {
    // 除了 IE8 及更早版本，其他浏览器都能用
    return {
      scrollTop: win.pageYOffset,
      scrollLeft: win.pageXOffset
    }
  }
  const doc = win.document
  if (doc.compatMode === 'CSS1Compat') {
    // 标准模式下的 IE（或任何浏览器）
    return {
      scrollTop: doc.documentElement.scrollTop,
      scrollLeft: doc.documentElement.scrollLeft
    }
  }

  // 怪异模式下的浏览器
  return {
    scrollTop: doc.body.scrollTop,
    scrollLeft: doc.body.scrollLeft
  }
}
```
