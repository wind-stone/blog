---
sidebarDepth: 0
---

# 创建组件实例

[[toc]]

每个 Vue 实例，都是用`new Vue(options)`创建而来的，只是应用的根组件实例是用户显式创建的，而根组件实例里的子组件是在渲染过程中隐式创建的。

该章节里仅讨论根组件实例的创建，而子组件实例的创建，我们将在组件`patch`的过程中详细说明。

```js
// 用户显式创建 Vue 实例
var vm = new Vue({
  // 选项
})
```

PS：这里的`用户`指的是使用`Vue.js`的开发者，一般是指前端开发工程师。

## Vue.prototype._init

通过`new`操作符创建 Vue 实例时，实际上就是调用了实例方法`_init`，以完成一些初始化工作。

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

```js
// src/core/instance/init.js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

组件实例的初始化工作，主要有：

1. 合并组件的`options`选项配置（详见[合并配置](/vue/source-study/component/options.html)）
2. 初始化组件数据
    - 生命周期相关数据
    - 事件相关数据
    - 渲染相关数据
    - （调用`beforeCreate`钩子）
    - `provide`/`inject`相关数据
    - 状态相关数据（详见[状态数据初始化](/vue/source-study/instance/state/)）
    - （调用`created`钩子）
3. 对于根组件，调用`vm.$mount`将组件挂载到`document`上

## Vue.prototype.$mount

若是根组件的组件选项对象里存在`el`选项，则会在组件数据初始化之后，自动地调用`Vue.prototype.$mount`方法将根组件实例挂载到`document`上的`el`元素上。若是不存在`el`选项，将由用户在需要的时候手动调用`vm.$mount(el)`将组件实例挂载。

而`Vue.prototype.$mount`方法实际上对`mountComponent`函数的封装，以适用于 Web 平台的组件实例的挂载。

```js
// src/platforms/web/runtime/index.js
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

  // 非生产环境下，对使用 Vue.js 的运行时版本进行警告
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    // 非生产环境下，对组件生成 VNode 和 patch 做性能追踪
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

`mountComponent`函数里，主要做了以下工作：

1. 调用`beforeMount`钩子
2. 定义渲染 Watcher 的表达式
3. 创建渲染 Watcher，且 Watcher 实例会首次计算表达式，创建 VNode Tree，进而生成 DOM Tree
4. （对于根组件）调用`mounted`钩子
5. 返回组件实例`vm`

这里的最重要的是渲染 Watcher 的表达式`updateComponent`函数。表达式`updateComponent`函数里，`vm._render()`将执行组件的`vm.$options.render`方法创建并返回组件的 VNode Tree。而`vm._update()`方法将基于组件的 VNode Tree 生成 DOM Tree，并在特定情况下进行挂载，生成视图。

渲染 Watcher 首次计算表达式时，会做[依赖收集](/vue/source-study/observer/dep-collection.html)工作，这些依赖是组件在模板里或者`render`里使用到的响应式属性，一旦这些依赖发生变化，会通知渲染 Watcher 重新计算表达式以更新视图。

## Vue.prototype._render

关于 VNode Tree 的创建，请详见[创建 VNode Tree](/vue/source-study/vdom/vnode-tree-create.html)一节。

## Vue.prototype._update

关于基于 VNode Tree 生成 DOM Tree，请详见[Patch](/vue/source-study/vdom/patch.html)一节。
