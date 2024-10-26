# 滚动列表元素时平滑上升

## 效果说明

当滚动列表元素时，当元素从视口底部刚进入到视口里时，出现一个平滑上升的效果。

注意：

- 初始时，若元素已经出现在视口，曾不添加平滑上升的动画效果。
- 如果元素已经播放了动画效果，则后续不再播放。
- 仅向下滑动时，元素有平滑上升的效果，当反过来向上滑动时，则不应该出现动画效果。

## 效果演示

<animation-effects-scroll-element-fade-up></animation-effects-scroll-element-fade-up>

## 实现源码

@[code vue](@components/animation-effects/scroll-element-fade-up.vue)
