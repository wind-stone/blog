---
sidebarDepth: 0
---

# fastclick

[[toc]]

## 实现原理

`fastclick`是通过在`touchstart`里记录触摸点信息，在`touchend`里判断此次触摸是否是个有效的`click`点击，如果是，则在`touchend`里阻止默认事件以防止产生原生`click`事件（因为会有 300ms 的延迟），并立即生成并触发自定义的`click`事件（没有延迟）

## 哪些情况不需要 fastclick

在代码里引入`fastclick`后，初始化`fastclick`时会做一些检测，当检测出如下情况时，将不会使用`fastclick`：

- 设备不支持`touch`事件
- Chrome 浏览器
  - 桌面版 Chrome 浏览器
  - Android Chrome，以下两种情况都不需要`fastclick`
    - `meta`里有`user-scalable=no`
    - Chrome 版本 >= 32，且`meta`里有`width=device-width`
- IE 浏览器
  - IE 11+，传入`fastclick.attach`的元素包含 CSS 样式，`touch-action: manipulation;`
  - IE 10，传入`fastclick.attach`的元素包含 CSS 样式，`-ms-touch-action: manipulation;`
- BlackBerry 浏览器
  - 版本 >= 10.3，且`meta`里有`user-scalable=no`或`width=device-width`
- Firefox 浏览器
  - 版本 >= 27，且`meta`里有`user-scalable=no`或`width=device-width`

## 存在的问题

### 手动触发 element.click() 无效

<code-scroll-fastclick-bug></code-scroll-fastclick-bug>

PS：请在手机上观看

#### 问题描述

可能存在这样的需求，点击元素`div1`，在`div1`元素的`click`回调函数里再以代码方式触发另一元素`div2`的`click`事件。

<<< @/docs/.vuepress/components/code/scroll/fastclick-bug.vue

若是使用了`fastclick`，但`Android`上可以按预期运行（实际上是这个`Android`手机的 Chrome 版本 >= 32，且`meta`里有`width=device-width`，没使用到`fastclick`）。

在 iOS 上，`this.$refs.div2.click();`这一行代码不会生效，但将这一行代码写两遍，即手动触发`div2.click()`两次，代码就会按预期运行。

#### 问题原因

当点击屏幕时，`fastclick`在`touchstart`里会设置`fastclick`实例的`targetElement`属性为当前事件的目标元素。

```js
FastClick.prototype.onTouchStart = function(event) {
  var targetElement, touch, selection;

  if (event.targetTouches.length > 1) {
    return true;
  }
  // 事件目标元素
  targetElement = this.getTargetElementFromEventTarget(event.target);
  // ...
  // 设置 fastclick 实例的 targetElement 属性为当前事件的目标元素
  this.targetElement = targetElement;
  // ...
  return true;
};
```

但是通过`this.$refs.div2.click();`是在 js 里以编程方式触发`click`事件，不会产生`touchstart`事件，因此无法重新设置`this.targetElement`，而且在点击了`div1`之后，`this.targetElement`也没有重置为`null`，其值仍为`div1`。

```js
function FastClick(layer, options) {
  // ...
  var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
  var context = this;
  for (var i = 0, l = methods.length; i < l; i++) {
    context[methods[i]] = bind(context[methods[i]], context);
  }

  // Set up event handlers as required
  if (deviceIsAndroid) {
    layer.addEventListener('mouseover', this.onMouse, true);
    layer.addEventListener('mousedown', this.onMouse, true);
    layer.addEventListener('mouseup', this.onMouse, true);
  }

  // 注意，click 事件是在捕获阶段监听处理的
  layer.addEventListener('click', this.onClick, true);
  layer.addEventListener('touchstart', this.onTouchStart, false);
  layer.addEventListener('touchmove', this.onTouchMove, false);
  layer.addEventListener('touchend', this.onTouchEnd, false);
  layer.addEventListener('touchcancel', this.onTouchCancel, false);
  // ...
}
```

第一次`div2.click()`时，会在事件捕获阶段被`layer`（一般是`document.body`）上的监听函数处理，即`this.onClick`。在`onClick`里会调用`onMouse`，`onMouse`里通过`needsClick`判断出`this.targetElement`即`div1`不需要原生`click`事件，因此会阻止该事件的默认行为以及阻止事件冒泡/捕获，并将`this.targetElement`置为`null`。因此第一次的`div2.click()`在事件捕获阶段被`layer`的事件处理函数给阻止了捕获阶段的进步传播，最终事件未传播到`div2`上，`div2`的`click`事件也未执行。

因为在第一次`div1.click()`时已经将`this.targetElement`重置为`null`了，第二次`div2.click()`时在`onMouse`里判断出`this.targetElement`为`null`后直接返回`true`，而没有机会执行之后的`needsClick`以及阻止事件捕获的逻辑，事件会进一步传播到`div2`上，因此第二次的`div2.click()`生效了。

```js
FastClick.prototype.needsClick = function(target) {
  switch (target.nodeName.toLowerCase()) {

  // Don't send a synthetic click to disabled inputs (issue #62)
  case 'button':
  case 'select':
  case 'textarea':
    if (target.disabled) {
      return true;
    }

    break;
  case 'input':

    // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
    if ((deviceIsIOS && target.type === 'file') || target.disabled) {
      return true;
    }

    break;
  case 'label':
  case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
  case 'video':
    return true;
  }

  return (/\bneedsclick\b/).test(target.className);
};

FastClick.prototype.onMouse = function(event) {

  // If a target element was never set (because a touch event was never fired) allow the event
  if (!this.targetElement) {
    return true;
  }

  if (event.forwardedTouchEvent) {
    return true;
  }

  // Programmatically generated events targeting a specific element should be permitted
  if (!event.cancelable) {
    return true;
  }

  // Derive and check the target element to see whether the mouse event needs to be permitted;
  // unless explicitly enabled, prevent non-touch click events from triggering actions,
  // to prevent ghost/doubleclicks.
  if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

    // Prevent any user-added listeners declared on FastClick element from being fired.
    // 阻止事件冒泡并且阻止相同事件的其他侦听器被调用
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else {

      // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
      event.propagationStopped = true;
    }

    // Cancel the event
    event.stopPropagation();
    event.preventDefault();

    return false;
  }

  // If the mouse event is permitted, return true for the action to go through.
  return true;
};

FastClick.prototype.onClick = function(event) {
  // ...
  permitted = this.onMouse(event);
  // ...
  // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
  // 若不允许此次 click 事件，则重置 this.targetElement
  if (!permitted) {
    this.targetElement = null;
  }

  // If clicks are permitted, return true for the action to go through.
  return permitted;
};
```

PS：DOM Level 2 里事件处理函数`handler`里的`return false`即不会阻止默认事件，也不会阻止冒泡。

#### 解决方案

##### 方案一：添加 needsclick 类（不推荐）

```html
<div
    class="div1 needsclick"
    @click="clickDiv1"
>div1，点击此处，将在 div1 的 click 回调里触发 div2.click() </div>
```

在`div1`元素上添加`needsclick`类，这样点击`div1`时不会触发`fastclick`自定义的`click`事件，而是原生`click`事件（会存在 300 ms 延迟的问题）。

且仅需要执行一次`div2.click()`，执行时`needsclick`函数根据`div1`上的`needsclick`判断出`this.targetElement`即`div1`需要原生`click`事件，就不会阻止事件的进一步传播，最终`div2`上的`click`事件回调顺利执行。

##### 方案二：使用 element.dispatchEvent(event) 触发事件（推荐）

```js
clickDiv1() {
    const event = new MouseEvent('click');
    this.$refs.div2.dispatchEvent(event);
},
```

通过`new MouseEvent('click')`创建的事件，默认的`event.cancelable`和`event.cancelBubble`都为`false`，因此走到`onMouse`里会直接返回`true`，没有机会执行之后的`needsClick`以及阻止事件捕获的逻辑，会让事件进一步传播到`div2`上，进而触发了`div2`的`click`事件。

注意：`div2`上的事件，不能是采用事件代理注册在其祖先元素上的`click`事件。

#### Reference

- [记录fastclick中一次手动触发click事件失败](https://segmentfault.com/a/1190000009246194)
