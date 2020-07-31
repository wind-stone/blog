# 微信小程序

## 疑难杂症

- [微信小程序如何隐藏scroll-view滚动条](https://developers.weixin.qq.com/community/develop/doc/00006473cf08f8c29da606b2d56c00)

以`scroll-view`为横向滚动为例，该方式是给`scroll-view`增加一个父元素，父元素的高度固定，并设置`overflow: hidden`；`scroll-view`作为子元素，其高度超过父元素高度，以便将滚动条置于父元素高度之外。注意，若是直接给`scroll-view`增加`padding-bottom`不能将滚动条置于最底部，可尝试给`scroll-view`的子元素添加`padding-bottom`。
