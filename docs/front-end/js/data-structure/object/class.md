# 类

在 ES3 和之前的版本 JavaScript 中，类的概念是相当弱的，“类”的定义是一个私有属性`[[class]]`，语言标准为内置类型诸如 Number、String、Date 等指定了`[[class]]`属性，以表示它们的类。语言使用者唯一可以访问`[[class]]`属性的方式是`Object.prototype.toString`。

```js
var o = new Object;
var n = new Number;
var s = new String;
var b = new Boolean;
var d = new Date;
var arg = function(){ return arguments }();
var r = new RegExp;
var f = new Function;
var arr = new Array;
var e = new Error;

console.log([
    o,
    n,
    s,
    b,
    d,
    arg,
    r,
    f,
    arr,
    e
].map(v => Object.prototype.toString.call(v)));

// [
//     0: "[object Object]"
//     1: "[object Number]"
//     2: "[object String]"
//     3: "[object Boolean]"
//     4: "[object Date]"
//     5: "[object Arguments]"
//     6: "[object RegExp]"
//     7: "[object Function]"
//     8: "[object Array]"
//     9: "[object Error]"
// ]
```

从 ES5 开始，`[[class]]`私有属性被`Symbol.toStringTag`代替，`Object.prototype.toString`的意义从命名上不再跟 Class 相关。我们甚至可以自定义`Object.prototype.toString`的行为，以下代码展示了使用`Symbol.toStringTag`来自定义`Object.prototype.toString`的行为：

```js
var o = {
    [Symbol.toStringTag]: "MyObject"
};
console.log(o + "");
```

这里创建了一个新对象，并且给它唯一的一个属性`Symbol.toStringTag`，我们用字符串加法触发了`Object.prototype.toString`的调用，发现这个属性最终对`Object.prototype.toString`的结果产生了影响。

## 面向对象

面向对象主要两类流派：基于类的面向对象和基于原型的面向对象。

早期的 JavaScript 程序员一般都有过使用 JavaScript “模拟面向对象”的经历。但 JavaScript 本身就是面向对象的，它并不需要模拟，只是它实现面向对象的方式（即基于原型）和主流的流派（即基于类）不太一样。因此所谓使用 JavaScript “模拟面向对象”，实际上做的事情就是“模拟基于类的面向对象”。
