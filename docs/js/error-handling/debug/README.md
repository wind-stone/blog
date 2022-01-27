# 调试

[[toc]]

## APP 内

### 微信

[微信下调试H5页面](https://segmentfault.com/a/1190000018407990)

## Chrome 调试

### 远程调试

参考文档：[在安卓设备上使用 Chrome 远程调试功能](http://wiki.jikexueyuan.com/project/chrome-devtools/remote-debugging-on-android.html)

可能遇到的问题及解决方法：

- 手机设置里，打开“USB 调试”开关后，Chrome 上未显示设备，可尝试以下解决方法：
  - 使用正规的数据线（最好是原装的）
  - 重置“开发者选项”

## Charles

### iOS 安装证书

1. 在 Safari 中访问`http://chls.pro/ssl`，安装证书
2. （需要抓包 https 时，针对 iOS 11 及以上）打开【设置】>【通用】>【关于本机】>【证书信任设置】，将上一步安装的证书设置为信任

## 浏览器控制台

### $ 符号

- `$0` ~ `$4`：在 elements 面板中标记一个 DOM 元素，然后在 console 中使用它。Chrome Inspector 会保存最后 5 个元素在其历史记录中，所以最后标记的元素可以用 $0 来显示，倒数第二个被标记的元素为 $1 ，以此类推。
- `$(selector)`：`$('.class')`会返回 CSS 选择器所匹配的第一个元素
- `$$(selector)`：`$$('.class')`会返回所有的元素
- `$_`：返回最近执行表达式的值

### 事件相关

- `getEventListeners(document)`：返回指定 DOM 元素上注册的事件监听器。
- `monitorEvents(window, ['resize', 'scroll'])`/`unmonitorEvents(DOMElement)`：在指定 DOM 元素上触发任何事件时，都可以在控制台中看到相关信息。直到取消对相应元素的监视。

### debugger

```js
if (thisThing) {
  debugger
}
```

### 断点调试

#### JS 断点调试

#### Sources 断点

#### DOM 断点调试

#### XHR 断点调试

#### 事件监听 断点调试

## Reference

- [前端早读课【第556期】一探前端开发中的JS调试技巧](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651220284&idx=1&sn=26eab0ec27163e7cb020fd95ac0dfaee&scene=21#wechat_redirect)
- [前端早读课【第1104期】14 个你可能不知道的 JavaScript 调试技巧](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651227260&idx=1&sn=7471c6326c41ab56d9653948ab5803a8&chksm=bd495df88a3ed4eeec595e226eaa075890ff0b33d08ee72f5639868c63b3b8dd65d255f2cf22&scene=21#wechat_redirect)
- [前端早读课【第1112期】前端 Console 调试小技巧](https://mp.weixin.qq.com/s/0g8X8As0X5FdBdjnWWBQkQ)
