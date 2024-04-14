# 【初级】事件循环输出题

## 【初级】事件循环：输出结果

```js
setTimeout(()=>console.log("d"), 0)
var r = new Promise(function(resolve, reject){
    resolve()
});
r.then(() => {
    var begin = Date.now();
    while(Date.now() - begin < 1000);
    console.log("c1")
    new Promise(function(resolve, reject){
        resolve()
    }).then(() => console.log("c2"))
});
```

```js
// 打印结果：
// c1
// c2
// d
```

## 【初级】事件循环：输出结果，说明原因

```js
setTimeout(() => {
    console.log(1);
}, 0);

console.log(2);

(new Promise((resolve) => {
    console.log(3);
})).then(() => {
    console.log(4);
});

console.log(5);
```

- B-回答出正确的结果 2 3 5 1
- A-从 JavaScript 异步任务的角度给出原因，以及结果中为什么没有 4
- S-可以完整阐述 JavaScript 事件循环机制
