# Promise

## Promise 构造函数

通过 Promise 构造函数生成 Promise 实例时，需要给 Promise 构造函数传递一函数作为参数，该函数有两个参数，分别是`resolve`和`reject`，调用`resolve`和`reject`以改变 Promise 实例对象的状态。

### resolve 函数的参数是 Promise 实例

在`promiseA`实例对象的构造函数参数里调用`resolve`时，如果传递给`resolve`的参数是另一个 Promise 实例 `promiseB`，则此时`promiseB`的状态将传递给`promiseA`，也就是说，`promiseB`的状态决定了`promiseA`的状态。

如果`promiseB`的状态是 Pending，那么`promiseA`的回调函数就会等待`promiseB`的状态改变；
如果`promiseB`的状态是 Resolved 或者 Rejected，那么`promiseA`的回调函数将会立刻执行。

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

注意，上述只是针对`resolve`函数的参数是 Promise 实例来说的，`reject`函数的参数是 Promise 实例时，无类似效果，会直接将`promiseA`的状态改变为 Rejected。
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
  console.log('catch')
})

// 执行结果：
// catch
```




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
    console.log('第一个 then 方法的 resolve 回调函数，其参数为: ' + json)
    return 'hello';
  }
).then(
  param => {
    console.log('第二个 then 方法的 resolve 回调函数，其参数为: ' + param)
  }
)

// 执行结果：
// "第一个 then 方法的 resolve 回调函数，其参数为: /posts.json"
// "第二个 then 方法的 resolve 回调函数，其参数为: hello"
```

上面的代码链式调用了两次`then`方法，并分别指定了两个`resolve`回调函数，第一个`then`方法的`resolve`回调函数完成之后，会将返回结果作为参数，传入第二个`then`方法的`resolve`回调函数。


### then/catch 里的 resolve/reject 回调函数返回另一 Promise 实例

（接上条）如果第一个`then`方法的`resolve/reject`回调函数 return 的是另一个 Promise 实例，这时第二个`then`回调函数就会等待这个返回的 Promise 实例的状态发生变化后才会被调用，如果返回的 Promise 实例的状态变为 Rejected，则调用`reject`函数，变为 Resolved 则调用`resolve`函数。

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
    console.log('第一个 then 方法的 resolve 回调函数: ' + data)
    return getNone('reject啦~');
  }
).then(
  data => {
    console.log('第二个 then 方法的 resolve 回调函数: ' + data)
  },
  err => {
    console.log('err：' + err)
  }
)
// 执行结果：
// "第一个 then 方法的 resolve 回调函数: /posts.json"
// "err：reject啦~"

getNone("none~").then(
  json => {
    console.log('第一个 then 方法的 resolve 回调函数: ' + json)
    return getNone('reject啦~');
  },
  err => {
    console.log('第一个 then 方法的 reject 回调函数：' + err)
    return getNone('none~~~222')
  }
).then(
  param => {
    console.log('第二个回调函数的参数: ' + param)
  },
  err => {
    console.log('第二个 then 方法的 reject 回调函数：' + err)
  }
)
// 执行结果：
// "第一个 then 方法的 reject 回调函数：none~"
// "第二个 then 方法的 reject 回调函数：none~~~222"
```

### Promise.prototype.catch

`Promise.prototype.catch(rejection)`方法是`Promise.prototype.then(null, rejection)`的别名。

如果异步操作执行抛错，即作为构造函数参数的函数执行时抛错，Promise 实例的状态就会变为 Rejected。

```js
// 写法一
var promise = new Promise(function(resolve, reject) {
  throw new Error('test');
}).catch(function(error) {
  console.log(error);
});

// 写法二
var promise = new Promise(function(resolve, reject) {
  throw new Error('test');
}).then(null, function(error) {
  console.log(error);
});

// 写法三
var promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
}).catch(function(error) {
  console.log(error);
});

// 写法四
var promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
}).catch(function(error) {
  console.log(error);
});
```

比较上面几种写法，可以发现`reject`函数的作用，等同于抛出错误。

如果 Promise 状态已经变成 Resolved，再抛出错误是无效的。

```js
var promise = new Promise(function(resolve, reject) {
  resolve('ok');
  console.log('resolve 之后还会执行')
  throw new Error('test');
  console.log('但是抛错及以后代码都不会执行 ')
}).then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
```

一般来说，不要在`then`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

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

跟传统的`try/catch`代码块不同的是，如果没有使用`catch`方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

```js
var someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});
```

上面代码中，`someAsyncThing`函数产生的 Promise 对象会报错，但是由于没有指定`catch`方法，这个错误不会被捕获，也不会传递到外层代码。正常情况下，运行后不会有任何输出，但是浏览器此时会打印出错误“ReferenceError: x is not defined”，不过不会终止脚本执行，如果这个脚本放在服务器执行，退出码就是0（即表示执行成功）。


### then/catch 返回的 Promise 实例的状态

`then/catch`里的`resolve/reject`回调函数执行如果不抛错，则返回的 Promise 实例的状态变为 Resolved，回调函数的返回值（没有 return 则为 undefined）作为参数；抛错，状态变为 Rejected

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