## CSS 属性书写顺序

同一 rule set 下的属性在书写时，应按功能进行分组，并以 Formatting Model（布局方式、位置） > Box Model（尺寸） > Typographic（文本相关） > Visual（视觉效果） 的顺序书写，以提高代码的可读性。

- Formatting Model 相关属性包括：position / top / right / bottom / left / float / display / overflow 等
- Box Model 相关属性包括：border / margin / padding / width / height 等
- Typographic 相关属性包括：font / line-height / text-align / word-wrap 等
- Visual 相关属性包括：background / color / transition / list-style 等

- 另外，如果包含 content 属性，应放在最前面。

Reference：[百度-CSS 编码规范](https://github.com/fex-team/styleguide/blob/master/css.md)


## 清除浮动-最小副作用

```css
/**
 * For modern browsers
 * 1. The space content is one way to avoid an Opera bug when the
 *    contenteditable attribute is included anywhere else in the document.
 *    Otherwise it causes space to appear at the top and bottom of elements
 *    that are clearfixed.
 * 2. The use of `table` rather than `block` is only necessary if using
 *    `:before` to contain the top-margins of child elements.
 */
.cf:before,
.cf:after {
    content: " "; /* 1 */
    display: table; /* 2 */
}

.cf:after {
    clear: both;
}

/**
 * For IE 6/7 only
 * Include this rule to trigger hasLayout and contain floats.
 */
.cf {
    *zoom: 1;
}
```

Reference: [A new micro clearfix hack](http://nicolasgallagher.com/micro-clearfix-hack/)