# 工具函数

[[toc]]

## 生成随机的字母数字字符串

```js
function generateRandomAlphaNum(len) {
    var rdmString = "";
    for( ; rdmString.length < len; rdmString += Math.random().toString(36).substr(2))
    return  rdmString.substr(0, len);
}
```

说明：Number 的`toString()`方法接受一个表示基数的参数，告诉它返回几进制数值的字符串形式。
