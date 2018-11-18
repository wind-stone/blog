---
sidebarDepth: 0
---

# Patch

[[toc]]

通过`vm._render()`获取到组件的 VNode Tree（实际上是组件占位 VNode）之后，即可通过`vm._update()`创建/更新/销毁组件的 DOM Tree。

## Vue.prototype._update

`Vue.prototype._update`是对`vm.__patch__`方法的封装，真正创建/更新（包括销毁）DOM Tree 是由`vm.__patch__`方法来完成的，而`_update`方法做一些调用`vm.__patch__`前后的处理。

在调用`vm.__patch__`时，将根据是否存在旧 VNode 节点`prevVnode`，确定是组件的首次渲染还是再次更新，从而传入不同的参数。

```js
export function lifecycleMixin (Vue: Class<Component>) {
  /**
   * 该函数的主要作用是，传入新的 vnode，创建视图。
   */
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    // 将活动实例设置为 vm
    activeInstance = vm
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      // 首次渲染
      // 根组件首次渲染时，vm.$el 为组件选项对象的 el 选项
      // 子组件首次渲染时，vm.$el 为空
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      // 更新
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      // 解除`preEl`与`vm`的联系
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      // 将`vm.$el`与`vm`关联
      vm.$el.__vue__ = vm
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
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
  // ...
}
```

::: tip 重要提示
调用`vm.__patch__`后将返回组件渲染 VNode 的`vnode.elm`，该值将赋给`vm.$el`，记录着组件 DOM Tree 的根元素节点。PS：若是遇到连续嵌套组件，连续嵌套的父子组件的`vm.$el`都对应着 DOM Tree 的根元素节点。

若组件的渲染 VNode 是元素类型的 VNode，则返回的`vnode.elm`是渲染 VNode 对应的 DOM 元素节点。

若组件的渲染 VNode 是子组件的占位 VNode，则返回的`vnode.elm`是子组件占位 VNode 的`vnode.elm`，也就是子组件 DOM Tree 的根元素节点。详见[vnode.elm 的确定 - 组件占位 VNode](/vue/source-study/topics/dom-binding.html#组件占位-vnode)
:::

## Vue.prototype.__patch__

`Vue.prototype.__patch__`方法是在[Web 初次处理版 Vue](/vue/source-study/vue-constructor.html#web-初次处理版-vue)里添加的原型方法，用于 Web 平台的`patch`功能。

```js
// src/platforms/web/runtime/index.js
import { patch } from './patch'
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

而`patch`函数，是调用核心的 VDom 的函数`createPatchFunction`生成的，并传入了 Web 平台相关的一系列节点操作方法`nodeOps`和一些模块`modules`。如此，最后生成的`patch`函数是专用于在 Web 平台生成视图和更新视图。

```js
// src/platforms/web/runtime/patch.js
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

## createPatchFunction

`createPatchFunction`函数根据传入的参数做了一些初始化的操作，声明了大量的闭包函数，最后返回了`patch`函数。`patch`函数内将调用这些闭包函数，以完成复杂的 DOM Tree 的首次渲染、动态更新等。

```js
// src/core/patch.js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  // 将针对 refs 和 directives 等模块的 create、update、destroy 钩子合并到 cbs 里
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // 调用钩子函数，patchVnode 函数内将调用 update 钩子
  function invokeInsertHook(/* ... */) {/** **/}
  function invokeCreateHooks(/* ... */) {/** **/}
  function patchVnode(/* ... */) {/** **/}
  function removeAndInvokeRemoveHook(/* ... */) {/** **/}
  function invokeDestroyHook(/* ... */) {/** **/}

  // 创建元素/组件
  function createElm(/* ... */) {/** **/}
  function createComponent(/* ... */) {/** **/}
  function createChildren(/* ... */) {/** **/}
  function initComponent(/* ... */) {/** **/}

  // VNode / DOM 操作
  function insert(/* ... */) {/** **/}
  function removeNode(/* ... */) {/** **/}
  function removeVnodes(/* ... */) {/** **/}
  function emptyNodeAt(/* ... */) {/** **/}
  function createRmCb(/* ... */) {/** **/}

  function isUnknownElement(/* ... */) {/** **/}
  function reactivateComponent(/* ... */) {/** **/}
  function isPatchable(/* ... */) {/** **/}
  function setScope(/* ... */) {/** **/}
  function updateChildren(/* ... */) {/** **/}
  function checkDuplicateKeys(/* ... */) {/** **/}
  function findIdxInOld(/* ... */) {/** **/}
  function patchVnode(/* ... */) {/** **/}
  function hydrate(/* ... */) {/** **/}
  function assertNodeMatch(/* ... */) {/** **/}

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    // ...
  }
}
```

### 合并各模块的钩子函数

调用`createPatchFunction`传入的`modules`函数，包含的模板有：

- 核心模块
  - `ref`
  - `directives`
- Web 平台相关模块
  - `attrs`
  - `klass`
  - `events`，详见[事件监听器 - 原生事件](/vue/source-study/instance/events.html#原生事件)
  - `domProps`
  - `style`
  - `transition`

这些模块都提供了`create`和`update`钩子，用于在元素创建完成和更新完成后处理对应的模块；有些模块还提供了`activate`、`remove`、`destroy`等钩子。经过合并这些钩子函数之后，`cbs`变成了如下的结构，这些钩子函数将在对应的函数里被一一调用，比如`invokeCreateHooks`函数里将调用所有的`create`钩子。

```js
cbs = {
  create: [
    attrs.create,
    klass.create,
    events.create,
    domProps.create,
    style.create,
    transition.create,
    ref.create,
    directives.create
  ],
  update: [
    attrs.update,
    klass.update,
    events.update,
    domProps.update,
    style.update,
    ref.update,
    directives.update
  ],
  activate: [
    transition.activate
  ],
  remove: [
    transition.remove
  ],
  destroy: [
    ref.destroy,
    directives.destroy
  ]
}
```

而`createPatchFunction`最后返回的`patch`函数将赋值给`Vue.prototype.__patch__`，也就是说，调用`vm.__patch__`最终调用的就是`createPatchFunction`返回的`patch`函数。

## patch

调用`patch`函数时，将根据传入的参数的取值不同，进行不同的操作。

1. 销毁组件：`vnode`不存在，`oldVnode`存在
2. 首次渲染组件/更新组件：`vnode`存在
    - `oldVnode`不存在：子组件的首次渲染
    - `oldVnode`存在
      - `oldVnode`是 DOM 元素节点，根组件的首次渲染
      - `oldVnode`不是 DOM 元素节点，组件更新
        - `oldVnode`和`vnode`是相同的 VNode 节点，则`patchVnode`更新组件
        - 否则，重新为`vnode`创建元素

### 根组件首次 patch && 组件新旧渲染 VNode 不能 patch 的情况

根组件的首次`patch`，会为渲染 VNode 创建对应的 DOM 节点/组件实例，整个 DOM Tree 都是新创建的。而对于组件新旧渲染 VNode 不能 patch 时，也会弃用之前的 DOM Tree，转而重新创建新的 DOM Tree。因此这两种情况，可以共用同一套逻辑。

稍有不同的是，需要将根组件的首次`patch`传入的`oldVnode`（实际上是 DOM 元素节点）处理成旧的渲染 VNode 的形式。如此，处理后的`oldVnode`也拥有了`elm`属性，变成了组件新旧渲染 VNode 不能`patch`的情况了。

```js
  /**
   * 以 DOM 元素为基础，创建 VNode 节点（仅包含 tag 和 elm）
   */
  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }
```

此后，根组件的首次`patch`完全可以当成组件新旧 VNode 不能`patch`时来处理，主要的步骤有：

1. 获取到旧 VNode 对应的`elm`及基于`elm`的父 DOM 元素节点
2. 调用`createElm`为新 VNode 创建 DOM 节点/组件实例
3. 若 VNode 存在`vnode.parent`，则递归更新组件占位 VNode 的`vnode.elm`，详见[组件的 DOM Tree 是如何插入到父元素上的？ - 组件占位 VNode](/vue/source-study/topics/dom-binding.html#组件占位-vnode)
4. 销毁旧 VNode 及移除其对应的 DOM 元素，详见[patch 辅助函数 - removeVnodes：移除子 VNode 及其 DOM 元素](/vue/source-study/vdom/patch-fn.html#removevnodes：移除子-vnode-及其-dom-元素)

一言以蔽之就是，创建组件新的 DOM Tree -> 更新组件占位 VNode -> 销毁组件旧的 DOM Tree 及 VNode Tree

```js
  /**
   * 执行`patch`函数，是为组件的渲染 VNode 创建 DOM Tree，最后插入到文档内。在此过程中，会新增 DOM 节点、修补（patch）DOM 节点、删除 DOM 节点。

   * - 组件创建时，会首次调用`patch`，会根据渲染 VNode 创建 DOM Tree，DOM Tree 里所有 DOM 元素/子组件实例都是新创建的，且 DOM Tree 是递归生成的。
   * - 组件改变时，每次都会调用`patch`，会根据改变前后的渲染 VNode 修补 DOM Tree，该过程可能会新增 DOM 节点、修补（patch）DOM 节点、删除 DOM 节点。
   * - 组件销毁时，最后一次调用`patch`，会销毁 DOM Tree。
   *
   * @param {*} oldVnode 组件旧的渲染 VNode
   * @param {*} vnode 组件新的渲染 VNode（执行 vm._render 后返回的）
   * @param {*} hydrating 是否混合（服务端渲染时为 true，非服务端渲染情况下为 false）
   * @param {*} removeOnly 这个参数是给 transition-group 用的
   *
   * 需要额外注意的是，这里的传入的 vnode 肯定是某组件的渲染 VNode；而对于连续嵌套组件的情况来说，渲染 VNode 同时也是直接子组件的占位 VNode
   */
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    // ...
    if (isUndef(oldVnode)) {
      // ...
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        // 根组件实例首次 patch || （更新时）新旧 vnode 不是同一 vnode
        if (isRealElement) {
          // ...
          // 若是根实例首次 patch，将 el 处理出 oldVnode 的形式，再统一处理
          oldVnode = emptyNodeAt(oldVnode)
        }
        // replacing existing element
        const oldElm = oldVnode.elm
        // 组件占位 VNode 的 DOM 父元素节点
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        // 为新的 VNode 创建元素/组件实例，若 parentElm 存在，则插入到父元素上
        createElm(
          vnode,
          insertedVnodeQueue,
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // 递归更新占位 VNode 的 elm，以解决“连续嵌套组件”的情况，即父组件的渲染 VNode 同时是子组件的占位 VNode
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              // TODO: 为什么要销毁组件的占位 VNode？
              cbs.destroy[i](ancestor)
            }
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

        // destroy old node
        if (isDef(parentElm)) {
          // parentElm 存在，说明该旧 VNode 对应的 DOM 元素存在在 document 上
          // 不仅需要销毁旧的 VNode，还要移除旧的 DOM 元素
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          // parentElm 不存在，仅销毁旧的 VNode
          invokeDestroyHook(oldVnode)
        }
      }
    }
  }
```

#### 组件新旧渲染 VNode 不能 patch 的情况

```js
/**
 * 判断两个 VNode 节点是否是同一种 VNode
 */
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        // 若是元素类型的 VNode，则需要相同的元素标签；若是组件占位 VNode，则需要是相同组件的 VNode
        a.tag === b.tag &&
        // 都是注释 VNode，或都不是注释 VNode
        a.isComment === b.isComment &&
        // VNode 的 data 都定义了，或都没定义
        isDef(a.data) === isDef(b.data) &&
        // （对于 input 输入框来说），相同的输入类型
        sameInputType(a, b)
      ) || (
        // 对于异步组件占位 VNode 来说，工厂函数要完全相同；且新的异步组件占位 VNode 不能是失败状态
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

/**
 * 判断两个 VNode 是否是同一种 input 输入类型
 */
function sameInputType (a, b) {
  // 若不是 input 标签，返回 true
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  // input 的 type 相同或者两个 input 都是文本输入类型
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}
```

```js
export const isTextInputType = makeMap('text,number,password,search,email,tel,url')
```

### 组件更新

若是组件的新旧渲染 VNode 是`sameVnode`，则不会为渲染 VNode 重新创建 DOM 节点，而是在原有的 DOM 节点上进行修补，尽可能复用之前的 DOM 节点。

修复渲染 VNode 对应的 DOM 节点的步骤为：

1. 若新旧 VNode 是同一引用对象，则无需修补，直接返回
2. 处理旧 VNode 是异步占位 VNode 的情况
3. 处理静态 VNode 的情况
4. 调用组件占位 VNode 的`prepatch`钩子
5. 若 VNode 是可`patch`（修补）的，则：
    1. 调用各个模块的`update`钩子
    2. 调用（带有自定义指令且指令存在`update`钩子的元素类型的）VNode 的`update`钩子
6. 修补 DOM 节点，针对不同类型的 VNode，进行不同的处理
    - 元素类型的新 VNode
      - 新旧 VNode 都包含`children` && `children`不是同一引用：调用`updateChildren`递归更新`children`（重点，之后详细说）
      - 新 VNode 的`children`存在 && 旧 VNode 的`children`不存在
        - 若旧 VNode 是文本/注释节点，则将其`textContent`设为空字符串
        - 遍历`children`，创建 DOM 节点，并插入到该 VNode 对应的 DOM 元素节点上
      - 新 VNode 的`children`不存在 && 旧 VNode 的`children`存在：递归销毁子 VNode 和子 DOM 节点
    - 文本/注释类型的新 VNode：更新 DOM 节点的`textContent`
7. 调用（带有自定义指令且指令存在 componentUpdated 钩子的元素类型的） VNode 的 postpatch 钩子

```js
  /**
   * 修补 VNode
   */
  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      // TODO: 这是什么情况下出现的，不都是新建的 VNode 吗？
      return
    }

    const elm = vnode.elm = oldVnode.elm

    // 若旧 VNode 是异步占位 VNode
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        // 新 VNode 是异步组件成功解析之后 render 出的 VNode，则进行混合操作
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        // TODO: isAsyncPlaceholder 默认是 false，怎么进入满足 isTrue(oldVnode.isAsyncPlaceholder) ？
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    // TODO:
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      // 调用组件占位 VNode 的 prepatch 钩子
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      // 调用各个模块的 update 钩子
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      // 调用（带有自定义指令且指令存在 update 钩子的元素类型的） VNode 的 update 钩子
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    if (isUndef(vnode.text)) {
      // 若 VNode 不是文本节点，即是元素类型的 VNode 或组件占位 VNode
      if (isDef(oldCh) && isDef(ch)) {
        // 若 vnode 和 oldVnode 的 children 都存在
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        // 若 vnode 的 children 存在但 oldVnode 的 children 不存在，则添加子节点
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 若 oldVnode.children 存在但 vnode.children 不存在，则删除 oldVnode.children
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // 若 oldVnode 是文本类型的 VNode，则删除文本内容
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 文本/注释类型的 VNode，设置 DOM 节点的 textContent（DOM 注释节点也能通过 textContent 设置注释的内容哦）
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      // 调用（带有自定义指令且指令存在 componentUpdated 钩子的元素类型的） VNode 的 postpatch 钩子
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```

#### 组件占位 VNode 的 prepatch 钩子

#### updateChildren

### 组件销毁

### 返回 vnode.elm

除了组件销毁的情况之外，根组件和子组件的首次渲染和更新，执行`patch`函数都将返回组件渲染 VNode 的`vnode.elm`。而组件渲染 VNode 是元素类型的VNode 时和是子组件占位 VNode 时，`vnode.elm`的意义和获取方式都不相同，详见[vnode.elm 的确定](/vue/source-study/topics/dom-binding.html#vnode-elm-的确定)。

```js
export function createPatchFunction (backend) {
  // ...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      // 销毁 vnode 节点
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    // 此处是组件首次渲染/更新的逻辑

    // 返回组件渲染 VNode 的 vnode.elm
    return vnode.elm
  }
}
```

而`patch`函数返回的`vnode.elm`将赋值给组件实例的`vm.$el`，即组件的`vm.$el`是组件 DOM Tree 的根元素节点。

若是遇到连续嵌套组件的情况，因为父组件渲染 VNode 是子组件的占位 VNode，因此要更新父组件实例的`vm.$el`为子组件的`vm.$el`。

```js
export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    // ...
    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    // ...
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      // vm.$vnode 是组件的占位 VNode
      // vm.$parent 是组件渲染时当前活动的非抽象父组件
      // vm.$vnode === vm.$parent._vnode 成立，说明组件的占位 VNode 是其非抽象父组件的渲染 VNode，即连续嵌套组件的情况
      // 此种情况下，则更新父组件实例的 $el
      vm.$parent.$el = vm.$el
    }
    // ...
  }
}
```

## createElm

组件的首次`patch`时，肯定要为所有的 VNode 节点创建对应的 DOM 节点，而在组件更新的过程中，也有可能需要为新增的 VNode 节点创建 DOM 节点。

`createElm`，顾名思义，就是创建 VNode 节点的`vnode.elm`。不同类型的 VNode，其`vnode.elm`的和创建过程也不相同。对于组件占位 VNode 来说，会调用`createComponent`来创建组件占位 VNode 的组件实例；对于非组件占位 VNode 来说，会创建对应的 DOM 节点。

```js
  /*
   * 为 VNode 创建对应的 DOM 节点/组件实例
   *
   * @param {*} vnode 虚拟节点
   * @param {*} insertedVnodeQueue
   * @param {*} parentElm 父元素
   * @param {*} refElm nextSibling 节点，如果有，插入到父节点之下该节点之前
   * @param {*} nested 是否是嵌套创建元素，在 createChildren 里调用 createElm 时，该值为 true
   * @param {*} ownerArray 若 VNode 来源于某个 VNode 类型的数组，该参数即为该数组（比如该 VNode 是 vnodeParent 的子节点，ownerArray 即为 vnodeParent.children）
   * @param {*} index VNode 在 ownerArray 中的索引
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
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.

      // 若 vnode 的节点如果已经创建，则克隆一份 vnode，再继续向下走
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    vnode.isRootInsert = !nested // for transition enter check

    // 组件 vnode：创建组件实例以及创建整个组件的 DOM Tree，并插入到父元素上
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    // 非组件节点（正常 HTML 元素、注释、文本节点）
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {
      // 元素类型的 VNode
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          // 未知/未注册节点，警告
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }

      // 创建 DOM 元素节点
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      setScope(vnode)

      /* istanbul ignore if */
      if (__WEEX__) {
        // in Weex, the default insertion order is parent-first.
        // List items can be optimized to use children-first insertion
        // with append="tree".
        const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
        if (!appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          insert(parentElm, vnode.elm, refElm)
        }
        createChildren(vnode, children, insertedVnodeQueue)
        if (appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          insert(parentElm, vnode.elm, refElm)
        }
      } else {
        // 创建子 DOM 节点
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) {
          // 调用 create 钩子
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        // 将 VNode 的 DOM 节点，插入到父元素
        // 因为是递归调用 createElement，因此创建元素的过程是先父后子，将子元素插入到父元素的过程是先子后父
        insert(parentElm, vnode.elm, refElm)
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--
      }
    } else if (isTrue(vnode.isComment)) {
      // 注释类型的 VNode
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      // 文本类型的 VNode
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }
```

### 创建组件实例

当调用`createElm`为 VNode 创建对应的 DOM 节点时，会先调用`createComponent`，以判断该 VNode 是否是组件占位 VNode。如果是，则进入到创建组件实例的流程，最终`createComponent`返回`true`并结束`createElm`的过程；若该 VNode 不是组件占位 VNode，`createComponent`返回`false`，继续为非组件占位 VNode 创建对应的 DOM 元素/文本/注释节点。

详见[创建子组件实例](/vue/source-study/vdom/child-component-create.html)

### 创建 DOM 节点

经过`createComponent`判断后，走到这一步说明该 VNode 不是组件占位 VNode，而非组件占位 VNode 主要有三种类型，这三种类型都将创建 DOM 节点。

- 元素类型的 VNode
- 文本类型的 VNode
- 注释类型的 VNode

创建这三种 VNode 的 DOM 节点的过程如下：

- 元素类型的 VNode
  - 创建 VNode 对应的 DOM 元素节点`vnode.elm`
  - 设置 VNode 的`scope`
  - 调用`createChildren`创建子 VNode 的 DOM 节点
    - 若`children`是数组
      - （非生产环境）根据子 VNode 的 key，去除重复的子 VNode
      - 遍历调用`createElm`创建子 VNode 的 DOM 节点
    - 若该 VNode 是仅包含文本的节点（TODO: 这是哪些情形？）
      - 创建 DOM 文本节点并插入到`vnode.elm`
  - （如果有）调用`invokeCreateHooks`，执行`create`钩子函数
  - 将 DOM 元素节点`vnode.elm`，插入到父元素（若`parentElm`存在）
- 注释/文本类型的 VNode
  - 创建 DOM 注释/文本节点`vnode.elm`，并插入到父元素

若是元素类型的 VNode，在创建 VNode 对应的 DOM 元素节点之后，还需要依次创建子 VNode 对应的 DOM 节点。此外，若该 VNode 不是组件渲染 VNode 的根节点，将存在`parentElm`，会将 VNode 对应的 DOM 元素节点插入到父元素上。

## 释疑

### insertedVnodeQueue 的作用

每一个子组件在`vm.__patch__`生成 DOM Tree 的过程中，会存在一些含有`vnode.data.hook.insert`钩子的 VNode，这些 VNode 对应的 DOM 元素节点插入到父元素之后，需要做一些额外的操作。这些 VNode 大致分为两类：

- 元素类型的 VNode，且含有`inserted`钩子的自定义指令，在对应的 DOM 元素节点插入到父元素时执行`inserted`钩子
- 组件占位 VNode，在组件插入到父元素上时，也要做一些操作，比如调用组件的`mounted`钩子等

而`insertedVnodeQueue`就是保存这些 VNode 的，但是需要注意的是，每一个组件每次调用`vm.__patch__`时都会新创建一个`insertedVnodeQueue`空数组，也就是说，`insertedVnodeQueue`仅收集组件单次`vm.__patch__`过程中遇到的带有`vnode.data.hook.insert`钩子的 VNode。

另外一点，当子组件首次渲染时，不会急着遍历`insertedVnodeQueue`并调用各个 VNode 的`insert`方法，而是将`insertedVnodeQueue`转存至子组件占位 VNode 的`vnode.data.pendingInsert`上，等到子组件占位节点在做子组件初始化时，再将这些子组件的`insertedVnodeQueue`都`push`到父组件的`insertedVnodeQueue`中。

子组件`vm.__patch__()`的最后（下面代码里的`vnode`是指子组件渲染 VNode，`vnode.parent`是指子组件占位 VNode）：

```js
export function createPatchFunction (backend) {
  // ...
  /**
   * 调用 insert 钩子函数（如果是组件节点，则调用组件的 mounted 钩子）
   * @param {*} vnode 虚拟节点
   * @param {*} queue 待调用 insert 钩子函数的 VNode 数组，这些 VNode 都有 insert 钩子
   * @param {*} initial 是否是子组件的首次渲染
   */
  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      // 此处的 vnode 是子组件实例的渲染 VNode，vnode.parent 是子组件实例的占位 VNode

      // 若是子组件的首次渲染，则不先调用 queue 里的各个 VNode 的 insert 钩子
      // 而是将 queue 赋给子组件占位 VNode 的`vnode.data.pendingInsert`
      // 等到子组件实例初始化时，再做处理
      vnode.parent.data.pendingInsert = queue
    } else {
      for (let i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i])
      }
    }
  }
  // ...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    // ...
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    // ...
  }
}
```

初始化子组件实例时（下面的`vnode`是指子组件的占位 VNode）：

```js
export function createPatchFunction (backend) {
  // ...
  /**
   * 初始化组件实例
   */
  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      // 将子组件在创建 DOM Tree 过程中新增的所有带 insert 钩子的 VNode 数组添加到 insertedVnodeQueue 中
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
      vnode.data.pendingInsert = null
    }
    // 获取到组件实例的 DOM 根元素节点
    vnode.elm = vnode.componentInstance.$el
    if (isPatchable(vnode)) {
      // 调用 create 钩子
      invokeCreateHooks(vnode, insertedVnodeQueue)
      setScope(vnode)
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode)
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode)
    }
  }
  // ...
}
```

insertedVnodeQueue 的添加顺序是先子后父

所以对于同步渲染的子组件而言，

### 钩子函数的执行顺序

- 先父组件后子组件的有：
  - `beforeCreate`
  - `created`
  - `beforeMount`
  - `beforeUpdate`
  - `updated`
  - `beforeDestroy`
- 先子组件后父组件的有：
  - `mounted`
  - `destroy`

### 组件更新算法
