# patch 辅助函数

[[toc]]

## VNode/DOM 操作相关

### sameVnode

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

### removeVnodes：移除子 VNode 及其 DOM 元素节点

```js
  /**
   * 移除一批子 VNode 及其 DOM 元素节点
   * @param {Element} parentElm 父 DOM 元素节点
   * @param {Vnode} vnodes 要移除的子 VNode 数组
   * @param {Number} startIdx 要移除的开始索引（包含）
   * @param {Number} endIdx 要移除的结束索引（包含）
   */
  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          // 移除 DOM 元素节点，并调用 remove 钩子
          removeAndInvokeRemoveHook(ch)
          // 移除 Vnode，并调用 destroy 钩子
          invokeDestroyHook(ch)
        } else { // Text node
          // vnode 没有 tag 属性，即为文本节点，则删除文本节点
          removeNode(ch.elm)
        }
      }
    }
  }
```

### removeAndInvokeRemoveHook：移除 VNode 对应的 DOM 元素节点

```js
  /**
   * （递归地）移除 VNode 对应的 DOM 元素节点
   * @param {Vnode} vnode Vnode 节点
   * @param {Function} rm 回调函数，在其中删除 DOM 元素节点
   */
  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      let i
      // 加一是因为除了要调用 cbs.remove 上的所有函数，还要执行 vnode.data.hook.remove 函数
      const listeners = cbs.remove.length + 1
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners)
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm)
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm)
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm)
      } else {
        rm()
      }
    } else {
      removeNode(vnode.elm)
    }
  }
```

### removeNode：移除 DOM 元素节点

```js
  /**
   * 移除 DOM 节点节点
   */
  function removeNode (el) {
    const parent = nodeOps.parentNode(el)
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el)
    }
  }
```

## 钩子函数

### invokeCreateHooks

DOM 元素在创建好之后、插入到父元素之前，会调用`create`钩子。子组件实例在创建好之后、初始化子组件时、插入到父元素之前，也会调用`create`钩子。

在[createPatchFunction - 合并各模块的钩子函数](/vue/source-study/vdom/patch.html#合并各模块的钩子函数)里可以看到，每个模块都有`create`钩子，这些模块的`create`钩子处理新创建的 DOM 元素/子组件实例，包括：

- 注册`ref`
- 注册`directives`
- 添加`class`特性
- 添加`style`属性
- 添加其他`attrs`特性
- 添加原生事件处理
- 添加`dom-props`，如`textContent`/`innerHTML`/`value`等
- （待补充）

```js
  /**
   * 单个 DOM 元素节点创建好后，添加其 ref、directives、class、style 等等
   */
  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {

      cbs.create[i](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode)
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
    }
  }
```

此外，若 VNode 存在`vnode.data.hook.create`钩子，将调用该钩子；若存在`vnode.data.hook.insert`钩子，会将该 VNode 加入到父组件的`insertedVnodeQueue`数组里。

### invokeDestroyHook：销毁 VNode

```js
  /**
   * （递归地）销毁 VNode 节点及其子 VNode 节点
   */
  function invokeDestroyHook (vnode) {
    let i, j
    const data = vnode.data
    if (isDef(data)) {
      // 组件占位 VNode 的 destroy 钩子
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
      // 各个模块的 detroy 钩子
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    }
    // 递归地销毁子 VNode
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j])
      }
    }
  }
```

#### 组件占位 VNode 的 destroy 钩子

```js
const componentVNodeHooks = {
  // ...
  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        // 销毁组件实例
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
```
