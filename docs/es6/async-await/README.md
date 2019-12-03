# async/await

[[toc]]

`async`函数就是 Generator 函数的语法糖。

## async 函数的优势

`async`对 Generator 函数的改进，体现在以下四点:

### 内置执行器

Generator 函数的执行必须靠执行器，所以才有了`co`模块，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行。

```js
asyncReadFile();
```

上面的代码调用了`asyncReadFile`函数，然后它就会自动执行，输出最后结果。这完全不像 Generator 函数，需要调用`next`方法，或者用`co`模块，才能真正执行，得到最后结果。

### 更好的语义

`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

### 更广的适用性

`co`模块约定，`yield`命令后面只能是 Thunk 函数或 Promise 对象，而`async`函数的`await`命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即`resolved`的 Promise 对象）。

### 返回值是 Promise

`async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作。进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而`await`命令就是内部`then`命令的语法糖。

## 基本用法

占位词说明

- `returnedPromise`：`async`函数返回的 Promise 实例对象
- `awaitedPromise`：`await`后面的 Promise 实例对象，即 `awaitedPromise = new Promise(fn)`
- `fn`：创建 Promise 实例对象时传给构造函数的参数，形如`function(resolve, reject) {...}`

### async 函数定义

```js
// 函数声明
async function foo() {
  // ...
}

// 函数表达式
const foo = async function () {
  // ...
};

// 对象的方法
let obj = {
  async foo() {
    // ...
  }
};
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    // ...
  }
  async getAvatar(name) {
    // ...
  }
}

// 箭头函数
const foo = async () => {
  // ...
};
```

### async 函数的返回值

执行`async`函数，无论在什么情况下，一定会返回 Promise 实例对象。只是在不同的情况下，返回的 Promise 实例对象的状态改变的情况不一样。

#### async 函数 return 非 Promise 实例

若是`async`函数正常执行完，`async`函数里最终`return`的值（假设`return`的不是 Promise 实例），会成为添加到 Promise 实例对象的`resolved`回调函数的参数。

```js
// 未抛错情况下

async function f1() {
  return 'hello world';
}
f1().then(
  data => console.log('data', data)
)
// "hello world"

async function f2() {
  // 什么都没有，即 return undefined
}
f2().then(
  data => console.log(data === undefined)
)
// true
```

#### async 函数内抛错

若是`async`函数执行过程中抛出错误，则返回的 Promise 实例对象的状态将改变为`rejected`，可通过添加到 Promise 实例对象上的`rejected`回调函数处理错误。注意，这种情况下，此时必须做好调用`async`函数的错误处理，详情请见之后的错误处理一节。

```js
// 抛错情况下

async function f1() {
  throw new Error('出错了');
}

f1().then(
  data => console.log('data', data)
).catch (
  err => console.log('err', err)
)
// err Error: 出错了
```

#### async 函数 return Promise 实例

若是`async`函数最终返回的是另一个 Promise 实例，则该 Promise 实例的状态将决定之前的 Promise 实例的状态。

```js
async function f1() {
  return Promise.resolve('resolved')
}

f1().then(
  data => console.log('data', data)
).catch(
  err => console.log('err', err)
)
// data resolved

async function f2() {
  return Promise.reject('rejected')
}

f2().then(
  data => console.log('data', data)
).catch(
  err => console.log('err', err)
)
// err rejected
```

### async 函数的返回时机

#### 遇到首个 await 返回 Promise 实例

当`async`函数执行的时候，一旦遇到首个`await`，会先将`await`命令之后的语句执行完，之后立即先返回一个 Promise 实例对象即`returnedPromise`，此时`returnedPromise`的状态仍是`pending`。

注意这里各条语句的执行顺序，`await`后面的`new Promise(fn)`会先执行，其执行的过程中会执行`fn`函数，并返回一个 Promise 实例对象即`promise`，此时`async`函数获得返回值`returnedPromise`。等到异步操作完成即`promise`的状态`resolved/rejected`后，计算`await promise`的值，再接着执行`await promise`之后的语句，最终`return`的值将决定`returnedPromise`的状态改变。

```js
// 执行顺序的示例
async function asyncFn() {
  console.log(1)

  let a = await new Promise(resolve => {
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

pro.then(
  data => console.log('data', data)
)

console.log(4)

// 执行结果
// 1
// 2
// 3
// 4
// a 5
// data 6
```

#### 遇到 return 返回 Promise 实例

若是在`async`函数过程中始终没有遇到`await`命令，则就一直不返回 Promise 实例，直到遇到`return`，或`async`函数执行结束（这是`return undefined`的特例）。

```js
async function asyncFn() {
  console.log(1)

  return new Promise((resolve) => {
    console.log(2)

    resolve(4)
  })
}

const returnedPromise = asyncFn()

console.log(3)

returnedPromise.then(
  data => console.log(data)
)

// 执行结果
// 1
// 2
// 3
// 4
```

### await 命令

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

### result = await promise 里 result 的值

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
  let result
  try {
    let result = await new Promise((resolve, reject) => {
      reject('错误')
    })
    console.log('这里打印出来了吗？并没有！')
  } catch(err) {
    console.log('err: ' + err)
  }
  console.log('result: ' + result)

  // 执行结果
  // err: 错误
  // result: undefined
}

let pro = asyncFn()
```

```js
// promise 状态变为 rejected 且通过 then/catch 的方式进行错误处理
async function asyncFn() {
  // 通过 catch 进行错误处理
  let result = await new Promise((resolve, reject) => {
    reject('错误')
  }).catch(err => {
    console.log('err: ' + err)
    return 'catch 返回的值'
  })

  console.log('result: ' + result)

  // 执行结果：
  // err: 错误
  // result: catch 返回的值
}

let pro = asyncFn()
```

## async 函数的常用场景

### sleep 休眠

JavaScript 一直没有休眠的语法，但是借助`await`命令就可以让程序停顿指定的时间。下面给出了一个简化的`sleep`实现。

```js
function sleep(interval) {
  return new Promise(resolve => {
    setTimeout(resolve, interval);
  })
}

// 用法
async function one2FiveInAsync() {
  for(let i = 1; i <= 5; i++) {
    console.log(i);
    await sleep(1000);
  }
}

one2FiveInAsync();
```

## 使用注意点

- `await`命令后面的 Promise 实例对象，最终的状态可能是`rejected`，所以必须做好错误处理

```js
// async 函数内给 await 添加 try...catch
async function asyncFn() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log('err', err);
  }
}

// async 函数内给 await 后的 Promise 实例添加 then/catch
async function asyncFn() {
  await somethingThatReturnsAPromise().catch(
    err => console.log('err', err)
  );
}

// async 函数外，添加 catch
asyncFn.catch(
  err => console.log('err', err)
)
```

- 对`await`进行`try..catch`后再抛出错误跟不进行`try..catch`的效果是一样的

```js
async function asyncFn() {
  try {
    await new Promise((resolve, reject) => {
      reject('error')
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

asyncFn().catch(err => {
  console.log('err', err)
})
// err error
```

下面这种写法，跟上面的结果是一样的:

```js
async function asyncFn() {
  await new Promise((resolve, reject) => {
    reject('error')
  })
}

asyncFn().catch(err => {
  console.log('err', err)
})
// err error
```

- 多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发

```js
let foo = await getFoo();
let bar = await getBar();

// 方式一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 方式二
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

- `async`函数可以保留运行堆栈。

```js
const a = () => {
  b().then(() => c());
};
```

上面代码中，函数`a`内部运行了一个异步任务`b()`。当`b()`运行的时候，函数`a()`不会中断，而是继续执行。等到`b()`运行结束，可能`a()`早就运行结束了，`b()`所在的上下文环境已经消失了。如果`b()`或`c()`报错，错误堆栈将不包括`a()`。

现在将这个例子改成`async`函数。

```js
const a = async () => {
  await b();
  c();
};
```

上面代码中，`b()`运行的时候，`a()`是暂停执行，上下文环境都保存着。一旦`b()`或`c()`报错，错误堆栈将包括`a()`。

## Reference

- [阮一峰-ECMAScript 6 入门：async 函数](http://es6.ruanyifeng.com/#docs/async)

## 使用技巧

- [如何在使用async & await 时优雅的处理异常](https://juejin.im/post/5dd1498df265da0bd315cca8)
