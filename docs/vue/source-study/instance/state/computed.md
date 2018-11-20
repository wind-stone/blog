---
sidebarDepth: 0
---

# 计算属性

[[toc]]

初始化组件实例的状态数据时，需要对计算属性做初始化处理，包括：

- 为每一个计算属性，创建一个内部 Watcher 实例，我们称之为计算属性 Watcher
- 为每一个计算属性，往组件实例`vm`上添加同名的访问器属性，以便通过`vm`快捷访问计算属性

## 初始化计算属性

```js
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      // 创建计算属性 Watcher
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.

    // 注意此处：in 操作符将枚举出原型上的所有属性，包括继承而来的计算属性，因此针对组件特有的计算属性与继承而来的计算属性，访问方式不一样
    // 1、组件实例特有的属性：组件独有的计算属性将挂载在 vm 上
    // 2、组件继承而来的属性：组件继承而来的计算属性已挂载在 vm.constructor.prototype，详情请查看 Vue.extend 的实现
    if (!(key in vm)) {
      // 处理组件实例独有的计算属性
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // 计算属性的 key 不能存在在 data 和 prop 里
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

## 创建计算属性 Watcher

针对每一个计算属性，都会为其创建一个内部 Watcher 实例（我们称之为计算属性 Watcher），并将计算属性定义的函数或对象的`get`方法作为该 Watcher 实例的表达式。当首次获取计算属性的值时，计算 Watcher 实例将计算其表达式的值，并收集计算属性的依赖。

```js
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
```

## 访问计算属性

根据 API 我们知道，使用`vm.someComputed`可以获取到名为`someComputed`的计算属性的值，那么这是怎么实现的呢？

在为每个计算属性创建了 Watcher 之后，会在`vm`实例上添加与计算属性同名的访问器属性，在该访问器属性的描述符对象里会定义`get`和`set`，用于通过计算属性 Watcher 间接获取和设置计算属性的值。

假设计算属性的名称为`xxx`，则访问`vm.xxx`时，就会在`vm._computedWatchers`对象上获取到同名的计算属性 Watcher 的实例`vm._computedWatchers.xxx`，若该 Watcher 实例的依赖变化过，则重新计算 Watcher 实例的表达式；最后，返回 Watcher 实例的`watcher.value`。

需要注意的是，以上说的计算属性，都是组件独有的计算属性，而对于组件继承而来的计算属性实际上是通过`vm.constructor.prototype`来访问的，详情可查看`Vue.extend`的实现[Vue.extend - computed](/vue/source-study/component/extend.html#继承的-computed)。

```js
function initComputed (vm: Component, computed: Object) {
  // ...
  for (const key in computed) {
    // ...
    // 注意此处：in 操作符将枚举出原型上的所有属性，包括继承而来的计算属性，因此针对组件特有的计算属性与继承而来的计算属性，访问方式不一样
    // 1、组件实例特有的属性：组件独有的计算属性将挂载在 vm 上
    // 2、组件继承而来的属性：组件继承而来的计算属性已挂载在 vm.constructor.prototype，详情请查看 Vue.extend 的实现
    if (!(key in vm)) {
      // 处理组件实例独有的计算属性
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // ...
    }
  }
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  // 往 vm 上添加 computed 的访问器属性描述符对象
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        // 若是有依赖发生过变化，则重新求值
        watcher.evaluate()
      }
      if (Dep.target) {
        // 将该计算属性的所有依赖添加到当前 Dep.target 的依赖里
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

## 惰性求值 lazy: true

在为计算属性创建 Watcher 实例时，传入的`options.lazy`为`true`，这与一般的 Watcher 会有以下不同：

- 首次创建计算属性 Watcher 时，不立即对表达式进行求值，而是将`watcher.dirty`置为`true`，等到外部第一次获取计算属性的值时才对计算属性 Watcher 的表达式进行计算
- 计算属性 Watcher 的依赖发生变化时，计算属性 Watcher 不会立即重新计算表达式的值，而是将`watcher.dirty`置为`true`，等到外部下一次获取计算属性的值时才对表达式进行重新计算

```js
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // ...
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }
  // ...
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
      // 是否是惰性求值。若是，则只有在首次获取该 watcher 的值时才计算出结果并收集依赖；否则，立即计算出结果并收集依赖
      this.lazy = !!options.lazy
    }
    // ...
    this.dirty = this.lazy
    // ...
    // 若不是惰性 watcher，立即计算表达式的值
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   * 依赖改变时，依赖会遍历 watcher 并调用 watcher.update
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      // 若是惰性计算的 watcher，只将 dirty 标志为 true，但不重新计算表达式；等到获取 value 时，再重新计算表达式
      this.dirty = true
    } else if (this.sync) {
      // 若是同步计算，则依赖改变时，立即计算表达式
      this.run()
    } else {
      // 否则，将同一帧内的 watcher 放在一起，按 wathcer.id 排序后统一执行
      queueWatcher(this)
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
}
```

```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        // 若是有依赖发生过变化，则重新求值
        watcher.evaluate()
      }
      if (Dep.target) {
        // 将该计算属性的所有依赖添加到当前 Dep.target 的依赖里
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

## Dep.target 收集计算属性的依赖

调用`createComputedGetter`获取计算属性的值时，在计算属性的 Watcher 计算好表达式并收集好了依赖之后，会调用`watcher.depend()`，该方法的主要功能是，将计算属性 Watcher 的所有依赖添加到`Dep.target`里，这些依赖同时也将成为`Dep.target`的依赖。

```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        // 若是有依赖发生过变化，则重新求值
        watcher.evaluate()
      }
      if (Dep.target) {
        // 将该计算属性的所有依赖添加到当前 Dep.target 的依赖里
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

```js
export default class Watcher {
  // ...
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  // ...
}
```

这也就意味着，在当前`Dep.target`期间，每次获取当前计算属性的值，若计算属性的依赖有过变化，会触发计算属性 Watcher 重新计算表达式并重新收集依赖。而计算属性若是依赖`depB`、`depC`，那么当获取计算属性值时，会将`depB`、`depC`添加到`Dep.target`的依赖数组`deps`里，即`Dep.target`将计算属性的依赖变成了自己的依赖。

::: tip 提示
若在组件视图里使用到了计算属性，上述所说的`Dep.target`就是组件的渲染 Watchcer。渲染 Watchcer 会将该计算属性的依赖项变为自己的依赖项，当这些依赖项改变时，会触发渲染 Watchcer 的重新计算，进而引起视图的重新渲染。其他依赖于计算属性的 Watcher 也是如此。
:::

这里有个疑问，为什么每次获取计算属性的值时都要进行依赖收集呢，而不是仅进行一次性的依赖收集？原因是，计算属性的依赖项可能会改变，这次有`x`个依赖项，下次可能有`y`个依赖项。

## 组件实例独有的计算属性 VS 组件继承的计算属性

正如上面源码里所示，组件在初始化计算属性时，会给所有的计算属性创建对应的`watcher`，但是之后仅针对组件实例独有的计算属性提供了对外的访问接口（将其挂载在组件实例`vm`上以供访问）。

而外部如何访问那些继承而来的计算属性呢？实际上这部分在组件继承的时候就已经进行过处理，是通过挂载在`Sub.prototype`上来访问的。

```js
// src/core/global-api/extend.js
Vue.extend = function (extendOptions: Object): Function {
    // ...
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    // ...
    if (Sub.options.computed) {
      initComputed(Sub)
    }
    // ...
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    // 经此处理后，访问 Comp 实例的计算属性 key，会顺着原型链查找到 Comp.prototype，
    // 最终访问的是实例的 this._computedWatchers[key].value
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```

针对组件继承而来的计算属性，在继承时，就已经将对这些计算属性的访问挂载到`Sub.prototype`上。

因此在访问继承的计算属性时，在组件实例`vm`上会找不到，沿着原型链，最终会在`vm.prototype`上找到继承的计算属性。

## 释疑

### 为什么访问计算属性时，要实时计算？

我们发现，`props`添加到`vm`上的访问器属性的`getter`，是直接获取`this._props[key]`的值，但是计算属性添加到`vm`上的访问器属性的`getter`里返回的却是`createComputedGetter(key)`的结果，这是为什么呢？

计算属性是惰性求值的，即使计算属性的依赖发生变化了，也不会立即对计算属性 Watcher 的表达式进行重新计算，只有当下一次获取计算属性的值时，才会去判断计算属性 Watcher 是否需要重新计算表达式，需要的话就重新计算，不需要的话就返回之前计算的值。因此必须在每一次获取计算属性的值时，实时判断计算属性的 Watcher 是否需要重新计算。
