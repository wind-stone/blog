# Server

[[toc]]

## 后端服务器接口探活

在 Node.js 项目里，有时候需要探测后端服务器接口是否可用。

```js
const request = require('request');

function checkAPIStatus() {
  request({
    url: 'http://www.baidu.com',
    method: 'HEAD',
  }, function (error, response) {
    if (!error && response.statusCode < 400) {
      // 服务器接口可用
    } else {
      // 服务器接口不可用
    }
  })
}
```

::: tip 提示
当后端提供了多个域名供使用时，可通过此方法定期检测服务器接口是否正常（类似于`nginx`的健康检查），若不正常，将域名从域名列表里移除；若正常，再将被移除的域名重新加入域名列表。PS: 上述代码仅是简单示例，若想做到上一句所说功能，需要额外开发。
:::

## 禁止缓存

Server 端返回文件时，若是不想要缓存文件（比如 HTML），可设置返回头：

```header
Cache-Control: no-cache, no-store, must-revalidate
```

## 设备 ID

设备 ID 是用来追踪一台设备/一个人的最重要的标识，在产品运营、精准广告、个性化推荐等等领域都有极大的运用。

### Android/iOS

目前，在国内，Android 设备主要还是以 IMEI（为主）作为设备 ID，iOS 设备主要以 IDFA（为主）作为设备 ID，且在 Native APP 内可以通过相应的接口获取到。

Reference：[知乎专栏 - 移动设备（手机）的唯一ID有哪些](https://zhuanlan.zhihu.com/p/37455363)

### WEB h5

但是在浏览器环境下，无法使用 Native 的接口获取到 IMEI/IDFA。

因此一般采用的方式是用`cookie`粗略地生成一个伪设备 ID，具体方法是：在用户首次请求页面时，服务端生成唯一的 ID，并添加到`cookie`里的`did`字段里（主域名、超长的过期时间），最后`cookie`会随响应返回到浏览器里。下次再有请求时，会将`cookie`里的`did`再带回服务端。因此，对于携带了统一`did`的用户，可以认为是使用的同一台设备。

```js
const Puid = require('puid')
const puid = new Puid()
const DID_COOKIE_NAME = 'did'

function getMainDomain(host) {
  return host.split(':')[0].split('.').slice(-2).join('.')
}

// 导出 koa2 中间件
module.exports = function () {
  return async function (ctx, next) {
    let did = ctx.cookies.get(DID_COOKIE_NAME)
    if (!did) {
      const didCookieOptions = {
        httpOnly: false,
        domain: getMainDomain(ctx.host),
        // 70年有效期
        maxAge: 2207520000000
      }
      // 还可以对 did 进行加密
      did = `web_${puid.generate()}`
      ctx.cookies.set(DID_COOKIE_NAME, did, didCookieOptions)
    }
    await next()
  }
}
```
