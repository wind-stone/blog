# Axios

[[toc]]

## 源码分析

本文涉及的源码来自于：Axios 版本`0.21.1`，`master`分支。

### 拦截器的实现

[Axios 的拦截器 - interceptors](https://github.com/wind-stone/axios#interceptors)可以拦截请求以修改请求配置，拦截响应以修改返回结果。

其实现方式比较简单，也比较优美。以下，我们简单分析下源码，了解下拦截器的实现。

#### 拦截器的注册和使用

Axios 实例上的请求拦截器管理对象`interceptors.request`和响应拦截器管理对象`interceptors.response`上都存在`use`方法，该方法用于注册请求拦截器和响应拦截器。因此，在业务代码里，我们可以如下这样来注册拦截器。

```js
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```

注册好之后，所有的请求都会经过请求拦截器和响应拦截器的处理。以`axios.post`为例：

```js
axios.post('/hello-world').then((response) => {
    // 正常完成请求，处理返回数据
}).catch((error) => {
    // 处理错误，包括拦截器里抛出的错误
})
```

#### Axios 实例的 interceptors

创建 Axios 实例时，实例上会添加`interceptors`对象，该对象有两个属性，请求拦截器管理对象和响应拦截器管理对象。

```js
// lib/core/Axios.js

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

经过拦截器的注册一节可知，`interceptors.request`对象用于管理请求拦截器，`interceptors.response`对象用于管理响应拦截器，而它们都是 InterceptorManager 构造函数的实例。

#### InterceptorManager

InterceptorManager 主要用于管理拦截器，包括拦截器的添加、移除和遍历。

创建 InterceptorManager 实例时，会为实例添加`handlers`属性，该属性是个数组，用于保存所有的拦截器函数。

同时，InterceptorManager 原型上提供

- `use`方法用于添加拦截器函数
- `eject`方法用于移除拦截器函数
- `forEach`方法用于遍历所有拦截器并以拦截器为参数执行传入的函数

```js
// lib/core/InterceptorManager.js

'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
```

调用`use`方法注册拦截器时，会返回该拦截器在拦截器数组`hanlders`里的位置`id`，方便之后调用`eject`方法将拦截器移除。

#### 拦截器的合并

Axios 上所有发起请求的方法比如`axios.post`，实际上都是基于`Axios.prototype.request`的封装，最终还是会调用`Axios.prototype.request`。

当调用`Axios.prototype.request`方法时，会将所有请求拦截器函数和响应拦截器函数以及实际发起 HTTP 请求的`dispatchRequest`函数合并成一个待调用的函数数组。

```js
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  // ...

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  // 合并拦截器：请求拦截器放置在数组的前面，发起 HTTP 请求的函数放置在数组中间，响应拦截器放置在数组后面
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

#### 拦截器的调用

将`dispatchRequest`和请求、响应拦截器合并之后，在`Axios.prototype.request`方法的最后，会创建一个以`config`为参数且状态已变更为`fulfilled`的 Promise 实例，并通过`then`将数组里第`i`项（`i`是偶数）和第`i + 1`项分别作为`resolved`函数和`rejected`函数，并依次调用它们，调用顺序是：

```txt
 请求拦截器函数    -->    dispatchRequest    -->    响应拦截器函数
（处理请求配置）          （发出 HTTP 请求）          （处理返回数据）
```

经过这样处理，每个请求发生时，会先经过所有的请求拦截器函数以处理请求配置，再发出 HTTP 请求，之后等待 HTTP 请求回来之后，经过所有的响应拦截器处理响应数据，最后将响应数据返回。

需要注意的是，一但某个拦截器函数执行时抛错，之后的其他拦截器的`resolved`函数和`rejected`函数都不会执行，抛出的错误会交给最外层的 Promise 实例的`catch`处理。

### 适配器的实现

Axios 既支持在浏览器里使用，也支持在 Node.js 里使用，在浏览器里会使用`XMLHttpRequest`发起 HTTP 请求，在 Node.js 里会使用`http`模块发起 HTTP 请求。此处不再详述发起 HTTP 请求的过程。

### 取消请求

Axios 提供了取消请求的方式，使用方式见[Cancellation](https://github.com/wind-stone/axios#cancellation)。Axios 提供的两种取消请求的方式本质上是相同的，我们简单分析下源码。

#### axios.CancelToken

Axios 默认导出的对象上挂载了`CancelToken`构造函数。

```js
// lib/axios.js

// ...
var axios = createInstance(defaults);
// ...
axios.CancelToken = require('./cancel/CancelToken');
// ...
module.exports.default = axios;
```

`CancelToken`构造函数用于创建取消请求的`cancelToken`，`new CancelToken(fn)`时会传入一个函数`fn`作为参数，`CancelToken`内部会以`cancel`作为参数调用函数`fn`，而调用`cancel`会取消请求，因此将`cancel`暴露出来即是交出了取消请求的控制权。

`cancelToken`对象上存在一个待确定状态的 Promise 实例`promise`，当调用`cancel`函数时，`promise`的状态会改为`fulfilled`，参数为取消的原因`reason`对象，因此只要在发出 HTTP 请求时为`promise`添加状态改变的回调函数，即可在外部调用`cancel`函数时立即取消 HTTP 请求。

```js
// lib/cancel/CancelToken.js

'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;
```

#### 创建并传入 cancelToken

在业务代码里，若是想随时取消请求，需要在请求时给请求配置添加`cancelToken`，之后调用`cancel`函数即可取消请求。

方式一：

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

方式二：

```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel();
```

#### 添加 cancelToken.promise 的回调函数

以浏览器端为例，在发出 HTTP 请求之前，会先为`cancelToken.promise`添加`fulfilled`回调函数，该函数执行时会调用`request.abort()`来取消 HTTP 请求。

在 HTTP 请求过程中，一但调用了`cancel`函数，该请求的`cancelToken.promise`的状态将会变为`fulfilled`，`fulfilled`回调函数将执行，进而取消 HTTP 请求。

```js
// lib/adapters/xhr.js

'use strict';

// ...
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    // ...

    var request = new XMLHttpRequest();

    // ...
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    // ...

    if (config.cancelToken) {
      // 添加 fulfilled 回调函数，取消 HTTP 请求
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

```

### 防御 CSRF 攻击

Axios 提供了“双重 Cookie 验证”这种方式 CSRF 攻击的方式，关于该方式的详情可参考: [前端安全系列（二）：如何防止CSRF攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

简单说就行，一般 CSRF 攻击只能利用被攻击网站的 Cookie，但不能获取。因此在我们发起 Ajax 请求时，Axios 可帮助我们读取 Cookie 里的某个字段并设置到某个请求头里传递给接口。

在请求配置里，我们可以指定要读取的 Cookie 字段的名称以及要设置的请求头的名称。

```js
{
  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
}
```

在浏览器里发送请求时，会读取 Cookie 字段并设置请求头。

```js
// lib/adapters/xhr.js

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    // ...
    var requestHeaders = config.headers;
    var request = new XMLHttpRequest();
    // ...
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }
    // ...
    request.send(requestData);
  }
}
```

### 错误处理

浏览器里使用 Axios 发出的请求，可能会存在如下几类错误：

1. 请求未发出
     - 请求拦截器里抛错
2. 请求已发出，但未收到响应
     - 超时
     - 其他（TODO: 待确定还有哪些情况）
3. 请求已发出，且收到响应
     - 响应拦截器里抛错
     - 响应码`validateStatus`时为`false`

业务代码里需要判断出这些错误，并进行对应的处理。

```js
import axios from 'axios';

const instance = axios.create();
instance.defaults.timeout = 2500;

// 请求拦截器里抛错
instance.interceptors.request.use(() => {
    throw new Error('request interceptor error');
});

// 响应拦截器里抛错
instance.interceptors.request.use((response) => {
    throw new Error('request interceptor error');
    return response;
});
```

如下代码，用于判断错误属于哪一类。

```js
axios.post('/hello-world').then(() => {}).catch((error) => {
    if (error.response) {
        // 3. 请求已发出，且收到响应
        //   - 响应码 validateStatus 时为 false
        console.log('error.response.data', error.response.data)
        console.log('error.response.status', error.response.status)
        console.log('error.response.headers', error.response.headers)
    } else if (error.request) {
        // 2. 请求已发出，但未收到响应
        //   - 超时
        //   - 其他
        // console.log('error', Object.getOwnPropertyDescriptors(error))
        console.log('error.request', error.request)

        // 超时和取消请求的 code 都是 ECONNABORTED
        if (error.code === 'ECONNABORTED') {
            // 注意，这种判断方式来自于 Axios 源码，一旦源码有修改，该判断方式可能不正确
            // 若是项目里不存在取消请求的情况，可直接通过 error.code === 'ECONNABORTED' 判断是超时
            if (error.message.indexOf('timeout') > -1) {
                // 超时
            } else {
                // 取消请求
            }
        }
    } else {
        // 1. 请求未发出
        //   - 请求拦截器里抛错
        // 3. 请求已发出，且收到响应
        //   - 响应拦截器里抛错
        // 需要注意，若是走到这个分支，则 error 可能是 Error 的实例，没有 error.toJson 方法
        console.log('other error', error.message)
    }
})
```
