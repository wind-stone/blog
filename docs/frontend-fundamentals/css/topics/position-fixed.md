# position: fixed 失效

[[toc]]

若子孙元素是`position: fixed`，则当其某一祖先元素创建了层叠上下文（**Stacking Context**，也称为堆叠上下文），则该子孙元素的固定定位将基于该祖先元素进行定位，而不是基于 Viewport，因此固定定位失效了。

参考[MDN - 层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)，可以看到其中有很多方式能够让元素创建层叠上下文，但不是每一种方式都会导致`position: fixed`失效。

- `transform`属性不为`none`
- `perspective`属性不为`none`
- `filter`属性不为`none`
- 设置了`transform-style: preserve-3d`
- 在`will-change`中指定了任意 CSS 属性

以上任意一种创建层叠上下文的方式，都会导致`position: fixed`失效。

参考文档:

- [fixed 定位失效 | 不受控制的 position:fixed](https://github.com/chokcoco/iCSS/issues/24)
- [Un-fixing Fixed Elements with CSS Transforms](http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/)
