---
sidebarDepth: 0
---

# 事件监听器

[[toc]]

我们通常通过`v-on`指令或其缩写`@`监听元素上的事件。用在普通元素上时，只能监听原生 DOM 事件；用在自定义元素组件上时，也可以监听子组件触发的自定义事件。该节主要分析监听事件是如何与元素关系到一起，以及如何实现的。

## 组件自定义事件

组件自定义的事件监听器是在组件实例初始化时

在导出[基础核心版 Vue](/vue/source-study/vue-constructor.html#基础核心版-vue)构造函数时，会调用`eventsMixin(Vue)`给`Vue`构造函数的原型添加一些事件相关的方法，即`Vue`构造函数实现了事件接口，`Vue`实例将具有发布订阅事件的能力。

### eventsMixin

此处添加的几个方法，实现了发布订阅模式，其中：

- `$on`：添加订阅事件
- `$off`：删除订阅事件
- `$once`：添加单次执行的订阅事件，第一次执行监听器函数之后，即删除该事件的订阅
- `$emit`：发布事件

```js
// src/core/instance/event.js

/**
 * 发布订阅模式
 *
 * 每个 Vue 实例自带发布订阅的能力，即实现了事件接口，此能力是通过在`Vue.prototype`上添加`$on`、`$off`、`$emit`、`$once`方法实现的。
 */
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    // 挂载原始的 fn，方便通过 $off 删除
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    if (fn) {
      // specific handler
      let cb
      let i = cbs.length
      while (i--) {
        cb = cbs[i]
        // cb.fn 是通过 $once 添加的
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args)
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`)
        }
      }
    }
    return vm
  }
}
```

发布订阅模式实现的代码里，有一点需要我们注意，就是如何删除单次执行的订阅事件。我们看到，通过`$once`添加的单次执行的订阅事件，会将原始的监听器函数`fn`挂载在封装的监听器函数`on`的`fn`属性上，即`on.fn = fn`，这么做就方便了在用户通过`$off`方法删除单次执行的订阅事件时，能够找到通过`$once`添加的单次执行的订阅事件的监听器`fn`了。

### 添加自定义事件

#### initEvents

组件实例在初始化时，在`_init`方法里会调用`initEvents`，以初始化组件实例上事件相关的属性，比如在上一小节原型方法里的`_events`和`_hasHookEvent`属性。最后调用`updateComponentListeners`将事件监听器添加到`vm._events`上。

```js
// src/core/instance/event.js

export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  // 将挂载在组件标签上的 listeners 更新到组件上
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

#### listeners 的来源

详细分析`updateComponentListeners`如何将事件监听器添加到`vm._events`之前，我们先来了解下事件监听器数据`listeners`是如何而来的。

`initEvents`函数里的`listeners`来源于组件占位节点上的监听器数据（模板编译）或元素的数据对象的`on`属性上的监听器数据（用户编写的`render`函数），在创建组件占位 VNode 时，会将这些监听器数据`listeners`添加到组件占位 VNode 的`componentOptions`属性上去。在组件`_init`初始化时，会将组件占位 VNode 上的`componentOptions`数据合并到`vm.$options`上，最终可以在`initEvents`上获取到`vm.$options._parentListeners`。

TODO: 模板编译时，如何获取`data.on`和`data.nativeOn`？

```js
// src/core/vdom/create-component.js

export function createComponent (...) {
  // ...

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    // vnode.componentOptions
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  // ...
}
```

```js
// src/core/instance/init.js

/**
 * 针对组件实例，合并 vm.constructor.options 和 new Ctor(options) 时传入的 options
 * 请同时参考 create-component.js 里的 createComponentInstanceForVnode 函数
 */
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  // 该组件实例对应的父占位节点，_parentVnode 的 name 属性格式为 vue-component-Ctor.cid-name
  const parentVnode = options._parentVnode
  // ...
  const vnodeComponentOptions = parentVnode.componentOptions
  // 组件实例的 opts 要挂载 parentVnode 上的 listeners
  opts._parentListeners = vnodeComponentOptions.listeners
  // ...
}
```

#### updateComponentListeners

无论是组件添加、删除、更新自定义事件，都是调用`updateComponentListeners`完成的，只是每次传入的`listeners`和`oldListeners`参数不一样罢了。

```js
// src/core/instance/event.js

let target: any

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn)
  } else {
    target.$on(event, fn)
  }
}

function remove (event, fn) {
  target.$off(event, fn)
}

export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, vm)
  target = undefined
}
```

`updateComponentListeners`实际是对`updateListeners`的封装。注意到组件初始化时调用`updateComponentListeners`并没有传入第三个`oldListeners`，因为是组件首次初始化，肯定没有老的监听器数据。

在调用`updateListeners`时会传入`add`、`remove`参数，这两个参数都是函数，函数内分别是调用了`vm.$on/$once`、`vm.$off`来添加或删除组件的订阅事件。

::: warning 注意事项
`add`函数和`remove`函数都是将事件注册/移除在`target`上，而`target`是子组件实例。这也就是说，尽管自定义事件的事件处理方法是父组件的方法，但是最终事件是注册在子组件实例上的。（事件处理方法的`this`已经绑定了父组件实例）
:::

#### updateListeners

```js
// src/core/vdom/helpers/update-listeners.js

/**
 * 标准化事件名称，返回一个对象，包含:
 *   文件名
 *   是否监听一次
 *   是否采取捕获模式
 *   是否 passive
 */
const normalizeEvent = cached((name: string): {
  name: string,
  once: boolean,
  capture: boolean,
  passive: boolean,
  handler?: Function,
  params?: Array<any>
} => {
  const passive = name.charAt(0) === '&'
  name = passive ? name.slice(1) : name
  const once = name.charAt(0) === '~' // Prefixed last, checked first
  name = once ? name.slice(1) : name
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name
  return {
    name,
    once,
    capture,
    passive
  }
})

/**
 * 封装 fns 函数，返回新的函数 invoker，将原始的 fns 挂载在 invoker.fns 上
 *
 * 封装的目的是，fns 参数可以传入函数数组，即同时添加多个监听器
 */
export function createFnInvoker (fns: Function | Array<Function>): Function {
  function invoker () {
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments)
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns
  return invoker
}

/**
 * 更新 listeners
 *
 * 1、新的 listener 不存在：报错
 * 2、新的 listener 存在 && 旧的 listener 不存在：调用 createFnInvoker 生成新的 listener 并添加到 vm 上
 * 3、新的 listener 存在 && 旧的 listener 存在 && 新旧 listener 不相等：新的替换掉旧的
 *
 * 注意：通过调用 createFnInvoker 标准化 listener ，最终调用 listener 时，实际上是调用 listener.fns 上个每个函数（fns 可能是单个函数，也可能是数组）
 */
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) {
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)
    /* istanbul ignore if */
    if (__WEEX__ && isPlainObject(def)) {
      cur = def.handler
      event.params = def.params
    }
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params)
    } else if (cur !== old) {
      old.fns = cur
      on[name] = old
    }
  }
  // 去除 oldListeners 有但新 listeners 里没有的事件
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
```

`updateListeners`函数的逻辑是，遍历新的`listeners`，将每个监听器`cur`封装一下，并添加到`vm._events`对应的事件名称的数组里；移除掉存在在旧的`listeners`里但不存在在新的`listeners`里的监听器。

对新的监听器封装的目的是，`cur`可以是个监听器函数数组，而不仅仅是单个监听器函数。

### 更新自定义事件

更新自定义事件包括自定义事件监听器的修改及删除。

组件首次初始化时是通过在`initEvents`里调用`updateComponentListeners`来首次添加自定义事件监听器，而在以后的每次更新自定义事件时，仍然是调用`updateComponentListeners`来更新，只是是在组件`patch`时触发的。

```js
// src/core/vdom/patch.js
export function createPatchFunction (backend) {
  // ...
  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    // ...
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      // 调用 vnode 的 prepatch 钩子
      i(oldVnode, vnode)
    }
    // ...
  }
  // ...
}
```

```js
// src/core/vdom/create-component.js
const componentVNodeHooks = {
  // ...
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
  // ...
}
```

```js
// src/core/instance/lifecycle.js

export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  // ...
  // update listeners
  listeners = listeners || emptyObject
  const oldListeners = vm.$options._parentListeners
  vm.$options._parentListeners = listeners
  updateComponentListeners(vm, listeners, oldListeners)
  // ...
}
```

### 发布自定义事件

组件内部，我们直接调用`vm.$emit()`就可以发布事件。

## 原生事件

原生事件的处理，独立成为了一个模块，模块对外暴露了两个方法`create`和`update`，分别用来创建和更新原生事件，但模块内部这两个方法实际上调用的是同一个函数。

### 添加原生事件

组件上、HTML 元素上的原生事件，都是在其所在的父组件`patch`的过程中添加/更新的。

父组件首次`patch`的过程中，无论是 HTML 元素创建完成之后还是子组件创建完成之后，都会调用`invokeCreateHooks`函数来调用`create`钩子，而原生事件相关的添加也会在此进行。

```js
// src/core/vdom/patch.js
export function createPatchFunction (backend) {
  // ...
  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
      // 调用元素的 create 钩子，包括
      // - 注册 ref
      // - 注册 directives
      // - 添加 class 特性
      // - 添加 style 属性
      // - 添加其他 attrs 特性
      // - 添加原生事件处理
      // - 添加 dom-props，如 textContent/innerHTML/value 等
      // - （待补充）
      cbs.create[i](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode)
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
    }
  }
  // ...
}
```

### 更新原生事件

若节点是可`patch`的，在`patchVnode`时将传入`oldVnode`和`vnode`调用`update`钩子，原生事件模块也包含在内。

```js
// src/core/vdom/patch.js
export function createPatchFunction (backend) {
  // ...
  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    // ...
    if (isDef(data) && isPatchable(vnode)) {
      // 调用 vnode 的 update 钩子
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // ...
  }
  // ...
}
```

### 原生事件模块

```js
// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    const event = isIE ? 'change' : 'input'
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || [])
    delete on[RANGE_TOKEN]
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || [])
    delete on[CHECKBOX_RADIO_TOKEN]
  }
}

let target: any

function createOnceHandler (handler, event, capture) {
  const _target = target // save current target element in closure
  return function onceHandler () {
    const res = handler.apply(null, arguments)
    if (res !== null) {
      remove(event, onceHandler, capture, _target)
    }
  }
}

function add (
  event: string,
  handler: Function,
  once: boolean,
  capture: boolean,
  passive: boolean
) {
  handler = withMacroTask(handler)
  if (once) handler = createOnceHandler(handler, event, capture)
  target.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture, passive }
      : capture
  )
}

function remove (
  event: string,
  handler: Function,
  capture: boolean,
  _target?: HTMLElement
) {
  (_target || target).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  )
}

function updateDOMListeners (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  target = vnode.elm
  normalizeEvents(on)
  updateListeners(on, oldOn, add, remove, vnode.context)
  target = undefined
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}
```

原生事件也是调用的`updateListeners`函数，只是传入的`add`和`remove`方法不同，这两个方法都是使用的 DOM Node 的`addEventListener`方法来添加浏览器原生的事件监听器。

这里有一点需要额外注意，原生事件的监听器函数在绑定到 DOM 之前，都要先用`withMacroTask`封装一下，详见[nextTick - withmacrotask](/vue/source-study/util/next-tick.html#withmacrotask)

#### once 的疑惑

TODO: 创建单次执行的事件监听器时，当封装后的监听器执行完成之后，若返回值为`null`，将不移除事件监听器，这是基于什么考虑？

```js
function createOnceHandler (handler, event, capture) {
  const _target = target // save current target element in closure
  return function onceHandler () {
    const res = handler.apply(null, arguments)
    if (res !== null) {
      remove(event, onceHandler, capture, _target)
    }
  }
}
```

验证代码：

```html
<div class="outer" @click.once="oneClick">Click</div>
```

```js
export default {
  name: 'HelloWorld',
  data () {
    return {
      i: 0
    }
  },
  methods: {
    oneClick () {
      console.log(++this.i)
      return null
    }
  }
}
```

## 总结

组件的自定义事件与原生事件的对比：

类别 | 原生事件 | 组件自定义事件
--- | --- | ---
实现方式 | 通过`addEventListener`方法添加原生事件处理 | 订阅发布模式
事件挂载点 | 对应的 DOM Node | 子组件实例
对事件监听器的处理 | 监听器需要用`withMacroTask`封装一层 | 无处理
是否可以取消删除单次执行监听器 | 原始监听器返回`null`可以取消删除单次执行监听器 | 不可取消删除

HTML 元素和组件的对比：

类别 | HTML 元素 | 组件
--- | --- | ---
事件类型 | 只能有原生事件 | 既能有原生事件，又能有自定义事件；原生事件是添加到`vnode.elm`元素上
事件存放处 | `data.on` | 模板编译时，原生事件在`data.nativeOn`里；自定义事件在`data.on`里。但是在创建组件的 VNode 时，`data.on`数据会赋给`listeners`，`data.nativeOn`会赋给`data.on`，即最终组件的`data.on`放的是原生事件
