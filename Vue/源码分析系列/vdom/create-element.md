# create-element 源码学习及收获

`_createElement`函数用于生成`VNode`类型的元素，同时调用`normalizeChildren`/`simpleNormalizeChildren`保证其子元素也都是`VNode`类型。

## 分析

### `createElement`函数的第一个参数

`render`函数里，`createElement`函数的第一个参数可以是 HTML 标签字符串、组件选项对象，或者是返回值类型为 String/Object 的函数。那么针对各个类型的参数，是如何处理的呢？

#### HTML 标签字符串

- 平台内置元素：解析平台标签后，创建 vnode 节点
- 通过选项`components`局部定义的标签：获取该标签对应的组件选项对象，调用`createComponent`创建 vnode
- 正常 HTML 标签：创建正常的 vnode 节点

#### 组件选项对象/返回值类型为 String/Object 的函数

调用`createComponent`创建 vnode，详见`./create-component.md`


## 源码

```js
/* @flow */

import config from '../config'
import VNode, { createEmptyVNode } from './vnode'
import { createComponent } from './create-component'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isPrimitive,
  resolveAsset
} from '../util/index'

import {
  normalizeChildren,
  simpleNormalizeChildren
} from './helpers/index'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
// createElement 是对 _createElement 进行了包装，以及标准化所有的参数
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode {
  if (isDef(data) && isDef((data: any).__ob__)) {
    // 这里影响显示效果，暂先注释
    // process.env.NODE_ENV !== 'production' && warn(
    //   `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
    //   'Always create fresh vnode data objects in each render!',
    //   context
    // )
    return createEmptyVNode()
  }
  // 适用于以下两种情况：
  // 1、动态组件：<component :is="xxx"></component>
  // 2、DOM 模板解析：<table><tr is="my-row"></tr></table>
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 经过标准化处理后， children 为 VNode 类型的数组
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    // tag 为 HTML 标签字符串

    let Ctor
    // 此时 context.$vnode 为 parentVnode，即先使用 parentVnode 的 ns
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // 局部注册的组件（包括继承、混合而来的）
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
  } else {
    // tag 为 组件选项对象，或者一个返回值类型为 String/Object 的函数
    vnode = createComponent(tag, data, context, children)
  }
  if (isDef(vnode)) {
    if (ns) applyNS(vnode, ns)
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined
    force = true
  }
  if (isDef(vnode.children)) {
    for (let i = 0, l = vnode.children.length; i < l; i++) {
      const child = vnode.children[i]
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force)
      }
    }
  }
}
```
