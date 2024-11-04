# 渐变阴影

## 实现效果

<animation-effects-gradient-shadows></animation-effects-gradient-shadows>

## 实现说明

`box-shadow` 无法添加渐变的阴影。因此可以使用伪元素的渐变背景来实现渐变阴影的效果。

注意：

- `.box` 元素的背景可能是透明的，或者有透明的像素点。
- 通过伪元素的 `clip-path` 属性来裁剪，确保被父元素覆盖的区域的渐变背景不可见，非覆盖区域可见。
- 当阴影有偏移时，伪元素的裁剪区域也要随之变化。

## 实现代码

@[code vue](@components/animation-effects/gradient-shadows.vue)
