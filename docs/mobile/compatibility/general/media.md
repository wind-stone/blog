---
sidebarDepth: 0
---

# 媒体文件

[[toc]]

## 移动端`audio`元素无法自动播放

### 背景

Chrome 浏览器里，`audio`元素的`autoplay`特性不起作用，代码里调用`audio`元素的`play`方法也会报如下的错误。

> Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.

按错误提示，`play`方法调用失败，是因为用户没有与文档交互。换句话说就是，必须用户与文档里的任一元素产生了交互，才能调用`audio`元素的`play`方法。

但是为什么不能自动播放`audio`呢？据说是在移动端，为了节省流量，不能自动播放音频和视频。

> In Safari on iOS (for all devices, including iPad), where the user may be on a cellular network and be charged per data unit, preload and autoplay are disabled. No data is loaded until the user initiates it. This means the JavaScript play() and load() methods are also inactive until the user initiates playback, unless the play() or load() method is triggered by user action. In other words, a user-initiated Play button works, but an onLoad="play()" event does not.
>
> This plays the movie: `<input type="button" value="Play" onclick="document.myMovie.play()">`
>
> This does nothing on iOS: `<body onload="document.myMovie.play()">`
>
> Note: This requirement applies to media played by `<audio>` tags, `<video>` tags, and Web Audio. For more information about the Web Audio API, read the next chapter, Playing Sounds with the Web Audio API.

在[苹果的开发者文档](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW1)里，有如上描述。

### 解决方案

```html
<audio id="music" src="xxx.mp4" autoplay loop></audio>
```

#### 微信

引入微信的 JSSDK，在`wx.ready`函数内调用`audio.play()`即可。

```html
<script type="text/javascript src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
```

```js
// 配置信息
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，企业号的唯一标识，此处填写企业号corpid
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});

wx.ready(function () {
    document.getElementById('music').play();
})
```

#### 非微信、不可自动播放的渠道

用户触摸屏幕后（单次触发），播放音频

```js
$('html').one('touchstart',function(){
    document.getElementById('music').play();
});
```
