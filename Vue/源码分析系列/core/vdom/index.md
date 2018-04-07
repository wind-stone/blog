# 关于 vdom 的额外信息


## 组件实例属性详解

属性示例 | 属性说明 | 情景说明
--- | --- | ---
`vm.$parent` | 组件的父组件 | 组件间会形成组件链
`vm.$vnode` | 值为`_parentVnode`，组件对应的 vnode 的父虚拟节点（组件的占位节点） |

`vm._isDestroyed` | 组件是否销毁 |
`vm._watcher` | 组件的渲染`watcher` | 模板所依赖的数据变化后，该`watcher`会重新计算、渲染新的 DOM
`vm._watchers` | 组件内所有的`watcher`集合 |


## vnode 属性详解

属性示例 | 属性说明 | 情景说明
--- | --- | ---
`vm.$parent` | 组件的父组件 | 组件间会形成组件链
`childComponentVnode.parent` | 子组件`childComponentVnode`的父占位`vnode` | 子组件`vm`对应的 VNode 是`childComponentVnode`，且`childComponentVnode.parent = vm.$options._parentVnode = vnode`
