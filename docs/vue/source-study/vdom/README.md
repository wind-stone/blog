---
sidebarDepth: 0
---

# VNode

[[toc]]

## 组件的 Vnode 与 HTML 元素的 Vnode

- 创建 HMTL 元素的 Vnode 节点

```js
export function _createElement (
  // ...
) {
  // ...

  if (typeof tag === 'string') {
    // tag 为标签字符串：1、平台内置元素标签名称；2、局部注册的组件名称
    if (config.isReservedTag(tag)) {
      // 字符串类型一：平台内置元素标签（字符串），web 平台下包括 HTML 标签和 SVG 标签
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 字符串类型二：局部注册的组件名称（包括继承、混合而来的）
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  }

  // ...
}
```

- 创建组件的 Vnode 节点

```js
export function createComponent (
  // ...
) {
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

由此可见，创建 HTML 元素的 Vnode 节点时，会传入`children`作为 Vnode 的子 Vnode；但是创建组件实例的 Vnode 节点时，却不会传入`children`，组件会创建整个`render`函数或者模板的 DOM Tree。

## Vnode Tree & DOM Tree

针对`render`函数生成的 Vnode Tree（还没有实例化为真正的 DOM Tree），我们来大概描述下它的结构。

`ParentComponent.vue`定义如下，模板里的根节点就是`ChildComponent`：

```html
<template>
    <child-component></child-component>
</template>

<script>
    import ChildComponent from './child-component'
    export default {
        name: 'ParentComponent'
        components: {
            ChildComponent
        }
    }
</script>
```

`ChildComponent.vue`定义如下：

```html
<template>
    <div class="child-root">Hello World!</div>
</template>

<script>
    import ChildComponent from './child-component'
    export default {
        name: 'ChildComponent'
        components: {
            ChildComponent
        }
    }
</script>
```

`main.js`的定义如下：

```js
new Vue({
    el: '#app',
    template: '<ParentComponent/>',
    components: { ParentComponent }
});
```

`index.html`：

```html
<body>
    <div id="app"></div>
</body>
```

如此，我们最终生成的 Vnode Tree 大概是这样的（以 Vnode 的`tag`来表示 Vnode 节点）：

```js
- vue-component-${cid}-ParentComponent
    - vue-component-${cid}-ChildComponent
        - div.child-root
```

最终的 DOM Tree：

```html
<body>
    <div class="child-root">Hello World!</div>
</body>
```

### 数据来源及关系梳理

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

其中`vnode`是组件实例通过`_render`生成的 VNode 节点，而`vnode.parent`是指组件占位 VNode

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

`vm.$vnode`是组件占位 Vnode

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
