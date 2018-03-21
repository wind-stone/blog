# resolve-async-component 源码学习及收获

该文件主要是处理异步组件

## 分析

异步组件分为以下几种方式：

- 方式一：工厂函数调用后，在工厂函数内部`resolve/reject`

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 将组件定义传入 resolve 回调函数
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

注意，方式一可能会同步调用`resolve`，而不是异步

- 方式二：工厂函数调用后，返回`Promise`

```js
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```


## 源码

```js
/* @flow */

import {
  warn,
  once,
  isDef,
  isUndef,
  isTrue,
  isObject,
  hasSymbol
} from 'core/util/index'

import { createEmptyVNode } from 'core/vdom/vnode'

function ensureCtor (comp: any, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

/**
 * 创建一个空的 vnode 节点（工厂函数里需要异步获取组件选项对象的情况下）
 */
export function createAsyncPlaceholder (
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}

export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>,
  context: Component
): Class<Component> | void {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    // 优先使用缓存：如果之前已经处理过该函数（处理后返回的是构造函数，挂在 factory.resolved 上）
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    // 如果同时使用多个异步组件，且工厂函数相同，则将 context 即 vm 加入 contexts 数组，等工厂函数执行完毕，顺序调用各 context 的 $forceUpdate() 方法
    factory.contexts.push(context)
  } else {
    const contexts = factory.contexts = [context]
    let sync = true

    const forceRender = () => {
      for (let i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate()
      }
    }

    // 封装 resolve，确保只调用一次
    const resolve = once((res: Object | Class<Component>) => {
      // ensureCtor 函数返回的是构造函数，挂在 resolved 属性下，当做缓存
      factory.resolved = ensureCtor(res, baseCtor)
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender()
      }
    })

    // 封装 reject，确保只调用一次
    const reject = once(reason => {
      process.env.NODE_ENV !== 'production' && warn(
        `Failed to resolve async component: ${String(factory)}` +
        (reason ? `\nReason: ${reason}` : '')
      )
      if (isDef(factory.errorComp)) {
        factory.error = true
        forceRender()
      }
    })

    const res = factory(resolve, reject)

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // 工厂函数调用后，返回 Promise，异步组件的方式二
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject)
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject)

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor)
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor)
          if (res.delay === 0) {
            factory.loading = true
          } else {
            setTimeout(() => {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true
                forceRender()
              }
            }, res.delay || 200)
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(() => {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? `timeout (${res.timeout}ms)`
                  : null
              )
            }
          }, res.timeout)
        }
      }
    }

    sync = false
    // return in case resolved synchronously
    // 工厂函数可能会同步返回组件选项对象，比如方式一里同步调用`resolve`
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}
```
