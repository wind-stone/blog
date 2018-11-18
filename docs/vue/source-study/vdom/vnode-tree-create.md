---
sidebarDepth: 0
---

# 创建 VNode Tree

[[toc]]

[创建组件实例](/vue/source-study/instance/create.html)时，会先初始化组件数据，之后创建渲染 Watcher。在计算渲染 Watcher 的表达式时，并将通过`vm._render()`创建 VNode Tree（VNode Tree 的根节点即为组件占位 VNode），以便之后用于给`vm._update`生成 DOM Tree。

## Vue.prototype._render

组件选项对象里，存在两种方式定义组件的视图：

- 基于 HTML 的模板形式，即`template`选项
- 使用 JavaScript 完全编程的`render`函数形式

而`template`形式的模板最终也将转换成`render`函数的形式，不管是通过 Vue.js 完整版本里的编译器还是 Webpack 里的`vue-loader`。而`Vue.prototype._render`方法的功能就是，执行`render`函数并返回组件的 VNode Tree。

```js
// src/core/instance/render.js

export function renderMixin (Vue: Class<Component>) {
  // ...
  /**
   * 调用 vm.$options.render() 生成 VNode 节点
   */
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // 若是组件实例，则会存在 _parentVnode
    const { render, _parentVnode } = vm.$options

    // reset _rendered flag on slots for duplicate slot check
    if (process.env.NODE_ENV !== 'production') {
      for (const key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          } catch (e) {
            handleError(e, vm, `renderError`)
            vnode = vm._vnode
          }
        } else {
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
  // ...
}
```

调用`render`函数时，会将`vm`作为第一个参数传入（非生产环境会传入`vm._renderProxy`，其是对`vm`的代理，以便在获取不到`vm`上的方法/属性且该方法/属性不是`window`上的全局方法/属性时进行报错）作为函数内绑定的`this`，而`vm.$createElement`作为第二个参数。通过调用`vm.$createElement`返回的就是 VNode 节点。

## createElement：创建节点的 VNode

`vm.$createElement`是在`_init()`是通过调用`initRender`添加的，其功能是创建传入的节点的 VNode。

```js
// src/core/instance/render.js
import { createElement } from '../vdom/create-element'
export function initRender (vm: Component) {
  // ...
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  // 供模板编译时使用的 createElement
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  // 用户编写的 render 函数时使用的 createElement
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  // ...
}
```

`initRender`里不仅添加了`vm.$createElement`，还添加了`vm._c`，它们都是对`createElement`函数的封装。其中，`vm._c`是将模板编译成`render`函数时用于创建 VNode 的，而`vm.$createElement`是在用户自己编写的`render`函数用于创建 VNode 的，其区分就是传入`createElement`的第六个参数`alwaysNormalize`是否为`true`，涉及到对所创建 VNode 的子 VNode 不同的规范化处理，我们后续再说。

`createElement`函数是对`_createElement`的封装，主要是对传入`createElement`函数的参数位置进行调整（因为有些参数可以省略），以及分辨出是在用户编写的`render`函数还是模板编译出的`render`函数里调用的`createElement`，方便确定之后对 VNode 的子 VNode 数组采取哪一种规范化处理方式。

```js
// src/core/vdom/create-element.js

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
// createElement 是对 _createElement 进行了包装，以及标准化所有的参数
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  // 该参数目前仅在创建函数式组件时才有传入 true 的可能，当然此时也有可能传入 false
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 规范化参数（因为数据对象和子节点都是可选的）
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    // 若是用户编写的 render 函数，子节点虚拟数组必须采用复杂的规范化处理方式
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

/**
 * 生成 VNode 类型的元素
 *
 * @param {*} context （创建元素时的）当前组件实例
 * @param {*} tag 可以是 HTML 标签、组件选项对象，或者解析上述任何一种的一个 async 异步函数
 * @param {*} hydrating 是否混合（服务端渲染时为 true，非服务端渲染情况下为 false）
 * @param {*} removeOnly 这个参数是给 transition-group 用的
 */
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    // 这里影响显示效果，暂先注释
    // process.env.NODE_ENV !== 'production' && warn(
    //   `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
    //   'Always create fresh vnode data objects in each render!',
    //   context
    // )
    // 避免使用可观察数据对象作为 VNode 的数据对象
    return createEmptyVNode()
  }
  // object syntax in v-bind
  // 适用于以下两种情况：
  //   - 动态组件：<component :is="xxx"></component>
  //   - DOM 模板解析：<table><tr is="my-row"></tr></table>
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
  // 规范化子虚拟节点数组
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 复杂的规范化处理方式（用户编写的`render`函数，必须使用此种方式）
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 简单的规范化处理方式
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    // tag 为标签字符串：1、平台内置元素标签名称；2、全局/局部注册的组件名称

    let Ctor
    // 此时 context.$vnode 为 parentVnode，即先使用 parentVnode 的 ns
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      // 字符串类型一：平台内置元素标签（字符串），web 平台下包括 HTML 标签和 SVG 标签
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 字符串类型二：全局/局部注册的组件名称（包括继承、混合而来的）
      // Ctor 可能是继承 Vue 的构造函数，或者是组件选项对象
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
    // tag 为 1、组件选项对象；2、构造函数；3、返回值为组件选项对象的异步函数

    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

`_createElement`函数里主要做了以下工作：

1. 处理动态组件`v-bind:is`的情况
2. 规范化子节点数组（在此之前，子节点及其子孙节点已经转化成了 VNode）
3. 将节点转换成 VNode
4. 返回 VNode
    - VNode 是数组，直接返回
    - VNode 是存在且非数组，处理命名空间，返回
    - VNode 为空，创建空的 VNode 并返回

### 规范化子 VNode

需要注意的是，创建子节点的 VNode 是在创建节点的 VNode 之前，即 VNode Tree 的创建是自下而上的，等所有的子孙节点都创建好了，才会创建 VNode Tree 的根节点。因此在`_createElement`里传入的`children`已经是 VNode 的数组。而此处要做的只是对子虚拟节点数组进行规范化处理。

模板编译器在模板编译时通过静态分析，会尽量最小化对之后的规范化处理的需求。针对纯 HTML 标记来说，规范化处理完全可以跳过，因为生成的`render`函数已经保证返回的数组里都是 VNode。但是仍有两种情况需要做规范化处理。

#### simpleNormalizeChildren

第一种，当子节点包含组件时。

因为函数式组件可能返回 VNode 数组而不是单个 VNode，此种情况需要做简单的规范化处理，即通过`Array.prototype.concat`将`children`数组扁平化，以保证`children`数组只有一层的深度。（函数式组件已经对他们的子虚拟节点做了规划范处理）

假设`children`是这样的数组：

```js
[
  vnode1,
  [vnode2 , vnode3],
  [vnode4, vnode5]
]
```

则经过`simpleNormalizeChildren`处理之后，变成了`[vnode1, vnode2, vnode3, vnode4, vnode5]`。

```js
// src/core/vdom/helpers/normalize-children.js

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
/**
 * 将 children 做扁平化处理
 * @param {*} children 子 VNode 数组
 */
export function simpleNormalizeChildren (children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}
```

#### normalizeChildren

第二种，当子节点包含了总是生成嵌套数组的结构比如`template`节点、`slot`节点，`v-for`指令，或者子节点来自于用户编写的`render`函数/JSX。此种情况下，需要进行完整的规范化处理。

```js
// src/core/vdom/helpers/normalize-children.js

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}
```

`children`的类型若是原始值，则创建文本类型的 VNode（若`children`不是字符串，在创建文本类型的 VNode 时会转换为字符串），并处理成数组形式返回；若是数组类型，则调用`normalizeArrayChildren`处理并返回；否则，返回`undefined`。

```js
// src/core/vdom/helpers/normalize-children.js

/**
 * 判断节点是否是文本虚拟节点
 * @param {*} node 节点对象
 */
function isTextNode (node): boolean {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

/**
 * 递归地规范化处理 children 为数组的情况
 * @param {*} children 子虚拟节点数组
 * @param {*} nestedIndex 嵌套层级
 */
function normalizeArrayChildren (children: any, nestedIndex?: string): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    // 排除子节点是 undefined 和 Boolean 类型的情况
    if (isUndef(c) || typeof c === 'boolean') continue
    lastIndex = res.length - 1
    last = res[lastIndex]
    //  nested
    if (Array.isArray(c)) {
      // 子节点是数组
      if (c.length > 0) {
        // 递归规范化处理子节点的子虚拟节点数组
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
        // merge adjacent text nodes
        // 合并邻近的文本节点
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        // 将数组里的剩余元素推进 res 里
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) {
      // 子节点是原始值
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        // 若上一个节点是文本虚拟节点，则合并这两个邻近的文本，并替换掉上一个节点
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        // convert primitive to vnode
        // 将原始值转化为文本虚拟节点
        res.push(createTextVNode(c))
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        // 若上一个节点是文本虚拟节点 && 当前节点也是文本虚拟节点，则合并这两个邻近的文本虚拟节点，并替换掉上一个文本虚拟节点
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // default key for nested array children (likely generated by v-for)
        // 给嵌套的数组元素添加默认的 key（比如通过 v-for 生成的）
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}
```

`children`中的子节点可能存在如下几种类型，并存在不同的处理方式

- 通过`createElement`创建的 VNode 数组
  1. 递归调用`normalizeArrayChildren`规范化处理子节点的子虚拟节点数组
  2. 若子节点的子虚拟节点数组的第一个节点是文本虚拟节点 && `res`数组的最后一个节点也是文本虚拟节点，则将这两个虚拟文本节点合并成一个，生成新的文本虚拟节点并替换掉`res`数组最后一个节点；此外，还要移除子节点的子虚拟节点数组的第一个节点
  3. 将数组里的剩余元素推进 res 里
- 原始值
  - 字符串：若`res`数组的最后一个节点是文本虚拟节点，则合并这两个邻近的文本，生成新的文本虚拟节点并替换掉`res`数组最后一个节点
  - 非字符串：生成文本虚拟节点，加入`res`数组
- 通过`createElement`创建的 VNode
  - 该 VNode 是文本虚拟节点：若`res`数组的最后一个节点是文本虚拟节点，则合并这两个邻近的文本虚拟节点，生成新的文本虚拟节点并替换掉`res`数组最后一个节点
  - 其他 VNode，加入`res`数组
    - 若是`v-for`产生的常规 VNode：若没有`key`特性，则添加默认的`key`

TODO: 未规范化处理之前的子节点，为什么可能是文本虚拟节点？子节点只能是原始值，通过`createElement`创建的 Vnode，但是没发现什么场景下`createElement`会创建文本虚拟节点呀！

### 创建 VNode

创建 VNode 时，会根据节点的标签`tag`进行不同的处理：

- 节点的`tag`是字符串
  - `tag`是平台内置的元素标签（对于 Web 平台来说就是 HTML 元素标签）：直接创建 VNode
  - `tag`是全局/局部注册的子组件的标签：调用`createComponent`创建 VNode
  - `tag`是未知的元素标签或是无列出命名空间的元素：直接创建 VNode
- 节点的`tag`是组件选项对象或工厂函数：调用`createComponent`创建 VNode

#### VNode Class

VNode 是 Class，创建一 VNode 对象，就是实例化一 VNode 的实例，其`constructor`较为简单，只是将传入的数据一一变为实例的属性。

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    // 节点的标签
    tag?: string,
    // 节点的数据对象
    data?: VNodeData,
    // 节点的子节点
    children?: ?Array<VNode>,
    // 节点的文本
    text?: string,
    // 详见 https://windstone.cc/vue/source-study/topics/dom-binding.html#vnode-elm-%E7%9A%84%E7%A1%AE%E5%AE%9A
    elm?: Node,
    // 组件渲染时的父上下文组件
    context?: Component,
    // 组件的一些选项数据，比如 Ctor, propsData, listeners, tag, children
    componentOptions?: VNodeComponentOptions,
    // 异步组件工厂函数
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

#### 创建非组件节点的 VNode

非组件节点一般有如下几种 VNode：

- `tag`为`falsy value`的节点：创建出空文本的注释 VNode
- HTML/SVG 元素：创建出元素类型的 VNode
- 未知元素/未列出命名空间的元素：创建出元素类型的 VNode

以上几种情况，都是直接调用`new VNode()`创建出 VNode 的。

#### 创建组件节点的 VNode

创建组件的 VNode 就要复杂很多，需要处理组件的各种情况和数据等，以下是详细的步骤：

1. 若`Ctor`为组件选项对象，则将其转换成构造函数
2. 处理`Ctor`为异步工厂函数的情况，详见[异步组件](/vue/source-study/component/async-component.html)
3. 解析构造函数的 options，详见[合并配置 - resolveConstructorOptions](/vue/source-study/component/options.html#resolveconstructoroptions)
4. 将 v-model 数据转换为`props`&`events`
5. 提取 props 数据
6. （若有）创建函数式组件的 VNode 并返回，详见[函数式组件](/vue/source-study/component/functional-component.html)
7. 处理抽象组件的一些数据，如`props`&`listeners`&`slot`
8. 安装组件管理钩子方法
9. 调用`new VNode`创建组件的 VNode
10. 返回 VNode

组件节点的 VNode，我们一般称之为组件占位 VNode，因为该 VNode 在最终创建的 DOM Tree 并不会存在一个 DOM 节点与之一一对应，即它只出现在 VNode Tree 里，但不出现在 DOM Tree 里。

TODO: 这里的内容较多，需要之后详细梳理。

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  // _base 为 Vue 构造函数
  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  // Ctor 为组件选项对象时：转换成构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  // Ctor 为工厂函数时
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    /**
     * 解析异步组件
     *
     * - 首次解析
     *   - 若工厂函数同步 resolve 组件选项对象，则返回基于组件选项对象扩展的构造函数
     *   - 若工厂函数异步 resolve 组件选项对象
     *     - 若是高级异步组件 && 存在加载中组件 && delay 为 0，则返回基于加载中组件选项对象扩展的构造函数
     *     - 否则，返回 undefined（之后会强制渲染，再次解析异步组件）
     * - 再次解析
     *   - 若组件加载出错 && 高级异步组件存在出错时组件，返回基于出错时的组件选项对象扩展的构造函数
     *   - 若组件异步加载成功，返回基于组件选项对象扩展的构造函数
     *   - 若 delay 时间到达 && 仍处于异步加载过程中 && 高级异步组件存在加载中组件，返回基于加载中组件选项对象扩展的构造函数
     */
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // 创建异步占位 Vnode，并返回
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  // 解析构造函数的 options
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  // 将 v-model 数据转换为 props&events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  // 从 vnode 的 data 里提取出 props 数据，详见 ./helpers/extract-props.md
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  // 安装组件管理钩子方法
  installComponentHooks(data)

  // return a placeholder vnode
  // 注意：针对所有的组件，返回的 vnode 都是占位 vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    // vnode.componentOptions
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```

可以看到，相比于创建 HTML 元素的 VNode，调用`new VNode()`创建组件的 VNode 时多传入了第七、八个参数，这两个参数是组件在基于渲染 VNode 生成 DOM Tree 时使用到的数据，其中第七个参数包括组件的如下数据：

- 组件的构造函数`Ctor`，组件将通过`new Ctor()`来创建组件实例
- 传入组件的`props`相关数据`propsData`
- 处理组件内部发出的事件的响应函数集合`listeners`
- 组件的标签名称`tag`
- 组件的子元素`children`（`slot`相关的元素）

若是异步组件，传入的第八个参数是异步组件的工厂函数`asyncFactory`。

这些组件的数据，都将在组件`patch`的过程中使用到。

PS：以上的代码覆盖了创建根组件的 VNode 的全部流程，但是创建子组件的 VNode，会略微复杂一些，我们将在`patch`过程中详细描述。

##### 提取 props 数据

组件可能会存在[非 Prop 特性](https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E-Prop-%E7%89%B9%E6%80%A7)，对于没在组件内定义为`prop`的特性，会直接传入组件并被添加到组件的根元素上。

如果组件存在非 prop 特性，当将`template`编译成`render`函数时，我们就无法判断该特性是否是组件内定义的`prop`，因此`createElement`里的`data`就会包含`attrs`和`props`，需要我们自行根据组件选项对象里的`props`去`data.attrs/props`里筛选出需要的`prop`。

TODO: 模板编译时，是如何把组件上的特性识别为`attrs`还是`props`？

```js
// src/core/vdom/helpers/extract-props.js

/**
 * 根据组件选项对象里定义的 props 选项里的 key，从 data.props/attrs 提取出 prop 数据
 */
export function extractPropsFromVNodeData (
  data: VNodeData,
  Ctor: Class<Component>,
  tag?: string
): ?Object {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  const propOptions = Ctor.options.props
  if (isUndef(propOptions)) {
    return
  }
  const res = {}
  const { attrs, props } = data
  if (isDef(attrs) || isDef(props)) {
    for (const key in propOptions) {
      const altKey = hyphenate(key)
      if (process.env.NODE_ENV !== 'production') {
        const keyInLowerCase = key.toLowerCase()
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            `Prop "${keyInLowerCase}" is passed to component ` +
            `${formatComponentName(tag || Ctor)}, but the declared prop name is` +
            ` "${key}". ` +
            `Note that HTML attributes are case-insensitive and camelCased ` +
            `props need to use their kebab-case equivalents when using in-DOM ` +
            `templates. You should probably use "${altKey}" instead of "${key}".`
          )
        }
      }
      // 先从 props 里获取 prop，若获取不到，再从 attrs 里获取 prop
      // 需要注意，若是在 props 里获取到了 prop，要在 props 里保留该 prop；
      // 若是在 attrs 里获取到了 prop，则要将该 prop 从 attrs 里删除
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false)
    }
  }
  return res
}

/**
 * 检查 prop 是否存在在给定的 hash 里
 */
function checkProp (
  res: Object,
  hash: ?Object,
  key: string,
  altKey: string,
  preserve: boolean
): boolean {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key]
      if (!preserve) {
        delete hash[key]
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey]
      if (!preserve) {
        delete hash[altKey]
      }
      return true
    }
  }
  return false
}
```

##### 安装组件管理钩子方法

组件在创建组件占位 VNode 之前，会往组件的`data`对象上安装`init`、`prepatch`、`insert`、`destroy`等管理组件的钩子方法，方便在调用`vm.__patch__`期间，为组件占位 VNode 提供额外的功能，比如创建组件实例、等操作。

```js
// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      // 服务端渲染时，会执行 $mount(vnode.elm)
      // 对于正常的子组件初始化，会执行 $mount(undefined)
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

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
  },

  /**
   * 子组件完成 patch 之后，调用该 insert 钩子
   *（如果是子组件是首次挂载，会调用 mounted 钩子）
   */
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

/**
 * 合并两个钩子函数，返回新函数，新函数执行时，依次执行被合并的两个钩子
 */
function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}
```

经过安装管理钩子方法之后，组件占位 VNode 的`vnode.data.hook`对象上将有如下钩子函数。

```js
{
  init() {...},
  prepatch() {...},
  insert() {...},
  destroy() {...}
}
```
