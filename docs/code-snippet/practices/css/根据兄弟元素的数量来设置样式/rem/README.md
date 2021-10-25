# rem 组件

## 组件说明
移动端开发中，使用 rem 作为尺寸单位

## 组件功能说明
- 使用 less 的 rem 函数写尺寸

## 使用方式

```js
// 引入 rem/index.js 去动态修改 rootElement 的 font-size 值为屏幕款的 1/10
import rem from './rem';
```

```css
/* 引入 rem/index.less 以便使用 .rem 函数 */
@import '.rem/index.less';

/* 其中 640 为该元素的设计稿宽度，单位是px（设计稿宽度为 640px，如需修改，可更改 rem/index.less 文件） */
.class-name {
    .rem(width, 640);
}
```

