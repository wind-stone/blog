---
sidebarDepth: 0
---

# rem 组件

[[toc]]

移动端开发中，有时需要使用`rem`作为尺寸单位来做各个机型的适配。

如下介绍的是如何设置`rem`和通过`less`函数来做浏览器适配。

## 使用方式

```js
// 引入 rem/index.js 去动态修改 rootElement 的 font-size 值为屏幕款的 1/10
import rem from './rem';
```

```css
/* 引入 rem/index.less 以便使用 .rem 函数 */
@import '.rem/index.less';

/* 其中 640 为该元素的设计稿宽度，单位是px（设计稿宽度为 640px，如需修改，可更改 rem/index.less 文件） */
.class-name {
    .rem(width, 640);
}
```

<<< @/docs/code-snippet/rem/index.js

<<< @/docs/code-snippet/rem/index.less

## Android 设置系统字体大小影响 rem 的值

在开发 APP 内的 h5 页面且使用上述的`rem`布局时，若改变 Android 机型的系统字体大小后，会导致页面布局错乱，其原因是，系统字体大小的改变，会覆盖上述用户自己修改的`html`的`font-size`（但覆盖的时机不确定），网上有如下几种解决方案。

参考：- [rem布局在webview中页面错乱](https://blog.csdn.net/u013778905/article/details/77972841)

### 方案一: 客户端固定 webview 的默认字体大小（推荐）

安卓客户端通过`webview`配置`webview.getSettings().setTextZoom(100)`就可以禁止缩放，按照百分百显示。

### 方案二: 获取系统字体大小后改写 html 的大小为百分比

此方案会先获取到系统字体大小，再将`html`元素的`font-size`设置为基于系统字体大小的百分比数值，以最终达到想要的`px`值。

<<< @/docs/code-snippet/rem/default-font-size.js

此方案尽管经过测试是有效的，但是因为没有任何资料显示设置系统字体大小后系统覆盖`html`的`font-size`的时机，会存在通过`setRootElementFontSize`设置`html`的`font-size`之后系统再覆盖字体大小的可能。

PS: 关于这种方法，我猜测在`getSystemDefaultFontSize`方法里获取`div`元素的宽度时，就已经确定了系统默认字体大小了，因此之后改写`html`的`font-size`，就不会再被系统覆盖。

### 方案三: 先设置再读取，不一致的话，重新设置

此方案是先按要求设置`html`的`font-size`，再通过 DOM API 读取出来，对比设置值和读取值，若不一致，再按照比例再设置一次。

```js
function htmlFontSize(){
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var width = w > h ? h : w;
    width = width > 720 ? 720 : width
    var fz = ~~(width*100000/36)/10000
    document.getElementsByTagName("html")[0].style.cssText = 'font-size: ' + fz +"px";
    var realfz = ~~(+window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.replace('px','')*10000)/10000
    if (fz !== realfz) {
        document.getElementsByTagName("html")[0].style.cssText = 'font-size: ' + fz * (fz / realfz) +"px";
    }
}
```

`~`是 NOT 操作符。对于浮点数，`~~value`可以代替`parseInt(value)`，且效率更高。

假设`fz`为`100`，得到的`realfz`为`200`，则将`html`的`font-size`设置为`50`时，最终得到的`realfz`就为一开始想要的`fz`即`100`了。
