---
sidebarDepth: 0
---

# CSS 兼容性

[[doc]]

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
