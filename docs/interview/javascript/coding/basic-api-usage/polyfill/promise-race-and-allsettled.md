# 【高级】实现 Promise.race/allSettled 方法的 polyfill

参考：[风动之石的博客 - Promise.race](https://blog.windstone.cc/es6/polyfill/promise/promise-race.html)

减分项：

- 把构造函数方法当作实例方法对待
- 未考虑到异步情况

加分项：

- 考虑到传入对象是非Promise，对每一项遍历增加Promise.resolve包裹

参考：[风动之石的博客 - Promise.allSettled](https://blog.windstone.cc/es6/polyfill/promise/promise-allSettled.html)

```js
// Promise.allSetted 说明
输入：
[
  promise1,
  promise2,
  ...
  promise10
]

每一个 promise 都确定状态，无论 resolved/rejected，返回一个结果的数组。

输出：
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

注意：返回数组与输入数组要保持一致的顺序
```

## 【高级】实现 String.prototype.padStart 方法的 polyfill

参考：[风动之石的博客 - String.prototype.padStart](https://blog.windstone.cc/es6/polyfill/string/padStart.html)
