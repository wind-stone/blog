# 浏览器工作原理

## 进程 VS 线程

线程是不能单独存在的，它是由进程来启动和管理。一个进程就是一个程序的运行实例。详细解释就是，启动一个程序的时候，操作系统会为该程序创建一块内存，用来存放代码、运行中的数据和一个执行任务的主线程，我们把这样的一个运行环境叫进程。

进程和线程的关系有如下几个特点：

- 进程中的任意一线程执行出错，都会导致整个进程的崩溃。
- 线程之间共享进程中的数据。
- 当一个进程关闭之后，操作系统会回收进程所占用的内存。
- 进程之间的内容相互隔离。

进程内使用多线程并行处理，可以大大提升性能。

::: tip 作者注
采用类比的方式，可以将进程理解为一个家庭，同一个户口本上的所有人组成了这个家庭，家庭里的每个人都是一个线程，而户口本上的户主就是主线程。
:::

## 为什么 Chrome 浏览器的 UA 里会包含 AppleWebkit

UA 是浏览器的身份证。通常，在发送 HTTP 请求时，UA 会附带在 HTTP 的请求头中`user-agent`字段中，这样服务器就会知道浏览器的基础信息，然后服务器会根据不同的 UA 返回不同的页面内容，比如手机上返回手机的样式，PC 就返回 PC 的样式。

你也可以在浏览器的控制台中输入`navigator.userAgent`来查看当前浏览器的UA信息。

FireFox 中的打印的信息是：`"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0"`

Chrome 中打印的信息是：`"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36"`

安卓系统中的 Chrome 浏览器：`"Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36"`

我们知道了服务器会根据不同的 UA 来针对性地设计不同页面，所以当出了一款新浏览器时，他如果使用自己独一无二的 UA，那么之前的很多服务器还需要针对他来做页面适配，这显然是不可能的，比如Chrome 发布时他会在他的 UA 中使用`Mozilla`，`AppleWebKit`等关键字段，用来表示他同时支持 Mozilla 和 AppleWebKit，然后再在最后加上他自己的标示，如`Chrome/xxx`。

这就解释了为什么你查看的信息中含有 WebKit 字样。

## 现代浏览器里打开多个 Tab，每个 Tab 的端口是一样的吗

现代浏览器里可以同时打开多个 Tab，这些 Tab 的端口是一样的，网络进程会标记哪个 TCP 链接属于哪个 Tab，当接收到数据之后，会将数据分发给对应 Tab 的渲染进程。

## 为什么有时访问 HTTP 的 URL 会变成访问 HTTPS 的 URL

有些网站，当我们使用 HTTP 的 URL 去访问时，会立即变成访问其 HTTPS 的 URL，比如在浏览器地址栏输入`http://blog.windstone.cc`并回车，页面展示时地址栏的 URL 变成了`https://blog.windstone.cc`，这是为什么呢？

实际上，这是因为某些网站强制让用户使用 HTTPS 访问其网站。其实现方式是，以访问`http://blog.windstone.cc`为例，服务器会返回 301 Moved Permanently 并通过响应头里的 Location 重定向到`https://blog.windstone.cc`。

```txt
General
    Request URL: http://blog.windstone.cc/
    Request Method: GET
    Status Code: 301 Moved Permanently
    Remote Address: 127.0.0.1:8888
    Referrer Policy: no-referrer-when-downgrade

Response Headers
    Accept-Ranges: bytes
    Age: 3339
    Content-Length: 162
    Content-Type: text/html
    Date: Thu, 02 Jan 2020 04:24:26 GMT
    Location: https://blog.windstone.cc/
    Proxy-Connection: keep-alive
    Server: GitHub.com
    Vary: Accept-Encoding
    Via: 1.1 varnish
    X-Cache: HIT
    X-Cache-Hits: 1
    X-Fastly-Request-ID: 7df7dc01fd71ce991d34501ace927eb9f9b8a05d
    X-GitHub-Request-Id: F038:497C:479560:5F190D:5E0D636F
    X-Served-By: cache-hkg17928-HKG
    X-Timer: S1577939066.332016,VS0,VE0

Request Headers
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
    Accept-Encoding: gzip, deflate
    Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,ru;q=0.7,zh-TW;q=0.6
    Cache-Control: no-cache
    Host: blog.windstone.cc
    Pragma: no-cache
    Proxy-Connection: keep-alive
    Upgrade-Insecure-Requests: 1
    User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36
```
