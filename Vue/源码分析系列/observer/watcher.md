# watcher 源码学习及收获

Vue.js 版本：2.5.13

## background

在 Vue 的整个生命周期当中，会有 4 类地方会实例化`Watcher`：

- Vue 实例化的过程中有`watch`选项
- Vue 实例化的过程中有`computed`计算属性选项
- Vue 原型上有挂载`Vue.prototype.$watch`方法，或者通过实例调用`this.$watch`方法
- Vue 模板/`render`函数内有对数据进行依赖时


## 分析

主要内容
- deep 的实现
- 数组元素是原始值的情况

注意事项
- 两处地方进行了依赖收集
    - 在对 watch 的表达式求值时，会收集表达式的所有依赖
    - 如果`deep: true`，则将对表达式的返回值进行深度遍历，收集所有`key`/`value`的依赖
- 跨级依赖收集
    - 假设 A 依赖于 B，B 依赖于 C、D，则在计算 B 的值以后（计算过程中 B 收集到了依赖 C、D）会将依赖 C、D 添加到 A 的依赖里去，可见实际上
        - C、D 的改变会直接导致 A 的重新求值，而不是 C、D 的改变先导致 B 重新求值，B 的改变导致 A 的重新求值


### deep 的实现

组件选项`watch`或调用`$watch`监听数据变化时，如果传入选项参数`deep: true`，将可以发现对象内部值的变化。

那么这是如何实现的呢？

`Watcher`实例调用`this.get`计算`value`时，如果发现`this.deep`为`true`，将调用`traverse`函数。而`traverse`函数里，将遍历获取对象的每个属性值，获取属性值将会调用属性的`get`方法，正是在此时，`Dep.target` 收集到对象所有属性的依赖，一旦这些属性的值有变化，都将通知到`Watcher`实例，由此实现`deep`深度监听功能。

```js
// @file src/core/observer/watcher/js
import { traverse } from './traverse'
export default class Watcher {
  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
}
```

```js
// traverse.js

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    // 此时会调用 val[i] 的 get 方法，Dep.target 将收集到对 val[i] 的依赖）
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    // 此时会调用 val[keys[i]] 的 get 方法，Dep.target 将收集到对 val[keys[i]] 的依赖）
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```


### 数组元素是原始值的情况

条件：
- 监听数组某一元素的值的变化
- 该元素的值为原始值
- 通过数组索引去修改该元素

结论：
- 无法监听到数组元素（值为原始值）的变化

```js
export default {
  name: 'App',
  data() {
    return {
      arr: [0]
    }
  },
  created() {
    this.$watch(
      () => {
        return this.arr[0]
      },
      (val, oldVal) => {
        console.log('+++++', val, oldVal)  // 无法打印出来
      }
    )
    let i = 0
    setInterval(() => {
      this.arr[0] = ++i
      console.log(this.arr[0])  // 能打印出来
    }, 1000)
  }
}
```

模板里同理，视图也不会更新。

```html
<div id="app">
  <div v-text="arr[0]"></div>
</div>
```


## 源码

### watcher.js

```js
/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      // 是否要深度 watch
      this.deep = !!options.deep

      // 是否是用户创造的 watcher，比如通过 $watch 调用或者组件对象的 watch 选项
      this.user = !!options.user

      // 是否是惰性计算，如果是，初始化 watcher 时不进行求值计算
      this.lazy = !!options.lazy

      // 是否要加入 watcher queue 后异步计算（会忽略掉重复的 watcher，除非相同的 watcher 之前已经计算过）
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        // 如果 expOrFn 里检测到包含了除了 字母、小数点、$ 以外的字符，将视为无效，并报错
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 此处，会收集计算过程中的依赖
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        // 如果是用户创造的 watcher，计算出错的话需要报错
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        // 此处，如果是深度 watch，将对计算的返回值的所有下属 key-value 收集依赖
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        // 如果最近一次计算没有用到某个 dep，将该 watcher 从这个 dep 里删除（比如 if else 的情况）
        // （这样下次这个 dep 有变化，就不会通知这个 watcher 了）
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      // 对于惰性计算的 watcher（如计算属性产生的 watcher），不立即进行计算，而是获取值的时候再计算
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            // 如果是用户创造的 watcher，计算出错的话需要报错
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   * 跨级收集依赖
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        // 如果 vm 不是正在被销毁，则将该 watcher 从 vm._watchers 移除
        // 因为 vm._watchers 可能有大量的 watcher，因此如果 vm 正在被销毁，就没必要从 vm._watchers 里移除 watcher（反正所有的 watcher 都没用了）
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
```

```js
/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    // 检测到 path 里包含了除了 字母、小数点、$ 以外的字符，将视为无效 path
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```


### scheduler.js

```js
// @file src/core/observer/scheduler.js
import type Watcher from './watcher'
import config from '../config'
import { callHook, activateChildComponent } from '../instance/lifecycle'

import {
  warn,
  nextTick,
  devtools
} from '../util/index'

export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}

/**
 * Flush both queues and run the watchers.
 */
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

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

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

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent (vm: Component) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false
  activatedChildren.push(vm)
}

function callActivatedHooks (queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```