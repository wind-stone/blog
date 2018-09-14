---
sidebarDepth: 0
---

# 知识点

[[toc]]

## HTML

### 首字母自动大写 autocapitalize

- none等同于off。
- autocapitalize="words"：每个单词的开头字母会自动大写。
- autocapitalize="characters"：每个字母都会大写。
- autocapitalize="sentences"：每句开头字母会自动大写。

Reference: [为移动而生的 HTML 属性 #3](https://github.com/yisibl/blog/issues/3)

## CSS

### pointer-events: none

设置元素不成为鼠标事件的target

### -webkit-overflow-scrolling: touch

控制元素在移动设备上是否使用滚动回弹效果.[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-overflow-scrolling)

取值 | 说明 | 中文
-- | -- | --
auto | Use "regular" scrolling, where the content immediately ceases to scroll when you remove your finger from the touchscreen. | 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。
touch | Use momentum-based scrolling, where the content continues to scroll for a while after finishing the scroll gesture and removing your finger from the touchscreen. The speed and duration of the continued scrolling is proportional to how vigorous the scroll gesture was. Also creates a new stacking context. | 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

## 设备

### 键盘

#### Android 键盘 keydown 事件里 keyCode = 229

Android 系统里，keydown 事件的 event 里，keyCode = 229，不是正确的 keyCode

Reference:

- [keyCode on android is always 229](https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229)
- [keydown and keyup events do not have proper keyCode (it's always 0)](https://bugs.chromium.org/p/chromium/issues/detail?id=118639)

#### 键盘的调起和收起

在 iOS 6 之前，当控件获得 focus 的时候，如果不是用户触发的事件，键盘是不会弹起的，在 iOS 6 之后，设置了一个属性可以做到，在 Android 上，只要不是用户触发的事件都无法触发。暂时还没有解决方案。键盘的收起，可以通过 js 的 blur 的方式来实现。
