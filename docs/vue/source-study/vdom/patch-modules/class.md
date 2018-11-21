---
sidebarDepth: 0
---

# class 模块

[[toc]]

创建 DOM 元素节点和修补 DOM 元素节点时，可能需要添加/修改元素节点的`class`特性。`class`模块将`class`的添加和修改合并成了同一个函数`updateClass`。

## 更新 class

更新`class`的步骤为：

1. 若新旧 VNode 上都不存在`class`和`staticClass`，更无需处理`class`，直接返回
2. 基于新 VNode，生成最新的`class`字符串
3. 处理过渡的`class`（TODO: 待以后分析）
4. 将`class`字符串设置到 DOM 元素上

```js
// src/platforms/web/runtime/modules/class.js
import {
  isDef,
  isUndef
} from 'shared/util'

import {
  concat,
  stringifyClass,
  genClassForVnode
} from 'web/util/index'

/**
 * 更新元素的 class 特性
 * @param {*} oldVnode 上一次的 vnode 节点
 * @param {*} vnode 此次更新的 vnode 节点
 */
function updateClass (oldVnode: any, vnode: any) {
  const el = vnode.elm
  const data: VNodeData = vnode.data
  const oldData: VNodeData = oldVnode.data
  if (
    // 若新旧 VNode 都不存在 class 属性，则直接返回
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  // 生成最终的 class 字符串（结合 staticClass 和 class）
  let cls = genClassForVnode(vnode)

  // handle transition classes
  const transitionClass = el._transitionClasses
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass))
  }

  // set the class
  // 设置 DOM 元素的 class 特性
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls)
    el._prevClass = cls
  }
}

export default {
  create: updateClass,
  update: updateClass
}
```

## 基于 VNode 生成 class 字符串

给 DOM 元素节点添加`class`特性之前，需要将 VNode 上的`staticClass`和`class`数据合并成字符串。若是组件占位 VNode 还需要处理将连续嵌套组件上的所有`staticClass`和`class`数据合并，共同组成最终的`class`字符串。

```js
import { isDef, isObject } from 'shared/util'

/**
 * 合并 class 数据，并生成最终的 class 字符串
 *
 * @param {VNode} vnode 虚拟节点
 */
export function genClassForVnode (vnode: VNodeWithData): string {
  let data = vnode.data
  let parentNode = vnode
  let childNode = vnode
  // 若该 VNode 是组件占位 VNode，则合并该组件占位 VNode 和组件渲染 VNode 上的 class/staticClass，包括组件渲染 VNode 同时也是子组件占位 VNode 的情况（即连续嵌套组件的情况）
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data)
    }
  }
  // 若该 VNode 是组件渲染 VNode，则需要该组件渲染 VNode 和该组件的占位 Vnode 上的 class/staticClass，包括组件占位 VNode 是父组件渲染 VNode 的情况（即连续嵌套组件的情况）
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data)
    }
  }
  return renderClass(data.staticClass, data.class)
}

/**
 * 合并 class 数据
 */
function mergeClassData (child: VNodeData, parent: VNodeData): {
  staticClass: string,
  class: any
} {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

/**
 * 合并最终的 class 字符串（会将数组、对象等转换为字符串）和 staticClass 字符串
 */
export function renderClass (
  staticClass: ?string,
  dynamicClass: any
): string {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

/**
 * 合并 staticClass，纯字符串合并
 */
export function concat (a: ?string, b: ?string): string {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

/**
 * 将 class 数据转换成字符串形式
 */
export function stringifyClass (value: any): string {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

/**
 * 将数组形式的 class 数据转成字符串形式
 */
function stringifyArray (value: Array<any>): string {
  let res = ''
  let stringified
  for (let i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) res += ' '
      res += stringified
    }
  }
  return res
}

/**
 * 将对象形式的 class 数据转成字符串形式
 */
function stringifyObject (value: Object): string {
  let res = ''
  for (const key in value) {
    if (value[key]) {
      if (res) res += ' '
      res += key
    }
  }
  return res
}
```

## 疑惑

### 为什么不对最终合并的 class 字符串里的各个 class 进行去重？

从源码里可以看到，没有对最终合并好的`class`字符串里的各个`class`进行去重，验证代码如下所示。这是为什么呢？

```js
const vm = new Vue({
  el: '#app',
  // router,
  store,
  components: { App },
  template: '<App class="123"/>'
})
```

`App`组件的模板：

```html
<template>
  <div id="app" class="123">
    <HelloWorld :type="type"></HelloWorld>
  </div>
</template>
```

最终的渲染结果：

```html
<div id="app" class="123 123">HelloWorld</div>
```
