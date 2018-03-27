# merge-hook 源码学习及收获

合并 vnode 的 hook 钩子函数，合并进来的钩子函数执行一次即移除。


## 源码

```js
/* @flow */

import VNode from '../vnode'
import { createFnInvoker } from './update-listeners'
import { remove, isDef, isUndef, isTrue } from 'shared/util'

export function mergeVNodeHook (def: Object, hookKey: string, hook: Function) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {})
  }
  let invoker
  const oldHook = def[hookKey]

  // 封装函数，执行后即移除该 hook 函数
  function wrappedHook () {
    hook.apply(this, arguments)
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook)
  }

  if (isUndef(oldHook)) {
    // 钩子函数不存在，创建新的 invoker
    invoker = createFnInvoker([wrappedHook])
  } else {
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // 已经是个合并过的 invoker，复用 involer
      invoker = oldHook
      invoker.fns.push(wrappedHook)
    } else {
      // 已存在的钩子是个普通的函数，创建新的 invoker
      invoker = createFnInvoker([oldHook, wrappedHook])
    }
  }

  invoker.merged = true
  def[hookKey] = invoker
}
```
