# Vue.extend 源码学习及收获

`Vue.extend(options)`函数使用基础的 Vue 构造器，创建一个“子类”，参数是一个包含组件选项的对象

## 分析

`Vue.extend`的实现源码里，有几点需要特别注意：
- 基于同一父类并使用同一`options`创建的子类，是同一个子类（单例）
- 基于子类比如`SubVue`创建的实例，其通过`Vue.extend(options)`继承而来的`props`和`computed`是挂载在`SubVue.prototype`上的，需要通过原型链来访问，但最终访问的实例上的数据


## 源码

```js
// @file src/core/global-api/extend.js
import { ASSET_TYPES } from 'shared/constants'
import { defineComputed, proxy } from '../instance/state'
import { extend, mergeOptions, validateComponentName } from '../util/index'

export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0

  // Class id
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      // 使用相同的 option 对象创建（同一父类的）子类，得到的是同一个子类
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      // 验证组件的 name 是否合法
      validateComponentName(name)
    }

    // 子类的构造函数，类似于 Vue
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    // 以父类的 prototype 为原型
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.

    // 在 Sub.prototype 上添加 props 和 computed 的便捷访问
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      // 组件内递归调用自身
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    // 缓存由该选项对象创建的子类，下次（基于同一父类）使用该对象创建子类时，返回第一次创建的子类，不会再重复创建子类
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    // 经此处理后，访问 Comp 实例的 props 属性 key，会顺着原型链查找到 Comp.prototype，
    // 最终访问的是实例的 this._props[key]
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    // 经此处理后，访问 Comp 实例的计算属性 key，会顺着原型链查找到 Comp.prototype，
    // 最终访问的是实例的 this._computedWatchers[key].value
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```