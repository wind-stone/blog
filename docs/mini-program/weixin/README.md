# 微信小程序

## 特性

### 分享卡片进入会创建新页面栈

小程序已启动且切换到后台的情况下，再通过分享卡片进入，会新创建新的页面栈，之前的页面栈会销毁。目前没有相关文档记载，但实际情况就是如此。

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

- [微信小程序如何隐藏scroll-view滚动条](https://developers.weixin.qq.com/community/develop/doc/00006473cf08f8c29da606b2d56c00)

以`scroll-view`为横向滚动为例，该方式是给`scroll-view`增加一个父元素，父元素的高度固定，并设置`overflow: hidden`；`scroll-view`作为子元素，其高度超过父元素高度，以便将滚动条置于父元素高度之外。注意，若是直接给`scroll-view`增加`padding-bottom`不能将滚动条置于最底部，可尝试给`scroll-view`的子元素添加`padding-bottom`。
