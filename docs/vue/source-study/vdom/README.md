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

## 释疑

### 模板里使用了 vm 上不存在的方法或属性时的报错，是如何实现的？

非开发环境下，执行`render`函数时第一个参数传入的是`vm._renderProxy`而不是`vm`，`vm._renderProxy`是对`vm`的代理，其内实现了报错逻辑。

TODO: 待完成一篇详细的分析文章
