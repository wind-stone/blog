# options 合并策略学习及收获

Vue 里，当我们使用到`Vue.extend`、`Vue.mixin`全局方法或组件对象里的`mixins`选项和`extends`选项时，都会涉及到`options`合并的问题，现在我们来分析分析这些`options`是如何合并的。

## 分析

组件选项对象里各个选项的合并方式都有可能不相同，根据合并方式进行如下分类：
- `el`、`propsData`选项
- `data`选项
- 生命周期钩子选项
- 资源选项（`components`、`directives`、`filters`）
- `watch`选项
- `props`、`methods`、`inject`、`computed`选项
- `provide`选项

注意：对于合并的每个`key`，基本上合并之后都是返回新的`value`引用对象。（方便后续比较`value`是否发生了变化）

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 *
 * 合并两个 options 选项
 *
 */
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
    // 这里是什么场景？
    child = child.options
  }

  normalizeProps(child, vm)  // 格式化 props 为对象格式
  normalizeInject(child, vm)  // 格式化 inject 为对象格式
  normalizeDirectives(child)  // 格式化 directives 为对象格式
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

如下代码所示，当合并`parent`、`child`两个`options`的时候，会先将`parent`与`child`的`extends`选项、`mixins`选项里的组件定义对象先合并。因此，最终的合并顺序如下：

1. `parent`与`child.extends`合并成新的`parent`组件选项对象
2. `parent`依次与`child.mixins`合并成新的`parent`组件选项对象
3. `parent`与`child`合并成最终的组件选项对象


### `el`、`propsData`选项 合并

（非产品环境）通过`Vue.extend`、`Vue.mixin`全局方法合并`options`的方式不能存在`el`、`propsData`选项

```js
/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config.optionMergeStrategies

/**
 * Options with restrictions
 */
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


### `data`选项 合并

```js
/**
 * Helper that recursively merges two data objects together.
 *
 * to->child，from->parent，合并策略为：
 * 1. 如果 child 不存在某个 key，则 parent 对应 key 的值为合并后值；
 * 2. 如果 child 存在 key，且 child、parent 的 key 的值不都是对象，则 child 的 key 的值为合并后的值
 * 3. 如果 child 的 key 的值和 parent 的 key 的值都为对象，则递归合并
 */
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
    // vm 不存在，即通过 Vue.extend、Vue.mixin 合并 options

    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.

    // 返回一个 data function，等真正实例化的时候再调用
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    // vm 存在，即通过 extends 选项、mixins 选项合并 options
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


### 生命周期钩子选项 合并

同一生命周期钩子合并成一数组，并且`parent`的钩子优先执行

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

/**
 * Hooks and props are merged as arrays.
 *
 * 合并成数组，且 parent 的钩子优先
 */
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


### 资源选项 合并

`component`、`directive`、`filter`等资源选项合并时，默认会让`child`里`options`的资源的每一项覆盖`parent`里`options`的资源的每一项。

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

```js
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
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


### `watch`选项 合并

同名的`watch`合并成一数组，并且`parent`的`watch`回调优先执行

```js
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
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


### `props`、`methods`、`inject`、`computed`选项合并

在`props`、`methods`、`inject`、`computed`这些选项里，如果存在同名的`key`，则`child`的`value`将覆盖`parent`的`value`

```js
/**
 * Other object hashes.
 */
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


### `provide`选项合并

```js
// mergeDataOrFn 函数，详见 data 的合并
strats.provide = mergeDataOrFn
```


### 默认合并

如果有的选项没有单独的合并方式，则采用默认的合并方式，即如果`child`的`value`存在则使用，否则使用`parent`的`value`。

```js
/**
 * Default strategy.
 *
 * 默认的合并策略，如果 childVal 存在则使用 childVal，否则使用 parentVal
 *
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}
```
