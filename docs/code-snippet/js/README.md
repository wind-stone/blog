# JS 代码片段

## 通用代码

### 队列函数迭代执行

<<< @/docs/code-snippet/js/common/queen-next.md

### EventEmitter 简单实现

<<< @/docs/code-snippet/js/common/event-emitter.js

## 浏览器环境

### URL 操作

<<< @/docs/code-snippet/js/browser/url.js

### Class 操作

<<< @/docs/code-snippet/js/browser/class.js

### Cookie 操作

<<< @/docs/code-snippet/js/browser/cookie.js

### 环境判断

<<< @/docs/code-snippet/js/browser/env.js

### 事件代理

<<< @/docs/code-snippet/js/browser/delegate.js

### 异步加载 JS 文件

<<< @/docs/code-snippet/js/browser/load-script.js

### Storage

<<< @/docs/code-snippet/js/browser/storage.md

### 复制内容到剪贴板

<<< @/docs/code-snippet/js/browser/clipboard.js

## 服务器环境

### 获取本机 IPv4 地址

<<< @/docs/code-snippet/js/server/ipv4.js

## 校验规则

### 身份证有效性校验

<<< @/docs/code-snippet/js/validate/idcard.js

### 杂项

<<< @/docs/code-snippet/js/validate/README.md

## Number

### 生成随机的字母数字字符串

```js
function generateRandomAlphaNum(len) {
    var rdmString = "";
    for( ; rdmString.length < len; rdmString += Math.random().toString(36).substr(2))
    return  rdmString.substr(0, len);
}
```

说明：Number 的`toString()`方法接受一个表示基数的参数，告诉它返回几进制数值的字符串形式。
