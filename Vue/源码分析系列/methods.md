# methods 源码学习及收获

Vue.js 版本：2.5.13

## 分析

创建 Vue 实例/组件实例时，需要对`methods`做出简单的处理，包括：

- （非 production 环境下）对各个方法进行校验
    - 方法的`value`不能为`null`/`undefined`
    - 方法的`key`不能与`props`里的`key`冲突
    - 方法的`key`不能与已有的 Vue 实例方法名冲突
- 将方法内的`this`绑定到`vm`上
- 将方法挂载到`vm`上，以更加方便的引用


## 源码

### src/core/instance/state.js

```js
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          `Method "${key}" has an undefined value in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
```


### src/shared/util.js

```js
/**
 * Simple bind, faster than native
 */
export function bind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l: number = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length
  return boundFn
}
```
