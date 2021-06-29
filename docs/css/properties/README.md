# 属性

[[toc]]

## 最佳实践

- 不要用`0px`，而是`0`
- 颜色值
  - 尽量使用`#XXX`，而不是`#XXXXXX`
  - 不要使用单词
- 小数值：不要用`0.X`，而是`.X`

## rgba() 与 opacity

- `rgba()`和`opacity`都能实现透明效果
- `opacity`作用于元素，以及元素内的所有内容的透明度
- `rgba()`只作用于元素的颜色或其背景色，子元素不会继承透明效果

## display

### display: none 与 visibility: hidden 与 opacity: 0

- `display: none`
  - DOM 结构
    - 不会生成`box`，即不会出现在`formatting structure`里（可以理解为不会出现在`DOM Tree`里）
    - 不会占据空间，即不会影响布局
  - 事件监听
    - 无法进行 DOM 事件监听
  - 继承
    - 不会被子元素继承，且后代元素上设置`display`不为`none`，无法覆盖这种行为
  - 性能
    - 切换该属性值，会导致`reflow`
- `visibility: hidden`
  - DOM 结构
    - 元素会生成`box`，会出现在`formatting structure`里，但是不可见（全透明，不会绘制任何东西）
    - 会占据空间，会影响布局
  - 事件监听
    - 无法进行 DOM 事件监听
  - 继承
    - 会被子元素继承，且后代元素可通过设置`visibility: visible`使得后代元素可见
  - 性能
    - 切换该属性值，会导致`repaint`
- `opacity: 0`
  - DOM 结构
    - 元素会生成`box`，会出现在`formatting structure`里
    - 会占据空间，会影响布局
  - 事件监听
    - 可以进行 DOM 事件监听
  - 继承
    - 不会被子元素继承，且后代元素设置`opacity`大于`0`，无法覆盖这种行为
  - 性能
    - 切换该属性值，会导致`repaint`

### display: inline-block 的 baseline 的确定

> The baseline of an 'inline-block' is the baseline of its last line box in the normal flow, unless it has either no in-flow line boxes or if its 'overflow' property has a computed value other than 'visible', in which case the baseline is the bottom margin edge. -- [https://www.w3.org/TR/CSS21/visudet.html#line-height](https://www.w3.org/TR/CSS21/visudet.html#line-height)

翻译成中文：

> `inline-block`的基线是正常流中最后一个 line box 的基线, 除非，这个 line box 里面既没有 line boxes 或者本身`overflow`属性的计算值而不是`visible`, 这种情况下基线是`margin`底边缘。

简单说就是：一个`inline-block`元素，如果里面没有`inline`内联元素，或者`overflow`不是`visible`，则该元素的基线就是其`margin`底边缘，否则，其基线就是元素里面最后一行内联元素的基线。

## z-index

参考：[深入理解CSS中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

### 层叠上下文

层叠上下文，`Stacking Context`。

哪些元素会创建层叠上下文：

- 第一类：页面根元素即`html`元素，天然具有层叠上下文
- 第二类：`z-index`不为`auto`的定位元素（`position`为`relative`/`absolute`/`fixed`）
- 第三类：存在如下列出的其中一条 CSS3 属性
  - `z-index`值不为`auto`的`flex`项(父元素`display:flex | inline-flex`)
  - 元素的`opacity`值不是`1`
  - 元素的`transform`值不是`none`
  - 元素`mix-blend-mode`值不是`normal`
  - 元素的`filter`值不是`none`
  - 元素的`isolation`值是`isolate`
  - `will-change`指定的属性值为上面任意一个
  - 元素的`-webkit-overflow-scrolling`设为`touch`

::: tip 提示
在 CSS 2.1 时代，`z-index`必须与定位元素一起才能创建层叠上下文，但在 CSS3 里，可以与`flex`元素（即具有`display: flex | inline-flex`元素的子元素）一起创建层叠上下文。
:::

### 层叠顺序

层叠顺序，`Stacking Order`。

## vertical-align

CSS 的属性`vertical-align`用来指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式。

也就意味着，`vertical-align`属性对块级元素是无效的。

## perspective

### 设置 perspective 之后子元素的大小

如果父元素设置了 perspective 属性，且子元素设置了 translateZ，则子元素的大小公式为：

透视距离 / （透视距离-移动距离）

perspective / (perspective - distance)

```html
<div class="container”>
  <div class="parallax-child”></div>
</div>
```

```css
.container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  perspective: 1px;
  perspective-origin: 0 0;
}
.parallax-child {
  transform-origin: 0 0;
  transform: translateZ(-2px);
}
```

以上面为例，

父元素 perspective = 1

子元素 distance = -2

则最终 子元素看来变成了原来的 1/3，此时将子元素 scale(3) 将获得跟原来一样的视图

## width

### CSS 3 里 width 属性的新取值：max/min-content、fit-content、fill-available

CSS 3 里，`width`属性又多了几个关键字取值：

| “关键字”值       | 说明                                                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `fill-available` | 元素自动充满剩余的空间（类似`div`元素默认宽度为父元素的`100%`），但是其`display`属性可以取其他任意值，比如`display: inline-block` |
| `max-content`    | 先假设容器元素有足够的宽度，其内部元素将按容器元素有足够的空间来布局，`max-content`的值就是宽度最大的那个内部元素的宽度           |
| `min-content`    | 采用内部元素最小宽度值最大的那个元素的宽度作为最终容器的宽度                                                                      |
| `fit-content`    | 类似于`shrink-to-fit`，可以实现元素收缩效果，同时能保持原本的`display`属性特性                                                    |

Reference: [张鑫旭 - 理解CSS3 max/min-content及fit-content等width值
](https://www.zhangxinxu.com/wordpress/2016/05/css3-width-max-contnet-min-content-fit-content/)

## flex 相关

### flex-basis

- `flex-basis`默认作用在 Content Box 上
- 只有`flex-basis`为`auto`时，`width`才有可能生效

更多内容，参考[张鑫旭 - Oh My God，CSS flex-basis原来有这么多细节](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-basis/)

## 属性值的百分比

CSS 有些属性的属性值可以使用百分比值，那么这些百分比值都是相对哪些元素的哪些属性来说的呢？

| 属性             | 相对元素和属性        | 说明                                                                                                                                   |
| ---------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `width`          | 包含块宽度`width`     | 详见[https://www.w3.org/TR/CSS22/visudet.html#the-width-property](https://www.w3.org/TR/CSS22/visudet.html#the-width-property)         |
| `padding`        | 包含块的宽度`width`   | 详见[https://www.w3.org/TR/CSS22/box.html#padding-properties](https://www.w3.org/TR/CSS22/box.html#padding-properties)                 |
| `margin`         | 包含块的宽度`width`   | 详见[https://www.w3.org/TR/CSS22/box.html#margin-properties](https://www.w3.org/TR/CSS22/box.html#margin-properties)                   |
| `left`/`right`   | 包含块的宽度`width`   | 详见[https://www.w3.org/TR/CSS22/visuren.html#position-props](https://www.w3.org/TR/CSS22/visuren.html#position-props)                 |
| `height`         | 包含块高度`height`    | 详见[https://www.w3.org/TR/CSS22/visudet.html#the-height-property](https://www.w3.org/TR/CSS22/visudet.html#the-height-property)       |
| `top`/`bottom`   | 包含块的高度`height`  | 详见[https://www.w3.org/TR/CSS22/visuren.html#position-props](https://www.w3.org/TR/CSS22/visuren.html#position-props)                 |
| `vertical-align` | 该元素的`line-height` | 详见[https://www.w3.org/TR/CSS22/visudet.html#propdef-vertical-align](https://www.w3.org/TR/CSS22/visudet.html#propdef-vertical-align) |
| `font-size`      | 父元素`font-size`     | 详见[https://www.w3.org/TR/CSS22/fonts.html#propdef-font-size](https://www.w3.org/TR/CSS22/fonts.html#propdef-font-size)               |
