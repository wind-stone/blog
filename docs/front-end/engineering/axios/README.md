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

### 防御 CSRF 攻击

## 应用

### 判断请求错误类型

浏览器里使用 Axios 发出的请求，可能会出错如下几类错误：

1. 请求未发出
     - 请求拦截器里抛错
2. 请求已发出，但未收到响应
     - 超时
     - 其他（TODO: 待确定还有哪些情况）
3. 请求已发出，且收到响应
     - 响应拦截器里抛错
     - 响应码`validateStatus`时为`false`

```js
import Axios from 'axios';

const instance = Axios.create();
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

        if (error.code === 'ECONNABORTED') { // 判断超时

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
