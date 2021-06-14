# 组件继承：Vue.extend

[[toc]]

`Vue.extend()`的功能是基于传入的组件选项对象参数，创建`Vue`构造函数的子类。所有的内部子组件的构造函数，都是调用`Vue.extend()`创建出来的子类。

组件继承的步骤为：

1. 若同一组件选项对象基于同一父类创建过子类构造函数，则直接返回缓存的子类，避免重复创建
2. （非生成环境下）若组件选项对象存在`name`，则验证组件的`name`是否合法
3. 声明子类构造函数，函数内会调用`this._init()`
4. 继承父类原型上的所有方法
5. 子类添加静态属性`cid`
6. 合并父类的静态属性`Super.options`和传入的`extendOptions`，形成子类的静态属性`Sub.options`
7. 将子类的静态属性`Sub.super`指向父类`Super`，即`Sub.super = Super`
8. 在`Sub.prototype`上添加`props`和`computed`的便捷访问
9. 子类继承父类的静态方法`extend/mixin/use`
10. 子类继承父类的静态资源方法`component/directive/filter`，用于注册全局的组件、指令、过滤器
11. 保持在继承时对父类`Super.options`的引用，以便于在之后实例化时检查`Super.options`是否更新过
12. 缓存该组件选项对象基于该父类创建的子类，在第`1.`步会使用到
13. 返回子类构造函数

```js
// src/core/global-api/extend.js

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
  let cid = 1

  /**
   * Class inheritance
   * 构造 Vue 的子类
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      // 若同一组件选项对象基于同一父类创建过子类构造函数，则直接返回缓存的子类，避免重复创建
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      // （非生成环境下）若组件选项对象存在`name`，则验证组件的`name`是否合法
      validateComponentName(name)
    }

    // 声明子类构造函数，类似于 Vue
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    // 继承父类原型上的所有方法
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++

    // 合并父类的静态属性 options 和 传入的 extendOptions，形成子类的静态属性 options
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )

    // 将子类的静态属性 super 指向父类
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 通过`Vue.extend`扩展得到的类`Vue`的构造函数如`SubVue`创建的实例组件，组件对所有继承而来的共有的`prop`的访问将挂载在`SubVue.prototype`上，而`SubVue.prototype`定义的访问器属性最终拿到的是实例的`this._props[key]`。
    // 因此，通过将组件继承而来的共有`prop`挂载在原型链上，而仅在`vm`上挂载组件特有的`prop`。如此这般设计，确实优化了对共有`prop`的访问性能。

    // 在 Sub.prototype 上添加 props 和 computed 的便捷访问
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    // 继承父类的静态方法 extend/mixin/use
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    // 继承父类的静态资源方法 component/directive/filter，用于注册全局的组件、指令、过滤器
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      // 将子类自身注册为局部组件
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    // 保持在继承时对父类 Super.options 的引用，以便于在之后实例化时检查 Super.options 是否更新过
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    // 缓存由该组件选项对象基于该父类创建的子类构造函数，下次再次通过该组件选项对象创建基于该父类的子类构造函数时，将直接返回缓存的子类构造函数，不会重复创建子类构造函数
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
```

## props 和 computed 的便捷访问

### 继承的 props

```js
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    // 经此处理后，访问 Comp 实例的 props 属性 key，会顺着原型链查找到 Comp.prototype，
    // 最终访问的是实例的 this._props[key]
    proxy(Comp.prototype, `_props`, key)
  }
}
```

可以看到，继承而来的`props`是挂载在子类的原型上，以后访问`subVm.xxx`时，会先在子类实例`subVm`上寻找`xxx`，但是找不到，会沿着子类实例的原型链查找，并在`Sub.prototype`上找到了`xxx`，但是这是个访问器属性，最终返回的还是`this._props.xxx`即`subVm._props.xxx`。

也就是说，对比[非继承的`props`](/vue/source-study/instance/state/props.html#prop-挂载到-vm-上便捷访问)，访问继承而来的`props`比访问非继承的`props`会多一次查找，但是不需要在每个子类实例上都添加继承的`props`的访问器属性，可以说是以时间换空间的一种优化方式。

### 继承的 computed

```js
function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    // 经此处理后，访问 Comp 实例的计算属性 key，会顺着原型链查找到 Comp.prototype，
    // 最终访问的是实例的 this._computedWatchers[key].value
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```

对比与[组件特有的计算属性的访问](/vue/source-study/instance/state/computed.html#访问计算属性)，继承而来的计算属性时挂载在组件的构造函数上，而不是组件实例上。

以后访问`subVm.computedXxx`时，会先在子类实例`subVm`上寻找`computedXxx`，但是找不到，会沿着子类实例的原型链查找，并在`Sub.prototype`上找到了`computedXxx`，但是这是个访问器属性，最终返回的还是`this._computedWatchers.computedXxx.value`。
