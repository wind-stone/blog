# Vue 面试题

## V2 和 V3 的对比

V2 面临的问题：

- 随着功能的增长，复杂组件的代码变得越来越难以维护
- 缺少一种比较「干净」的在多个组件之间提取和复用逻辑的机制
- 类型推断不够友好
- bundle 的时间太久了

Vue3 的设计目标：

- 更小
  - 移除一些不常用的 API
  - 引入`tree-shaking`，可以将无用模块“剪辑”，仅打包需要的，使打包的整体体积变小了
- 更快
  - diff 算法优化
  - 静态提升
  - 事件监听缓存
  - SSR 优化
- 更友好
  - composition API，增加代码的**逻辑组织**和**代码复用**能力
- TypeScript 支持
- API 设计一致性
- 提高自身的可维护性
- 开放更多底层功能

### 性能

Vue3 的优化

- 体积优化
- 编译优化
  - diff 算法优化
  - 静态提升
  - 事件监听缓存
  - SSR 优化
- 数据劫持优化

#### 体积优化

Vue3 整体体积变小了。

- 移除了一些不常用的 API
- Tree shaking。任何一个函数，如`ref`、`reactive`、`computed`等，仅仅在用到的时候才打包，没用到的模块都被摇掉，打包的整体体积变小

#### 编译优化

试想一下，一个组件结构如下图

```vue
<template>
    <div id="content">
        <p class="text">静态文本</p>
        <p class="text">静态文本</p>
        <p class="text">{{ message }}</p>
        <p class="text">静态文本</p>
        ...
        <p class="text">静态文本</p>
    </div>
</template>
```

可以看到，组件内部只有一个动态节点，剩余一堆都是静态节点，所以这里很多 diff 和遍历其实都是不需要的，造成性能浪费

因此，Vue3 在编译阶段，做了进一步优化。主要有如下：

- diff 算法优化
- 静态提升
- 事件监听缓存
- SSR 优化

##### diff 算法优化

Vue3 在 diff 算法中相比 Vue2 增加了静态标记。

关于这个静态标记，其作用是为了在会发生变化的地方添加一个 flag 标记，下次发生变化的时候直接找该地方进行比较。

针对已经标记静态节点的标签，在 diff 过程中不会比较，把性能进一步提升。

关于静态类型枚举如下：

```js
export const enum PatchFlags {
  TEXT = 1,// 动态的文本节点
  CLASS = 1 << 1,  // 2 动态的 class
  STYLE = 1 << 2,  // 4 动态的 style
  PROPS = 1 << 3,  // 8 动态属性，不包括类名和样式
  FULL_PROPS = 1 << 4,  // 16 动态 key，当 key 变化时需要完整的 diff 算法做比较
  HYDRATE_EVENTS = 1 << 5,  // 32 表示带有事件监听器的节点
  STABLE_FRAGMENT = 1 << 6,   // 64 一个不会改变子节点顺序的 Fragment
  KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9,   // 512
  DYNAMIC_SLOTS = 1 << 10,  // 动态 solt
  HOISTED = -1,  // 特殊标志是负整数表示永远不会用作 diff
  BAIL = -2 // 一个特殊的标志，指代差异算法
}
```

##### 静态提升

Vue3 中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用。

这样就免去了重复的创建节点，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用。

```vue
<span>你好</span>

<div>{{ message }}</div>
```

没有做静态提升之前：每一次`render`都会去创建`span`的 VNode。

```js
export function render(_ctx,_cache, $props, $setup, $data, $options) {
  return (_openBlock(),_createBlock(_Fragment, null, [
    _createVNode("span", null, "你好"),
    _createVNode("div", null,_toDisplayString(_ctx.message), 1 /*TEXT */)
  ], 64 /* STABLE_FRAGMENT*/))
}
```

做了静态提升之后：`span`的 VNode 只会创建一次。

```js
const _hoisted_1 = /*#**PURE***/_createVNode("span", null, "你好", -1 /*HOISTED*/)

export function render(_ctx,_cache, $props, $setup, $data, $options) {
  return (_openBlock(),_createBlock(_Fragment, null, [
    _hoisted_1,
    _createVNode("div", null, _toDisplayString(_ctx.message), 1 /*TEXT */)
  ], 64 /* STABLE_FRAGMENT*/))
}
```

静态内容`_hoisted_1`被放置在`render`函数外，每次渲染的时候只要取`_hoisted_1`即可

同时`_hoisted_1`被打上了 PatchFlag ，静态标记值为 -1 ，特殊标志是负整数表示永远不会用于 diff。

##### 事件监听优化、SSR 优化

详见参考文档。

#### 数据劫持优化

在 Vue2 中，数据劫持是通过 Object.defineProperty 实现的，这个 API 有一些缺陷，并不能检测对象属性的新增和删除。

```js
Object.defineProperty(data, 'a',{
    get(){
        // track
    },
    set(){
        // trigger
    }
})
```

尽管 Vue2 为了解决这个问题提供了`$set` 和`$delete`实例方法，但是对于用户来说，还是增加了一定的心智负担。

同时在面对嵌套层级比较深的情况下，Vue2 需要在初始响应式处理时就要深度遍历所有属性（即使嵌套的子孙节点可能未使用到），如此就存在性能问题。

```js
default {
    data: {
        a: {
            b: {
                c: {
                    d: 1
                }
            }
        }
    }
}
```

相比之下，Vue3 是通过 Proxy 监听整个对象，那么对于删除还是监听当然也能监听到。

同时 Proxy 并不能监听到内部深层次的对象变化，而 Vue3 的处理方式是在`getter`中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归。

更多关于 Vue2/3 响应式的对比，可以查看：

- [数组的响应式限制](/vue/source-study/observer/array-observe-limit)
- [Vue 2 和 Vue 3 响应式使用的差异](/vue/vue3/reactivity/use-difference)

### 语法 API

主要是指 Composition API，有两大显著优化：

- 优化逻辑组织
- 优化逻辑复用（Vue2 的`mixin`存在两个明显的问题：命名冲突和数据来源不清晰。）

### 源码管理

第一点：Vue3 源码采用 monorepo 的方式维护，根据功能将不同的模块拆分到 packages 目录下的不同子目录里。

这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也更加明确，开发人员也更容易阅读、理解和更改所有模块源码，提高代码的可维护性

另外一些 package（比如 reactivity 响应式库）是可以独立于 Vue 使用的，这样用户如果只想使用 Vue3 的响应式能力，可以单独依赖这个响应式库而不用去依赖整个 Vue。

第二点：Vue3 是基于 TypeScript 编写的，提供了更好的类型检查，能支持复杂的类型推导。

### 参考文档

- [面试官：Vue3.0的设计目标是什么？做了哪些优化? #45](https://github.com/febobo/web-interview/issues/45)
- [面试官：Vue3.0 性能提升主要是通过哪几方面体现的？ #46](https://github.com/febobo/web-interview/issues/46)
