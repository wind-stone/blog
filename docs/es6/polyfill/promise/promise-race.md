---
sidebarDepth: 0
---

# Promise.race

[[toc]]

```js
Promise.race = function(promises) {
    // 简单地判断是否是数组，实际上要判断是否是可迭代的
    if (!Array.isArray(promises)) {
        throw '传入的参数需要是数组';
    }
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(function(value) {
                return resolve(value);
            }, function(reason) {
                return reject(reason);
            });
        }
    });
};
```

注意事项：

- 若第一个参数不是可迭代的，需要报错
- 若传入的可迭代参数是空的，则返回的`promise`将永远等待
- 若迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值
