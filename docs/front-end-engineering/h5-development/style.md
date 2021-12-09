---
sidebarDepth: 0
---

# 样式

[[toc]]

## 文字省略

### 单行省略

```scss
@mixin one-line-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
```

```stylus
one-line-ellipsis(maxWidth = 100%)
    max-width maxWidth
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
```

```less
.one-line-ellipsis() {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
```

### 多行省略

```less
.multi-line-ellipsis(@line) {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
}
```

## 文字渐变

[小tip:CSS3下的渐变文字效果实现](https://www.zhangxinxu.com/wordpress/2011/04/%E5%B0%8Ftipcss3%E4%B8%8B%E7%9A%84%E6%B8%90%E5%8F%98%E6%96%87%E5%AD%97%E6%95%88%E6%9E%9C%E5%AE%9E%E7%8E%B0/)

## 滚动回弹效果

`-webkit-overflow-scrolling: touch`，iOS 上产生滚动回弹效果。

`-webkit-overflow-scrolling`属性控制元素在移动设备上是否使用滚动回弹效果.[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-overflow-scrolling)

取值如下：

- `auto`
  - Use "regular" scrolling, where the content immediately ceases to scroll when you remove your finger from the touchscreen.
  - 翻译：使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。                                                                                                                   |
- `touch`
  - Use momentum-based scrolling, where the content continues to scroll for a while after finishing the scroll gesture and removing your finger from the touchscreen. The speed and duration of the continued scrolling is proportional to how vigorous the scroll gesture was. Also creates a new stacking context.
  - 翻译：使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。 |

需要注意的是，对容器添加了`-webkit-overflow-scrolling: touch`后，可能会存在以下问题：

- 导致容器内使用`position:fixed;`固定定位的元素随着页面一起滚动。
- （iOS UIWebview 里）容器内溢出的内容（比如弹窗）将被隐藏，效果类似于`overflow: hidden`，google 未找到原因

## safe area

针对 iPhone X 等手机，给元素的任意属性，添加安全距离。

```styl
// 定义
safe-area-mixin($property, $value, $safeAreaDirection = bottom, $important = false)
    {$property} $value
    for fn in constant env
        {$property} s('calc(%s + %s(safe-area-inset-%s)', $value, fn, $safeAreaDirection) $important == true ? !important : unquote('')

// 使用
body {
    safe-area-mixin(height, bottom, 20px, true)
}

// 或
body
    safe-area-mixin(
        $property: height,
        $value: 20px,
        $safeAreaDirection: bottom,
        $important: true
    )

// 结果
body {
  height: 20px;
  height: calc(20px + constant(safe-area-inset-bottom) !important;
  height: calc(20px + env(safe-area-inset-bottom) !important;
}
```
