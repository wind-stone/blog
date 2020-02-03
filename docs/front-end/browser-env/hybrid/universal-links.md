# Universal Links

参考链接:

- [iOS H5打开App(通用链接)](https://www.jianshu.com/p/0ead88409212)，这篇文章特别详细
- [Allowing Apps and Websites to Link to Your Content](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content)

在 2015 年的 WWDC 大会上，Apple 推出了 iOS 9 的一个功能：Universal Links（通用链接）。

如果你的 APP 支持 Universal Links，那就可以访问 HTTP/HTTPS 链接直接唤起 APP 进入特定页面，不需要其他额外判断；如果未安装 APP，访问此通用链接时会直接访问这个 HTTP/HTTPS 链接，而这个链接是你可以自定义的页面。

## 为什么要使用 Universal Links

传统的 URL Scheme 有如下痛点：

- 在 iOS 上会有确认弹窗提示用户是否唤起 APP，对于用户唤起 APP 来说，多出了一步操作。若用户未安装 APP，也会有个提示弹窗，告知我们“Safari浏览器打不开该网页，因为网址无效。”
- 传统的 Scheme 跳转无法得知唤起 APP 是否成功，Universal Links 唤起 APP 失败后，可以直接打开此链接对应的页面。
- URL Scheme 在微信、微博、QQ浏览器、手百中都已经被禁止使用，使用 Universal Link 可以避开它们的屏蔽（但截止到2018年8月21日，微信和QQ浏览器已经禁止了 Universal Links，其他主流 APP 未发现有禁止）。

### 优点

- 唯一性: 不像自定义的`scheme`，因为它使用标准的 HTTP/HTTPS 链接到你的 WEB 站点，所以它不会被其它的 APP 所声明（即不会出现两个 APP 共用一个`scheme`的情况）。另外，Custom URL scheme 因为是自定义的协议，所以在没有安装 APP 的情况下是无法直接打开的，而 Universal Links 本身是一个 HTTP/HTTPS 链接，所以有更好的兼容性。
- 安全: 当用户的手机上安装了你的 APP，那么 iOS 将去你的网站上去下载你上传上去的说明文件`apple-app-site-association`(这个说明文件声明了 APP 可以打开哪些类型的 HTTP/HTTPS 链接)。因为只有你自己才能上传文件到你网站的根目录,所以你的网站和你的 APP 之间的关联是安全的。
- 可变: 当用户手机上没有安装你的 APP 的时候，Universal Links 也能够工作。如果你愿意，在没有安装 APP 的时候，用户点击链接，会在 Safari 中展示你网站的内容。
- 简单: 一个 URL 链接，可以同时作用于网站和 APP，可以定义统一的 web-native 协议。
- 私有: 其它 APP 可以在不需要知道是否安装了的情况下和你的 APP 相互通信。

### 缺点

- 只支持 iOS9 及以上系统。
- 当使用 Universal Links 打开 APP 之后，状态栏右上角会出现链接地址，点击它会取消 Universal Links，需引导用户重新使用 Safari 再次打开该链接，弹出 Safari 内置 APP 广告条，再点击打开重新开启 Universal Link。

## 如何让 APP 支持 Universal Links

1. 准备好一个**HTTPS**域名。
2. 在 开发者中心 的 Identifiers 下 AppIDs 找到自己的 AppID，编辑打开 Associated Domains 服务。
3. 打开工程配置中的 Associated Domains ，在其中的 Domains 中填入你想支持的域名，必须以 applinks: 为前缀。
4. 配置`apple-app-site-association`文件，文件名必须为`apple-app-site-association`，**不带任何后缀**。
5. 上传该文件到你的 HTTPS 服务器的**根目录**或者`.well-known`目录下。

### apple-app-site-association 格式

```json
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "Y5963EFXW8.com.kwai.intl",
                "paths": [ "/app/*" ]
            },
            // ....
        ]
    },
    "webcredentials": {
       "apps": [
            "MW76NQM8LG.com.jiangjia.gif",
            "MW76NQM8LG.com.kwai.gifshow.beta1"
        ]
    }
}
```

## Universal Links 配置中的坑

在实际的配置过程中，要严格按照上面的步骤进行，但仍然会遇到一些坑。

- 跨域问题。

iOS 9.2 以后，必须要触发跨域才能支持 Universal Links 唤起 APP。
iOS 系统里有这样一个判断，如果你要打开的 Universal Links 和 当前页面是同一域名，iOS 将尊重用户最可能的意图，直接打开链接所对应的页面。如果不在同一域名下，才会执行具体的唤起操作。

- Universal Links 是空页面

Universal Links 本质上是个空页面，如果未安装 APP，Universal Links 会被当做普通的页面链接，自然会跳到 404 页面，所以我们需要将它绑定到我们的中转页或者下载页。
