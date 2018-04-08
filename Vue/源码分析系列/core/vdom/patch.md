# patch 源码学习和收获

执行`patch`函数，是为了将根实例/组件生成的 VNode Tree 转变成 DOM Tree，最后插入到文档内。在此过程中，会新增 DOM 元素、修补（patch）DOM 元素、删除 DOM 元素。

- 组件创建时，会首次调用`patch`，会根据 VNode Tree 生成 DOM Tree，DOM Tree 里所有元素都是新创建的。
    - 深度递归生成 DOM Tree
- 组件发生改变时，每次都会调用`patch`，会根据改变前后的 VNode Tree 修改 DOM Tree，该过程可能会新增 DOM 元素、修补（patch）DOM 元素、删除 DOM 元素。
- 组件销毁时，最后一次调用`patch`，会销毁 DOM Tree。

## 分析

### 子组件返回的`vnode`都是占位`vnode`，最后生成 DOM 的时候是如何处理的？


### updateChildren

若是两个 vnode 节点


### Vue 实例首次渲染时，渲染后的模板是如何以及何时挂载到 el 元素上的？

```js
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm, // 父元素
  nodeOps.nextSibling(oldElm) // 后一兄弟元素，新元素将挂载在父元素之下，后一兄弟元素之前
)
```

首次渲染会基于`render`函数产生的`vnode`创建新的元素，元素创建好后，会将元素插入到父节点之下，完成元素的挂载。


## `patch`各个步骤分析

### `patch`函数

`patch`函数是根据组件的新旧 VNode Tree，生成、修补、销毁组件的 DOM Tree。

```js
function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
  if (isUndef(vnode)) {
    // 销毁 vnode 节点
    // 组件调用 Vue.prototype.$destroy 时，会调用 vm.__patch__(vm._vnode, null) 销毁 vnode 节点
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element

    // 生成子组件的 DOM Tree（子组件实例首次 patch，oldVnode 为 undefined）
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue, parentElm, refElm)
  } else {
    // 根组件实例首次 patch，oldVnode 为要挂载到的 DOM 元素
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 新旧 VNode Tree 进行 patch
      patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
    } else {
      // 根组件实例首次 patch || （更新时）新旧 vnode 不能 patch
      if (isRealElement) {
        // 根组件实例首次 patch

        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR)
          hydrating = true
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true)
            return oldVnode
          } else if (process.env.NODE_ENV !== 'production') {
            warn(
              'The client-side rendered virtual DOM tree is not matching ' +
              'server-rendered content. This is likely caused by incorrect ' +
              'HTML markup, for example nesting block-level elements inside ' +
              '<p>, or missing <tbody>. Bailing hydration and performing ' +
              'full client-side render.'
            )
          }
        }
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it

        // 若是根实例首次 patch，将 el 处理出 oldVnode 的形式，再统一处理
        // （则创建空的 vnode 节点，tag 为 DOM 元素的标签名，elm 为该 DOM 元素）
        oldVnode = emptyNodeAt(oldVnode)
      }

      // replacing existing element
      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)

      // 创建新 DOM 节点，并插入到父元素上
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm, // 父元素
        nodeOps.nextSibling(oldElm) // 后一兄弟元素，新元素将挂载在父元素之下，后一兄弟元素之前
      )

      // update parent placeholder node element, recursively
      // 递归更新占位的父 vnode（待发现实际使用情景）
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent
        const patchable = isPatchable(vnode)
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
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

      // 移除、销毁旧节点
      if (isDef(parentElm)) {
        removeVnodes(parentElm, [oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  // 针对所有新创建的节点，调用 insert 钩子函数
  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
```


### `createElm`函数

`createElm`函数是为`vnode`节点创建关联的 DOM 元素，其步骤如下：

1. 调用`createComponent`函数创建组件`vnode`对应的元素
    - 若`vnode.data.hook.init()`钩子函数存在
        - 则调用`init()`钩子函数生成`vnode.componentInstance`并渲染、挂载到父元素
            - 注意：`vm.$mount()`里会新建渲染`watcher`，执行`vm._update(vm._render())`
            - 注意：此过程将以`componentInstance`为中心，创建其下所有的子元素、子组件 
    - 若上一步有生成`vnode.componentInstance`
        - 调用`initComponent`函数，初始化组件实例
            - `vnode.elm = vnode.componentInstance.$el`
            - 若`isPatchable(vnode)`
                - 调用`invokeCreateHooks`，执行`create`钩子函数
                - 设置`vnode`的 scope
            - 若`!isPatchable(vnode)`
                - 注册`ref`
                - `insertedVnodeQueue.push(vnode)`
        - 返回，不再继续往下
    - 若上一步没生成`vnode.componentInstance`，进入下一步
2. 创建非组件元素（正常 HTML 元素、注释、文本节点）
    - HTML 元素节点
        - 创建`vnode`对应的 DOM 元素`vnode.elm`
        - 设置`vnode`的 scope
        - 调用`createChildren`创建子节点
            - 若子节点是数组
                - （非生产环境）子节点去重
                - 循环调用`createElm`创建子虚拟节点对应的 DOM 元素
            - 若 vnode 是仅包含文本的元素
                - 创建文本节点并插入到`vnode.elm`
        - （如果有）调用`invokeCreateHooks`，执行`create`钩子函数
        - 将`vnode.elm`插入到父元素
    - 注释/文本节点
        - 创建注释/文本节点`vnode.elm`
        - 将`vnode.elm`插入到父元素

需要注意的是，
- 若`createElm`创建的是 HTML 元素（即`vnode.tag`为正常的 HTML 标签），生成对应的 DOM 元素后，会调用`createChildren`函数创建子节点，进而递归调用`createElm`创建子孙节点
- 若`createElm`创建的是组件节点（即`vnode`是占位虚拟节点，`vnode.tag`为`vue-component-${cid}-${name}`形式），则会以该组件为起点，递归创建该组件以下的所有子孙节点

```js
/**
  * 创建节点，若是非组件节点则插入到父元素里
  * @param {*} vnode 虚拟节点
  * @param {*} insertedVnodeQueue
  * @param {*} parentElm 父元素（基本都会有，除了一种情况，在 patch 函数里）
  * @param {*} refElm nextSibling 节点，如果有，插入到父节点之下该节点之前
  * @param {*} nested 是否是嵌套创建元素，在 createChildren 里调用 createElm 时，该值为 true
  * @param {*} ownerArray 若 vnode 来源于某个 VNode 类型的数组，该参数即为该数组（比如该 vnode 是 vnodeParent 的子节点，ownerArray 即为 vnodeParent.children）
  * @param {*} index vnode 在 ownerArray 中的索引
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

  // 子组件节点：创建子组件实例，以子组件实例为起点，创建整个子组件的 DOM Tree
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  // 非组件节点（正常 HTML 元素、注释、文本节点）
  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    // 元素类型的 vnode
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
      // 创建子节点
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        // 调用 create 钩子
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      // 将 vnode 对应的 DOM 节点，插入到父元素
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    // 注释类型的 vnode
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    // 文本类型的 vnode
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```
