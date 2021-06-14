# watch

[[toc]]

## initWatch

组件选项对象里存在[`watch`选项](https://cn.vuejs.org/v2/api/#watch)，在组件初始化状态数据的最后，将初始化`watch`数据。

初始化`watch`就是为`watch`选项里的每一项调用`vm.$watch`方法创建一个 Watcher。

需要注意的是，`watch`的`key`对应的`value`的形式有多种：

- 函数
- 组件的方法名
- 对象，至少包含`handler`方法，可以有`depp`属性和`immediate`属性
- 数组，元素是函数

```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

## vm.$watch()

在导出`Vue`构造函数之前，会先调用`stateMixin(Vue)`为其添加一些原型方法，比如`$watch`。

```js
// src/core/instance/state.js
export function stateMixin (Vue: Class<Component>) {
  // ...
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this

    // cb 可以包含在 options 里，此处处理 $watch(expOrFn, options)的情况
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      // 立即执行回调
      cb.call(vm, watcher.value)
    }
    // 返回取消监听函数
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

通过`$watch`创建的 Watcher 实例，其`options`参数的`user`属性为`true`，以区分出是用户创建的 Watcher 还是 Vue 内部创建的 Watcher。
