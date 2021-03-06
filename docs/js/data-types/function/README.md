# 函数

[[toc]]

## 立即执行的函数表达式

立即执行的函数表达式（IIFE）。由于语法规定了`function`关键字开头是函数声明，所以要想让函数变成函数表达式，我们必须得加点东西，最常见的做法是加括号。

```js
(function() {
    var a; // code
}());

(function() {
    var a; // code
})();
```

但是，括号有个缺点，那就是如果上一行代码不写分号，括号会被解释为上一行代码最末的函数调用，产生完全不符合预期并且难以调试的行为，加号等运算符也有类似的问题。所以一些推荐不加分号的代码风格规范，会要求在括号前面加上分号。

```js
;(function() {
    var a; // code
}())

;(function() {
    var a; // code
})();
```

但 Winter 比较推荐的写法是使用`void`关键字。

```js
void function(){
    var a; // code
}();
```

这有效避免了语法问题，同时，语义上`void`运算表示忽略后面表达式的值，变成`undefined`，我们确实不关心 IIFE 的返回值，所以语义也更为合理。

## 应用

### 将函数伪装成 Native 函数

```js
var fakerAlert = (function () {}).bind(null)
console.log(fakerAlert.toString())
// 结果：
// function () { [native code] }
```
