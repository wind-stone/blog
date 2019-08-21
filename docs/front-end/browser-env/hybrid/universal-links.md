# Universal Links

参考链接:

- [iOS H5打开App(通用链接)](https://www.jianshu.com/p/0ead88409212)，这篇文章特别详细
- [Allowing Apps and Websites to Link to Your Content](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content)

在 2015 年的 WWDC 大会上，Apple 推出了 iOS 9 的一个功能：Universal Links（通用链接）。

如果你的 APP 支持 Universal Links，那就可以访问 HTTP/HTTPS 链接直接唤起 APP 进入特定页面，不需要其他额外判断；如果未安装 APP，访问此通用链接时会直接访问这个 HTTP/HTTPS 链接，而这个链接是你可以自定义的页面。

## 优点

- 唯一性: 不像自定义的`scheme`，因为它使用标准的 HTTP/HTTPS 链接到你的 WEB 站点，所以它不会被其它的 APP 所声明（即不会出现两个 APP 共用一个`scheme`的情况）。另外，Custom URL scheme 因为是自定义的协议，所以在没有安装 APP 的情况下是无法直接打开的，而 Universal Links 本身是一个 HTTP/HTTPS 链接，所以有更好的兼容性。
- 安全: 当用户的手机上安装了你的 APP，那么 iOS 将去你的网站上去下载你上传上去的说明文件(这个说明文件声明了 APP 可以打开哪些类型的 HTTP/HTTPS 链接)。因为只有你自己才能上传文件到你网站的根目录,所以你的网站和你的 APP 之间的关联是安全的。
- 可变: 当用户手机上没有安装你的 APP 的时候，Universal Links 也能够工作。如果你愿意，在没有安装 APP 的时候，用户点击链接，会在 Safari 中展示你网站的内容。
- 简单: 一个 URL 链接，可以同时作用于网站和 APP，可以定义统一的 web-native 协议。
- 私有: 其它 APP 可以在不需要知道是否安装了的情况下和你的 APP 相互通信。

## 缺点

只支持 iOS9 及以上系统；当使用 Universal Link 打开 APP 之后，状态栏右上角会出现链接地址，点击它会取消 Universal Link，需引导用户重新使用 Safari 再次打开该链接，弹出 Safari 内置 APP 广告条，再点击打开重新开启 Universal Link。

## 使用步骤

- 