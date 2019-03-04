---
sidebarDepth: 0
---

# 触摸事件

[[toc]]

## 触摸点

每个`Touch`对象代表一个触摸点，每个触摸点都由其位置、大小、形状、压力大小和目标元素描述。

### 触摸点的目标元素

触摸点的[目标元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch)（`target element`，即`Touch`对象的`touch.target`属性），是触摸点最开始被追踪时（即发生`touchstart`事件时）触摸点所位于的 DOM 元素。哪怕在触摸点移动过程中，触摸点的位置已经离开了这个元素的有效交互区域，或者这个元素已经被从文档中移除。

需要注意的是，如果这个元素在触摸过程中被移除，这个事件仍然会指向它，但是不会再冒泡这个事件到`window`或`document`对象。因此，如果有元素在触摸过程中可能被移除，最佳实践是将触摸事件的监听器绑定到这个元素本身，防止元素被移除后，无法再从它的上一级元素上侦测到从该元素冒泡的事件。

### 事件的目标元素

无论是发生`touchstart`/`touchmove`/`touchend`事件时，触摸事件的目标元素`touchEvent.target`的值始终是触摸点发生`touchstart`事件时所位于的 DOM 元素，事件的目标元素在触摸点离开触摸平面之前，不会改变。

经测试，以`touchstart`事件为例

- 若两个手指同一时间点击同一个元素，则只触发一次`touchstart`事件
- 若两个手指同一时间点击两个不同的元素，则会触发两次`touchstart`事件

TODO: 具体关于浏览器在多个手指同时触发事件后是如何确定事件目标的，待以后详细了解。

### touches/targetTouches/changedTouches

- `touchEvent.touches`
  - `TouchList`列表，含有所有当前在与触摸平面接触的`Touch`对象，不管触摸点是否已经改变或其目标元素是否处于`touchstart`阶段
- `touchEvent.targetTouches`
  - 只读的`TouchList`列表，列出了当前接触屏幕的所有触摸点所对应的`Touch`对象，这些触摸点需要满足以下两个条件：
    - 触摸事件发生时，这些触摸点仍与触摸平面接触着，且这些触摸点自`touchstart`事件后，未曾离开触摸平面（但是可以移动到触摸点目标元素之外）
    - 这些触摸点的目标元素（即这些触摸点发生`touchstart`事件时所处于的 DOM 元素）与此次触摸事件的目标元素`touchEvent.target`是同一元素
  - `targetTouches`元素是`touches`的严格子集
- `touchEvent.changedTouches`
  - 只读的`TouchList`列表，包含了所有从上一次触摸事件到此次事件过程中，状态发生了改变的触点的`Touch`对象。
    - 对于`touchstart`事件, 列出在此次事件中新增加的触点
    - 对于`touchmove`事件，列出和上一次事件相比较，发生了变化的触点
    - 对于`touchend`事件，列出离开触摸平面的触点（这些触点对应已经不接触触摸平面的手指）

假设只有一个触摸点发生`touchstart`/`touchmove`/`touchend`事件，`touches`/`targetTouches`/`changedTouches`的变化情况如下：

- 针对`touchstart`事件，假设新增的触摸点位于`el`元素上
  - `touchEvent.touches`列表里会新增这个新的触摸点
  - `touchEvent.targetTouches`会改变，列出所有在`el`元素上发生了`touchstart`事件且未曾离开触摸平面的触摸点（包括已经移动到`el`元素之外的触摸点），包括这个新增的触摸点
  - `touchEvent.changedTouches`会改变，列出导致触发`touchstart`事件的触摸点，此时只有这个新增的触摸点
- 针对`touchmove`事件
  - `touchEvent.touches`/`touchEvent.targetTouches`不会改变
  - `touchEvent.changedTouches`会改变，列出导致触发`touchmove`事件的触摸点，此时只有这个移动的触摸点
- 针对`touchend`事件
  - `touchEvent.touches`
