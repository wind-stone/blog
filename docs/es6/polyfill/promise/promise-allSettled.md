# Promise.allSettled

## 题目描述

### 出入参说明

```js
// 参数: promise 实例数组

[
  promise1,
  promise2,
  ...
  promise10
]


// 返回: promise 实例，当传入的数组里的每个 promise 都确定状态，则返回的 promise 的状态确定，并携带每个 promise 的结果数组。 
[
  // promise1: resolved
  {
    status: 'fulfilled',
    value,
  },
  // promise2: rejected
  {
    status: 'rejected',
    reason,
  },
  ...
]

// 注意：返回数组与输入数组要保持一致的顺序
```

### 使用示例

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));

const promises = [
  promise1,
  promise2
];

Promise.allSettled(promises)
  .then(
    (results) => console.log(results)
  );


// 打印结果
[
  {
    status: 'fulfilled',
    value: 3
  },
  {
    status: 'rejected',
    reason: 'foo'
  }
]
```

## 实现

参考实现：[Polyfill for Promise.allSettled](https://95yashsharma.medium.com/polyfill-for-promise-allsettled-965f9f2a003)

```js
Promise.allSettled = function (promises) {
  let mappedPromises = promises.map((p) => {
    return p
      .then((value) => {
        return {
          status: 'fulfilled',
          value,
        };
      })
      .catch((reason) => {
        return {
          status: 'rejected',
          reason,
        };
      });
  });
  return Promise.all(mappedPromises);
};
```

另可参考：

- [github - es-shims/Promise.allSettled](https://github.com/es-shims/Promise.allSettled)
