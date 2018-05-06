# `addEventListener()`里的`passive`参数

`addEventListener(type, listener[, options ])`里`options`里的`passive`参数，设置为`true`时，表明注册的`listener`内不会调用`preventDefault()`，浏览器将同时执行`listener`和浏览器的默认行为（而不是等执行`listener`结束之后再执行默认行为），且会忽略`listener`里的`preventDefault()`，使得滚动更加流畅。

Reference:
- [passive 的事件监听器](http://www.cnblogs.com/ziyunfei/p/5545439.html)
- [前端早读课--【第1240期】passive 事件监听](https://mp.weixin.qq.com/s/TrN50625KykugTiOZ3JVsw)