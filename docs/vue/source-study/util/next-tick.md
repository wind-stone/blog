---
sidebarDepth: 0
---

# nextTick

[[toc]]

Vue 里将`next-tick.js`独立成一单独的文件，主要向外暴露了两个函数`nextTick`和`withMacroTask`。

## nextTick 函数

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

调用`nextTick(cb)`就是让函数`cb`在下一个`tick`里执行。

`pending`标志着是否正在执行`callbacks`里的函数。

`nextTick`执行过程为：

1. 新建一函数，并推入到`callbacks`队列里，等待之后执行该函数。
2. 检测`pending`，决定是否执行`callbacks`里的函数
    - `pending`为`true`：说明正在执行`callbacks`，则忽略，进入下一步；
    - `pending`为`false`：说明没有执行`callbacks`
      - 则将`pending`置为`true`
      - 根据`useMacroTask`的取值，决定用`macroTimerFunc`或`microTimerFunc`来执行`callbacks`里的函数
3. 若`cb`不存在并且环境里支持 Promise，则返回一 Promise 实例，当调用`_resolve`时，该实例的状态变为`resolved`

可以看到，当`cb`存在时，加入到`callbacks`里的函数在执行时，就是执行`cb`。

```js
nextTick().then(() => {
  console.log('cb 为空时，在下一个 tick，这里会执行')
})
```

但是在`cb`为空时，若是环境支持 Promise，`nextTick`将返回一 Promise 实例，等到下一个`tick`的时候，Promise 实例会改变为`resolved`状态，从而通过 Promise 实例的`then`方法添加的函数就可以成功执行。

TODO: 这里有个疑问，若是环境不支持 Promise，`nextTick`将返回`undefined`，给`nextTick`上调用`then`方法，会报错吧？

### macroTimerFunc / microTimerFunc

上面的第二步里，会根据`useMacroTask`的取值，决定用`macroTimerFunc`或`microTimerFunc`来执行`callbacks`里的函数。我们先来看看这两个函数的区别。

```js
// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}
```

这里会根据环境来决定`macroTimerFunc`和`microTimerFunc`采取哪一种实现。

`macroTimerFunc`的实现选取顺序为：

- `setImmediate`（仅 IE 10/11、Edge 12+、IE Mobile 支持，[caniuse - setImmediate](https://caniuse.com/#search=setImmediate)）
- `MessageChannel`（基本上都支持，除了少数的低版本浏览器，[caniuse - MessageChannel](https://caniuse.com/#search=MessageChannel)）
- `setTimeout`

`microTimerFunc`实现的选取顺序为：

- Promise
- `macroTimerFunc`

若是环境支持 Promise，则使用 Promise 实现`microTimerFunc`，否则就使用上面确定的`macroTimerFunc`。

### flushCallbacks

无论是使用`macroTimerFunc`还是`macroTimerFunc`，最终都是在下一次`tick`里执行了`flushCallbacks`。该函数就是将`callbacks`数组里函数取出，并一一执行。

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

## withMacroTask

`withMacroTask`是将`fn`函数封装一层，分装的作用是：在`fn`函数内若是调用了`nextTick(cb)`，则传入`nextTick`的函数`cb`将强制使用`macroTimerFunc`来执行，即放在 macro task 队列里执行。

这种用法主要用于封装监听 DOM 事件的方法，以便在 DOM 事件内发生的状态变更引起渲染 Watcher 重新计算时使用到的`nextTick`在`macroTimerFunc`里执行，详见[事件监听器 - 原生事件模块](/vue/source-study/instance/events.html#原生事件模块)。如果不这么做的话，可能引起的问题有：[#6566](https://github.com/vuejs/vue/issues/6566)，还有其他问题可以见上面的注释。

```js
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}
```

## Vue.nextTick / vm.$nextTick

Vue 有两种方式将`nextTick`暴露出去，分别是静态方法`Vue.nextTick`和实例方法`vm.$nextTick`，它们都是间接地调用了`nextTick`函数。

```js
// src/core/global-api/index.js
import { nextTick } from '../util/index'
export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  Vue.nextTick = nextTick
}
```

```js
// src/core/instance/render.js
export function renderMixin (Vue: Class<Component>) {
  // ...
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
}
```

## 释疑

### 为什么不在 nextTick 里直接执行 cb，而要先压入 callbacks 里？

一开始读`nextTick`的源码，就好奇，为什么不在`nextTick`里直接执行`cb`，而是先把`cb`加入到`callbacks`数组里，再统一执行呢？

假设在主线程执行时，我们要执行 10 次`nextTick(cb)`，且假设`nextTick`是用`setTimeout`实现的。这样的话，执行 10 次`nextTick`，将产生 10 个`setTimeout`定时器；但是要是把 10 个`cb`放在`callbacks`里，只会产生一个`setTimeout`定时器，且在当前主线程中，可以任意调用`nextTick(cb)`加入新的`cb`，所有的这些`cb`都会在下一次`tick`时顺序执行。如此，也算是提升了一些性能。
