# 【中级-好题】周期执行某个函数n次

```js
const repeatFunc = repeat(console.log, 4, 3000);

repeatFunc("helloworld");
// 每3秒打印一个helloworld，总计执行4次
```

参考答案：

```js
const repeat = function(fn, times, interval) {
    let count = 0;

    return function returnFn(...args) {
        if (count < times) {
            setTimeout(() => {
                fn(...args);
                count++;
                returnFn(...args);
            }, interval);
        }
    };
};
```
