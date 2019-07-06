---
sidebarDepth: 0
---

# async/await

[[toc]]

`async`函数就是 Generator 函数的语法糖。Generator 函数如果想实现自动执行，依赖我们外部（自行实现）的执行器，而`async`函数内置了执行器。

占位词说明

- `returnedPromise`：`async`函数返回的 Promise 实例对象
- `promise`：`await`后面的 Promise 实例对象，即 `promise = new Promise(fn)`
- `fn`：创建 Promise 实例对象时传给构造函数的参数，形如`function(resolve, reject) {...}`

## 调用 async 函数

### async 函数返回时机

- 当`async`函数执行的时候，一旦遇到`await`就会先返回一 Promise 实例对象即`returnedPromise`

注意这里的语句执行顺序，`await`后面的`new Promise(fn)`构建函数的参数`fn`会先执行，`new Promise(fn)`会返回一个 Promise 实例对象即`promise`，等到异步操作完成即`promise`的状态`resolved/rejected`后，计算`await promise`的值，再接着执行`await promise`之后的语句

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


### async 函数的返回值：Promise 实例对象

```js
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

```js
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```

- `async`函数返回一个 Promise 实例对象即`returnedPromise`，可以调用`returnedPromise`的`then`方法添加回调函数
- `async`函数内部`return`语句返回的值，会成为`then`方法添加的`resolved`回调函数的参数（注意，是`return`返回的值，而不是`async`函数内部其他 Promise 实例对象`resolve`的值）
- `async`函数内部抛出错误，会导致返回的 Promise 对象变为`rejected`状态，抛出的错误对象会被`catch`方法的回调函数接收到。

### `async`函数返回的 Promise 实例对象的状态变化

`async`函数返回的 Promise 实例对象，必须等到内部所有`await`命令后面的 Promise 实例对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。

- `async`函数内部执行完不抛错，则`returnedPromise`变为`resolve`状态
    - 有`return`语句，`returnPromise`的`resolve`回调函数的参数即为`return`返回的值
    - 无`return`语句，`returnPromise`的`resolve`回调函数的参数则为`undefined`
- 抛错且未被处理，则`returnedPromise`变为`reject`状态，`reject`的参数为`async`函数内部抛错的错误对象

## async 函数内部

###  await 命令

- 正常情况下，`await`命令后面是一个 Promise 实例对象。如果不是，会被转成一个立即`resolved`的 Promise 实例对象

```js
async function f() {
  return await 123;
}

f().then(v => console.log(v))
// 123
```

- `await`命令后面的 Promise 实例对象如果变为`rejected`状态，则`reject`的参数会被`catch`方法的回调函数接收到。

```js
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

- 只要一个`await`语句后面的 Promise 实例对象变为`rejected`状态，那么整个`async`函数都会中断执行

```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个`await`放在`try...catch`结构里面，这样不管这个异步操作是否成功，第二个`await`都会执行。

```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```

```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```


### `result = await promise` 里`result`的值

- `await`是运算符，`await promise`是表达式，该表达式返回的是`promise`异步操作的结果
- `promise`的状态变为`resolved`时，`result`的值即为`resolved`时传递的参数值
- `promise`的状态变为`rejected`时
    - `promise`有错误处理，进行错误处理
        - 处理方式一`try...catch`：`promise`的状态改为`rejected`后直接`catch`处理，无法执行到赋值操作及`await`后面的代码，`result`保持原值
        - 处理方式二`promise.then/catch`：`result`的值为`then/catch`方法里的`rejected`函数`return`的值
    - `promise`无错误处理，则会结束`async`函数的执行，改变`returnedPromise`的状态为`rejected`

```js
// promise 状态变为 rejected 且通过 try...catch 的方式进行错误处理
async function asyncFn() {
  let a
  try {
    let a = await new Promise((resolve, reject) => {
      reject('错误')
    })
    console.log('这里打印出来了吗？并没有！')
  } catch(err) {
    console.log('err: ' + err)
  }
  console.log('a: ' + a)

  // 执行结果
  // err: 错误
  // a: undefined
}

let pro = asyncFn()
```

```js
// promise 状态变为 rejected 且通过 then/catch 的方式进行错误处理
async function asyncFn() {
  // 通过 catch 进行错误处理
  let a = await new Promise((resolve, reject) => {
    reject('错误')
  }).catch(err => {
    console.log('err: ' + err)
    return 'catch 返回的值'
  })
  // 通过 then 的 reject 回调进行错误处理
  // let a = await new Promise((resolve, reject) => {
  //   reject('错误')
  // }).then(
  //   data => data,
  //   err => { // reject 回调
  //     console.log('err: ' + err)
  //     return 'catch 返回的值'
  //   }
  // )

  console.log('a: ' + a)

  // 通过 then/catch 处理，执行结果都是：
  // err: 错误
  // a: catch 返回的值
}

let pro = asyncFn()
```


## 使用注意点

- `await`命令后面的 Promise 实例对象，最终的状态可能是`rejected`，所以最好把`await`命令放在`try...catch`代码块中

```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  });
}
```

- 多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发

```js
let foo = await getFoo();
let bar = await getBar();

// 正确写法

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

- `await`命令只能用在`async`函数之中，如果用在普通函数，就会报错

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  // 报错
  docs.forEach(function (doc) {
    await db.post(doc);
  });
}
```

## Reference
- [阮一峰-ECMAScript 6 入门：async 函数](http://es6.ruanyifeng.com/#docs/async)
