# update-listeners 源码学习及收获

更新 listeners，添加新增的 listener，删除无用的 listener

## 源码

```js
/* @flow */

import { warn } from 'core/util/index'
import { cached, isUndef, isPlainObject } from 'shared/util'

/**
 * 标准化事件名称，返回一个对象，包含:
 *   文件名
 *   是否监听一次
 *   是否采取捕获模式
 *   是否 passive
 */
const normalizeEvent = cached((name: string): {
  name: string,
  once: boolean,
  capture: boolean,
  passive: boolean,
  handler?: Function,
  params?: Array<any>
} => {
  const passive = name.charAt(0) === '&'
  name = passive ? name.slice(1) : name
  const once = name.charAt(0) === '~' // Prefixed last, checked first
  name = once ? name.slice(1) : name
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name
  return {
    name,
    once,
    capture,
    passive
  }
})


/**
 * 封装 fns 函数，返回新的函数 invoker
 * invoker.fns = fns
 */
export function createFnInvoker (fns: Function | Array<Function>): Function {
  function invoker () {
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments)
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns
  return invoker
}

/**
 * 更新 listeners
 *
 * 1、新的 listener 不存在：报错
 * 2、新的 listener 存在 && 旧的 listener 不存在：调用 createFnInvoker 生成新的 listener 并添加到 vm 上
 * 3、新的 listener 存在 && 旧的 listener 存在 && 新旧 listener 不相等：新的替换掉旧的
 *
 * 注意：通过调用 createFnInvoker 标准化 listener ，最终调用 listener 时，实际上是调用 listener.fns 上个每个函数（fns 可能是单个函数，也可能是数组）
 */
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) {
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)
    /* istanbul ignore if */
    if (__WEEX__ && isPlainObject(def)) {
      cur = def.handler
      event.params = def.params
    }
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params)
    } else if (cur !== old) {
      old.fns = cur
      on[name] = old
    }
  }
  // 去除 oldListeners 有但新 listeners 里没有的事件
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
```
