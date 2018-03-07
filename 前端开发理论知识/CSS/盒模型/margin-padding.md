## 应用示例

### 如何实现自适应的正方形？

#### 解决思路一：`padding-top/bottom`百分比取值

`padding-top/bottom`取值为百分比时，是相对父元素的宽度进行计算的，因此可以这样：

```css
/* 方式一：设置 `padding-top/bottom`撑开容器 */
.placeholder {
    width: 100%;
    height: 0;  /* 不设置此项时，增加内容会增加 height；设置为 0，可保证元素为正方形 */
    padding-bottom: 100%;
}
```

但是以上也有弊端：无法设置元素的`max-height`（因为元素的`height`都为`0`，更不谈`max-height`了..）

```css
/* 方式二：利用伪元素的 margin/padding-top/bottom 撑开容器 */
.placeholder {
    width: 100%;
    max-height: 100px; /* 此时可以愉快的设置 max-height */
    overflow: hidden; /* 使用 margin-top/bottom 时需要触发 BFC，消除 margin 重叠 */
}
.placeholder:after {
    content: '';
    display: block;
    margin-top: 100%;
}
```

但是，元素在`.placeholder`元素里添加内容，依然会增加`height`，可以将内容单独放在其他标签内，并绝对定位


#### 解决思路二：CSS3 vw 单位

CSS3 中新增了一组相对于可视区域百分比的长度单位`vw`, `vh`, `vmin`, `vmax`。其中`vw`是相对于视口宽度百分比的单位，1`vw` = 1% viewport width，`vh`是相对于视口高度百分比的单位，1`vh` = 1% viewport height；`vmin`是相对当前视口宽高中`较小`的一个的百分比单位，同理`vmax`是相对当前视口宽高中`较大`的一个的百分比单位。

利用`vw`单位，我们可以很方便做出自适应的正方形：

```css
.placeholder {
    width: 100%; /* 假设 100% 是只屏幕宽度 */
    height: 100vw;
}
```
