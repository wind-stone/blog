# video 兼容性

[[toc]]

## 属性

更多详情请见[MDN - video 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)

```html
<video
  src="video.mp4"
  muted
  controls
  autoplay
  poster="images.jpg" /*视频封面*/
  preload="auto"

  webkit-playsinline
  playsinline

  x-webkit-airplay="allow"

  x5-video-player-type="h5"
  x5-video-orientation="portraint"
  x5-video-player-fullscreen="true"

  style="object-fit:fill">
</video>
```

- `src`：视频的地址
- `muted`：布尔特性，设置该属性，则视频的音频输出会被静音
- `controls`：布尔特性，加上这个属性，Gecko 会提供用户控制，允许用户控制视频的播放，包括音量，跨帧，暂停/恢复播放
- `autoplay`：布尔特性，视频自动播放
- `poster`：属性规定视频下载时显示的图像，或者在用户点击播放按钮前显示的图像。如果未设置该属性，则使用视频的第一帧来代替。
- `preload`：该属性规定在页面加载后载入视频。如果设置了`autoplay`属性，则忽略该属性。可选的值有：
  - auto：当页面加载后载入整个视频
  - meta：当页面加载后只载入元数据
  - none：当页面加载后不载入视频
- `playsinline`/`webkit-playsinline`：布尔特性，iOS only
  - 设置该属性，可以让视频在`video`元素所在区域内播放，而不是全屏播放。
  - 若不设置该属性，iOS 上会弹出全屏播放，并携带播放控件（可以播放、暂停、快进、快退、拖动播放进度等，效果图可参见引用里的第一篇文章）
  - 该属性较为特别，需要嵌入网页的APP 比如 WeChat 中的 UIwebview 的`allowsInlineMediaPlayback` = YES，才能生效；如果 APP 的 UIwebview 不设置，即使在页面里的`video`标签加了该特性也无效。
  - 该特性仅对 iOS 有效，iOS 10 之前需要使用带前缀的版本`webkit-playsinline`，iOS 10 之后可以去掉前缀，直接使用`playsinline`，为了兼容新老版本，一般这两个都会使用（[New video Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)）
- `x5-video-player-type`：WeChat 安卓版特有的属性
  - 特性值为"h5"，意为开启 H5 同层播放，就是在视频全屏的时候，`div`等元素可以呈现在视频层上。同层播放别名也叫做沉浸式播放，播放的时候看似全屏，但是已经除去了`control`和微信的导航栏，只留下`X`和`<`两键。目前的同层播放器只在 Android（包括微信）上生效，暂时不支持 iOS。
  - 背景：以前播放视频，`video`元素是顶层的，任何元素不能悬浮于`video`元素之上
  - 笔者想过为什么同层播放只对安卓开放，因为安卓不能像ISO一样局域播放，默认的全屏会使得一些界面操作被阻拦，如果是全屏H5还好，但是做直播的话，诸如弹幕那样的功能就无法实现了，所以这时候同层播放的概念就解决了这个问题。不过笔者在测试的过程中发现，不同版本的ISO和安卓效果略有不同。
- `x5-video-player-fullscreen`：
  - 视频播放时将会进入到全屏模式，如果不申明此属性，页面得到视口区域为原始视口大小(视频未播放前)，比如在微信里，会有一个常驻的标题栏，如果不声明此属性，这个标题栏高度不会给页面，播放时会平均分为两块（上下黑块）
  - 注： 声明此属性，需要页面自己重新适配新的视口大小变化。可以通过监听resize 事件来实现

```html
<video id="test_video" src="xxx" x5-video-player-type="h5" x5-video-player-fullscreen="true" />
```

```js
window.onresize = function(){
  test_video.style.width = window.innerWidth + "px";
  test_video.style.height = window.innerHeight + "px";
}
```

- `x5-video-orientation`：
  - 声明播放器支持的方向，可选值`landscape`横屏,`portraint`竖屏。默认值`portraint`
  - 无论是直播还是全屏H5一般都是竖屏播放，但是这个属性需要x5-video-player-type开启 H5 模式

## 事件

详细的事件列表可参考[MDN - 媒体相关事件](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Media_events)。

主要注意的是，按照参考链接[视频H5 video最佳实践 #11](https://github.com/gnipbao/iblog/issues/11)里说的，在移动端除了`ended`、`timeupdate`、`event`事件之外，不要轻易使用媒体元素的其他事件。

### 查询视频的缓冲时间

有时候会遇到对`video`添加了`autoplay`但是无法自动播放的情况，这时候可以查看下`video`的缓冲时间是否足够播放，可使用`video`的`buffered`属性查看，详情可参考[Media buffering, seeking, and time ranges](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_delivery/buffering_seeking_time_ranges)。

## 兼容性问题汇总

- 华为/Vivo 等系统浏览器
  - 当`video`元素设置了`object-fit: cover`后，在`video`所在区域内播放时，视频会位于最顶层，覆盖其他所有东西。
  - 当`video`元素滚动到屏幕上方时，`video`宽度会变成屏幕宽度
  - 播放控件无法隐藏
- Android 微信里不能监听`ended`事件后调用`video.play()`进行循环播放，需要给`video`元素添加`loop`属性

## 参考链接

- [MDN - video 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)
- [MDN - 媒体相关事件](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Media_events)
- [视频H5 video最佳实践 #11](https://github.com/gnipbao/iblog/issues/11)
- [视频H5のVideo标签在微信里的坑和技巧](https://aotu.io/notes/2017/01/11/mobile-video/)
- [Media buffering, seeking, and time ranges](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_delivery/buffering_seeking_time_ranges)
