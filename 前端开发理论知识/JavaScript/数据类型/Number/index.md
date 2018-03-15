
#### 生成随机的字母数字字符串

```
function generateRandomAlphaNum(len) {
    var rdmString = "";
    for( ; rdmString.length < len; rdmString += Math.random().toString(36).substr(2))
    return  rdmString.substr(0, len);
}
```
说明：Number 的 toString() 方法接受一个表示基数的参数，告诉它返回几进制数值的字符串形式。

#### 关于 X.toString()，X是数字直接量

- 3.toString() 会按照从左到右的顺序解析
- 3.会被计算成 3

所以 3.toString() 等同于(3)toString() ，这显然是语法有问题。

而 3..toString() 会被计算成 (3.).toString()，OK！

3...toString() 等同于 (3.)..toString()，语法问题。