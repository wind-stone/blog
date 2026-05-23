# CORS

## 简单请求和非简单请求

浏览器将 CORS 请求分成两类：简单请求（`simple request`）和非简单请求（`not-so-simple request`）。

简单请求不会发起预检请求，而非简单请求需要在发起实际请求之前，必须首先使用 OPTIONS 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。"预检请求“的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响。

若请求满足所有下述条件，则该请求可视为“简单请求”：

- 使用下列方法之一：
  - GET
  - HEAD
  - POST
- 除了被用户代理自动设置的首部字段（例如 Connection ，User-Agent）和在 Fetch 规范中定义为[禁用首部名称](https://fetch.spec.whatwg.org/#forbidden-header-name)的其他首部，允许人为设置的字段为 Fetch 规范定义的 对 CORS 安全的首部字段集合。该集合为：
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type （需要注意额外的限制）
  - DPR
  - Downlink
  - Save-Data
  - Viewport-Width
  - Width
- Content-Type 的值仅限于下列三者之一：
  - `text/plain`
  - `multipart/form-data`
  - `application/x-www-form-urlencoded`
- 请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象可以使用`XMLHttpRequest.upload`属性访问。
- 请求中没有使用 ReadableStream 对象。

### 参考链接

- [MDN - 跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [阮一峰 - 跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
