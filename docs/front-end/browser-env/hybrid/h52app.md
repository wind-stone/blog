---
sidebarDepth: 0
---

# h5 唤起 APP

[[toc]]

h5 里若是想唤起指定 APP，一般会出现两种情况：

1. 设备里安装了该 APP，期望可以直接唤起该 APP。
2. 设置里没安装该 APP，期望（跳转到应用市场/App Store）下载 APP。

而 h5 唤起 APP 的能力或者说方式，一般称之为 Deep linking: 跳转到原生 iOS 和 Android 移动应用内部特定页面的能力。

目前，Deep linking 实现的方式有：

- Universal Link（>= iOS 9）
- Android App Link（>= Android 6）
- URI Scheme
- Chrome Intent

## Deep Linking

### URL scheme

#### 客户端注册 scheme 协议

以 Android 为例：

```xml
<activity android:name = ".MainActivity">
    <intent-filter>
        <action android:name = "android.intent.action.MAIN" />

        <category android:name = "android.intent.category.LAUNCHER" />
    </intent-filter>
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="cxl" android:host="wind-stone.com"/>
    </intent-filter>
</activity>
```

h5 页面里即可通过各种方式大概该 scheme，比如`a`标签：

```html
<a href="cxl://wind-stone.com/path?params=xxx">打开app</a>
```

- [android-Scheme与网页跳转原生的三种方式](https://blog.csdn.net/sinat_31057219/article/details/78362326)
- [iOS scheme跳转机制](https://www.jianshu.com/p/138b44833cda)

一般会优先使用`iframe`打开自定义的`scheme`：

```js
const iframe = document.createElement('iframe');
iframe.src = 'URL scheme';
iframe.style.display = 'none';
document.body.appendChild(iframe);
```

有些系统会拦截`iframe`的`src`（这只是造成唤醒 APP 失败的其中一种原因）,因为这个`src`属性是一个法外`hacker`，很多漏洞都是利用他造成的。所以这时候就要判断跳转 APP 失败的情况了。

```js
const timer = 1000;
setTimeout(function() {
    // 执行成功后移除iframe
    document.body.removeChild(iframe);

    // setTimeout 小于 2000 通常认为是唤起 APP 失败
    if (Date.now() - last < 2000) {
        // 执行失败函数
        // 也有可能是浏览器弹窗询问是否跳转 APP，导致时间超过 2000 ms
    } else {
        //  执行成功函数
    }
}, timer);
```

若是成功唤起 APP，则原 h5 页面会切换到后台（导致定时器停止运行）。即使用户再用唤起的 APP 切换到原来的 h5 页面，这个时间差必然是大于 2000ms 的。

若是唤起 APP 失败，定时器会按预期时间执行，这时候绝大多数情况下都是小于 2s 的。（主线程长时间执行可能会导致定时器延迟，因此此处不是 100% 正确，但是基本相差不大）

#### 如何判断设备里是否安装指定的 APP

实际上，不管是 iOS 还是 Android，我们都无法通过浏览器预知本地是否安装了指定的 APP。
（即使浏览器可以读取本地安装的应用列表，但是目前没有任何一家浏览器实现了提供查询的 API）

但是 APP 在安装时，可以注册 URL scheme，当浏览器打开注册的 scheme 时，会唤起对应 APP。若是唤起失败，则代表没有安装对应的 APP。

```js
var url = {
  open: 'app://xxxxx',
  down: 'xxxxxxxx'
};
var iframe = document.createElement('iframe');
var body = document.body;
iframe.style.cssText='display:none;width=0;height=0';
var timer = null;

// 立即打开的按钮
var openapp = document.getElementById('openapp');
openapp.addEventListener('click', function() {
  if(/MicroMessenger/gi.test(navigator.userAgent)) {
    // 引导用户在浏览器中打开
  } else {
    body.appendChild(iframe);
    iframe.src = url.open;

    timer = setTimeout(function() {
      wondow.location.href = url.down;
    }, 500);
  }
}, false)
```

以上代码的逻辑是，当用户点击“立即打开”按钮，通过`iframe`的方式跳转到 URL scheme，延时 500ms 后跳转到下载页面。

但是存在的问题是，若是本地安装了 APP 并成功唤起了，h5 页面 500ms 后还是会跳转到下载页面。

因此要做以下补充：

```js
$(document).on('visibilitychange webkitvisibilitychange', function() {
  var tag = document.hidden || document.webkitHidden;
  if (tag) {
    timer && clearTimeout(timer);
  }
})

$(window).on('pagehide', function() {
  timer && clearTimeout(timer);
})
```

监听`window`的`pagehide`事件以及`document`的`visibilitychange`事件（由于各个浏览器的支持情况不同，我们需要同事监听这两个事件），当页面隐藏时，及时清除定时器。

Tips：

- 为什么不使用`location.href`？
  - 在有的浏览器中，当我们使用`location.href`尝试跳转到 scheme link 的时候，若本地没有安装 APP，则会跳转到浏览器默认的错误页面
- iOS 9+ 不支持通过`iframe`跳转到自定义协议
  - [Stack Overflow - iOS 9 safari iframe src with custom url scheme not working](https://stackoverflow.com/questions/31891777/ios-9-safari-iframe-src-with-custom-url-scheme-not-working)

#### URL scheme 的兼容性问题

Android 原生的 Chrome 浏览器（Chrome for Android）里，如下两种情况下，给定一个 Intent URI 时，Chrome 将不会拉起外部应用：

- Intent URI 是根据键入的 URL 重定向得到的
- 在未经过用户交互（比如用户点击）的情况下，初始化 Intent URI

详见：[Android Intents with Chrome](https://developer.chrome.com/multidevice/android/intents)

## 跳转到应用市场/App Store

### iOS，跳转到 App Store

在浏览器里打开类似：`https://itunes.apple.com/app/apple-store/id440948110?pt=572643&mt=8&ct=`的链接，可以唤起 App Store，并进入到 快手 APP 的详情页面。

链接里的`mt`代表`meta-type`，有效值如下：

- 1：Music
- 2：Podcasts
- 3：Audiobooks
- 4：TV Shows
- 5：Music Videos
- 6：Movies
- 7：iPod Games
- 8：Mobile Software Applications
- 9：Ringtones
- 10：iTunes U
- 11：E-Books
- 12：Desktop Apps

（猜测：针对每个 APP，App Store 都会生成类似上面的唯一链接）

### Android，跳转到应用市场

通过`window.location.href = 'market://details?id=com.smile.gifmaker'`可以吊起应用市场，其中`id`参数是要定位到的 APP 的包名，比如快手的包名为`com.smile.gifmaker`。

## 兼容性问题

### 兼容性概括

Android:

微信、QQ：URL Scheme 不可用，可通过应用宝中转，APP 必须在腾讯商店上架。
浏览器：URL Scheme 可用。
其他APP：提示用浏览器打开。

iOS >= 9（支持 Universal Links）：

微信：URL Scheme 和 Universal Links 均不可用，通过应用宝中转。
QQ：Universal Links 尚且可用。
QQ浏览器：Universal Links 不可用，但 URL Scheme 可用。
其他APP：Universal Links 可用。

iOS < 9（不支持 Universal Links）：

微信、QQ：URL Scheme 不可用，提示用浏览器打开。
各浏览器：URL Scheme 可用。
其他APP：提示用浏览器打开。

以上兼容性数据来源于：[H5唤醒APP或打开应用商店下载（未完成）](https://blog.csdn.net/weixin_39921345/article/details/79892920?utm_source=copy)

### 微信

微信对 URL scheme 协议做了屏蔽，无法通过 URL scheme 的方式唤起其他 APP。（除非`scheme`在微信的白名单里）

微信也不支持 Universal Links。

针对微信，有两个解决办法：

- 通过应用宝跳转（[应用宝微下载](http://wiki.open.qq.com/index.php?title=mobile/%E5%BA%94%E7%94%A8%E5%AE%9D%E5%BE%AE%E4%B8%8B%E8%BD%BD)）
- 提示用户在浏览器里打开

## Reference

- [Deep Linking：从浏览器调起 APP](https://harttle.land/2017/12/24/launch-app-from-browser.html)
- [Universal Link 前端部署采坑记](https://awhisper.github.io/2017/09/02/universallink/)
- [应用宝微下载](http://wiki.open.qq.com/index.php?title=mobile/%E5%BA%94%E7%94%A8%E5%AE%9D%E5%BE%AE%E4%B8%8B%E8%BD%BD)
