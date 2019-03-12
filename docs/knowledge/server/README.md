# 未分类

## 后端服务器接口探活

在 Node.js 项目里，有时候需要

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
```

::: tip 提示
当后端提供了多个域名供使用时，可通过此方法定期检测服务器接口是否正常（类似于`nginx`的健康检查），若不正常，将域名从域名列表里移除；若正常，再将被移除的域名重新加入域名列表。PS: 上述代码仅是简单示例，若想做到上一句所说功能，需要额外开发。
:::
