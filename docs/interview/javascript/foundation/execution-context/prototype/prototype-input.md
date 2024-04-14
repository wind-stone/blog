# 【初级】原型链输出题

```js
Function.prototype.a = () => alert(1);
Object.prototype.b = () => alert(2);
function A() {}
var a = new A();
a.a();
a.b();
```

```js
// 输出结果
a.a() 报“Uncaught TypeError: a.a is not a function”
a.b() 显示 alert(2)
```
