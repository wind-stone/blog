---
sidebarDepth: 0
---

# 概览

[[toc]]

## 名词解释

### 组件占位 VNode 与 组件渲染 VNode

```html
<section class="nav-ctn">
  <AppNav></AppNav>
</section>
```

`AppNav`组件的定义：

```html
<template>
  <div class="app-nav">
    <!-- ... -->
  </div>
</tempalte>
<script>
  export default {
    name: 'AppNav',
    // ...
  }
</script>
```

#### 组件占位 VNode

为组件标签创建的 VNode 节点，如上的组件标签为`AppNav`的组件，为该组件创建的组件占位 VNode 的`vnode.tag`为`vue-compoment-${递增的 cid}-AppNav`，该 VNode 在最终创建的 DOM Tree 并不会存在一个 DOM 节点与之一一对应，即它只出现在 VNode Tree 里，但不出现在 DOM Tree 里。

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    // vnode.componentOptions
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  // ...
}
```

#### 组件渲染 VNode

“组件渲染 VNode”是我为该系列的源码分析文章创建的用词，因为在 Vue 官方文档里找不到对应的用词。

针对用户手动编写的`render`函数来说，组件渲染 VNode 就是`render`函数返回的 VNode。

针对于有模板且还未编译的组件来说，组件渲染 VNode 指的是为模板的根节点创建的 VNode，在`app-nav`组件里，组件的渲染 VNode 就是为模板的根节点`.app-nav`节点创建的 VNode，其`vnode.tag`为`div`。而事实上，组件的模板最终将编译为`render`函数，`render`函数返回的就是为模板根节点创建的 VNode。

### 连续嵌套组件

连续嵌套组件，指的是父组件的模板的根节点是子组件，下面以连续的两个嵌套组件来说明。（子组件的模板的根节点还可以是孙组件，这样就是连续三个嵌套组件，以此类推）

父组件的定义：

```html
<template>
  <Child></Child>
</tamplate>
<script>
  import Child from './Child.vue'
  export default {
    name: 'Parent',
    components: {
      Child
    }
    // ...
  }
</script>
```

子组件的定义：

```html
<template>
  <div class="child-root">
    <!-- 其他子节点 -->
  </div>
</tamplate>
<script>
  export default {
    name: 'Child',
    // ...
  }
</script>
```

针对这种情况，最终生成的 VNode Tree 大概是这样的（以 Vnode 的`tag`来表示 Vnode 节点）：

```js
- vue-component-${cid}-Parent
    - vue-component-${cid}-Child
        - div.child-root
```

假设这样调用`Parent`组件：

```html
<div class="ctn">
  <Parent></Parent>
</div>
```

最终`Parent`插入到文档之后：

```html
<div class="ctn">
  <div class="child-root">
    <!-- 其他子节点 -->
  </div>
</div>
```

## 数据来源及关系梳理

### vm.$options.parent、vm.$parent、vnode.parent

#### vm.$options.parent

`vm.$options.parent`是子组件渲染时执行`vm.__patch__`时当前活跃的组件实例，也就是子组件实例的父组件实例

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  activeInstance = vm
  vm._vnode = vnode
  if (!prevVnode) {
    // 首次渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // 数据更新
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  activeInstance = prevActiveInstance
}
```

```js
import { activeInstance } from '../instance/lifecycle'
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      // ...
    ) {
      // ...
    } else {
      // 创建子组件
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      // ...
    }
  }
}
```

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // ...
  return new vnode.componentOptions.Ctor(options)
}
```

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // ...
  vm._isVue = true
  if (options && options._isComponent) {
    initInternalComponent(vm, options)
  }
  // ...
}
```

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  // ...
}
```

#### vm.$parent

`vm.$parent`是组件实例的第一个非抽象的父组件实例

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options
  // 注意：keep-alive 组件和 transition 组件是 abstract 的
  // 初始化组件的 $options 时，vm.$options.parent 已经指向父组件
  // 此处将组件加入到第一个非抽象父组件的 $children 里
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  // 第一个非抽象父组件
  vm.$parent = parent
}
```

#### vnode.parent

其中`vnode`是组件实例通过`_render`生成的渲染 VNode，而`vnode.parent`是指组件占位 VNode

```js
export function renderMixin (Vue: Class<Component>) {
  // ...
  /**
   * 调用 vm.$options.render() 生成 VNode 节点
   */
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // 若是组件实例，则会存在 _parentVnode
    const { render, _parentVnode } = vm.$options
    // ...
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      // ...
    }
    // ...
    // set parent
    // _parentVnode 是组件实例的组件占位 VNode
    vnode.parent = _parentVnode
    return vnode
  }
}
```

::: tip 提示
只有组件的渲染 VNode 才有`vnode.parent`属性哦！
:::

### vm._vnode、vm.$vnode

`vm._vnode.parent === vm.$vnode`

#### vm._vnode

`vm._vnode`是组件实例经过`vm._render()`创建的渲染 Vnode。

```js
export function mountComponent (
  // ...
) {
  if (...) {
    // ...
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
}
```

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  activeInstance = vm
  vm._vnode = vnode
  // ...
}
```

#### vm.$vnode

`vm.$vnode`是子组件的属性，指向子组件的占位 Vnode；而根组件的`vm.$vnode`一直为`undefined`。

- 子组件在调用`_init`初始化时，会调用`initRender`，此时会首次添加`vm.$vnode`，指向子组件的组件占位 VNode。

```js
export function initRender (vm: Component) {
  // ...
  const options = vm.$options
  // options._parentVnode 是子组件的组件占位 VNode，因此根组件不存在
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  // ...
}
```

- 子组件在调用`_render`时，也会更新`vm.$vnode`，指向子组件的组件占位 VNode。

```js
export function renderMixin (Vue: Class<Component>) {
  // ...
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // 若是组件实例，则会存在 _parentVnode
    const { render, _parentVnode } = vm.$options
    // ...

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    }
    // ...
  }
}
```

- 子组件在组件更新时，也会再次更新`vm.$vnode`

```js
const componentVNodeHooks = {
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  }
}
```

```js
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  // ...
  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  // ...
}
```

## 释疑

### 模板里使用了 vm 上不存在的方法或属性时的报错，是如何实现的？

非开发环境下，执行`render`函数时第一个参数传入的是`vm._renderProxy`而不是`vm`，`vm._renderProxy`是对`vm`的代理，其内实现了报错逻辑。

TODO: 待完成一篇详细的分析文章
