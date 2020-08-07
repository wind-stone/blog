# 微信小程序

## 特性

### 分享卡片进入会创建新页面栈

小程序已启动且切换到后台的情况下，再通过分享卡片进入，会新创建新的页面栈，之前的页面栈会销毁。目前没有相关文档记载，但实际情况就是如此。

## 疑难杂症

- [微信小程序如何隐藏scroll-view滚动条](https://developers.weixin.qq.com/community/develop/doc/00006473cf08f8c29da606b2d56c00)

以`scroll-view`为横向滚动为例，该方式是给`scroll-view`增加一个父元素，父元素的高度固定，并设置`overflow: hidden`；`scroll-view`作为子元素，其高度超过父元素高度，以便将滚动条置于父元素高度之外。注意，若是直接给`scroll-view`增加`padding-bottom`不能将滚动条置于最底部，可尝试给`scroll-view`的子元素添加`padding-bottom`。
