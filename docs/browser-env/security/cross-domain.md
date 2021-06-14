# 跨域

[[toc]]

## 同源策略

当两个域具有相同的协议, 相同的端口，相同的域名，那么我们就可以认为它们是相同的域。

只要协议、域名、端口有任何一个不同，都被当作是不同的域，之间的请求就是跨域操作。

## 造成跨域的两种策略

浏览器的同源策略会导致跨域，这里同源策略又分为以下两种：

- DOM 层面的同源策略：禁止对不同源页面 DOM 进行操作。
  - 比如 iframe 跨域的情况，不同域名的 iframe 是限制互相访问的。
  - 比如通过 A 页面打开 B 页面，B 不同源的话，B 页面无法操作 A 页面的 DOM。
- 数据层面的同源策略：限制不同源站点读取当前站点的 Cookie、IndexDB、LocalStorge 等数据。
- 网络层面的同源策略：禁止使用 XHR 对象向不同源的服务器地址发起 HTTP 请求。（实际上是可以请求，但是请求返回后，浏览器会告知你这是跨域请求，返回结果无法使用）

## 为什么要有跨域限制

跨域限制主要是为了安全考虑。

Ajax 同源策略主要用来防止 CSRF 攻击。如果没有 Ajax 同源策略，相当危险，我们发起的每一次 HTTP 请求都会带上请求地址对应的 cookie，那么可以做如下攻击：

1. 用户登录了自己的银行页面`http://mybank.com`，`http://mybank.com`向用户的 cookie 中添加用户标识。
2. 用户浏览了恶意页面`http://evil.com`，执行了页面中的恶意 Ajax 请求代码。
3. `http://evil.com`向`http://mybank.com`发起 Ajax 请求，请求会默认把`http://mybank.com`对应 cookie 也同时发送过去。
4. 银行页面从发送的 cookie 中提取用户标识，验证用户无误，response 中返回请求数据。此时数据就泄露了。
5. 而且由于 Ajax 在后台执行，用户无法感知这一过程。

DOM 同源策略也一样，如果 iframe 之间可以跨域访问，可以这样攻击：

1. 做一个假网站，里面用 iframe 嵌套一个银行网站 http://mybank.com
2. 把 iframe 宽高啥的调整到页面全部，这样用户进来除了域名，别的部分和银行的网站没有任何差别
3. 这时如果用户输入账号密码，我们的主网站可以跨域访问到 http://mybank.com 的 dom 节点，就可以拿到用户的输入了，那么就完成了一次攻击。所以说有了跨域跨域限制之后，我们才能更安全的上网了。

## 跨域方法

如下列举所有我已知的跨域方法，包括

- CORS
- JSONP
- postMessage
- 服务器代理（一般用于开发阶段）
- 表单提交
- document.domain
- window.name
- location.hash
- WebSocket

其中前五项最为常用，我也实际在项目里使用过，现在分别介绍这些跨域方法的原理。

### CORS（跨域资源共享）

CORS 是一个 W3C 标准，全称是“跨域资源共享”（Cross-origin resource sharing）。 对于这个方式，阮一峰老师总结的文章特别好，希望深入了解的可以看一下 [阮一峰-跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

简单的说一说大体流程。

1. 对于客户端，我们还是正常使用 xhr 对象发送 Ajax 请求。唯一需要注意的是，我们需要设置我们的 xhr 属性 `withCredentials`为`true`，即`xhr.withCredentials = true`，否则 cookie 是带不过去的
2. 对于服务器端，需要在 response header 中设置如下两个字段，如此便可以跨域请求接口了

```sh
Access-Control-Allow-Origin: http://www.yourhost.com
Access-Control-Allow-Credentials:true
```

优点：CORS 支持所有类型的 HTTP 请求，是跨域 HTTP 请求的根本解决方案

### JSONP

预先在 js 里注册好函数`callback`，新建`script`并设置`src`携带函数名称`callback`，服务器端会返回 js 文件，其内容为`callback(data)`，将`script`插入到文档里执行。

```js
function jsonp(url, data, callback) {
  const callbackName = 'callback' + math.random().replace('.', '')
  const script = document.createElement('script')
  const head = document.querySelector('head')

  window[callbackName] = function (res) {
    // 清理 script 标签和回调函数
    head.removeElement(script)
    window[callbackName] = undefined
    callback(res)
  }

  // 简单处理 url 及 data
  script.src = url + data + '&callback=' + callbackName
  head.appendChild(script)
}
```

优点：简单适用，老式浏览器全部支持，服务器改造小。不需要XMLHttpRequest或ActiveX的支持。

缺点：只支持GET请求。

### postMessage

信息传递除了客户端与服务器之前的传递，还存在以下几个问题：

- 页面和新开的窗口的数据交互
- 多窗口之间的数据交互
- 页面与所嵌套的 iframe 之间的信息传递

`window.postMessage`是一个 HTML5 的 API，允许两个窗口之间进行跨域发送消息。

以主页面与其内的 iframe 通信为例：

```js
// 主页面监听从 iframe 发来的消息
window.addEventListener('message', function (evt) {
  console.log(evt, evt.data)
}, false)

// 主页面发送消息（可以指定给特定域名发送消息）
const iframe = document.querySelector('iframe')
iframe.contentWindow.postMessage({
  width: window.screen.width
}, '*')
```

### 服务器代理

浏览器有跨域限制，但是服务器不存在跨域问题，所以可以由服务器请求所要域的资源再返回给客户端。

一般在项目开发阶段，会使用本地服务器转发接口（比如可以通过 webpack 的`webpack-dev-server`去配置`proxy`），从而达到通过服务器代理解决跨域问题。

### 表单提交

表单可以设置 action 为任何域名，进而实现跨域提交，但是表单提交默认会进行跳转，因此一般会新建 iframe 并在其内创建表单并提交

Reference: [http://blog.csdn.net/cxl444905143/article/details/41923497](http://blog.csdn.net/cxl444905143/article/details/41923497)

### document.domain（主域相同的跨域）

document.domain 的场景只适用于不同子域的框架间的交互，及主域必须相同的不同源。

各个子域通过将页面文档的 document.domain 设置为相同的主域，实现多个页面处于同一域名下，这样就不存在跨域的问题了。

Reference:

- [前端跨域问题及解决方案 #2](https://github.com/wengjq/Blog/issues/2)
- [设置document.domain实现js跨域注意点 【转】](http://www.cnblogs.com/fsjohnhuang/articles/2279554.html)

### window.name

`window`对象有个`name`属性，该属性有个特征：即在一个窗口（`window`）的生命周期内,窗口载入的所有的页面都是共享一个`window.name`的，每个页面对`window.name`都有读写的权限，`window.name`是持久存在一个窗口载入过的所有页面中的。`window.name`属性的神奇之处在于`name`值在不同的页面（甚至不同域名）加载后依旧存在（如果没修改则值不会变化），并且可以支持非常长的`name`值（2MB）。

```js
// example.com/index.html
window.name = 'example'
window.location = 'target.com/index.html'  // 此时页面会跳转到 target.com/index.html

// target.com/index.html
window.name // 打印 window.name，其值仍为 example
```

因此使用该方法跨域的方案就是：

- 准备三个页面
  - 主页面`source/main.html`
  - 代理页面`source/proxy.html`（需要与主页面同域）
  - 要跨域的页面`target.com/target.html`（与主页面不同域）
- 主页面内新建 iframe，且`iframe.src = 'target.com/target.html'`，`target.com/target.html`页面渲染 js 执行（该页面执行时会设置`window.name = '要传递给主页面的数据'`）
- 主页面通过`iframe.onload`监控到`target.com/target.html`加载并执行后，设置 iframe 为代理页面的地址`iframe.src = 'source/proxy.html'`
- 代理页面加载并执行，既可取到`window.name`里的数据，且跟主页面同域，可以相互调用 window 的方法或者属性，最终完成跨域功能

```js
// source/main.html
let ready
const iframe = document.createElement('iframe')
iframe.onload = function () {
  if (ready) {
    // 主页面获取到 代理页面的 window.name，这个数据就是要跨域获取的数据
    const data = iframe.contentWindow.name
    // 销毁 iframe
    // iframe.contentWindow.document.write('')
    // iframe.contentWindow.close()
    // document.body.removeChild(iframe)
  } else {
    ready = true
    iframe.contentWindow.location = 'source/proxy.html'
  }
}
iframe.src = 'target.com/target.html'  // 先设置成要跨域的页面
document.body.appendChild(iframe)
```

```js
// target.com/target.html
window.name = 'some data from server or somewhere'
```

### location.hash

`location.hash`可以跨域的原理是，子框架具有修改父框架`src`里`hash`值的功能，通过修改`hash`可以传递数据，且页面不会刷新。但是传递的数据长度是有限的。

因此使用该方法跨域的方案就是：

- 准备两个/三个页面（如果是在 IE、Chrome 下，不同源的话不允许修改`parent.location.hash`，则需要三个页面）
  - 主页面`source/main.html`
  - 代理页面`source/proxy.html`（解决兼容性问题）
  - 要跨域的页面`target.com/target.html`

```js
// source.com/main.html
window.addEventListener("hashchange", function () {
  // 获取 hash
  const data = location.hash.substring(1)
}, false);

const iframe = document.createElement('iframe')
iframe.style.display = 'none'
iframe.src = 'target.com/target.html'
document.body.appendChild(iframe)
```

```js
// target.com/target.html
const data = 'some data from server or somewhere'
try {
  parent.location.hash = data
} catch (e) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = 'sourece.com/proxy.html#data';  // 这里的 data 需要做编码处理
  document.body.appendChild(iframe);
}
```

```js
// source.com/proxy.html
parent.parent.location.hash = self.location.hash.substring(1)
```

优点：

- 可以解决域名完全不同的跨域
- 可以实现双向通讯（待分析）

缺点：

- 数据暴露在 url 上，数据不安全
- 改变 hash 会产生历史记录，影响用户体验
- url 上的数据大小有限制
- 不支持`hashchange`事件的浏览器，需要轮询来获取 url 里 hash 的改变

### WebSocket

WebSocket 是一种通信协议，使用ws://（非加密）和wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

## XMLHttpRequest 之 withCredentials

当通过 XMLHttpRequest 实例发送跨域 Ajax 请求时，可以设置`withCredentials`属性为`true`，其作用是请求可以携带目标页面所在域的 Cookie。

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://b.com/api');
xhr.withCredentials = true;
xhr.send();
```

假设上述代码所在的页面为`https://a.com/page`，向`https://b.com/api`发送了跨域 Ajax 请求，若是设置`withCredentials`为`true`，则会将`https://b.com`域下的 Cookie 都携带上。

## Reference

- [知乎专栏-跨域的那些事儿](https://zhuanlan.zhihu.com/p/28562290)
- [前端跨域问题及解决方案 #2](https://github.com/wengjq/Blog/issues/2)
