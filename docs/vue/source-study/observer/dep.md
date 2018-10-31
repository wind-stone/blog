---
sidebarDepth: 0
---

# Dep

[[toc]]

## Dep 类

`Dep`是类，创建依赖对象`dep`，就是新建`Dep`的实例。`dep`服务于观察者对象（`Observer`的实例）或响应式属性（通过`defineReactive`定义的），它会维护着一个依赖列表`subs`，`subs`里记录着所有依赖于其服务对象（即观察者对应的被观察对象/响应式属性）的订阅者。当其服务对象改变了，可以调用`dep.notify`方法通知`subs`里的所有订阅者。`dep`提供了一些接口来操作订阅者：

- `dep.addSub`：添加订阅者
- `dep.removeSub`：移除订阅者
- `dep.notify`：通知订阅者
- `dep.depend`：将依赖对象添加当前`Dep.target`的依赖列表里

```js
/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

/**
 * 将传入的 watcher 设置为全局的 Dep.target，方便传入的 watcher 所依赖的 dep 将其添加到订阅列表里
 *
 * @param {Watcher} _target 当前正在计算表达式结果的 watcher
 */
export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

/**
 * 恢复之前的 Dep.target
 */
export function popTarget () {
  Dep.target = targetStack.pop()
}
```

`Dep.target`就是当前正在计算其表达式的订阅者，是 Watcher 的一个实例，且是全局唯一的。当某个 Watcher 调用它的`get`方法计算表达式时，就会将它自己设置为`Dep.target`，并将之前的`Dep.target`压入栈中。等到这个 Watcher 计算完表达式之后，会从栈中取出之前的`Dep.target`以重新作为当前的`Dep.target`。

```js
// src/core/observer/watcher.js
export default class Watcher {
  // ...
  get () {
    // 将当前 watcher 设置为全局的 Dep.target，方便该 watcher 依赖的 dep 将该 watcher 添加到订阅列表里
    pushTarget(this)
    try {
      // 此处，会收集计算过程中的依赖
      value = this.getter.call(vm, vm)
    } catch (e) {
        // ...
    } finally {
      // ...
      popTarget()
      // ...
    }
    return value
  }
}
```
