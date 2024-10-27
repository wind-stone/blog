# 利用 animation-delay 实现复杂动画

## 示例一：控制小球移动

### 实现效果

<animation-effects-animation-delay-ball-translate></animation-effects-animation-delay-ball-translate>

### 实现说明

利用 CSS 的 `animation-delay` 属性，该属性的值可以设置成负数。当设置成负数时比如 -1s，表示动画从 1s 前开始执行。

因此当动画的 `animation-duration` 设置为 2s，且 `animation-delay` 设置成 -1s，则说明在当前时间动画已经执行了 50% 时间。

### 实验源码

@[code vue](@components/animation-effects/animation-delay/ball-translate.vue)

## 示例二：评分动画

### 实现效果

<animation-effects-animation-delay-give-scores></animation-effects-animation-delay-give-scores>

### 实验源码

@[code vue](@components/animation-effects/animation-delay/give-scores.vue)
