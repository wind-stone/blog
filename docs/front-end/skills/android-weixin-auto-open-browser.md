# Android 微信里自动调起系统浏览器访问页面

正常情况下，在微信里是无法自动调起系统浏览器访问页面的，但是通过如下所描述的 hack 方式，可以在 Android 微信里自动打开浏览器访问页面。

具体步骤为：

1. 在微信里访问页面地址，比如`http://windstone.cc/weixin/auto-launch-browser`。
2. 后端或 Nginx 层判断是否是在 Android 微信里访问的，若是则返回如下的核心`response header`；否则正常返回页面内容。
3. Android 微信接收到上面的`response header`，会自动调起系统浏览器，并在系统浏览器里再次访问页面地址`http://windstone.cc/weixin/auto-launch-browser`，此时后端或 Nginx 层判断出不是在 Android 微信里，则正常返回内容。

```
HTTP/1.1 206 Partial Content
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Accept-Ranges: bytes
Content-Range: bytes 0-1/1
Content-Disposition: attachment;filename=1579.apk
Content-Length: 0
ETag: W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"
Date: Tue, 17 Sep 2019 07:32:12 GMT
Proxy-Connection: keep-alive
```
核心`response header`代码片段

这个实现需要后端配合，或者在 Nginx 层里进行处理，要是想简单处理，可以通过 Charles 里的 Breakpoints 设置断点，在页面响应里将`response header`修改为上述代码，即可验证。

## 进一步优化

在上述的实现里，微信在拉起系统浏览器后，会显示一个白屏的页面，用户需要手动关闭这个页面，体验不好。

可以如下优化：

1. 在微信里访问页面地址，比如`http://windstone.cc/weixin/auto-launch-browser`。
2. 后端或 Nginx 层正常返回页面内容，页面返回后正常执行、渲染。
3. 页面渲染完成后，判断页面所在环境，若是在 Android 微信里，则通过`window.location.href = 'http://windstone.cc/weixin/auto-launch-browser-api'`请求后端接口，接口判断是在 Android 微信里后，返回上述的核心`response header`；此时，微信里打开的页面正常显示。
4. Android 微信接收到上面的`response header`，会自动调起系统浏览器，并在系统浏览器里再次访问页面地址`http://windstone.cc/weixin/auto-launch-browser-api`，此时后端或 Nginx 层判断出不是在 Android 微信里，则通过 302 重定向到`http://windstone.cc/weixin/auto-launch-browser`。

此方案还可以通过后端接口控制是否要调起浏览器，防止微信修复了该漏洞后出问题。