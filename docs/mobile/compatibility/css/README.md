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
