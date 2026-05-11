# 【初级】简述闭包的概念，输出结果

```js
var data = [];

for (var i = 0; i < 3; i++) {
    data[i] = function () {
        console.log(i);
    };
}
data[0]();
data[1]();
data[2]();
```

```js
// 打印结果是：
3
3
3
```

- B-能够回答概念问题，是私有变量，可能会有内存泄露
- A-能够用闭包解决一些问题，比如
- S-执行环境栈 EC stack，作用域，作用域链，GC，V8 GC
