# async/await

占位词说明
- returnPromise：async 函数返回的 Promise 对象
- promise：await 后面的 Promise 对象，即 promise = new Promise( fn )
- fn：创建 Promise 实例的函数参数，形如 function(resolve, reject) {...}

## async 函数返回时机
- 当 async 函数执行的时候，一旦遇到 await 就会先返回

注意这里的语句执行顺序，await 后面的 new Promise( fn ) 构建函数的函数参数 fn 会先执行，new Promise( fn ) 会返回一个 Promise 实例即 promise，等到异步操作完成即 promise resolve/reject 后，计算 await promise 的值，再接着执行 await promise 之后的语句


```js

// 执行顺序的示例

async function asyncFn() {
  console.log(1)
  let a = await new Promise((resolve, reject) => {
    console.log(2)
    setTimeout(() => {
      resolve(5)
    }, 200)
  })
  console.log('a', a)
  return 6
}

let pro = asyncFn()
console.log(3)
pro.then((data) => {
  console.log(data)
}).catch( () => {
  console.log('bbbb')
})
console.log(4)

// 执行结果
// 1
// 2
// 3
// 4
// "a" 5
// 6
```

## async 函数的返回值
- async 函数返回一个 Promise 对象（以下简称为 returnPromise）
- returnPromise 可以调用 then 方法添加回调函数
- async 函数内部 return 语句返回的值，会成为 then 方法回调函数的参数（注意，是 return 返回的值，而不是函数内部其他 promise 实例 resolve 的值）


## result = await promise 里 result 的值
- 正常情况下，await 命令后面是一个 Promise 对象。如果不是，会被转成一个立即 resolve 的 Promise 对象
- promise 的状态变为 resolve 时，result 的值即为 resolve 时传递的参数值
- promise 的状态变为 reject 时，则执行不到赋值就已经提前退出
    - promise 有错误处理，则错误处理
    - promise 无错误处理，则会直接改变 returnPromise 的状态为 reject
## returnPromise 的状态改变
- async 函数内部执行完不抛错，则 returnPromise 变为 resolve 状态
    - 有 return 语句，resolve 的参数即为 return 返回的值
    - 无 return 语句，resolve 的参数则为 undefined
- 抛错且未被处理，则 returnPromise 变为 reject 状态，reject 的参数错误对象


## returnPromise 状态改变的时机
- 等到内部所有 await 命令后面的 Promise 对象执行完，async 函数执行完
- async 函数作用域内，遇到 return 语句提前返回
- async 函数作用域内，抛错


## 防止 await 后面的 promise 抛错/reject 的方式
- 将 await promise 放在 try...catch 语句中
- 添加 promise.catch( () => {})


## Reference
- [阮一峰-ECMAScript 6 入门：async 函数](http://es6.ruanyifeng.com/#docs/async)