---
sidebarDepth: 0
---

# Promise

[[toc]]

## Promise 构造函数

```js
const executor = (resolve, reject) {
  if (条件为真) {
    resolve()
  } else {
    reject()
  }
}
const promiseInstance = new Promise(executor)
```

通过`new Promise(executor)`创建 Promise 实例时，需要给`Promise`构造函数传递一函数作为参数，该函数有两个参数，分别是`resolve`和`reject`，调用`resolve`或`reject`将 Promise 实例的状态改变为`resolved`或`rejected`状态。

### resolve 的参数是 Promise 实例

在创建`promiseA`实例的构造函数的参数`fn`执行过程中，若调用`resolve`时传入的参数是另一个 Promise 实例`promiseB`，则此时`promiseB`的状态将传递给`promiseA`，也就是说，`promiseB`的状态决定了`promiseA`的状态。

如果`promiseB`的状态是`pending`，那么`promiseA`就会等待`promiseB`的状态改变。

如果`promiseB`的状态是`resolved`/`rejected`，那么`promiseA`的状态也会变成`resolved`/`rejected`。

```js
var promiseB = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

var promiseA = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(promiseB), 1000)
})

promiseA.then(result => {
  console.log(result)
}).catch(error => {
  console.log(error)
})
// 执行结果：
// Error: fail
```

::: warning 警告
注意，上述只是针对调用`resolve`时传入的参数是 Promise 实例来说的，调用`reject`时传入的参数是 Promise 实例则无类似效果，会直接将`promiseA`的状态改变为`Rejected`。

```js
var promiseB = new Promise(function (resolve, reject) {
  setTimeout(() => resolve('promiseB resolved!'), 3000)
})

var promiseA = new Promise(function (resolve, reject) {
  setTimeout(() => reject(promiseB), 1000)
})

promiseA.then(result => {
  console.log('then')
}).catch(error => {
  console.log('error 是否是 promise 实例:', error instanceof Promise)
})

// 执行结果：
// error 是否是 promise 实例: true
```
:::

## Promise.prototype.then/catch 方法

### then/catch 方法返回新的 Promise 实例

Promise 实例的`then/catch`方法返回一个新的 Promise 实例，因此可以采用链式写法，即`then/catch`方法后面再调用另一个`then/catch`方法。以`then`方法为例：

```js
function getJSON(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, 100)
  })
}

getJSON("/posts.json").then(
  json => {
    console.log('第一个 resolved 状态的回调函数，其参数为: ' + json)
    return 'hello';
  }
).then(
  param => {
    console.log('第二个 resolved 状态的回调函数，其参数为: ' + param)
  }
)

// 执行结果：
// "第一个 resolved 状态的回调函数，其参数为: /posts.json"
// "第二个 resolved 状态的回调函数，其参数为: hello"
```

上面的代码链式调用了两次`then`方法，并分别指定了两个`resolved`状态的回调函数，第一个`then`方法的`resolved`回调函数完成之后，会将返回结果作为参数，传入第二个`then`方法的`resolved`回调函数。

### resolved/rejected 回调函数返回另一 Promise 实例

如果第一个`then`方法添加的`resolved/rejected`回调函数执行后`return`的是另一个 Promise 实例，这时第二个`then`添加的回调函数就会等待这个返回的 Promise 实例的状态发生变化后才会被调用，如果返回的 Promise 实例的状态变为`rejected`，则调用`rejected`回调函数，变为`resolved`则调用`resolved`回调函数。

```js
function getJSON(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, 100)
  })
}

function getNone(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(data)
    }, 100)
  })
}

getJSON("/posts.json").then(
  data => {
    console.log('第一个 then 方法添加的 resolved 回调函数: ' + data)
    return getNone('reject啦~');
  }
).then(
  data => {
    console.log('第二个 then 方法添加的 resolved 回调函数: ' + data)
  },
  err => {
    console.log('err：' + err)
  }
)
// 执行结果：
// "第一个 then 方法添加的 resolved 回调函数: /posts.json"
// "err：reject啦~"

getNone("none~").then(
  json => {
    console.log('第一个 then 方法添加的 resolved 回调函数: ' + data)
    return getNone('reject啦~');
  },
  err => {
    console.log('第一个 then 方法添加的 rejected 回调函数：' + err)
    return getNone('none~~~222')
  }
).then(
  param => {
    console.log('第二个回调函数的参数: ' + param)
  },
  err => {
    console.log('第二个 then 方法添加的 rejected 回调函数：' + err)
  }
)
// 执行结果：
// "第一个 then 方法添加的 rejected 回调函数：none~"
// "第二个 then 方法添加的 rejected 回调函数：none~~~222"
```

### Promise.prototype.catch

`Promise.prototype.catch(rejected)`方法是`Promise.prototype.then(null, rejected)`的别名。

如果异步操作执行抛错，即`fn`函数执行时抛错，Promise 实例的状态就会变为 Rejected。

```js
// 写法一
var promise = new Promise(function(resolve, reject) {
  throw new Error('test');
}).catch(function(error) {
  console.log(error);
});

// 写法二
var promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
}).catch(function(error) {
  console.log(error);
});

// 写法三
var promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
}).catch(function(error) {
  console.log(error);
});
```

比较上面几种写法，可以发现`reject`函数的作用，等同于抛出错误。

如果 Promise 状态已经变成`resolved`，再抛出错误是无效的。

```js
var promise = new Promise(function(resolve, reject) {
  resolve('ok');
  console.log('resolve 之后还会执行')
  throw new Error('test');
  console.log('但是抛错及以后代码都不会执行 ')
}).then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
```

一般来说，不要在`then`方法里面定义`rejected`回调函数（即`then`的第二个参数），总是使用`catch`方法。

```js
// bad
promise.then(function(data) {
  // success
}, function(err) {
  // error
});

// good
promise.then(function(data) {
  // success
}).catch(function(err) {
  // error
});

```

跟传统的`try/catch`代码块不同的是，如果没有使用`catch`方法指定错误处理的`rejected`回调函数，`fn`抛出的错误不会传递到外层代码，即不会有任何反应。

```js
var someAsyncThing = function() {
  return new Promise(function fn(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

上面代码中，`someAsyncThing`函数里的`fn`函数执行时会报错，但是由于没有指定`catch`方法，这个错误不会被捕获，也不会传递到外层代码。正常情况下，运行后不会有任何输出，但是浏览器此时会打印出错误`ReferenceError: x is not defined`，但是不会退出进程、终止脚本执行，2 秒之后还是会输出`123`。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

这个脚本放在服务器执行，退出码就是`0`（即表示执行成功）。不过，Node 有一个`unhandledRejection`事件，专门监听未捕获的`reject`错误，上面的脚本会触发这个事件的监听函数，可以在监听函数里面抛出错误。

```js
process.on('unhandledRejection', function (err, p) {
  throw err;
});
```

上面代码中，`unhandledRejection`事件的监听函数有两个参数，第一个是错误对象，第二个是报错的 Promise 实例，它可以用来了解发生错误的环境信息。

### then/catch 返回的 Promise 实例的状态

`then/catch`里的`resolved/rejected`回调函数执行如果不抛错，则返回的 Promise 实例的状态变为`resolved`，回调函数的返回值（没有`return`则为`undefined`）作为参数；抛错，状态变为`rejected`。

```js
var promise = new Promise(function(resolve, reject) {
  resolve('ok');
}).then(function(data) {
  console.log(data)
}).then(function(data) {
  console.log(data)
});
// 执行结果
// "ok"
// undefined

var promise = new Promise(function(resolve, reject) {
  reject('err');
}).then(
  value => console.log(value),
  err => console.log(err)
).then(
  value => console.log(value)
)
// 执行结果
// "err"
// undefined
```

## Promise.all()

## Promise.race()

## Promise.resolve()

## Promise 实现

### Promises/A+ 规范

Promises/A+ 规范文档

- [英文原版](https://promisesaplus.com/)
- [中文译版](http://www.ituring.com.cn/article/66566)

代码实现参考

- [解读Promise内部实现原理](https://juejin.im/post/5a30193051882503dc53af3c)

### 重难点问题

#### then 方法链式调用后为什么要返回新的 promise 实例？

如我们理解，为保证`then`函数链式调用，`then`需要返回`promise`实例。但为什么返回新的`promise`，而不直接返回`this`当前对象呢？看下面示例代码：

```js
const promise2 = promise1.then(function (value) {
  return Promise.reject(3);
})
```

假如`then`函数执行返回`this`调用对象本身，那么`promise2 === promise1`，`promise2`状态也应该等于`promise1`同为`resolved`。而`onResolved`回调中返回状态为`rejected`对象。考虑到`Promise`状态一旦`resolved`或`rejected`就不能再迁移，所以这里`promise2`也没办法转为回调函数返回的`rejected`状态，产生矛盾。

#### 通过 then 注册的回调函数为什么要异步执行？

```js
var a = 1;

promise1.then(function (value) {
  a = 2;
})

console.log(a)
```

`promise1`内部执行同步或异步操作未知。

假如未规定`then`注册回调为异步执行，则这里打印`a`可能存在两种值。`promise1`内部同步执行操作时`a === 2`，相反执行异步操作时`a === 1`。为屏蔽依赖外部的不确定性，规范指定`onFulfilled`和`onRejected`方法异步执行。

### 简单实现源码

<<< @/docs/es6/promise/implement.js

## 应用

### 单例 Promise

Copy From [高级异步模式 - Promise 单例](https://mp.weixin.qq.com/s/WOPY0OCJX8upEcMHm6F5Xw)

有些时候我们在进行某种操作之前需要先进行初始化，初始化完成之后才能进行操作。比如在查询数据库之前，需要先连接到数据库。此时，若是并行执行多个查询，可能会多次连接数据库，导致出现问题。

```js
class DbClient {
  private isConnected: boolean;

  constructor() {
    this.isConnected = false;
  }

  private async connect() {
    if (this.isConnected) {
      return;
    }

    await connectToDatabase(); // stub
    this.isConnected = true;
  }

  public async getRecord(recordId: string) {
    await this.connect();
    return getRecordFromDatabase(recordId); // stub
  }
}

// 并发查询
const db = new DbClient();
const [record1, record2] = await Promise.all([
  db.getRecord('record1'),
  db.getRecord('record2'),
]);
```

使用单例 Promise 可以解决这个问题。

```js
class DbClient {
  private connectionPromise: Promise<void> | null;

  constructor() {
    this.connectionPromise = null;
  }

  private async connect() {
    if (!this.connectionPromise) {
      this.connectionPromise = connectToDatabase(); // stub
    }

    return this.connectionPromise;
  }

  public async getRecord(recordId: string) {
    await this.connect();
    return getRecordFromDatabase(recordId); // stub
  }
}
```
