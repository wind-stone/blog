# 【初级，可进阶高级】调用栈溢出问题

以下这段代码，可能存在什么问题？如何改进？

```js
function runStack (n) {
  if (n === 0) return 100;
  return runStack(n - 2);
}
runStack(50000)
```

答：会导致栈溢出。改为:

```js
function runStack (n) {
  if (n === 0) return 100;
  return runStack.bind(null, n - 2); // 注意：这里返回一个新的函数，且预置参数
}
// 蹦床函数，避免递归
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
trampoline(runStack(1000000))
```
