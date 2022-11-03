# 样式

[[toc]]

## 注意事项

- 按钮要有点击态（可使用 mixin 实现）
- 针对经常使用的样式，可抽取为`mixin`公共样式
- 切图的图片周围要有空白，防止使用`rem`导致图片被裁剪
- 涉及到用户名（可能包含 emoji）的地方，`font-size`和`line-height`不能设置成一样，否则会出现 emoji 上下被截断的问题
- 在字体比较小的地方，不用使用边框包裹字体，Android 有些机型上会出现文字偏上的问题。
  - 如果真要这么做，可以在实现时，将字体大小、尺寸等扩大 2 位，再`scale(.5)`

## 功能实现

- 文字
  - [文字省略](/css/tools/text-ellipsis.md)
  - [安全距离](/css/tools/safe-area.md)
  - 文字渐变，[小tip:CSS3下的渐变文字效果实现](https://www.zhangxinxu.com/wordpress/2011/04/%E5%B0%8Ftipcss3%E4%B8%8B%E7%9A%84%E6%B8%90%E5%8F%98%E6%96%87%E5%AD%97%E6%95%88%E6%9E%9C%E5%AE%9E%E7%8E%B0/)

- 滚动
  - [滚动回弹效果](/browser-env/scroll/#css-相关)
  - [隐藏滚动条](/browser-env/scroll/#滚动条隐藏但可滚动)
  - [锚点定位滚动动画](/browser-env/scroll/#锚点切换时-流畅的滚动)

## 尺寸适配

使用 postcss 的插件[postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem)，可以将代码里的`px`处理成`rem`。比如：

```css
body {
  padding: 0 20px;
}

/* 经过 postcss-plugin-px2rem 处理后 */
body {
  padding: 0 0.2rem;
}
```

默认是`1rem = 100px`，所以需要设置`document.documentElement.style.fontSize`为`100 * 实际屏幕宽度 / 设计稿宽度`，设置方式可参考：
[rem 组件](/code-snippet/browser-env/rem/)。
