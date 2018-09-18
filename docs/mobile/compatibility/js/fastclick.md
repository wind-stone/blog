---
sidebarDepth: 0
---

# fastclick

[[toc]]

问题描述：[Android 浏览器文本垂直居中问题](http://imweb.io/topic/5848d0fc9be501ba17b10a94)

## 手动触发 element.click() 无效

### 问题描述

可能存在这样的需求，点击一元素`div1`，在`div1`元素的`click`回调函数里再触发另一元素`div2`的`click`事件。

```html
<div class="div1">点击此处</div>
<div class="div2"></div>
```

```js
// 页面里使用了 fastclick，此处省略了使用 fastclick 的代码

const $div1 = $('.div1');
const $div2 = $('.div2');
$div1.on('click', function () {
  // 获取原生 div2 元素，调用原生的 click 事件
  $div2[0].click();
});

$div2.on('click', function () {
  $div2[0].click();
  console.log('div2 的 click 事件触发');
});
```

若是使用了`fastclick`，在 iOS 上，`$div2[0].click()`这一行代码不会生效。

[记录fastclick中一次手动触发click事件失败](https://segmentfault.com/a/1190000009246194)，这篇文章解释了原因，并给出了解决方法一，详见下方。

### 问题原因

待读源码，详解原因。

### 解决方案

#### 方案一：添加 needsclick 类

在`div2`元素上添加`needsclick`类

```html
<div class="div1 needsclick">点击此处</div>
<div class="div2"></div>
```

#### 方案二：使用 element.dispatchEvent(event) 触发事件

```js
$div1.on('click', function () {
  const event = new MouseEvent('click');
  $div2[0].dispatchEvent(event);
});
```
