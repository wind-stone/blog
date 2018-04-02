# instance 源码学习及收获


## 源码

```js
// @file src/core/instance/index.js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue 构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)  // 详见 ./init.md
stateMixin(Vue)  // 详见 ./state/index.md
eventsMixin(Vue)  // 详见 ./events.md
lifecycleMixin(Vue)  // 详见 ./lifecycle.md
renderMixin(Vue)  // 详见 ./render.md

export default Vue
```
