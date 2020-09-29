# Vue 3.x

## 源码学习进度

### 响应式原理 reactivity

- reactive.ts
  - 常规 Object、Array 的`reactive()`/`readonly()`/`shallowReactive()`
    - `get`
    - `set`
    - `deleteProperty`
    - `has`
    - `ownKeys`
  - `isReactive()`
  - `isReadonly()`
  - `isProxy()`
  - `toRaw()`：递归地获取代理对象`observed`的目标对象
  - `markRaw()`：标记`value`是非代理对象
  - 【TODO】Map、Set、WeakMap、WeakSet
- 【done】baseHandlers.ts
- 【done】effect.ts
  - `effect()`
  - `track()`
  - `trigger()`
- 【done】ref.ts
  - `ref()`
  - `shallowRef()`
  - `isRef()`
  - `unref()`: 获取`ref`的原始值
  - `toRef()`: 解决因提前触发值的`get`方法（比如解构赋值、扩展运算符）导致的响应式丢失问题
  - `toRefs()`: 基于`toRef()`的封装，处理整个对象
  - `triggerRef()`: 手动触发依赖`ref`的`effect`重新运行
  - `customRef`: 自定义`ref`的`get`/`set`函数
  - 【TODO】`proxyRefs`
- 【done】computed.ts
  - `computed()`是基于`effect()`的封装，不同点有
    - 首次声明`computed()`时不进行计算
    - 即使`computed`的依赖项发生了变化也不立即重新计算，而是在外部再次获取`computed`时才重新计算
    - `computed`具有双重角色，既能成为别的`effect`的依赖项，也能自己作为`effect`依赖外部的依赖项

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
