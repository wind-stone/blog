---
sidebarDepth: 0
---

# 组件注册

Vue 里除了内置的`keep-alive`、`component`、`transition`、`transition-group`等组件之外，其余的组件在使用之前必须先注册。只有组件注册了，在创建组件的实例时才能找到组件的定义。而组件注册主要分为全局注册和局部注册。全局注册的组件可以在任一组件里使用，而在某组件里局部注册的组件只能在该组件内部使用。

## 全局组件

组件全局注册时，若组件定义是组件选项对象，则将组件选项对象用`Vue.extend`处理成继承了`Vue`的构造函数（若原先就是构造函数，则不需要处理），并添加到`Vue.options.component`下，而`Vue.options`最终将合并到每一个组件实例的`vm.$options`里。

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

```js
ASSET_TYPES.forEach(type => {
  Vue[type] = function (
    id: string,
    definition: Function | Object
  ): Function | Object | void {
    if (!definition) {
      // 获取 id 对应的定义对象/函数
      return this.options[type + 's'][id]
    } else {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && type === 'component') {
        validateComponentName(id)
      }
      if (type === 'component' && isPlainObject(definition)) {
        // 组件优先使用组件对象的 name 属性
        definition.name = definition.name || id
        // 将注册的组件选项对象转换为经过 Vue.extend 处理过的继承了 Vue 的构造函数
        definition = this.options._base.extend(definition)
      }
      if (type === 'directive' && typeof definition === 'function') {
        definition = { bind: definition, update: definition }
      }
      this.options[type + 's'][id] = definition
      return definition
    }
  }
})
```

## 局部注册

组件的局部注册是将组件定义（组件选项对象或者构造函数）添加到父组件的组件选项对象`options`的`component`选项下，最终父组件的组件选项对象会合并到父组件实例的`vm.$options`里。

```js
export default {
  components: {
    HelloWorld
  }
}
```

## 组件配置合并

在组件初始化的时候，会将`Vue.options`和组件选项对象`options`合并为`vm.$options`。

这里需要注意的是，根组件和子组件配置合并的时机和方式略微不同。

根组件是在调用`vm._init`时将`Vue.options`和组件定义对象`options`配置合并到`vm.$options`上的。

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // ...
  if (options && options._isComponent) {
    initInternalComponent(vm, options)
  } else {
    // 根组件
    vm.$options = mergeOptions(
      // 返回最新的 vm.constructor.options
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  // ...
}
```

而（组件定义为组件选项对象的）子组件是在`createComponent`里使用`Vue.extend`继承时将`Vue.options`和组件定义对象`options`先合并为`Ctor.options`，之后在`vm._init`里通过`initInternalComponent`基于`Ctor.options`生成`vm.$options`。

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  // _base 为 Vue 构造函数
  const baseCtor = context.$options._base

  // 组件选项对象：转换成构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
}
```

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // ...
}
```

## 获取组件定义

当我们最终在创建元素时，将以组件的`tag`从当前活动组件实例的配置的`component`上即`vm.$options.component`上查找组件的定义并返回。

```js
export function _createElement (
  // ...
) {
  // ...
  if (typeof tag === 'string') {
    // tag 为标签字符串：1、平台内置元素标签名称；2、局部注册的组件名称
    if (config.isReservedTag(tag)) {
      // ...
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 字符串类型二：局部注册的组件名称（包括继承、混合而来的）
      // Ctor 可能是继承 Vue 的构造函数，或者是组件选项对象
      vnode = createComponent(Ctor, data, context, children, tag)
    }
    // ...
  }
  // ...
}
```

```js
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```

在查找组件定义时，会先在`options.component`上分别以将`id`、camelCase 式`id`和 PascalCase 式`id`来获取组件定义；若是找不到，再在`options.component`的原型链上查找。
