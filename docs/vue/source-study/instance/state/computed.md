---
sidebarDepth: 0
---

# 计算属性

[[toc]]

## initComputed

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

### 计算属性挂载到 vm 上便捷访问

在为每个计算属性创建了 Watcher 之后，会在`vm`实例上添加与计算属性同名的访问器属性，在该访问器属性的描述符对象里会定义`get`和`set`，用于通过计算属性的 Watcher 间接获取和设置计算属性的值。

假设计算属性的名称为`xxx`，则访问`vm.xxx`时，就会在`vm._computedWatchers`对象上获取到同名的 Watcher 实例`vm._computedWatchers.xxx`，若该 Watcher 实例的依赖变化过，则重新计算 Watcher 实例的表达式；最后，返回 Watcher 实例的`watcher.value`。

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

## 释疑

### Dep.target 通过计算属性收集依赖

由上面的计算属性的源码里可以看出，在获取计算属性的值时，会调用`watcher.depend()`，该方法的作用是，将当前计算属性所对应的`watcher`的所有依赖添加到`Dep.target`里。

这也就意味着，当前`Dep.target`（可能是某个`watcher`，姑且称为`curWatcher`） 在计算表达式的值时，要获取当前计算属性`curComputed`的值，而当前计算属性`curComputed`依赖`depB`、`depC`，那么当`curWatcher`获取当前计算属性`curComputed`的值时，会将`depB`、`depC`添加到`curWatcher`的依赖数组`deps`里，即`curWatcher`将`curComputed`的依赖变成了自己的依赖，从而完成了部分的依赖收集工作。

由此可以发现，事实上，此处的`curComputed`并不是充当着`watcher`和`dep`的双重角色，仅仅是`watcher`的角色。

这里有个疑问，为什么每次获取计算属性的值时都要进行依赖收集呢，而不是仅进行一次性的依赖收集？原因是，计算属性的依赖项可能会改变，这次有`x`个依赖项，下次可能有`y`个依赖项。

### 计算属性的惰性求值 lazy: true

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
    // 若不是惰性 watcher，立即计算表达式的值
    this.value = this.lazy
      ? undefined
      : this.get()
  }
}
```

在为计算属性创建`watcher`时，传入的`options.lazy`为`true`，与一般的`watcher`会有以下不同：

- 首次创建计算属性的`watcher`时，不对表达式进行求值，而是将`dirty`置为`true`，等到外部第一次获取计算属性的值时才计算表达式的值
- 计算属性`watcher`的依赖项发生变化时，`watcher`不会立即重新计算表达式的值，而是将`dirty`置为`true`，等到外部下一次获取计算属性的值时才计算表达式的值

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

### 组件实例独有的计算属性 VS 组件继承的计算属性

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
