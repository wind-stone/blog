---
sidebarDepth: 0
---

# 实例化

## Vue 构造函数

```js
// src/core/instance/index.js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

### Vue 为什么不用 Class 实现 ？

注意到`Vue`构造函数下方有一些`xxxMixin`的函数，这些函数传入`Vue`作为参数，给`Vue.prototype`添加了一些方法，而这些方法承担着 Vue 绝大部分的功能实现。按照 Vue 构造函数的方式，Vue 可以将不同的功能分散到不同模块里去实现，十分方便代码的维护和管理；若是使用 Class，所以的方法就只能放在一个模块里。

## 根组件的实例化 VS 普通组件实例化

- 根组件实例：是指在`main.js`里显示调用`new Vue(options)`生成的实例
- 普通组件实例：是指只定义了组件选项对象，在生成 DOM Tree 的过程中隐式调用`new vnode.componentOptions.Ctor(options)`生成的组件

现在我们来总结一下，根组件实例和普通组件实例在实例化过程中的区别。
