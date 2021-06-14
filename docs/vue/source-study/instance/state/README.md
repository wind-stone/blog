# 状态数据初始化

目录

[[toc]]

该章节要解答的疑惑有：

- 为什么通过`vm.xxx`可以访问到`props`和`data`数据？

## initState

组件实例化的过程中，会在`vm._init`里调用`initState()`对组件实例上的状态数据进行初始化，包括：

- [props](/vue/source-study/instance/state/props.html)
- [methods](/vue/source-study/instance/state/methods.html)
- [data](/vue/source-study/instance/state/data.html)
- [computed](/vue/source-study/instance/state/computed.html)
- [watch](/vue/source-study/instance/state/watch.html)

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

## proxy

无论是组件的`props`数据还是`data`数据，最终都可以在组件实例`vm`上访问到，因为在`initProps`和`initData`时都调用了`proxy`将`vm._props`和`vm._data`上的数据都代理到了`vm`上。

```js
// initProps 里
proxy(vm, `_props`, key)

// initData 里
proxy(vm, `_data`, key)
```

其实`proxy`的实现特别简单，就是通过`Object.defineProperty`在`vm`上新增加了一属性，属性访问器描述符的`get`特性就是获取`vm._props[key]`（以`props`为例）的值并返回，属性的访问器描述符的`set`特性就是设置`vm._props[key]`的值。

因此，我们最终在访问`props`时，对`vm.xxx`的读写实际上就是对`vm._props.xxx`的读写。`data`也是同理。

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

`computed`也是经过类似的处理，只是`get`和`set`不一样而已。
