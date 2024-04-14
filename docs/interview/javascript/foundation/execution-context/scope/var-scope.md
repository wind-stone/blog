# 【初级】作用域输出题

```js
var count = 10;
function a() {
    return count + 10;
}
function b() {
    var count = 20;
    return a();
}
console.log(b());
```

```js
// 打印结果
// 20
```
