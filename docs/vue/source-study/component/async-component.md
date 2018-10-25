---
sidebarDepth: 0
---

# 异步组件

[[toc]]

Vue 允许以工厂函数的方式定义组件，而在工厂函数内部，可以异步解析组件的定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

## 工厂函数的几种形式

- 普通工厂函数，向`resolve`回调传递组件定义
- 返回 Promise 的工厂函数
- 高级工厂函数

```js
// 普通工厂函数
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

```js
// 返回 Promise 的工厂函数
Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

```js
// 高级工厂函数
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

## 处理异步组件

创建组件的 Vnode 节点时，若是发现组件定义是工厂函数，会调用`resolveAsyncComponent`获取组件定义。

若是能获取到组件定义即工厂函数同步`resolve`返回组件的构造函数，则继续往下走，基于构造函数创建组件的 Vnode 节点。

若是获取的结果是`undefined`（工厂函数异步获取组件定义，先以`undefined`返回），则创建异步占位 Vnode 并返回。等到真正的组件定义返回时，会调用`vm.$forceUpdate()`方法重新渲染，此时异步组件已经 ready，会同步返回组件的构造函数。

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  // _base 为 Vue 构造函数
  const baseCtor = context.$options._base

  // Ctor 为工厂函数时
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // 创建异步占位 Vnode，并返回
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }
  // ...
}
```

### resolveAsyncComponent

`resolveAsyncComponent`针对工厂函数的三种形式，分别进行了不同的逻辑处理。

```js
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

/**
 * 基于组件选项对象，返回生成的组件构造函数
 * @param {*} comp 组件选项对象
 */
function ensureCtor (comp: any, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    // 若是 CommonJS 的模块对象，则取模块对象的 default 属性值
    comp = comp.default
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

/**
 * 创建异步占位 Vnode
 */
export function createAsyncPlaceholder (
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  // 增加 asyncFactory、asyncMeta 数据
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}

/**
 * 解析异步组件
 *
 * - 首次解析
 *   - 若工厂函数同步 resolve 组件选项对象，则返回基于组件选项对象扩展的构造函数
 *   - 若工厂函数异步 resolve 组件选项对象
 *     - 若是高级异步组件 && 存在加载中组件 && delay 为 0，则返回基于加载中组件选项对象扩展的构造函数
 *     - 否则，返回 undefined（之后会强制渲染，再次解析异步组件）
 * - 再次解析
 *   - 若组件加载出错 && 高级异步组件存在出错时组件，返回基于出错时的组件选项对象扩展的构造函数
 *   - 若组件异步加载成功，返回基于组件选项对象扩展的构造函数
 *   - 若 delay 时间到达 && 仍处于异步加载过程中 && 高级异步组件存在加载中组件，返回基于加载中组件选项对象扩展的构造函数
 */
export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>,
  context: Component
): Class<Component> | void {
  // 高级异步组件：（经过 timeout 时间后再次解析异步组件时）异步组件加载超时，强制渲染“渲染错误组件”
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  // （再次解析异步组件时）若之前已经解析过该异步组件，解析后的构造函数会挂在 factory.resolved 上，则直接使用解析好的构造函数
  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  // 高级异步组件：（经过 delay 时间后再次解析异步组件时）强制渲染“加载中组件”
  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    // 若同时在多处使用同一个异步组件，则将 context（即创建组件时的当前组件活动实例 vm）加入 factory.contexts 数组，等异步组件获取到组件定义，顺序调用各 context 的 $forceUpdate() 方法
    factory.contexts.push(context)
  } else {
    // 首次解析异步组件
    const contexts = factory.contexts = [context]
    let sync = true

    // 遍历每个 context，调用 $forceUpdate() 方法强制重新渲染
    const forceRender = () => {
      for (let i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate()
      }
    }

    // 封装 resolve，确保只调用一次
    const resolve = once((res: Object | Class<Component>) => {
      // cache resolved
      // ensureCtor 函数返回的是构造函数，挂在 factory.resolved 属性下，方便再次渲染后异步组件直接可用
      factory.resolved = ensureCtor(res, baseCtor)
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        // 若是工厂函数异步 resolve 组件选项对象，则需要调用各个 context 重新强制渲染
        // 若是工厂函数同步 resolve 组件选项对象，则不需要。
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
        // 组件获取失败，强制各个 context 重新渲染（出错时组件）
        forceRender()
      }
    })

    // 执行工厂函数，同步返回执行结果
    const res = factory(resolve, reject)

    // 若工厂函数返回 Promise 实例或者对象（高级异步组件）
    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // 工厂函数返回 Promise 实例
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject)
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        // 工厂函数返回对象（高级异步组件）
        res.component.then(resolve, reject)

        if (isDef(res.error)) {
          // 存在出错时组件选项对象
          factory.errorComp = ensureCtor(res.error, baseCtor)
        }

        if (isDef(res.loading)) {
          // 存在加载中组件选项对象
          factory.loadingComp = ensureCtor(res.loading, baseCtor)
          if (res.delay === 0) {
            // 不延时，直接展示加载中组件
            factory.loading = true
          } else {
            // 延时 delay 后展示加载中组件
            setTimeout(() => {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                // 若延时 delay 时间后，组件选项对象仍为 ready，且仍未出错，则让各个 context 重新渲染（展示加载中组件）
                factory.loading = true
                forceRender()
              }
            }, res.delay || 200)
          }
        }

        if (isDef(res.timeout)) {
          // 出错时的渲染组件存在
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
    // 若是高级组件里的加载中组件存在且不演示展现加载中组件，factory.loading 为 true，返回加载中组件的构造函数 factory.loadingComp
    // 否则，返回解析后的组件构造函数（可能为空）
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}
```

异步组件可能会用于不止一处地方，因为可能会在多个活动实例里渲染，因此我们需要收集所有这些组件活动实例，当异步组件获取到组件定义之后，通知这些组件活动实例重新渲染。

```js
  if (isDef(factory.contexts)) {
    // already pending
    // 若同时在多处使用同一个异步组件，则将 context（即创建组件时的当前组件活动实例 vm）加入 factory.contexts 数组，等异步组件获取到组件定义，顺序调用各 context 的 $forceUpdate() 方法
    factory.contexts.push(context)
  } else {
    // ...
    // 执行工厂函数，同步返回执行结果
    const res = factory(resolve, reject)
    // ...
  }
```

不管工厂函数是哪一种形式，都需要执行工厂函数，并根据返回结果区分出是哪一种工厂函数形式。

`resolve`和`reject`函数都经过`once`函数封装了一层，保证`resolve`和`reject`的逻辑只执行一次。

- `forceRender`：强制让`factory.contexts`里的每个活动实例重新渲染
- `resolve`函数：将组件定义处理成构造函数，并挂载在`factory.reosolved`上，若是异步`resolve`的话，则调用`forceRender`进行强制渲染。
- `reject`函数：开发环境下报错提示，（针对高级组件）标明组件定义获取失败，重新渲染（错误时显示的组件）

#### 普通工厂函数

针对普通工厂函数而言，执行工厂函数返回的值通常为非对象类型（没有`return`语句的话，都是返回`undefined`），因此会跳过之后的处理 Promise 工厂函数和高级工厂函数的逻辑。但是在工厂函数内部`resolve`组件定义时，可能存在两种情况：同步`resolve`和异步`resolve`，这两种情况决定着最终`resolveAsyncComponent`函数的返回。

若是同步`resolve`组件定义，`resolve`函数会将组件定义处理为构造函数的形式并挂载在`factory.resolved`上，最后`resolveAsyncComponent`函数返回的是`factory.resolved`构造函数，之后的流程就按常规的同步组件处理。

```js
return factory.loading
      ? factory.loadingComp
      : factory.resolved
```

若是异步`resolve`组件定义，构造函数的将在之后的某个时间点挂载在`factory.resolved`上，并调用`forceRender`进行重新渲染。但是当前的`factory.resolved`就为`undefined`，最终`resolveAsyncComponent`函数返回的就是`undefined`。

#### 返回 Promise 实例的工厂函数

针对返回 Promise 实例的工厂函数而言，执行工厂函数后会返回 Promise 实例，则调用`promise.then()`方法添加`resolve`函数和`reject`函数，等待异步处理的结果，最终`resolveAsyncComponent`函数返回的也是`undefined`。

#### 高级工厂函数

针对高级工厂函数，执行工厂函数后会返回一对象`res`，且`res.component`是 Promise 实例，则调用`res.component.then()`方法添加`resolve`函数和`reject`函数，这一过程跟`返回 Promise 实例的工厂函数`完全一致。不同的是，高级异步组件可以添加更好的用户体验，可以先展示 Loading 过程的组件以及在超时后展示错误组件。

若是`res.loading`存在，即存在渲染中组件：若是延迟`0s`，则`resolveAsyncComponent`函数返回渲染中组件，异步组件获取期间将显示渲染中组件；否则返回`undefined`。

若是`res.timeout`存在，即规定了组件加载的超时时间，则设置一定时器，超过规定时间后组件定义还没加载到就调用`forceRender`强制渲染并显示错误组件。此种情况，`resolveAsyncComponent`函数会返回`undefined`

#### 获取组件定义后的再次渲染

以上三种形式的工厂函数都有可能会涉及到调用`forceRender`进行强制重新渲染的问题。若是正常获取到了异步组件的定义，会将其处理成构造函数后挂在`factory.resolved`上，高级工厂函数若是有加载中或是错误组件，处理后将挂在`factory.errorComp`或`factory.loadingComp`，如此再下一次重新渲染时，`resolveAsyncComponent`函数就能直接返回构造函数了。

```js
export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>,
  context: Component
): Class<Component> | void {
  // 高级异步组件：（经过 timeout 时间后再次解析异步组件时）异步组件加载超时，强制渲染“渲染错误组件”
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  // （再次解析异步组件时）若之前已经解析过该异步组件，解析后的构造函数会挂在 factory.resolved 上，则直接使用解析好的构造函数
  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  // 高级异步组件：（经过 delay 时间后再次解析异步组件时）强制渲染“加载中组件”
  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }
  // ...
}
```

### 异步占位 Vnode

若是工厂函数内异步去获取组件定义时，`resolveAsyncComponent`函数会返回`undefined`（除非是高级工厂函数且有无延迟的 Loading 组件）。此时，将调用`createAsyncPlaceholder`生成异步占位 Vnode 节点，先以此 Vnode 节点返回。异步占位 Vnode 是基于空的 Vnode 节点创建的，再加上异步组件的一些元数据如`data`、`children`等。

```js
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
```

```js
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```
