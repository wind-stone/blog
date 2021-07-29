# Vue 3.x

## 源码学习进度

### 响应式原理 reactivity

- `reactive`: 为对象、数组、`Set`/`WeakSet`、`Map`/`WeakMap`等做响应式转换，而不会对 Date、RegExp、Function 等做响应式处理
  - 源码位置: `packages/reactivity/src/reactive.ts`
  - 其他方法
    - `isReactive()`
    - `isReadonly()`
    - `isProxy()`
    - `toRaw()`：递归地获取代理对象`observed`的原始对象
    - `markRaw(value)`：标记`value`为跳转响应式转换，以后即使调用`reactive(value)`等操作返回的还是`value`本身
    - baseHandlers.ts: 对象/数组做代理时使用的处理器对象
- `ref(val)`: 将`val`转换为 Ref 对象，`val`可以是对象或代理对象
  - 源码位置: `packages/reactivity/src/ref.ts`
  - `shallowRef()`
  - `isRef()`
  - `unref()`: 获取 Ref 对象的原始值
  - `toRef(obj, key)`: 将对象的单个`key`转为 ObjectRef 对象（类似于 Ref 对象），解决因提前触发值的`get`方法（比如解构赋值、扩展运算符）导致的响应式丢失问题
  - `toRefs()`: 遍历对象的每一个`key`调用`toRef`
  - `triggerRef()`: 手动触发依赖`ref`的`effect`重新运行
  - `customRef`: 自定义`ref`的`get`/`set`函数
  - 【TODO】`proxyRefs`
- 【done】effect.ts
  - `effect()`
  - `track()`
  - `trigger()`
- `computed`方法
  - 源码位置: `packages/reactivity/src/computed.ts`
  - `computed`具有双重角色，自身既作为`ReactiveEffect`依赖外部的依赖项，也作为`ComputedRef`（类似于`ref`，专用于计算属性）成为外部`ReactiveEffect`的依赖项
  - `computed`的计算是惰性的，即:
    - 首次声明`computed()`时不会对传入的`getter`进行计算
    - 若只声明了`computed`但没有获取`computed`的值，当`computed`的依赖项改变时，`computed`不会进行计算新值，只会标记当前的计算值为`dirty`

以上这些内容位于`vue-next/packages/reactivity`目录下，会单独发包为`@vue/reactivity`，可独立于 Vue 3 使用。

#### 响应式的计算和侦听

- `watchEffect`/`watch`方法
  - 源码位置: `packages/runtime-core/src/apiWatch.ts`
  - `watchEffect`方法
    - 第一个参数只能是函数
    - 立即执行传入的函数`fn`，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数`fn`
  - `watch`
    - 第一个参数可以是：
      - `getter`函数
      - `ref`对象
      - 响应式对象
      - 以上这些组成的数组
    - 与`watchEffect`比较，`watch`允许我们：
      - 懒执行副作用；
      - 更具体地说明什么状态应该触发侦听器重新运行；
      - 访问侦听状态变化前后的值。

以上这些内容是 Vue 3 基于`@vue/reactivity`的封装，只在 Vue 3 内部使用。

### runtime-core

#### watchEffect/watch

- `watchEffect`/`watch`
  - 首次都会运行一次
  - 调用`watchEffect()`的返回值`stop`，可以停止副作用，且将该`watcher`从当前 Vue 实例`instance.effects`数组里移除
- `watchEffect(effect, options?)`
- `watch(source, callback, options?)`
  - 当`source`的依赖项改变导致`source`重新计算后，则满足以下条件之一，回调函数`callback`会运行
    - 第一个参数是`ref`，或是`reactive`的对象，或是指定了`deep: true`
    - 通过第一个参数获取的值改变了

#### 为什么解构赋值、扩展运算符等会造成响应式丢失

```js
const obj = reactive({ foo: 1 }) // obj 是响应式数据
const obj2 = { foo: obj.foo }

effect(() => {
  console.log(obj2.foo) // 这里读取 obj2.foo
})

obj.foo = 2  // 设置 obj.foo 显然无效
```

第`2`行获取`obj.foo`时会触发`obj.foo`的`get`函数进行依赖收集，但是此时`activeEffect`为空，这导致`obj.foo`没有被任何的`effect`所依赖，且赋值结束后，`obj2`的值为`{ foo: 1 }`，`obj.foo`的值是原始值，而不是响应式的，因此在`effect()`函数执行时不会将`obj.foo`收集为依赖项，因此最后一行给`obj.foo`赋值时不会触发`effect()`的重新计算。

解构赋值、扩展运算符也是同理，都是先将值获取到再赋值给变量，而这个过程中`activeEffect`都为空，不会进行依赖收集，而赋值后的变量不是响应式的。

## 参考文档

- [Vue3 的响应式和以前有什么区别，Proxy 无敌？](https://juejin.cn/post/6844904122479542285)
- [深入理解 Vue3 Reactivity API](https://zhuanlan.zhihu.com/p/146097763)
