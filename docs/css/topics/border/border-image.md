---
sidebarDepth: 0
---

# border-image

[[toc]]

## 学习文档

- [张鑫旭 - CSS3 border-image详解、应用及jQuery插件](https://www.zhangxinxu.com/wordpress/2010/01/css3-border-image/)，本文可以说是对 CSS3 中`border-image`讲解的非常深入细致的一篇文章，优先推荐

上文中未提及：

- `border-image-slice`里的`fill`，详见[MDN - border-image-slice](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-slice)
- 如果`border-image-width`属性值大于元素的`border-width`，则边界图像将会向`padding`边缘延展，详见[MDN - border-image-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-width)
- `border-image-outset`属性设置了`border-image`可以超出元素边框盒子（`border box`）的距离，超出部分不会触发滚动条，也不会捕获鼠标事件，详见[MDN - border-image-outset](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-outset)

## 边框渐变

假设要实现一个边框从上到下的渐变效果，如图所示：

![边框渐变效果图](./images/border-linear-gradient.png)

其中，

- 边框的渐变由上`#9a5eff`到下`#702ff3`
- 内容区背景是`blue`，元素外的背景是`#1d0277`（只是为了能让边框渐变显示地更加清楚，与边框渐变实现无关）。
- 圆角`border-radius: 16px`

补充：[掘金 - 巧妙实现带圆角的渐变边框](https://juejin.cn/post/6844903972281516045) 这篇文章说的更加详细，实现方式更多。

### 实现方式一：border-image

```html
<div class="background">
    <div class="example first-example"></div>
</div>
```

```less
.background {
    padding: 20px;
    background: #1d0277;
    .example {
        width: 700px;
        height: 30px;
        &.first-example {
            border: 2px solid;
            border-radius: 16px;
            border-image: linear-gradient(180deg,#6c41eb 0%, #611dcf 100%) 2;
            background: blue;
        }
    }
}
```

可以发现，尽管我们能用`border-image`+`linear-gradient`实现了边框渐变，但是`border-radius`却失效了。

### 实现方式二：background*2

```less
.background {
    padding: 20px;
    background: #1d0277;
    .example {
        width: 700px;
        height: 30px;
        &.second-example {
            padding: 2px;
            border-radius: 16px;
            background: linear-gradient(180deg,#6c41eb 0%, #611dcf 100%);
            .inner-second {
                width: 100%;
                height: 100%;
                border-radius: 16px;
                background: blue;
            }
        }
    }
}
```

### 效果演示

<examples-border-image-linear-gradient></examples-border-image-linear-gradient>
