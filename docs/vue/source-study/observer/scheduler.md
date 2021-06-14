# 异步队列

[[toc]]

## 同步计算 VS 异步队列

创建 Watcher 实例时，若选项对象里的`sync`为`true`，则意味着只要依赖项发生改变，将立即计算 Watcher 实例的表达式；否则，Watcher 在依赖项发生变化时，会先将 Watcher 实例添加到异步队列，等下一次`tick`时再重新计算表达式。

```js
export default class Watcher {
  // ...

  /**
   * 依赖改变时，依赖会调用 watcher.update
   */
  update () {
    if (this.lazy) {
      // 若是惰性计算的 watcher，只将 dirty 标志为 true，但不重新计算表达式；等到获取 value 时，再重新计算表达式
      this.dirty = true
    } else if (this.sync) {
      // 若是同步计算，则依赖改变时，立即计算表达式
      this.run()
    } else {
      // 否则，将 watcher 放入异步队列，在下一次 tick 时再计算表达式
      queueWatcher(this)
    }
  }

  // ...
}
```

> Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。—— [深入响应式原理 - 异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

## 调度器(Scheduler)

### queueWatcher

纵观目前 Vue 里所有源码，基本上没有 Watcher 是同步计算表达式的。这也就是说，除了计算属性是使用的惰性计算的 Watcher 之外，其他所有的 Watcher 在`update`时都会进入队列里，等待在下一个`tick`里执行。

此处的队列是 Vue 在通知更新时的优化，主要保证了：

- 同一事件循环里多次触发的 Watcher，最终只执行一次（借鉴了 DOM 的渲染方式？）
- 所有加入队列的 Watcher，会按其`id`进行排序
- 队列里的所有 Watcher 都将在下一个事件循环`tick`里执行

```js
// src/core/observer/scheduler.js
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false

export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 若当前 wathcer 没进行过 queueWatcher 处理，则进行如下处理；否则，忽略
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      // 若是队列还没有 flush，则将当前 watcher 加入到队列末尾
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 若是队列里正在 flush，则将当前 watcher 按照 id 插入到队列里
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    // 加锁，在下一个 tick 里 flush 队列
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```

### flushSchedulerQueue

```js
// src/core/observer/scheduler.js
function flushSchedulerQueue () {
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  // 队列里的 wathcer 执行完后，重置调度器的状态，方便下次再次循环执行该队列
  resetSchedulerState()

  // call component updated and activated hooks
  // 调用 activated 钩子
  // TODO: 跟 keep-alive 有关，待之后分析
  callActivatedHooks(activatedQueue)

  // 调用 update 钩子
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

/**
 * 渲染 Watcher，在重新计算表达式后，调用 updated 钩子
 */
function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```

#### Watcher 按 id 排序

在执行队列里的 Watcher 之前，会先将 Watcher 按其`id`从小到大排序，这主要是为了保证：

1. 组件的更新顺序是先父后子。原因是，父组件是在子组件之前创建的，父组件的 Watcher 也是先于子组件的 Watcher 创建的。
2. 组件里用户自定义的 Watcher 比如组件选项对象里定义的`watch`选项，在组件的渲染 Watcher 之前执行。原因是，用户自定义的 Watcher 是在组件渲染 Watcher 之前创建的。
3. 若组件在其父组件 Watcher 执行的过程中被销毁，则该组件的 Watcher 就没必要执行，可以跳过。

排序好之后，就会遍历队列里的每个 Watcher。若是该 Watcher 有`before`方法，则先执行，之后再执行`watcher.run()`方法。

#### beforeUpdate 钩子

在挂载组件时，会创建组件的渲染 Watcher，创建渲染 Watcher 时，参数`options`会存在`before`方法，该方法最终将挂载到 Watcher 实例上。`before`方法的作用就是，在渲染 Watcher 重新计算之前，先调用组件的`beforeUpdate`钩子函数

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
}
```

```js
export default class Watcher {
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // ...
    if (options) {
      // ...
      this.before = options.before
    }
  }
}
```

#### 实时获取队列的长度

我们发现，在每次获取队列的长度时，都是使用的`queue.length`。而一般在数组长度不变化的情况下，我们只在首次获取数组长度`len`，之后遍历的过程中始终使用`len`；只有当数组长度在遍历过程中发生改变时，才需要实时获取`queue.length`的值。

事实上，在`flushSchedulerQueue`执行过程中，仍然会有新的 Watcher 加入到队列里，新加入的 Watcher 会按`id`大小，插入到队列里。

```js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      // 若是队列还没有 flush，则将当前 watcher 加入到队列末尾
      queue.push(watcher)
    } else {
      // 若是队列里正在 flush，则将当前 watcher 按照 id 插入到队列里
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // ...
  }
}
```

#### 重置状态

队列里的 wathcer 执行完后，需要重置调度器的状态，方便下次再次循环执行该队列。

```js
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}
```

#### 调用 activated 钩子

待学习

#### 调用 updated 钩子

对于（已挂载的）组件的渲染 Watcher 来说，每次重新渲染之后，都需要调用组件的`updated`钩子。

```js
function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```
