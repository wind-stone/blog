---
sidebarDepth: 0
---

# 组件的 DOM Tree 是如何插入到父元素上的？

[[toc]]

首先我们需要知道，在创建`vnode`节点对应的 DOM Node 后，会先递归创建子虚拟节点的 DOM Node，之后再将该节点的 DOM Node 插入到父元素上，因此：在由 VNode Tree 转化为 DOM Tree 的过程中，DOM 节点的创建是自上而下的，即先创建父元素，再创建子元素，最后创建孙元素；但是将元素插入到父元素的过程是自下而上的，即孙元素先插入到子元素之下，子元素再插入到父元素之下。

在`createElm`里创建`vnode`对应的 DOM Node 时，无论`vnode`是组件占位 VNode 还是 DOM 节点对应的 VNode，都会调用`insert(parentElm, vnode.elm, refElm)`将`vnode.elm`插入到父元素里。所不同的是，针对不同类型的`vnode`，其`vnode.elm`代表的 DOM Node 也不一样。

```js
/**
 * 由 vnode 节点创建对应的 DOM Node（包括递归创建子虚拟节点的 DOM Node）
 */
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  // 组件 vnode：创建组件实例以及创建整个组件的 DOM Tree，并插入到父元素上
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // 元素类型的 vnode
  if (isDef(tag)) {
    // 创建元素
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)
    // 元素类型的 vnode
    if (__WEEX__) {
    } else {
      // 创建子节点
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        // 调用 create 钩子
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      // 将 vnode 对应的 DOM 节点，插入到父元素
      // 因为是递归调用 createElement，因此创建元素的过程是先父后子，将子元素插入到父元素的过程是先子后父
      insert(parentElm, vnode.elm, refElm)
    }
  }
}

function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    // 是否是重新激活的节点（keep-alive 的组件 activated 了）
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      // 若是 vnode.data.hook.init 存在（该方法是在 create-component.js 里创建组件的 VNode 时添加的）
      // 说明是组件 vnode，则调用 init 方法创建组件实例 vnode.componentInstance
      i(vnode, false /* hydrating */)
    }
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      // 将组件 DOM 根节点插入到父元素下
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

由上方的`createComponent`函数可以看出，创建好组件实例后，会调用`initComponent`初始化组件，之后调用`insert`将整个 DOM Tree 插入到父元素上。接下来，我们来看看`vnode.elm`、`parentElm`分别是什么，以及是如何而来的。

## vnode.elm 的确定

`vnode.elm`是在`createElm`的过程中产生的，不同类型的`vnode`，`vnode.elm`的含义和生成过程都不一样，共有两种不同的情况：

- HTML 元素对应的 VNode：`vnode.elm`就是`vnode`对应的 DOM Node 元素
- 组件占位 VNode：`vnode.elm`即为最终挂载时组件 DOM Tree 的根节点 DOM Node

且组件对应的`vnode`的`elm`的确定，是基于 HTML 元素对应的`vnode`的`elm`的确定。

因此我们需要先了解下 HTML 元素对应的 VNode 的`vnode.elm`是如何确定的。

### HTML 元素对应的 VNode

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (isDef(tag)) {
    // 元素类型的 vnode
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)
  }
  // ...
}
```

```js
export function createElement (tagName: string, vnode: VNode): Element {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}
```

若是 HTML 元素对应的 VNode，会直接通过`createElement`生成对应的 DOM Node，并赋值给`vnode.elm`。

### 组件占位 VNode

我们知道，组件的占位 VNode 最终并不会创建对应的 DOM Node 节点，只有`tag`为 HTML 标签名称的 VNode、文本 VNode 以及注释 VNode 才会创建对应的 DOM Node。但是组件实例是有渲染 VNode 的，若是组件渲染 VNode 的根节点 VNode 是 HTML 元素对应的 VNode，我们会将该 HTML 元素的 DOM Node 作为组件占位 VNode 的`vnode.elm`。

```js
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(oldVnode)) {
      // ...
    } else {
      // 根组件实例首次 patch，oldVnode 为要挂载到的 DOM 元素
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // 新旧 VNode Tree 进行 patch
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        // 根组件实例首次 patch || （更新时）新旧 vnode 不是同一 vnode
        // ...
        // 创建新 DOM 节点，并插入到父元素上
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          // 父元素
          oldElm._leaveCb ? null : parentElm,
          // 后一兄弟元素，新元素将挂载在父元素之下，后一兄弟元素之前
          nodeOps.nextSibling(oldElm)
        )

        // 递归更新占位的父 vnode
        //
        // 考虑这样的情况：
        // parent-component 的模板为：
        //   <template>
        //     <child-component></child-component>
        //   <template>
        // child-component 的模板为：
        //   <template>
        //     <div class="child-root"></div>
        //   <template>
        //
        // 未渲染的 HTML:
        // <div id="root">
        //   <parent-component></parent-component>
        // </div>
        //
        // 渲染后的 HTML:
        // <div id="root">
        //   <div class="child-root"></div>
        // </div>
        if (isDef(vnode.parent)) {
          // vnode.parent 存在，说明 vnode 是组件实例 componentInstance 通过 render() 生成的 _node
          // 因此 vnode.parent 即为组件实例 componentInstance 对应的占位 VNode
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            // 递归地将 vnode.elm 赋值给所有祖先占位 vnode 的 elm
            // 比如最初的 vnode 的是 div.child-root 对应的 vnode，vnode.elm 即为 div.child-root
            // 经过一轮循环，child-component 组件对应的 VNode 的 elm 也变成了 div.child-root
            // 再经过一轮循环，parent-component 组件对应的 VNode 的 elm 也变成了 div.child-root
            // 实际上，div.child-root 是最终要挂载到 div#root 节点上的元素
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }
        // ...
      }
    }

    // 针对所有新创建的节点，调用 insert 钩子函数
    // isInitialPatch 为 true 时，表示子组件的首次渲染
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```

注意观察`patch`里`createElm`之后的那段代码，若是当前`vnode`是组件实例的渲染 VNode，则需要将组件占位 VNode 节点的`vnode.elm`属性更新为组件实例渲染 VNode 的`vnode.elm`，并向上遍历所有的祖先组件占位 VNode，将这些组件占位 VNode 的`vnode.elm`都更新了。

如此，我们明白了，组件占位 VNode 的`vnode.elm`属性一开始是不存在的，当组件渲染 VNode 的根节点是 HTML 元素时，根节点将创建 DOM Node 作为根节点 VNode 的`vnode.elm`。进而在创建好根节点 DOM Node 后，更新组件占位 VNode 的`vnode.elm`。

那么若是遇到嵌套组件（即父组件的渲染 VNode 的根节点是子组件）的情况呢？

若是 A 组件的渲染 VNode 的根节点是 B 组件，那么在 B 组件渲染 VNode 的 HTML 根元素创建好后，再一次更新 A 组件和 B 组件占位 VNode 的`elm`，依次类推。（最后一个组件的渲染 VNode 的根节点肯定会是 HTML 元素）

组件占位 VNode 在创建组件实例时，组件渲染 VNode 的`parent`属性指向组件占位 VNode，即`vm._vnode.parent === vm.$vnode`，其中`vm._vnode`是组件实例的渲染 VNode，`vm.$vnode`是组件占位 VNode。

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
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

```js
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // 若是组件实例，则会存在 _parentVnode
    const { render, _parentVnode } = vm.$options
    // ...
    vnode.parent = _parentVnode
    return vnode
  }
```

## parentElm 的确定

`parentElm`是在调用`createElm`创建 DOM 元素时传入的，而调用`createElm`主要有以下三大类情况：

- 组件的父元素是 HTML 元素
- 组件是根组件
- 组件嵌套（这种情况比较复杂，将在下一小节单独说明）

### 组件的父元素是 HTML 元素

```HTML
<div class="div-el">
  <ComponentC></ComponentC>
</div>
```

这种情况是最简单的。在创建完`.div-el`元素后，会通过`createChildren`函数遍历子虚拟节点并调用`createElm`为子虚拟节点创建子元素。注意到这里调用`createElm`时是传入父虚拟节点的`vnode.elm`（即`.div-el`元素）作为`parentElm`的，在`createElm`函数里调用`createComponent`时也会透传`parentElm`。

```js
function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    if (process.env.NODE_ENV !== 'production') {
      // 子节点去重
      checkDuplicateKeys(children)
    }
    for (let i = 0; i < children.length; ++i) {
      // vnode.elm 作为子节点的 parentElm
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
    }
  } else if (isPrimitive(vnode.text)) {
    // 若 vnode 是仅包含文本的元素
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // 组件 vnode：创建组件实例以及创建整个组件的 DOM Tree，并插入到父元素上
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
}
```

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      // 将组件 DOM 根节点插入到父元素下
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

### 根组件

组件首次渲染时是通过`parentElm = nodeOps.parentNode(oldElm)`获取到的真实 DOM Node。`oldElm`是`oldVnode`的`elm`属性即`oldVnode.elm`，但首次渲染时不存在`oldVnode`，因此进行了特殊处理。

根组件首次`patch`时，会将`vm.$el`作为`oldVnode`传入`vm.__patch__`函数里，实际上就是`createPatchFunction`返回的`patch`函数里。`patch`函数里针对根组件首次`patch`的情况做了特殊处理，基于`vm.$el`创建`oldVnode`，将`oldVnode.elm`指向`vm.$el`。之后，获取到`oldVnode.elm`的`parentNode`作为`parentElm`。如此根组件的`parentElm`就已经确定了，即为传入的`options.el`的父元素。详细的数据传递可见以下关键代码。

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  // （根组件实例）存在 el 属性，挂载到 el 上（替换掉 el）
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
  // ...
}
```

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  vm.$el = el
  // ...
}
```

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevVnode = vm._vnode

  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    // 首次渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    // 数据更新
    vm.$el = vm.__patch__(prevVnode, vnode)
  }

  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    // 如果是连续两个组件的情况，比如 componet-father 组件的如下定义，将更新父组件的 $el
    // <template>
    //   <component-son>
    //   </component-son>
    // </template>
    vm.$parent.$el = vm.$el
  }
}
```

```js
export function createPatchFunction (backend) {
  /**
    * 以 DOM 元素为基础，创建 VNode 节点（仅包含 tag 和 elm）
    */
  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    // ...
    if (isUndef(oldVnode)) {
    } else {
      // 根组件实例首次 patch，oldVnode 传入的为要挂载到的 DOM 元素
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        // 根组件实例首次 patch || （更新时）新旧 vnode 不是同一 vnode
        if (isRealElement) {
          // 根组件实例首次 patch
          // 若是根实例首次 patch，将 el 处理出 oldVnode 的形式，再统一处理
          // （则创建空的 vnode 节点，tag 为 DOM 元素的标签名，elm 为该 DOM 元素）
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        // vnode 占位节点的父 DOM 元素
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        // 创建新 DOM 节点，并插入到父元素上
        createElm(
          vnode,
          insertedVnodeQueue,
          // 父元素
          oldElm._leaveCb ? null : parentElm,
          // 后一兄弟元素，新元素将挂载在父元素之下，后一兄弟元素之前
          nodeOps.nextSibling(oldElm)
        )
        // ...
      }
    }
    // ...
    return vnode.elm
  }
}
```

```js
export default class VNode {
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    // ...
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    // ...
  }
}
```

以上为根组件首次`patch`时获取`parentElm`的过程，其实质是首次`patch`时获取`oldVnode.elm`的过程。通过`__update`方法可知，首次`patch`之后的每次`patch`，我们都能从上一次的`vnode`上获取到`elm`，进而可以再次获得`parentElm`。

让我们来简单举个例子，如下示例里，根组件的`parentElm`就是`#app`元素的父元素，即`body`元素。

```html
<body>
  <div id="app"></div>
</body>
```

```js
new Vue({
  el: '#app',
  // ...
})
```

## 组件嵌套

组件嵌套，是指父组件的渲染 VNode 的根节点是子组件的情况，请看如下示例。

```html
<div class="a-parent">
  <ComponentA></ComponentA>
</div>
```

```HTML
<!-- 组件 A 的模板根节点是 组件 B-->
<template>
  <ComponentB></ComponentB>
</template>
```

```HTML
<!-- 组件 B 的模板根节点是 HTML 元素-->
<template>
  <div class="b-root"></div>
</template>
```

为了详细说明，我们先假设组件 A 的父元素是 HTML 元素`div.a-parent`，组件 A 的模板的根节点是组件 B，组件 B 的模板的根节点是`div.b-root`。那么创建组件 B 的实例时，`parentElm`是什么呢？

我们发现，前两种情况（组件的父元素是 HTML 元素、组件是根组件）组件调用`createElm`的时机和传入的参数都不相同，而组件嵌套里的子组件即组件 B 调用`createElm`创建元素也不同于前两种情况。

组件 A 的模板的根节点是组件 B，则组件 A 的渲染 VNode 同时也是组件 B 的占位 VNode。在组件 A 的实例调用`vmA.$mount`去生成组件 A 的渲染 VNode 时，传入`vmA.$mount`的第一个参数是`undefined`，这也导致为组件 A 的渲染 VNode 也就是组件 B 的占位 VNode 调用`createElm`创建元素时，不传入第三个参数`parentElm`。

```js
  // 这里是创建组件 A 的实例，此处的 vnode 是组件 A 的占位 VNode
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        // 此处创建组件 A 的组件实例
        i(vnode, false /* hydrating */)
      }
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue)
        // 将组件 DOM 根节点插入到父元素下
        insert(parentElm, vnode.elm, refElm)
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
  }
```

```js
// 组件 A 的组件实例创建好后，会调用 $mount 去生成组件 A 的渲染 VNode，该渲染 VNode 同时也是组件 B 的占位 VNode
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
      // 组件 A 的实例调用 $mount，传入的第一个参数是 undefined
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  }
}
```

```js
export function createPatchFunction (backend) {
  // ...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // 此处调用 createElm 为组件 A 的渲染 VNode 同时也是组件 B 的占位 VNode 创建元素时，未传入第三个参数 parentElm
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    }
    // ...
  }
}
```

```js
export function createPatchFunction (backend) {
  // ...
  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    // ...
    // 此处的 parentElm 为 undefined
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
    // ...
  }
  // ...
}
```

```js
export function createPatchFunction (backend) {
  // ...
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */)
      }
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue)
        // 此处的 parentElm 为 undefined
        insert(parentElm, vnode.elm, refElm)
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
  }
  // ...
}
```

经过一系列的过程，我们发现组件 B 的占位 VNode 创建好组件 B 的实例之后，调用`insert(parentElm, vnode.elm, refElm)`时，`parentElm`为`undefined`。查看`insert`函数的实现，当`parent`为`undefind`时，啥都没有干！

```js
export function createPatchFunction (backend) {
  // ...
  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }
  // ...
}
```

最终我们得出结论，对于组件嵌套的情况，即组件 A 的模板的根节点是组件 B 时，组件 B 在创建了组件 B 的实例之后，不会将组件 B 的根 DOM Node 插入到父元素上。

但是在组件 A 创建了组件 A 实例之后，会将组件 B 的`vnode.elm`插入到`parentElm`上。

1. 组件 A 生成组件 A 的实例
    1. 组件 A 的实例生成渲染 VNode，该 渲染 VNode 同时也是组件 B 的占位 VNode
    2. 组件 B 的占位 VNode 生成组件 B 的实例
    3. 初始化组件 B 的实例
    4. 试图将组件 B 的占位 VNode 的`vnode.elm`即元素`.b-root`插入到`parentElm`，但`parentElm`为`undefined`，插入失败
2. 初始化组件 A 的实例
3. 将组件 A 的占位 VNode 的`vnode.elm`即元素`.b-root`插入到`parentElm`上，`parentElm`是元素`.a-parent`，插入成功

PS：组件 A/B 的占位 VNode 的`vnode.elm`都是元素`.b-root`，详见[vnode.elm 的确定 - 组件占位 VNode](/vue/source-study/topics/dom-binding.html#组件占位-vnode)；组件 A 创建元素时的`parentElm`是`.a-parent`，详见[parentElm 的确定 - 组件的父元素是 HTML 元素](/vue/source-study/topics/dom-binding.html#组件的父元素是-html-元素)

事实上，组件的渲染 VNode 的根节点，既有可能是 HTML 元素的虚拟节点，也有可能是子组件的占位 VNode，而调用`createElm`为组件的渲染 VNode 创建元素时，不会将创建出的元素插入到父元素上（`parentElm`不存在）。但是在此之后，当组件的占位 VNode 创建的组件实例初始化之后，会将`vnode.elm`插入到`parentElm`上。
