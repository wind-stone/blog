# 功能模块的钩子函数

[[toc]]

我们在分析`patch`函数时，无论是元素类型的 VNode 还是组件占位 VNode，都只是分析了 DOM 节点及其子节点是如何修补的，但是没有提到 DOM 元素节点上的`class`/`style`/`events`等数据时如何修补的。实际上，在`patchVnode`的过程中，会执行很多功能模块的钩子函数，比如：

- `create`钩子：DOM 元素节点创建时/初始化组件时调用
- `activate`钩子：组件激活时调用
- `update`钩子：DOM 节点更新时调用
- `remove`钩子：DOM 节点移除时调用
- `destroy`钩子：组件销毁时调用

而这些功能模块有：

- Web 平台相关模块
  - `attrs`模块：处理节点上的特性`attribute`
  - `klass`模块：处理节点上的类`class`
  - `events`模块：处理节点上的原生事件
  - `domProps`模块：处理节点上的属性`property`
  - `style`模块：处理节点上的内联样式`style`特性
  - `transition`模块
- 核心模块
  - `ref`模块：处理节点的引用`ref`
  - `directives`模块：处理节点上的指令`directives`

每一功能模块包含了若干个钩子，但基本都存在`create`钩子和`update`钩子，用于在 DOM 节点创建、更新以及销毁时，如何来处理这些挂载上节点之上的数据。

## 钩子函数的来源

调用`createPatchFunction`函数时，会将所有的功能模块当做参数传入，以返回专属于 Web 平台的`patch`函数。

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

`platformModules`专属模块的来源：

```js
// src/platforms/web/runtime/modules/index.js
import attrs from './attrs'
import klass from './class'
import events from './events'
import domProps from './dom-props'
import style from './style'
import transition from './transition'

export default [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]
```

`baseModules`的来源：

```js
// src/core/vdom/modules/index.js
import directives from './directives'
import ref from './ref'

export default [
  ref,
  directives
]
```

这些引入的各个模块暴露的对象，都包含了钩子的名称和处理函数，以`class`为例，模块的结构如下所示。

```js
function updateClass(oldVnode, vnode) {
  // ...
}
export default {
  create: updateClass,
  update: updateClass
}
```

## 钩子函数的合并

`createPatchFunction`函数执行时，第一时间就是合并这些钩子函数，将所有功能模块同类型的钩子函数合并到数组里，

```js
// src/core/patch.js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
  // ...
}
```

经过合并以后，`cbs`变成了如下的结构，这些钩子将在不同的时机被一一调用。

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

## 钩子函数的调用时机

### create 钩子

DOM 元素创建好后以及初始化创建好的子组件时会调用`invokeCreateHooks`函数，而`create`钩子的调用主要就是封装在`invokeCreateHooks`函数里。

```js
// src/core/patch.js
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

::: tip 提示
还有几处零散地调用`create`钩子和`invokeCreateHooks`函数的地方，在此不再详述。
:::

### update 钩子

在修补新旧 VNode 时会调用`update`钩子。

```js
// src/core/patch.js
  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    // ...
    if (isDef(data) && isPatchable(vnode)) {
      // 调用各个模块的 update 钩子
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      // 调用（带有自定义指令且指令存在 update 钩子的元素类型的） VNode 的 update 钩子
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // ...
  }
```

## 其他说明

### 钩子函数参数

调用这些钩子函数时，第一个参数是旧 VNode，第二个参数是新 VNode

### DOM 操作的节点

有些模块的操作主体是 DOM 元素节点，比如`class`模块、`attrs`模块。

对于元素类型的 VNode，所操作的是其对应的 DOM 元素节点。

对于组件占位 VNode，所操作的是组件视图 DOM 的根元素节点。

## 各模块详解

### events 模块

详见[events 模块](/vue/source-study/instance/events.html#原生事件)

### class 模块

详见[class 模块](/vue/source-study/vdom/patch-modules/class.html)

### style 模块

详见[style 模块](/vue/source-study/vdom/patch-modules/style.html)

### attrs 模块

详见[attrs 模块](/vue/source-study/vdom/patch-modules/attrs.html)

### dom-props 模块

详见[dom-props 模块](/vue/source-study/vdom/patch-modules/dom-props.html)

### transition 模块

TODO: 待添加

### ref 模块

详见[ref 模块](/vue/source-study/vdom/patch-modules/ref.html)

### directives 模块

TODO: 待添加
