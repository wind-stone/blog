# 修补 VNode

[[toc]]

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

## 修补子组件

若是要修补的是子组件占位 VNode，则会调用子组件占位 VNode 的`prepatch`钩子，其主要作用是更新子组件实例上挂载的一些数据，如有必要，还需要强制子组件重新渲染。其内容主要有：

- 更新`vm.$options._parentVnode`/`vm.$vnode`/`vm.$options._renderChildren`
- 更新`vm.$attrs`/`vm.$listeners`，且这两个属性是响应式的，若是子组件视图对它们有依赖，会自动进行重新渲染
- 更新`vm._props`，且这个属性是响应式的，若是子组件视图对它们有依赖，会自动进行重新渲染
- 更新自定义事件
- （若存在`slot`）更新`vm.$slots`，且强制渲染子组件

```js
const componentVNodeHooks = {
  // ...
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    // 子组件占位 VNode 的 patch，复用组件实例
    const child = vnode.componentInstance = oldVnode.componentInstance
    // 更新子组件实例
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  }
  // ...
}
```

```js
/**
 * 更新子组件实例
 */
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  const hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  )

  // 更新子组件实例指向的子组件占位 VNode
  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  // 替换为新的 static slots
  vm.$options._renderChildren = renderChildren

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  // 更新子组件的 $attrs 和 $listeners，这两个属性也是响应式的，若是子组件视图里使用了它们，会引起子组件的重新渲染
  vm.$attrs = parentVnode.data.attrs || emptyObject
  vm.$listeners = listeners || emptyObject

  // update props
  // 更新子组件的 props
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      // props 是响应式的，若是子组件视图依赖某个 prop，prop 改变，会想起子组件重新渲染
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  // update listeners
  listeners = listeners || emptyObject
  const oldListeners = vm.$options._parentListeners
  vm.$options._parentListeners = listeners
  updateComponentListeners(vm, listeners, oldListeners)

  // resolve slots + force update if has children
  // 若是子组件存在 slot，则强制渲染该组件
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}
```

::: warning 注意事项
调用子组件占位 VNode 的`prepatch`钩子是对组件实例进行修补，比如`vm.$attrs`/`vm.$listeners`/传入的`props`/自定义事件/`vm.$slots`等，但是`vm.$attrs`/`vm.$listeners`是响应式的，若子组件视图依赖了这些属性，这些属性的变化到导致子组件模板重新渲染。
:::

## 修补子 VNode

修补完 VNode 后，若新旧 VNode 都存在子 VNode，则需要递归地对子 VNode 进行修补。

修补过程中，会尽可能地去寻找哪些新旧 VNode 是`sameVnode`。若是新 VNode 能找到`sameVnode`的旧 VNode，则递归地修补该子 VNode，若找不到，会针对新子 VNode 创建 DOM 节点。若是`newChildren`数组里的新子 VNode 都处理完毕，但是`oldChildren`里仍存在未处理的旧子 VNode，则需要将这些旧子 VNode 都移除掉；若是`oldChildren`里旧子 VNode 都被处理完了但是`newChildren`还有未处理的新子 VNode，则需要未这些新子 VNode 创建对应的 DOM 节点。

而在对于新旧子 VNode 是否是`sameVnode`的过程中，为了在单次循环里尽可能多地比较新旧子 VNode 是否是`sameVnode`，且不添加新的循环而引入更大的复杂度，每次循环里会进行四次比较：

- `oldStartVnode` vs `newStartVnode`
- `oldEndVnode` vs `newEndVnode`
- `oldStartVnode` vs `newEndVnode`
- `oldEndVnode` vs `newStartVnode`

其中，前两种出现的概率最大，而两种是为了尽量多地比较但又不引入新的循环的情况下进行比较的。

更详细的过程，请参考下面的源码注释，已经比较清晰了。

```js
  /**
   * 更新 VNode 的子 VNode
   * @param {*} parentElm VNode 对应的 DOM 元素节点
   * @param {*} oldCh 旧 VNode 的子 VNode 数组
   * @param {*} newCh 新 VNode 的子 VNode 数组
   * @param {*} insertedVnodeQueue
   * @param {*} removeOnly
   */
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    // 下一个未经 patch 的旧子 VNode 节点，在此索引之前的旧子 VNode 都已经处理完毕
    let oldStartVnode = oldCh[0]
    // 最后一个未经 patch 的旧子 VNode 节点，在此索引之后的旧子 VNode 都已经处理完毕
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    // 下一个未经 patch 的新子 VNode 节点，在此索引之前的新子 VNode 都已经处理完毕
    let newStartVnode = newCh[0]
    // 最后一个未经 patch 的新子 VNode 节点，在此索引之后的新子 VNode 都已经处理完毕
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    // 为了在单次循环里尽可能多地比较新旧子 VNode 是否是`sameVnode`，且不添加新的循环而引入更大的复杂度，每次循环里会进行四次比较：
    // - oldStartVnode vs newStartVnode
    // - oldEndVnode vs newEndVnode
    // - oldStartVnode vs newEndVnode
    // - oldEndVnode vs newStartVnode
    // 其中，前两种出现的概率最大，而两种是为了尽量多地比较但又不引入新的循环的情况下进行比较的。
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 这里要针对 oldStartVnode 和 oldEndVnode 判断是否为 undefined，是因为最后一个 else 里的逻辑可能会将旧子 VNode 设置为 undefined
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // PS：oldStartVnode 和 newStartVnode，最有可能是同一个 VNode
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // PS：oldEndVnode 和 newEndVnode，最有可能是同一个 VNode
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // PS：oldStartVnode 和 newEndVnode，也有可能是同一个 VNode
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        // patch 后将 oldStartVnode 对应的 DOM 节点移到 oldEndVnode 对应的 DOM 节点之后
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // PS：oldEndVnode 和 newStartVnode，也有可能是同一个 VNode
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        // patch 后将 oldEndVnode 对应的 DOM 节点移到 oldStartVnode 对应的 DOM 节点之前
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 查找 newStartVnode 在 oldChildren 里对应的 oldVnode 的索引
        // 注意：oldStartIdx 之前和 oldEndIdx 之后的 VNode 都已经处理完毕
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          // 若是没找到对应的 oldVnode，创建新的元素
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          // 若是找到对应的 oldVnode
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 移动
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    if (oldStartIdx > oldEndIdx) {
      // oldChildren 先遍历完，说明 newChildren 存在多余节点，添加这些新节点
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      // newChildren 先遍历完，说明 oldChildren 存在多余节点，删除掉
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

PS：

- 修补 DOM 的过程仅发生在同级的 DOM 节点上
- 若 DOM 节点不是同级，将删除旧 DOM，生成新 DOM
- `patch`的复杂度是`O(n)`

以上是针对修补子 VNode 的详细文字描述，若是仍不够直观，可以参考[黄老师简单明了的图形化示例](https://ustbhuangyi.github.io/vue-analysis/reactive/component-update.html#updatechildren)。

## TODO: 等待学习 slot 之后，需要重新审视一下子组件里有 slot 时的情况
