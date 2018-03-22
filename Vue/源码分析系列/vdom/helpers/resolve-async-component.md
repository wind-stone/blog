# resolve-async-component 源码学习及收获

该文件主要是处理异步组件，返回基于组件选项对象的构造函数。

返回值有如下情况：

- 如果是同步获取的组件，返回基于组件选项对象的构造函数
- 如果是异步获取的组件
    - 普通的异步组件（调用工厂函数后返回`Promise`实例），返回`Undefined`
    - 高级异步组件（调用工厂函数后返回对象，对象的`component`是`Promise`实例）
        - 工厂函数返回的对象有`loading`属性，
            - `delay`为`0`，返回基于`loading`组件选项对象的构造函数
            - `delay`不为`0`，返回`undefined`；在`delay`时间后，再调用`forceRender()`强制渲染出“加载中组件”
        - 否则，返回`undefined`

针对所有异步获取的组件，不管是返回`undefined`还是返回“加载中组件”，最终都会调用`forceRender()`方法，强制重新渲染出正确的异步组件（或者是“渲染出错组件”）


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

- 方式三：高级异步组件

```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})
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
  // 高级异步组件：经过 timeout 时间后异步组件加载超时，强制渲染“渲染错误组件”
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  // 优先使用缓存：如果之前已经处理过该函数（处理后返回的是构造函数，挂在 factory.resolved 上）
  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  // 高级异步组件：经过 delay 时间后，强制渲染“加载中组件”
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
        // 方式二：工厂函数调用后，返回 Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject)
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        // 方式三：高级异步组件
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
