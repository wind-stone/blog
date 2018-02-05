# vue-router

## 默认使用 hash 模式
使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载

## 可选择 history 模式
这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。不过这种模式要玩好，还需要后台配置支持。