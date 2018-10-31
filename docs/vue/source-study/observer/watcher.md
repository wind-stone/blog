---
sidebarDepth: 0
---

# Watcher

[[toc]]

## Watcher 类

## 释疑

### 哪些情况下会产生 Watcher？

- 渲染 Watcher（`vm._watcher`）
- 计算属性 Watcher
- 用户 Watcher（通过`Vue.prototype.$watch`和组件对象的`watchers`属性产生）

### watcher 是如何实现 deep: true 深度监听的？

只要`watcher`的某一个依赖的子孙属性发生变化，就会触发`watcher`重新计算表达式，如有必要，执行监听的回调函数。

```js
export default class Watcher {
  // ...

  /**
   * Evaluate the getter, and re-collect dependencies.
   * 计算表达式的值，并重新收集依赖
   */
  get () {
    // 将当前 watcher 设置为全局的 Dep.target，方便该 watcher 依赖的 dep 将该 watcher 添加到订阅列表里
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
        // 此处，如果是深度 watch，则收集 value 下的所有响应式属性作为依赖
        // 其原理是，不断的获取 value 下面的每一个属性值（只获取，不作其他任何改变操作），触发所有依赖将 Dep.target（此时还是当前正在计算表达式的 watcher）添加到订阅列表里
        traverse(value)
      }
      // 当前 watcher 计算结束，将 Dep.target 设置为原先的值
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  // ...
}
```

可以发现，当对`watcher`是深度监听时，执行了`traverse(value)`，这个操作是获取`表达式计算的返回值`下的每一个子孙属性的属性值，以将在获取时的求值过程中发现的依赖添加到当前`watcher`的`deps`里。

```js
// src/core/observer/travesrse.js
import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

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
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
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
    // 获取每个数组每个元素值的同时，也在让当前的 Dep.target 收集依赖
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    // 获取对象每个 key 的 value 的同时，也在让当前的 Dep.target 收集依赖
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

### 哪些情况下 watcher 的回调函数会执行？

通过学习源码，我们发现在以下三种情况下会执行回调函数（前提是表达式进行了重新求值）：

- 所监听的表达式的返回值`value`改变了（原始值改变，或者是对象的引用改变）
- 所监听的表达式的返回值`value`是对象或数组（即使`value`的引用没改变）
- 深度监听表达式时。

```js
export default class Watcher {
  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   * 依赖改变时，最终会调用该函数
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        // 以下三种情况需要调用监听回调函数：
        // 1、表达式的返回值 value 改变了（原始值，或者是对象的引用）
        // 2、表达式的返回值 value 是对象或数组（即使 value 的引用没改变）
        // 3、深度监听的，不管最终的返回值是否改变，都要执行回调。（因为 watcher 依赖的 dep 的子孙属性改变了）
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
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
  // ...
}
```

针对于第一点，我们比较好理解，毕竟返回的值都改变了，肯定是要执行回调函数的。

但是针对第二点，表达式的返回值时对象或数组时，即使引用没改变，为什么要执行回调函数呢？按照源码的英文注释，即使返回的是同一引用，但是引用的子孙属性可能发生变化了。我猜想，因为返回的对象不一定是响应式的，我们无法知道（或者是比较难知道？）引用的子孙属性发生变化，因此统一处理成执行回调函数。我们来验证一下。

```js
const OBJECT = {}
export default {
  name: 'App',
  data: function () {
    return {
      a: 1
    }
  },
  created () {
    this.$watch(() => {
      const a = this.a
      return OBJECT
    }, function () {
      console.log('$watch 回调执行啦，尽管 OBJECT 没改变！')
    })
    this.a = 2
  }
}
```

结果打印：`$watch 回调执行啦，尽管 OBJECT 没改变！`

我们可以看到，监听的表达式的返回值时一常量对象`OBJECT`，我们并没有改变它，但是当我们改变表达式的依赖`data.a`时，回调函数居然执行了！（其实上，表达式并没有实际依赖`data.a`，只是在计算表达式的值时，会获取`data.a`的值，导致`data.a`成了表达式的依赖项了）

### 同步计算 VS 异步队列

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
