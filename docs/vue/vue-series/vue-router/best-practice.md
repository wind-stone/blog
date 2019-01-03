---
sidebarDepth: 0
---

# 最佳实践

[[toc]]

## 异步路由-处理加载状态/加载失败

```js
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

> 注意如果你希望在 Vue Router 的路由组件中使用上述语法的话，你必须使用 Vue Router 2.4.0+ 版本。

尽管 Vue.js 官网已经声称 Vue Router 2.4.0+ 已经支持带有加载状态的异步路由，但是亲测在`vue-router` 3.0.2 及以前版本，都没有实现异步路由处理加载状态/加载失败的功能。但是通过 hack 的方式，可以实现这一功能。

```js
// router.js
function lazyLoadView(AsyncView) {
    const AsyncHandler = () => ({
        component: AsyncView,
        loading: LoadingComponent,
        error: ErrorComponent,
        delay: 200,
        timeout: 200
    });

    return Promise.resolve({
        functional: true,
        render(h) {
            return h(AsyncHandler);
        }
    });
}

const router = new Router({
    routes: [
         {
             path: '/video',
             name: ROUTER_NAME_VIDEO,
             component: () => lazyLoadView(import(/* webpackChunkName: 'video' */ './modules/Video'))
         }
    ]
});

export default router;
```