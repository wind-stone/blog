# Vue 构造函数

[[toc]]

每一个组件实例，无论是根组件还是子组件，最终都是通过`new Vue(options)`操作来创建的。核心版的`Vue`构造函数不仅可以应用于 Web 浏览器平台，还可以应用于 Weex 平台，只是不同平台最终获取到的`Vue`构造函数都添加了各自平台的特性。

本系列源码学习的文章都是基于 Web 浏览器平台。Web 浏览器平台最后获取的`Vue`构造函数会经过多次不同的处理，每次都会添加一些原型方法/属性、静态方法/属性。

## 核心版 Vue

核心板`Vue`构造函数是 Web 平台和 Weex 共享的，主要是定义了`Vue`构造函数的函数体，以及添加一些平台无关的全局 API。

### 基础核心版 Vue

最基础的核心板`Vue`构造函数的函数体较为简单，主要做了两件事情：

1. 非生产环境下，检测是否是通过`new`操作符调用的`Vue`，若不是则给出警告
2. 调用`this._init(options)`对组件实例进行初始化操作。

定义了`Vue`构造函数之后，会执行一系列的`xxxMixin`函数。这些函数主要是往`Vue`构造函数的原型即`Vue.prototype`上添加各种原型方法和属性。

| xxxMixin         | 原型方法                                                                                                       | 原型属性                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `initMixin`      | `Vue.prototype._init`                                                                                          |
| `stateMixin`     | `Vue.prototype.$set`<br>`Vue.prototype.$delete`<br>`Vue.prototype.$watch`                                      | `Vue.prototype.$data`<br>`Vue.prototype.$props` |
| `eventsMixin`    | `Vue.prototype.$on`<br>`Vue.prototype.$once`<br>`Vue.prototype.$off`<br>`Vue.prototype.$emit`                  |
| `lifecycleMixin` | `Vue.prototype._update`<br>`Vue.prototype.$forceUpdate`<br>`Vue.prototype.$destroy`<br>`Vue.prototype._update` |
| `renderMixin`    | `Vue.prototype.$nextTick`<br>`Vue.prototype._render`                                                           |

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

### 完整核心版 Vue

完整核心版`Vue`构造函数是在基础核心板的基础上，添加了一些平台无关的全局 API，主要有：

- 全局 API（静态方法和静态属性）
  - `Vue.config`
  - `Vue.util`
    - `Vue.util.warn`
    - `Vue.util.extend`
    - `Vue.util.mergeOptions`
    - `Vue.util.defineReactive`
  - `Vue.set`
  - `Vue.delete`
  - `Vue.nextTick`
  - `Vue.options`
    - `components = {}`
      - `KeepAlive`
    - `directives = {}`
    - `filters = {}`
    - `_base = Vue`
  - `Vue.use`
  - `Vue.mixin`
  - `Vue.extend`
  - `Vue.use`
  - `Vue.component`
  - `Vue.directive`
  - `Vue.filter`
- `Vue.prototype.$isServer`
- `Vue.prototype.$ssrContext`
- `Vue.FunctionalRenderContext`
- `Vue.version`

```js
// src/core/index.js
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

// 添加全局 API（静态方法和静态属性）
initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
```

```js
// src/core/global-api/index.js
import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```

添加了这些平台无关的全局 API 之后，就可以将`Vue`构造函数导出，交给各个平台使用。

## Web 版 Vue

各个平台得到的`Vue`已经添加了一些平台无关的全局 API，但是在正式使用之前，各个平台还需要给`Vue`添加一些平台特有的配置和方法。而 Web 版的`Vue`构造函数，就是在完整核心版`Vue`构造函数的基础上，添加一些有关 Web 环境有关的配置和方法。

### Web 初次处理版 Vue

Web 初次处理版`Vue`添加的配置和方法主要有：

- `Vue.config`
  - `Vue.config.mustUseProp`
  - `Vue.config.isReservedTag`
  - `Vue.config.isReservedAttr`
  - `Vue.config.getTagNamespace`
  - `Vue.config.isUnknownElement`
- `Vue.options`
  - `directives`
    - `model`
    - `show`
  - `components`
    - `Transition`
    - `TransitionGroup`
- `Vue.prototype.__patch__`
- `Vue.prototype.$mount`

```js
// src/platforms/web/runtime/index.js
import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser, isChrome } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
```

### Web 最终导出版 Vue

Web 最终导出版的`Vue`是在 Web 初次处理版上的基础上做了以下工作：

- 封装了`Vue.prototype.$mount`，以处理组件选项对象里存在模板的情况
- 添加了`Vue.compile`方法

```js
// src/platforms/web/entry-runtime-with-compiler.js
import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        // 模板内表达式前后的分隔符，默认是 ["{{", "}}"]
        delimiters: options.delimiters,
        // 是否保留且渲染模板中的 HTML 注释，默认是 false
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
```

::: tip 提示
若是使用运行时版的`Vue.js`，则 Web 初次处理版`Vue`就是最终导出的`Vue`；若是使用完整版的`Vue.js`，则需要再做一些处理，Web 最终导出版`Vue`才是最终导出的`Vue`。
:::

## 释疑

### Vue 为什么不用 Class 实现 ？

注意到`Vue`构造函数下方有一些`xxxMixin`的函数，这些函数传入`Vue`作为参数，给`Vue.prototype`添加了一些方法，而这些方法承担着 Vue 绝大部分的功能实现。按照 Vue 构造函数的方式，Vue 可以将不同的功能分散到不同模块里去实现，十分方便代码的维护和管理；若是使用 Class，所以的方法就只能放在一个模块里。
