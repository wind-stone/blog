# 客户端激活

[[toc]]

请先了解[Vue SSR 指南 - 客户端激活](https://ssr.vuejs.org/zh/guide/hydration.html)。

服务端渲染的 HTML 里，`app`元素上会存在一个特殊的属性`data-server-rendered="true"`，该属性让客户端 Vue 知道这部分 HTML 是由 Vue 在服务端渲染的，并且应该以激活模式进行挂载。

```html
<div id="app" data-server-rendered="true">
```

在`entry-client.js`里，我们用下面这行挂载(`mount`)应用程序：

```js
app.$mount('#app')
```

客户端在接收到服务端渲染的 HTML 后，会加载、运行入口 JS（会包含`entry-client.js`）文件，生成根组件实例`app`，并调用`app.$mount('#app')`进行挂载。

```js
// src/platforms/web/runtime/index.js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

```js
// src/core/instance/lifecycle.js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // ...

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    // ...
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  // Vue 根实例没有 $vnode 属性，需要手动调用 mounted 生命周期钩子函数
  // （子组件会在 Vnode 的 inserted 钩子里调用 mounted 生命周期函数）
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

```js
// src/core/instance/lifecycle.js
export function lifecycleMixin (Vue: Class<Component>) {
  /**
   * 该函数的主要作用是，传入新的 vnode，更新视图。
   */
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // 如果是根实例 patch，vm.$el 有值，vm.$options._parentElm 无值，最终会挂载在 vm.$el.parent 之下
      // 如果是组件实例，vm.$el 为空，vm.$options._parentElm 有值，最终会挂载在 vm.$options._parentElm 之下
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    // ...
  }
  // ...
}
```

在`mountComponent`函数里创建渲染 Watcher，调用`vm._render`生成 VNode，调用`vm._update`进而进行首次`patch`。直到这里，与 CSR 一样并没有什么不同。

## SSR 的 patch

SSR 的`patch`过程和 CSR 的`patch`过程是不太一样的。若是 SSR，会在`patch`里处理客户端激活，若激活失败，则丢弃 SSR 产生的 HTML，走与 CSR 一样的`patch`流程。

```js
// src/core/vdom/patch.js
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
        // ...
        // 根组件实例首次 patch || （更新时）新旧 vnode 不是同一 vnode
        if (isRealElement) {
          // 根组件实例首次 patch

          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            // 判断出是 SSR 渲染后的客户端激活，将 data-server-rendered 属性移除，标记为客户端激活
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }

          // 处理客户端激活
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              // 若是成功激活，直接返回；否则走 CSR 的流程，创建 DOM 并挂载
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
                // ...
            }
          }
        }
        // ...
  }
```

`hydrate`函数里主要做了以下几件事情：

- 检查 SSR 产生的 DOM 节点与客户端生成的 VNode 是否匹配，主要检查标签名称是否匹配，且会递归地检查子节点
- 往 SSR 产生的 DOM 节点上添加事件处理函数等模块（`class`/`staticClass`/`attrs`等除外，这些已经在 SSR 时添加到节点上了）

```js
// src/core/vdom/patch.js

  /**
   * SSR 渲染的客户端激活过程
   * @param {*} elm DOM 元素
   * @param {*} vnode 根组件的 VNode
   * @param {*} insertedVnodeQueue
   * @param {*} inVPre
   * @returns
   */
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    let i
    const { tag, data, children } = vnode
    inVPre = inVPre || (data && data.pre)

    // 将 SSR 的节点作为 VNode 的 elm，在之后调用 invokeCreateHooks 时，会往 SSR 产生的 DOM 节点上添加事件处理函数等
    vnode.elm = elm

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true
      return true
    }
    // assert node match
    if (process.env.NODE_ENV !== 'production') {
      // 检查 SSR 产生的根节点和客户端生成的根节点对应的 VNode 的标签名称是否匹配，若不匹配则激活失败
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }

    // 组件占位节点
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode, true /* hydrating */)
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue)
        return true
      }
    }

    // 常规 DOM 节点
    if (isDef(tag)) {
      // VNode 的节点具有子节点，则需要检查 SSR 的 DOM 节点的子节点和 VNode 的子节点是否匹配
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          // VNode 有子节点，但是 SSR 的对应节点没有子节点，则允许往节点上追加子节点的 DOM
          createChildren(vnode, children, insertedVnodeQueue)
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true
                console.warn('Parent: ', elm)
                console.warn('server innerHTML: ', i)
                console.warn('client innerHTML: ', elm.innerHTML)
              }
              return false
            }
          } else {
            // iterate and compare children lists
            let childrenMatch = true
            let childNode = elm.firstChild
            // 递归地激活（混合）子节点
            for (let i = 0; i < children.length; i++) {
              if (!childNode || !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)) {
                childrenMatch = false
                break
              }
              childNode = childNode.nextSibling
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              // 若 SSR 的 DOM 节点的子节点与 VNode 的子节点不匹配，则激活失败
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true
                console.warn('Parent: ', elm)
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children)
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        let fullInvoke = false
        for (const key in data) {
          // attrs,class,staticClass,staticStyle,key 等都在 SSR 时已经添加到 DOM 上，不需要再处理
          // 但是针对事件处理函数等，需要再添加的 DOM 上
          if (!isRenderedModule(key)) {
            fullInvoke = true
            // 往 SSR 的节点上添加事件处理函数等（hydrate 函数的开头，已经将 SSR 节点 elm 赋值给 vnode.elm）
            invokeCreateHooks(vnode, insertedVnodeQueue)
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class'])
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text
    }
    return true
  }
```
