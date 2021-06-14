# data

[[toc]]

组件实例化的过程中，会在`vm._init`里调用`initState()`对组件实例上的状态数据进行初始化，而`initState()`里的第三项就是初始化`data`数据，处于`initMethods`、`initProps`之后。

## initData

初始化`data`主要做了这么几件事：

1. 获取`data`最终的值
2. 检查`data`子属性的`key`是否与`props`和`methods`冲突
3. 将对`data`数据的访问代理到`vm`实例上（详见[状态数据 - proxy](/vue/source-study/instance/state/#proxy)）
4. 将`data`处理成响应式对象（详见[响应式原理 - observe](/vue/source-study/observer/#observe)）

获取`data`的值，是因为`data`可能是函数，执行函数并返回最终值。而在执行`data`工厂函数的时候，函数内的`this`将指向`vm`，且在此之前`props`和`methods`都已经初始化，这也就意味着，在`data`里是完全可以访问`props`的，也可能可以访问`methods`（因为`methods`里可能涉及到其他`data`，所以有风险，最好不要这么做）。

此外，当`data`为工厂函数时，在执行工厂函数期间，要禁用依赖收集功能，防止`props`再一次作为父组件渲染 Watcher 的依赖，详情可以查看[vue Issue #7573](https://github.com/vuejs/vue/issues/7573)。

初始化`data`数据是在初始化`props`和`methods`之后，因此需要检测`data`子属性的`key`，防止其与`props`和`methods`的`key`重复。

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 把对 data 里的数据的访问代理到 vm 上
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}

/**
 * 执行 data 工厂函数，返回结果
 * @param {*} data data 工厂函数
 * @param {*} vm vm 实例
 */
export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  // 设置当前的 Dep.target 为 undefined，即不做依赖收集
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```
