---
sidebarDepth: 0
---

# 创建子组件实例

[[toc]]

[创建组件实例](/vue/source-study/instance/create.html)一节中我们知道，根组件是用户显式调用`new Vue()`创建的 Vue 实例。除根组件实例之外的 Vue 实例，我们统称为子组件实例。而子组件，都是在根组件`patch`的过程中创建的。

PS：一般所说的组件，都是指子组件，当指根组件时，会强调是根组件。

当调用`createElm`为 VNode 创建对应的 DOM 节点时，会先判断该 VNode 是否是组件占位节点。如果是，则创建组件实例，并结束`createElm`的过程；否则，继续为非组件占位 VNode 创建对应的 DOM 元素/文本/注释节点。

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
    // 组件占位 VNode：创建组件实例以及创建整个组件的 DOM Tree，（若 parentElm 存在）并插入到父元素上
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
    // ...
  }
```

## createComponent

`createComponent`主要负责创建组件占位 VNode 的组件实例并做一些事后处理工作，而对于非组件占位 VNode 将不做任何操作并返回`undefined`。

我们在为组件创建组件占位 VNode 时，会在组件占位 VNode 的`vnode.data.hook`上[安装一系列的组件管理钩子方法](/vue/source-study/vdom/vnode-tree-create.html#安装组件管理钩子方法)，其中就存在`init`钩子。

若传入的 VNode 是组件占位 VNode，则将存在`vnode.data.hook.init()`钩子，调用`init`钩子后，将为组件占位 VNode 创建组件实例`vnode.componentInstance`。因此针对组件占位 VNode，`createComponent`函数最终将返回`true`，以表明该传入的 VNode 是组件占位 VNode，并完成了组件实例的创建工作。

反之，若传入的 VNode 不是组件占位 VNode，则不会存在`vnode.data.hook.init()`钩子，更加不会创建出组件实例`vnode.componentInstance`，因此最终`createComponent`函数将返回`undefined`，`createElm`函数将继续往下执行，为非组件占位 VNode 创建对应的 DOM 节点。

`createComponent`的主要流程为：

1. 若 VNode 存在`vnode.data.hook.init`方法，说明是组件占位 VNode，则创建组件实例，挂在`vnode.componentInstance`上
2. 若`vnode.componentInstance`存在
    - 初始化组件实例，设置`vnode.elm`
    - 将组件的 DOM Tree 插入到父元素上
    - 返回 true
3. 针对非组件占位 VNode，返回`undefined`

```js
// src/core/vdom/patch.js
export function createPatchFunction (backend) {
  // ...
  /**
   * 创建组件占位 VNode 的组件实例
   * @param {*} vnode 组件占位 VNode
   * @param {*} insertedVnodeQueue
   * @param {*} parentElm DOM 父元素节点
   * @param {*} refElm DOM nextSibling 元素节点，如果存在，组件将插入到 parentElm 之下，refElm 之前
   */
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
      // 是否是重新激活的节点（keep-alive 的组件 activated 了）
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        // 若是 vnode.data.hook.init 存在（该方法是在 create-component.js 里创建组件的 Vnode 时添加的）
        // 说明是组件占位 VNode，则调用 init 方法创建组件实例 vnode.componentInstance
        i(vnode, false /* hydrating */)
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      // 注释翻译：
      // 若是该 VNode 是子组件（的占位 VNode），调用 init 钩子方法后，该 VNode 将创建子组件实例并挂载了
      // 子组件也设置了占位 VNode 的 vnode.elm。此种情况，我们就能返回 true 表明完成了组件实例的创建。
      if (isDef(vnode.componentInstance)) {
        // 初始化组件实例
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
  // ...
}
```

### vnode.data.hook.init

```js
// src/core/vdom/create-component.js

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
      // 创建子组件实例
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      // 对于正常的子组件初始化，会执行 $mount(undefined)
      // 这样将创建组件的渲染 VNode 并创建其 DOM Tree，但是不会将 DOM Tree 插入到父元素上
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  }
}

/**
 * 创建子组件实例
 * @param {*} vnode 组件占位 VNode
 * @param {*} parent 创建该组件时，处于活动状态的父组件，如此形成组件链
 */
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  // 创建子组件实例时，传入的 options 选项
  const options: InternalComponentOptions = {
    // 标明是内部子组件，在调用组件的 _init 初始化时，将采用简单的配置合并策略
    _isComponent: true,
    // 组件的占位 VNode
    _parentVnode: vnode,
    // 当前处于活动状态的父组件
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

`init`钩子方法里，会先调用`createComponentInstanceForVnode`创建子组件的实例。

在`createComponentInstanceForVnode`函数里，`vnode.componentOptions.Ctor`是在为组件创建 VNode 时传入的组件构造函数，该构造函数是基于`Vue`构造函数继承而来，并混合了组件自身的选项在`Ctor.options`里。此外，创建实例时，也会往`Ctor`里传入`options`选项，但是这个`options`跟创建根组件传入的`options`有些许区别。

- `_isComponent: true`：用来标明这个组件是内部子组件，在调用组件的`_init`方法初始化时，将采用简单的配置合并，详见[合并配置 - 子组件](/vue/source-study/component/options.html#子组件)
- `_parentVnode: vnode`：`vnode`是当前子组件实例的占位 VNode，用于在后续合并配置时将组件实例跟组件占位 VNode 联系起来
- `parent`：创建当前子组件实例时，处于活动状态的父组件

`new vnode.componentOptions.Ctor(options)`将生成组件实例，并调用`vm._init`方法对组件实例做初始化工作后返回组件实例。

`init`钩子里，创建完子组件实例之后，会将子组件实例赋给`vnode.componentInstance`，这样的话，组件占位 VNode 和组件实例就联系了起来。之后，调用子组件实例的`$mount`方法，但是传入的第一个参数为`undefined`，子组件实例将调用`vm._render`方法生成渲染 VNode，并调用`vm._update`进而调用`vm.__patch__`创建组件的 DOM Tree，但是不会将 DOM Tree 插入到父元素上，插入到父元素的操作将在初始化子组件实例时完成，请见下一节。

::: tip 重要提示
此处创建子组件的实例时，会创建子组件的渲染 VNode 并创建子组件的 DOM Tree。若是子组件里有子孙组件，也会递归创建子孙组件的实例、创建子孙组件的渲染 VNode，并创建子孙组件的 DOM Tree。
:::

### initComponent

```js
  /**
   * 初始化组件实例
   */
  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      // 将子组件在创建过程中新增的所有节点加入到 insertedVnodeQueue 中
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
  /**
   * 判断 vnode 是否是可 patch 的：若组件的根 DOM 元素节点，则返回 true
   */
  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode
    }
    // 经过 while 循环后，vnode 是一开始传入的 vnode 的首个非组件节点对应的 vnode
    return isDef(vnode.tag)
  }
```

初始化组件实例过程中，需要做比较多的工作：

- 将子组件首次渲染创建 DOM Tree 过程中收集的`insertedVnodeQueue`（保存在子组件占位 VNode 的`vnode.data.pendingInsert`里）添加到父组件的`insertedVnodeQueue`，详见[Patch - insertedVnodeQueue 的作用](/vue/source-study/vdom/patch.html#insertedvnodequeue-的作用)
- 获取到组件实例的 DOM 根元素节点，赋给`vnode.elm`
- 判断组件是否是可`patch`的
  - 组件可`patch`
    - 调用`create`钩子，详见[patch 辅助函数 - invokeCreateHooks](/vue/source-study/vdom/patch-fn.html#invokecreatehooks)
    - 设置`scope`
  - 组件不可`patch`
    - 注册组件的`ref`
    - 将组件占位 VNode 加入到`insertedVnodeQueue`

#### VNode 不可 patch 的情况

在判断组件是否可`patch`时，判断的依据是组件的 DOM Tree 的根节点是否是元素节点。在模板编译时，当组件模板的根节点不是元素节点时，编译会报错；但是在用户手写的`render`函数里，可以给`createElement`传入`falsy value`，比如`''`/`null`/`undefined`，此时`createElement`会返回个注释类型 VNode。

```html
<template>
  <div id="app">
    <HelloWorld ref="hello" :hello="a"></HelloWorld>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    HelloWorld: {
      name: 'HelloWorld',
      data () {
        return {
        }
      },
      render (h) {
        // return h(null)
        // return h(undefind)
        return h('')
      }
    }
  },
  mounted () {
    console.log(this.$refs.hello)
  }
}
</script>
```

上面的组件的根节点就是个注释类型的 VNode，但是仍要保留组件的`ref`以及执行组件在插入父元素上时的`insert`钩子。

### 组件 DOM Tree 插入到父元素

当组件创建好并初始化好组件实例之后，其 DOM Tree 也已经完全 ready，此时若是存在`parentElm`，就会将组件的 DOM Tree 插入到`parentElm`。若是该组件同时作为其他组件渲染 VNode 的根节点，则不会存在`parentElm`，也不会插入到`parentElm`。详见：[组件的 DOM Tree 是如何插入到父元素上的？](/vue/source-study/vdom/topics/dom-binding.html)
