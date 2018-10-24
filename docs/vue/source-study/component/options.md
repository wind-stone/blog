---
sidebarDepth: 0
---

# 合并配置

[[toc]]

我们创建组件实例时，都会调用`vm._init`去初始化组件。而初始化组件的首要任务就是将跟组件实例有关的所有配置合并并返回新的配置对象，比如通过`Vue.extend`继承而来的配置、通过`Vue.mixins`或组件选项对象里`mixin`选项混合而来的配置等等。

## 根组件 VS 子组件

我们知道，创建组件实例时一般有两种情况：用户通过`new Vue(options)`显示创建、渲染组件时创建子组件，而这两种情况合并配置的方式也是不一样的。

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // ...
  // merge options
  if (options && options._isComponent) {
    // 子组件合并配置
    initInternalComponent(vm, options)
  } else {
    // 根组件合并配置
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  // ...
}
```

### 根组件

对于根组件来说，会将（经过处理里）`vm.constructor.options`和调用`new Vue(options)`传入的`options`合并。

这里我们需要弄明白：第一，`vm.constructor.options`是怎么来的以及有哪些内容；第二，`resolveConstructorOptions`是做什么用的。

#### Vue.options

我们先忽略继承的情况，先讨论根组件实例的`vm.constructor`为构造函数`Vue`的情况。在`initGlobalAPI(Vue)`初始化全局 API 的时候，以及在导出`Vue`的时候，已经对`Vue.options`进行了初始化和处理。

```js
// src/core/global-api/index.js
import builtInComponents from '../components/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  Vue.options = Object.create(null)
  // 初始化 components、directives、filters
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 添加内置组件定义
  extend(Vue.options.components, builtInComponents)
  // ...
}
```

```js
// src/platforms/web/runtime/index.js
import platformDirectives from './directives/index'
import platformComponents from './components/index'
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)
export default Vue
```

```js
// src/shared/constants.js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

```js
// src/core/components/index.js
import KeepAlive from './keep-alive'

export default {
  KeepAlive
}
```

最终，`Vue.options`的数据结构大概是如下这样。

```js
Vue.options = {
  components: {
    KeepAlive,
    Transition,
    TransitionGroup
  },
  directives: {
    model,
    show
  },
  filters: {},
  _base: Vue
}
```

#### resolveConstructorOptions

更新：全局方法`Vue.component/directive/filter`也会导致`Vue.options`增加新的内容。

若是想详细了解本节的内容，请先了解`Vue.extend`的实现。

`resolveConstructorOptions`的主要作用是，若是`vm.constructor`是继承而来的构造函数，需要重新对`vm.constructor.options`进行重新合并，以加入调用`vm.constructor.mixin()`对`vm.constructor.options`的修改以及调用`vm.constructor.super.mixin`对`vm.constructor.options.super`的修改。

主要注意的是，为了保证合并的顺序，`vm.constructor.super.options`需要重新计算，`vm.constructor.extendOptions`也要重新更新，最后再`mergeOptions(vm.constructor.super.options, vm.constructor.extendOptions)`来得到`vm.constructor.options`。

```js
/**
 * 返回最新的 Ctor.options，以及更新 Ctor.extendOptions
 *
 * 1. 若 Ctor 不是通过 Vue.extend 继承而来的，直接返回 Ctor.options
 * 2. 否则，返回计算而来的最新的 Ctor.options。此处要考虑的问题是
 *    a. 继承的基类 Ctor.super.options 可能发生变化（通过调用 Ctor.super.mixin() 而造成的）
 *    b. Ctor.options 可能发生变化（通过调用 Ctor.mixin() 而造成的）
 */
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  // 如果存在父类，即该 Ctor 是继承而来的子类
  if (Ctor.super) {
    // 当前计算得的最新的 Ctor.super.options
    const superOptions = resolveConstructorOptions(Ctor.super)
    // 子类继承时保存的 Ctor.super.options
    const cachedSuperOptions = Ctor.superOptions

    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        // 动态更新 Ctor.extendOptions，以确保其包含了通过 Ctor.mixin 添加、修改的选项（配置合并不会出现删除的情况）
        extend(Ctor.extendOptions, modifiedOptions)
      }

      // 基于最新的 Ctor.super.options 和 Ctor.extendOptions 合并配置
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}


/**
 * 返回通过调用 Ctor.mixin 从而导致 Ctor.options 里选项改变的那些选项及其值
 */
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified

  // 最新的 Ctor.options（可能已经通过 Ctor.mixin 改变了）
  const latest = Ctor.options

  // 上一次继承 Super 时调用 Super.extend(extendOptions) 传入的选项对象
  const extended = Ctor.extendOptions

  // 上一次继承 Super 时（合并）Ctor.options 后的副本
  const sealed = Ctor.sealedOptions

  for (const key in latest) {
    // Ctor.mixin 是通过 mergeOptions 合并选项的，返回的 value 都是新的引用对象
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      // 返回 Ctor.options 里改变的选项值（经过去重）
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

/**
 * 数据去重，若选项值不是数据，直接返回 latest，否则返回那些在 latest 里 &&（在 extended 里 || 不在 sealed 里的）
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
      // 筛选出：曾经在 extended 里以及 后来通过 Ctor.mixin 加入的（即不在 sealed 里）
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

#### mergeOptions

```js
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    // 检查 option 里的 components 的 name 是否符合要求
    checkComponents(child)
  }

  if (typeof child === 'function') {
    // child 是构造函数
    child = child.options
  }

  // 格式化 props、inject、directives 为对象格式
  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  const options = {}
  let key
  for (key in parent) {
    // 先合并 parent 里有的选项
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      // 再合并 child 里有但 parent 里没有的选项，避免重复合并
      mergeField(key)
    }
  }
  function mergeField (key) {
    // 优先使用选项单独的合并策略，没有的话使用默认策略
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

`mergeOptions`主要的功能就是，将`parent`和`child`配置进行合并，包括要合并`child`配置的`extends`和`mixins`。在合并具体选项时，我们可以看到不同的选项合并策略函数`strat`可能是不一样的，如果不存在已知的合并策略函数，则将使用默认的合并策略函数。需要注意的是，开发者还可以提供自定义的合并策略函数。具体的合并策略，我们将在`不同选项的合并策略`详细描述。

### 子组件

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

子组件在调用的`vm._init`时传入的`options._isComponent`为`true`，因此是通过`initInternalComponent(vm, options)`来合并配置的。

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

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
```

`initInternalComponent`主要做的是，基于`vm.constructor.options`创建`vm.$options`，并将如下数据转存到`vm.$options`，方便后续使用。

- 创建组件占位父 Vnode 时存储在`vnode.componentOptions`里的数据比如`propsData`
- 创建子组件时的选项`options`上的`parent`、`render`、`staticRenderFns`等数据

```js
export function createComponent (
  // ...
) {
  // ...
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    // vnode.componentOptions
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  // ...
}
```

## 不同选项的合并策略

组件选项对象里存在着各种选项，而各个选项的合并策略可能是不同的，需要在合并时通过选项的`key`获取到对应的选项策略函数，这些选项策略函数都预制在`strats`对象里，而`strats`对象初始时是空对象，后续会添加`key`及对应的选项策略函数。

```js
import config from '../config'
// ...
const strats = config.optionMergeStrategies
export function mergeOptions (
  // ...
): Object {
  // ...
  function mergeField (key) {
    // 优先使用选项单独的合并策略，没有的话使用默认策略
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

```js
// src/core/config.js
export default ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null)
}
```

根据选项策略的不同，我们将这些选项分为以下几类：

- `data`、`provide`选项
- 生命周期钩子函数
- 资源选项（`component`、`directive`、`filter`）
- `watch`选项
- `props`、`methods`、`inject`、`computed`选项
- 默认合并策略
- （开发模式）`el`、`propsData`选项

若是`child`

### data、provide 选项

按以下步骤来合并`data`数据（以下的`child`、`parent`代表的是子/父配置的`data`选项的值）：

1. 将`child`、`parent`数据若是函数，则执行函数获得返回的对象
2. 若`parent`不存在，返回`child`
3. 若`child`不存在，返回返回`parent`
4. 遍历`parent`的属性`key`
    - 若`child[key]`不存在，则`child[key]`取用`parent[key]`的值
    - 若`child[key]`存在，且`child[key]`和`parent[key]`都是对象，则递归合并`child[key]`和`parent[key]`

这里需要注意的是，合并配置时`vm`不存在（即是调用`Vue.extend`、`Vue.mixin`合并配置生成构造函数的`options`时）和`vm`存在（生成组件实例的`$options`时）的情况略微有些不同。

```js
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal
  const keys = Object.keys(from)
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // vm 不存在，即调用`Vue.extend`、`Vue.mixin`合并配置生成构造函数的`options`时
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }

    // 返回一个 data function，等真正实例化的时候再调用
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    // vm 存在，即生成组件实例的`$options`时
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```

`provide`选项类似`data`选项。

```js
strats.provide = mergeDataOrFn
```

### 生命周期钩子函数

同一生命周期钩子合并成一数组，并且`parent`的钩子排在数组前面，会优先执行。

```js
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
]
```

```js
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
```

### 资源选项（component、directive、filter）

`child`里`options`的资源的每一项覆盖`parent`里`options`的资源的每一项。

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

```js
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
```

### watch

1. `child`的`watch`选项不存在，则采用`parent`的`watch`选项
2. `parent`的`watch`选项不存在，则采用`child`的`watch`选项不存在
3. 若都存在，将同名的 Watcher 合并成数组，且`parent`的 Watcher 排在前面优先执行（单个的 Watcher 也以数组形式返回）

```js
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
```

### props、methods、inject、computed 选项

存在同名的`key`，则`child`将覆盖`parent`。

```js
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
```

### 默认合并策略

如果 childVal 存在则使用 childVal，否则使用 parentVal

```js
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}
```

### （开发模式）el、propsData 选项

```js
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}
```
