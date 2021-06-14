# 微信小程序

[[toc]]

## 独有特性

### 分享卡片进入会创建新页面栈

小程序已启动且切换到后台的情况下，再通过分享卡片进入，会新创建新的页面栈，之前的页面栈会销毁。目前没有相关文档记载，但实际情况就是如此。

### WXS

WXS 运行于视图层，与 WXML 是在同一个线程运行，避免了跨线程与逻辑层通信的开销。详见：[如何评价微信新推出的WXS语言？ - 鲁小夫的回答 - 知乎](https://www.zhihu.com/question/64322737/answer/223446446)

## 生命周期

### 父子组件生命周期顺序

假设首页页面里引用组件 Parent，组件 Parent 里引用组件 Child，组件 Parent 和 Child 里都有`pageLifetimes.show/hide`生命周期。

首次打开小程序并进入页面时，各生命周期的调用顺序为：

- App.onLaunch
- App.onShow
- ComponentChild.created
- ComponentParent.created
- ComponentParent.attached
- ComponentChild.attached
- Page.onLoad
- ComponentParent.pageLifetimes.show
- ComponentChild.pageLifetimes.show
- Page.onShow
- ComponentChild.ready
- ComponentParent.ready
- Page.onReady

切到后台时，各生命周期的调用顺序为：

- ComponentParent.pageLifetimes.hide
- ComponentChild.pageLifetimes.hide
- Page.onHide
- App.onHide

切回前台时，各生命周期的调用顺序为：

- App.onShow
- ComponentParent.pageLifetimes.show
- ComponentChild.pageLifetimes.show
- Page.onShow

页面销毁时，各生命周期的调用顺序为：

- Page.onUnload
- ComponentChild.detached
- ComponentParent.detached

测试所用代码片段：[https://developers.weixin.qq.com/s/HeI1uAm87kjE](https://developers.weixin.qq.com/s/HeI1uAm87kjE)

其他：

- 组件加载后注册了`pageLifetimes.show`之后，会在后续的页面`onShow`时触发

## 疑难杂症

### 如何隐藏 scroll-view 滚动条

- [微信小程序如何隐藏scroll-view滚动条](https://developers.weixin.qq.com/community/develop/doc/00006473cf08f8c29da606b2d56c00)

以`scroll-view`为横向滚动为例，该方式是给`scroll-view`增加一个父元素，父元素的高度固定，并设置`overflow: hidden`；`scroll-view`作为子元素，其高度超过父元素高度，以便将滚动条置于父元素高度之外。注意，若是直接给`scroll-view`增加`padding-bottom`不能将滚动条置于最底部，可尝试给`scroll-view`的子元素添加`padding-bottom`。

此外，可尝试设置`scroll-view`的`show-scrollbar`属性为`false`，以隐藏滚动条。

```html
<scroll-view :enhanced="true" :show-scrollbar="false"></scroll-view>
```

注意，需要开启`enhanced`属性之后，设置`show-scrollbar`方才有效。

### 禁止页面顶部下拉或底部上滑的弹性效果

若是页面只有一屏，可设置页面配置里的`disableScroll: true`。

若是页面内容较多，需要竖向滚动，可以使用`scroll-view`包裹所有内容，并设置：

```html
<scroll-view :scroll-y="true" :enhanced="true" :bounces="false">
    <view><view/>
    ...
</scroll-view>
```

注意，需要开启`enhanced`属性之后，设置`bounces`方才有效。

### 1rpx 圆角边框缺失或不清晰

若使用 1rpx 的边框但不设置圆角，正常情况下都会显示正常；但若是设置了圆角，会出现边框缺失或者不清晰的问题。

解决方案：按 2rpx 或 3rpx 的边宽实现，再 scale 为原来的 1/2 或 1/3，详见[retina-border](https://github.com/wind-stone/retina-border)

### 子组件上添加样式

若是想在子组件上添加样式，比如`background-color`、`margin`等，请先将子组件的`display`置为非`inline`即可。但是理论上来说，即使是`display: inline`，`background-color`也是能生效的，没明白是怎么回事。

```vue
<template>
    <div>
        <child-component class="child-component"></child-componet>
    </div>
</template>


<style lang="less" scoped>
    .child-component {
        display: block; // 只要不是 inline 即可
        margin-top: 12rpx;
    }
</style>
```

### 包含自定义组件的元素的 opacity 的 transition 无效

```html
<view class="ctn">
    <child-component></child-component>
</view>
```

```css
.ctn {
    position: absolute;
    transition: opacity .5;
    opacity: 0;
    /* 解决 opacity 不生效的问题 */
    z-index: 1;
}
.ctn.visible {
    opacity: 1;
}
```

当元素是`position: absolute/fixed`时，且包含了自定义组件，若不设置`z-index`为大于`0`的数值，则`opacity`的`transition`对自定义组件不会生效。

## 开发

### 反编译

- [解包工具 - mp-unpack](https://github.com/xuedingmiaojun/mp-unpack)
- [反编译步骤 - 以中银E路通小程序为例10分钟带你学会微信小程序的反编译](https://cloud.tencent.com/developer/article/1545940)

### 小程序上传打包产物

### miniprogram-api-typings

安装并配置[miniprogram-api-typings](https://github.com/wechat-miniprogram/api-typings)。配置好之后，`miniprogram-api-typings`里的绝大部分的声明都在`WechatMiniprogram`这个命名空间之下，且`WechatMiniprogram`是个全局的命名空间对象。如下以微信卡券相关方法为例，简单介绍使用方法。

假设项目里将`wx.addCard`封装成 Promise 调用。

```ts
// 方式一：直接获取命令空间下的声明 WechatMiniprogram.xxx
const addCard = (card: WechatMiniprogram.AddCardRequestInfo): Promise<WechatMiniprogram.AddCardResponseInfo> => {
    return new Promise((resolve, reject) => {
        wx.addCard({
            cardList: [card],
            success(res) {
                resolve(res.cardList[0]);
            },
            fail() {
                reject();
            },
        });
    });
};
```

```ts
// 方式二：采用命名空间的别名（推荐）
import AddCardRequestInfo = WechatMiniprogram.AddCardRequestInfo;

const addCard = (card: AddCardRequestInfo): Promise<AddCardResponseInfo> => {
    return new Promise((resolve, reject) => {
        wx.addCard({
            cardList: [card],
            success(res) {
                resolve(res.cardList[0]);
            },
            fail() {
                reject();
            },
        });
    });
};
```

### miniprogram-api-promise

[miniprogram-api-promise](https://github.com/wechat-miniprogram/miniprogram-api-promise)，扩展微信小程序的 API，以支持 Promise 形式调用。
