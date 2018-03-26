# `Vue.prototype._init`源码学习及收获

## 分析

- `options`合并
  - 内部组件（跟 Vnode 有关，待后续学习）
  - 非内部组件

### 非内部组件`options`合并

初始化 Vue 实例/组件时，需要将`Ctor.options`（考虑到继承，这里不只是`Vue.options`）与传入的`options`选项合并成新的`options`后，再做下一步处理。而在合并`options`前，需要做一些处理，比如获取最新的`Ctor.options`。

之所以要获取最新的`Ctor.options`，是因为如果`Ctor`是继承而来的话，`Ctor.options`实际上是由父类`Super`的`Super.options`与`Ctor`继承`Super`时传入的`extendOptions`合并而来的，且`Super.options`/`Ctor.options`都可能通过`Super/Ctor.mixin`方法注入新的选项。

注意项：
- 通过`mergeOptions`源码可知，每次有两个`options`合并之后，总会返回一新的`options`引用对象
- `mergeOptions`里合并各个`key`时，其`value`也是返回新的`value`引用对象（除了`data`的合并）

## 源码

```js
// @file src/core/instance/init.js
import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // 如果是内部组件（跟 VNode 有关，待后续学习）

      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      // 合并 options 选项
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),  // 返回最新的 vm.constructor.options
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm) // 详见 ./lifecycle.md
    initEvents(vm) // 详见 ./events.md
    initRender(vm) // 详见 ./render.md
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props，详见 ./inject.md
    initState(vm) // 详见 ./state/index.md
    initProvide(vm) // resolve provide after data/props，详见 ./inject.md
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    // 只有存在 el 属性，才挂载到 el 上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode
  opts._parentElm = options._parentElm
  opts._refElm = options._refElm

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

/**
 * 返回（最新的）Ctor.options
 *
 * 此处要考虑的问题是
 * 1. 继承的 super.options 可能变化
 * 2. 继承时传入的 extendOptions 可能发生变化（实际是通过 Ctor.mixin 修改的，算作 extendOptions 的修改）
 * 因此需要重新合并 superOptions 和 extendOptions
 */
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  // 如果存在父类，即该 Ctor 是继承而来的子类
  if (Ctor.super) {
    // 当前计算得出的 super.options
    const superOptions = resolveConstructorOptions(Ctor.super)

    // 子类继承时保存的 super.options
    const cachedSuperOptions = Ctor.superOptions

    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      // 通过`mergeOptions`源码可知，每次有两个`options`合并之后，总会返回一新的`options`引用对象
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}


/**
 * 返回 Ctor.options 修改后，key 对应的 value（通过 Ctor.mixin 修改的）
 */
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified

  // Ctor.options：合并 super.options 和 extendOptions 而来
  const latest = Ctor.options

  // Ctor.extendOptions：调用 super.extend(extendOptions) 传入的
  const extended = Ctor.extendOptions

  // Ctor.sealedOptions：调用 super.extend(extendOptions) 时对最终合并后的 Sub.options 的 sealed 版本
  const sealed = Ctor.sealedOptions

  for (const key in latest) {
    // Ctor.mixin 是通过 mergeOptions 合并选项的，返回的 value 都是新的引用对象
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

/**
 * value 是数组时，对数组项去重
 */
function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}
```
