---
sidebarDepth: 0
---

# Promise.allSettled

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
