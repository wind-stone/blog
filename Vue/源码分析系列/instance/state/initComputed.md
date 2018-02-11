# initComputed 源码学习及收获

Vue.js 版本：2.5.13

## 分析

创建 Vue 实例/组件实例时，需要对`computed`计算属性做出处理，包括：

- 针对`computed`计算属性里的每个`key`，创建一个内部`watcher`
- 将`computed`计算属性里的每个`key`挂载到`vm`上，以便通过`vm`直接访问计算属性
    - 设置计算属性的`get`、`set`
    - 将计算属性的`key`/`value`通过`Object.defineProperty`挂载到`vm`上


注意事项
- 计算属性具有双重身份，即自身可能作为`dep`被依赖，也可能依赖其他`dep`。假设 A 依赖了当前的计算属性 B，而当前的计算属性 B 依赖了 C、D，则
    - 在获取计算属性 B 的值的过程中，计算属性将作为订阅者`watcher`，完成自身的求值之后，收集依赖
    - 当计算属性的依赖 C 或 D 改变时，计算属性仅仅是设置其对应的`watcher`实例的`lazy`属性为`true`，而其自身的值不会重新进行计算，只有当外部重新调用了计算属性才会重新计算值（因为计算属性是惰性计算的）
    - 每次获取计算属性的值以后，都会将 B 的依赖 C、D 添加为 A 的依赖（之所以是每次计算都这么做，是因为 B 的依赖可能会变）
    - 因此，每次 C、D 改变不会导致计算属性 B 的值改变（这就是为什么计算属性是 lazy 的），但是会通知 A 进行重新计算
- 如果是通过`Vue.extend(options)`扩展而来的构造函数如`SubVue`，如果`options`里有`computed`选项，则这些计算属性的访问将通过`SubVue.prototype`访问，仅有组件独有的计算属性是通过`vm`直接访问的。`props`也是如此，详情请参考`Vue.extend`的实现及`initProps`的分析文档。


## 源码

```js
// @file src/core/instance/state.js

// 默认设置计算属性是
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

    // 注意此处，in 操作符枚举出原型上的所有属性，所以这里只会把组件独有的计算属性的访问挂载在 vm 上，而共有的计算属性会自动通过 vm.constructor.prototype 访问，详情请查看 Vue.extend 的实现
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
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
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        // 计算属性只有在它的相关依赖发生改变时才会重新求值
        // （因为初始化 watcher 时将 dirty 置为 true，因此首次获取计算属性的值也会进行求值）
        watcher.evaluate()
      }
      if (Dep.target) {
        // 假设 A 依赖了当前的计算属性 B，而当前的计算属性 B 依赖了 C、D，这里则是将 C、D 添加为 A 的依赖
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```