# 技巧和坑

[[toc]]

## animation-timing-function

`animation-timing-function`作用于动画的每一个关键帧周期，而不是整个动画周期。

```css
div {
    animation: 2s ease-in infinite scale;
}

@keyframes scale {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(.5);
    }
    100% {
        transform: scale(1);
    }
}
```

比如，我们设置了`animation-timing-function: ease-in`，则在`0%`~`50%`部分和`50%`~`100%`部分会分别应用`ease-in`，而不是在`0%`~`100%`整体应用`ease-in`。

此外，若是我们想在动画的某一段使用不同的`animation-timing-function`，可以在该段开始的关键帧上设置新的`animation-timing-function`:

```css
div {
    animation: 2s ease-in infinite scale;
}

@keyframes scale {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(.5);
        animation-timing-function: linear;
    }
    100% {
        transform: scale(1);
    }
}
```

经过这样配置，`0%`~`50%`部分将应用`ease-in`，`50%`~`100%`部分将应用`linear`。

参考文档

- [Animation Timing-Functions Get Applied Per-Keyframe In CSS](https://www.bennadel.com/blog/3885-animation-timing-functions-get-applied-per-keyframe-in-css.htm)
- [CSS ANIMATION TIMING FUNCTION PER KEYFRAME SEGMENT](https://jaketrent.com/post/css-animation-timing-function-per-keyframe-segment)
