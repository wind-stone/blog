---
sidebarDepth: 0
---

# CSS 兼容性

[[toc]]

## 各个国产浏览器兼容性

### 华为浏览器

部分华为浏览器，以下的代码将不起作用。其直接表现为设置`background-size: 100% auto;`会导致`background-repeat`属性失效。

解决办法：`background-size`的第二个参数不能使用`auto`，可使用`1px`代替，即`background-size: 100% 1px`。

```css
background: #FFE6AE url('...') top left/100% repeat-y;

/* 或 */
background: #FFE6AE url('...') top left repeat-y;
background: 100% auto;
```

## flex 兼容性问题

### flex-basis

`flex-basis`的默认值是`auto`。

但是在 iOS 10.2 及以下版本，`flex-basis`的默认值为`0`。

Reference: [flex:1在iOS10.2导致flex-wrap 不起作用](https://jsonz1993.github.io/2017/08/flex-1%E5%9C%A8iOS10-2%E5%AF%BC%E8%87%B4flex-wrap%E4%B8%8D%E8%B5%B7%E4%BD%9C%E7%94%A8bug/)

## rem 在 Android APP 的 webview 计算不准确的问题

Reference: [rem布局在webview中页面错乱](https://blog.csdn.net/u013778905/article/details/77972841)

前置信息:

- 内嵌在 APP 里面的 H5 页面
- 使用`rem`作为单位
- `html`元素的`font-size`设置正常
- 系统浏览器和绝大部分手机上，正常显示
- 在某些手机上，页面元素变大了（或变小了），调试后发现是`rem`计算成`px`时不准确导致

结论:

- 手机系统设置了字体大小，导致 APP 里 webview 里的默认字体大小偏大或偏小。将系统字体设置为“正常”即可解决问题。
- 若想要在用户设置了系统字体大小之后仍能正常显示，可参考 Reference 里的解决方法。
