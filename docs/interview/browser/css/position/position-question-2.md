# 【中级-好题】one、two 哪个 div 在 z 轴的上面

## 题目

```html
<div class="one"></div>
<div class="two"></div>

<style>
    .one {
        width: 100px;
        height: 100px;
        z-index: 5;
        background-color: red;
    }
    .two {
        width: 100px;
        height: 100px;
        position: relative;
        top: -50px;
        z-index: 3;
        background-color: blue;
    }
</style>
```

## 参考答案

`two`在`z`轴上面，因为`z-index`在没有`position`的时候不生效

加分项：如果第一个`one`的`position`各种取值是什么效果？

- `position: relative`：位置保持不变，`one`覆盖`two`
- `position: absolute/fixed`：`one`在顶部，`two`也在顶部且上面一半溢出顶部，`one`覆盖`two`
- `position: static`：同不加`position`的效果
