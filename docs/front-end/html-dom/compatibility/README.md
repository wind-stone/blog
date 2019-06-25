# 总览

## 文档滚动距离

### 标准模式

以垂直方向为例：

标准模式 | IE6 7 8 | IE9 | firefox | opera | chrome | safari
-- | -- | -- | -- | -- | -- | -- |
scrollY | undefined | undefined | 正确 | 正确 | 正确 | 正确
pageYOffset | undefined | 正确 | 正确 | 正确 | 正确 | 正确
body.scrollTop | 0 | 0 | 0 | 0 | 正确 | 正确
documentElement.scrollTop | 正确 | 正确 | 正确 | 正确 | 0 | 0

### quirk 模式

以垂直方向为例：

quirk 模式 | IE6 7 8 | IE9 | firefox | opera | chrome | safari
-- | -- | -- | -- | -- | -- | -- |
scrollY | undefined | undefined | 正确 | 正确 | 正确 | 正确
pageYOffset | undefined | 正确 | 正确 | 正确 | 正确 | 正确
body.scrollTop | 正确 | 正确 | 正确 | 正确 | 正确 | 正确
documentElement.scrollTop | 0 | 正确 | 0 | 0 | 0 | 0

Reference：[http://blog.sina.com.cn/s/blog_8ff228d50101n4y7.html](http://blog.sina.com.cn/s/blog_8ff228d50101n4y7.html)

### 兼容性写法

```js
// Reference: JavaScript 权威指南（第 6 版）--P390
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

## 视口尺寸

```js
// Reference: JavaScript 权威指南（第 6 版）--P391
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
```

## 元素相对于文档的位置

### getBoundingClientRect

```js
// Reference: JavaScript 权威指南（第 6 版）--P392
function getElementPosition(el) {
  const rect = el.getBoundingClientRect()  // 获取在视口坐标中的位置
  const scrollOffset = getScrollOffset()   // 获取文档滚动距离
  return {
    offsetLeft: rect.left + scrollOffset.scrollLeft,
    offsetTop: rect.top + scrollOffset.scrollTop,
  }
}
```

### 向上递归 offsetTop/offsetLeft

```js
// Reference: JavaScript 权威指南（第 6 版）--P394
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
```