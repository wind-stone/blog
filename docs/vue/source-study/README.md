---
sidebarDepth: 0
---

# General

[[toc]]

## 待学习/梳理的内容

- 模板方法的实现
- slot 的实现
- vue create API
- 函数式组件与常规组件的区别
- v-model 实现

## Vue 版本

该源码学习系列文章，都是基于 Vue.js 2.5.16 版本

## 名词解释

### 组件选项对象

```js
const options = {
  el: '...',
  props: '...',
  data: '...',
  computed: {
    // ...
  },
  created: () = {}
  // ...
}
```

## 数据来源及关系梳理

### vm.$options.parent、vm.$parent

- `vm.$options.parent`是子组件渲染时执行`vm.__patch__`时当前活跃的组件实例，也就是子组件实例的父组件实例

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

- `vm.$parent`是组件实例的第一个非抽象的父组件实例

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

### vm._vnode、vm.$vnode

- `vm._vnode`是组件实例经过`vm._render()`创建的渲染 Vnode。

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

- `vm.$vnode`是组件占位父 Vnode

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

- `vm._vnode.parent === vm.$vnode`
