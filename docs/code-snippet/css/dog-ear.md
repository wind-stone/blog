---
sidebarDepth: 0
---

# 折角效果

```html
<div class="dog-ear">
</div>
```

## 实现方法一：增加两个小三角，模拟折角和模拟缺口

```css
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: #58a;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    border: 20px solid transparent;
    border-right-color: #47728f;
    transform: rotate(-45deg);
}
.dog-ear::after {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    border: 20px solid transparent;
    border-left-color: #fff;
    transform: rotate(-45deg);
}
```

说明：这是最差的实现方式，在以下场景中会暴露出明显的缺陷

- 当折角元素之下的背景不是纯色，而是一副图案、一层纹理、一张照片、一副渐变或其他任何一种背景图像时
- 当我们想要一个45°以外的（旋转的）折角时

## 实现方式二：双渐变背景

```css
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background: #58a;
    /* 多个背景图从上往下分布，第一个背景图处于最上方 */
    background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .4) 0) no-repeat 100% 0 / 29px 29px,
                linear-gradient(-135deg, transparent 20px, #58a 0);
}
```

说明：这是较好的一种实现方式，但也有缺陷：

- 渐变里的距离如`linear-gradient(-135deg, transparent 20px, #58a 0)`里的 20px 是指渐变方向的距离，可能因为存在根号和小数导致存在误差，但这种误差极小，肉眼可能无法察觉。
- 无法实现45°以外的（旋转的）折角

## 实现方式三：单渐变背景+单伪元素（任意角度折角）

```css
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background: #58a;
    background: linear-gradient(-150deg, transparent 1.5em, #58a 0);
    /* 圆角 */
    border-radius: .5em;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1.73em;
    height: 3em;
    background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .4)) 100% 0 no-repeat;

    /* 2D 转换 */
    transform: translateY(-1.3em) rotate(-30deg);
    transform-origin: bottom right;

    border-bottom-left-radius: inherit;
    box-shadow: -.2em .2em .3em -.1em rgba(0, 0, 0, .15);
}
```

或者使用 3D 转换

```css
.dog-ear {
    position: relative;
    width: 200px;
    height: 200px;
    background: #58a;
    background: linear-gradient(-150deg, transparent 1.5em, #58a 0);
    /* 圆角 */
    border-radius: .5em;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 1.73em;
    width: 3em;
    background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .4)) 100% 0 no-repeat;

    /* 使用 3D 转换 */
    transform: rotate(-120deg) rotateX(180deg);
    transform-style: preserve-3d;

    border-bottom-left-radius: inherit;
    box-shadow: -.2em .2em .3em -.1em rgba(0, 0, 0, .15);
```

说明：

- （缺点）可能因为存在根号和小数导致存在误差，但这种误差极小，肉眼可能无法察觉。
- （优点）可以实现45°以外的（旋转的）折角

## 实现方式四：border + 单伪元素背景渐变

```css
.dog-ear {
    position: relative;
    width: 20px;
    height: 20px;
    border: 180px solid #58a;
    border-width: 0 0 180px 180px;
}
.dog-ear::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: #58a;
    background: linear-gradient(to left bottom, transparent 50%, #47728f 0);
}
```

说明：这是最好的实现方式，优点是：

- 不存在误差
- 可以实现任意角度的折角（旋转伪元素实现）
