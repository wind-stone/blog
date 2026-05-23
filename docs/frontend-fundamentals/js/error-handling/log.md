# 日志

[[toc]]

## 为什么浏览器通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片？

谷歌和百度等都是通过`new Image()`的方式请求`1x1`像素的透明`gif`图片的方式来发送埋点数据，而服务器端一般用一个`1x1`的`gif`图片来作为响应，但这有点浪费服务器资源；因此用`header`来响应比较合适，目前比较合适的做法是服务器端发送"204 No Content"，即“服务器成功处理了请求，但不需要返回任何实体内容”。

- 为什么是图片？
  - 请求图片，没有跨域问题
  - 请求图片，不会阻塞页面加载
  - 图片请求发出即可，也不需要等待服务器返回任何数据
  - 相比 XMLHttpRequest 对象发送 GET 请求，性能上更好
- 更进一步，为什么是 gif ？
  - gif 的最低合法体积最小
    - 最小的 BMP 文件需要 74 个字节
    - 最小的 PNG 需要 67 个字节
    - 而合法的 GIF，只需要 43 个字节

## 元素日志

元素的曝光和点击日志，可使用 Vue.js 的指令实现。

### 元素曝光日志

借助[Intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)判断元素是否进入可视区域，进而发送曝光埋点。

实现时需要注意：

- 提供修饰符，来按需确定元素是否需要重复发送曝光埋点（页面上下滑导致元素多次曝光），可以用 WeakMap 来记录元素是否发送过曝光埋点
- 提供修饰符，来按需在埋点数据发生响应式变化时重新发送埋点

### 元素点击日志

实现时需要注意：

- 针对点击后跳转的情况，需要在跳转之前发送埋点

```ts
// onClick 一般是公司级的埋点工具提供的方法，用于发送点击埋点
const handleClick = (e: Event) => {
    let dom = e.currentTarget as HTMLElement;
    dom && dom.__clickData && onClick(dom.__clickData);
};

Vue.directive('log-click', {
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
    inserted(el: HTMLElement, { value }) {
        el.__clickData = value;
        el.addEventListener('click', handleClick, false);
    },
    // 在指令所在组件的 VNode 及其子 VNode 全部更新后调用，更新点击数据
    componentUpdated(el, { value, oldValue }) {
        el.__clickData = value;
    },
    // 指令与元素解绑时调用
    unbind(el) {
        el.removeEventListener('click', handleClick);
    },
});
```
