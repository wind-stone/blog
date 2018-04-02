# initProps 源码学习及收获

Vue.js 版本：2.5.13

## 分析

主要内容
- `initProps`解析
- 如何验证`prop`的类型
- 实例共有的`props`的访问方式
- `observerState.shouldConvert`的作用

注意事项
- 处理`props`时，如果是在`production`环境，将不对`key`及`value`进行验证


### `initProps`解析

`initState`是初始化组件各个状态数据的，其首先处理的就是组件的`props`。
（因此，如果组件`data`选项里有`key`与`props`选项里的`key`冲突时，会提醒你`data`里的`key`不能用，而不是相反）

而在`initProps`函数里，主要做了如下处理：针对`props`里的每个`key`，

- `validateProp`：获取并验证`value`
    - 处理`value`为`Boolean`型的特殊情况
    - （如果需要）获取默认`value`，（如果需要）做响应式数据处理
    - 验证`value`是否符合`required`、`type`以及自定义验证函数
    - 返回`value`
- `defineReactive`：对`key`和`value`做响应式数据处理
- `proxy`：在`vm`上增加`key`属性并将对其的访问代理到`vm._props`上，从而简化对`props`的访问


### 如何验证`prop`的类型

字组件定义时，显示地用`props`选项来声明它预期的数据，我们可以为组件的`prop`指定规则，其中一项就是指定`prop`的类型`type`，其值可以是下面的原生构造器，或者由这些原生构造器构成的数组。

- `String`
- `Number`
- `Boolean`
- `Function`
- `Object`
- `Array`
- `Symbol`

那么我们如何验证`prop`的值符合指定的`type`类型呢？请见下面的`assertType`函数，分为四类：

- 第一类：通过`typeof`判断的类型，如`String`、`Number`、`Boolean`、`Function`、`Symbol`
- 第二类：通过`Object.prototype.toString`判断`Object`
- 第三类：通过`Array.isArray`判断`Array`
- 第四类：通过`instanceof`判断自定义的引用类型

`assertType`要判断给定的值是否是给定的构造函数类型，该函数调用时接受的第一个参数是要判断的值，第二个是给定的构造函数。

在进行判断之前，我们会先通过`getType`获取到给定的构造函数的类型字符串，这里是调用构造函数的`toString`方法，该方法返回的是个字符串，其中包含了构造函数类型的字符串：

```js
String.toString() // "function String() { [native code] }"
Number.toString() // "function Number() { [native code] }"
Boolean.toString() // "function Boolean() { [native code] }"
Function.toString() // "function Function() { [native code] }"
Object.toString()  // "function Object() { [native code] }"
Array.toString() // "function Array() { [native code] }"
Symbol.toString() // "function Symbol() { [native code] }"
```

通过返回的字符串，辅以一正则表达式，我们可以获取到对应的类型字符串了。

```js
// @file src/core/util/props.js
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/

function assertType (value: any, type: Function): {
  valid: boolean;
  expectedType: string;
} {
  let valid
  const expectedType = getType(type)
  if (simpleCheckRE.test(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects
    // 原始包装对象，比如 value = new Number(2)
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value)
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    // 自定义类型
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

```

```js
const _toString = Object.prototype.toString
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}
```


### 实例共有的`props`的访问方式

如果使用`const SubVue = Vue.extend(options)`等方式去扩展一个已有的组件选项对象`options`，将得到一个类似于`Vue`的构造函数`SubVue`。如果`options`对象里存在`props`选项，那么通过`SubVue`实例化的所有组件实例都将拥有对应的`prop`。那么这时候是怎么访问的呢？

先来看一看组件自身独有的`prop`是如何访问的。

```js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  observerState.shouldConvert = isRoot
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.

    // 注意此处，in 操作符枚举出原型上的所有属性，所以这里只会把组件独有的 prop 的访问挂载在 vm 上，而共有的 prop 会自动通过 vm.constructor.prototype 访问，详情请查看 Vue.extend 的实现
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
```

通过上面的代码，我们发现，如果`vm`及其原型链上没有对应的`key`，则会在`vm`上定义`key`的访问器属性。

那么如果`vm`的原型链上存在`key`呢，我们如何访问得到呢？
（注意，仅通过`Vue.extend`的组件选项对象的`props`才会挂载在原型链上）

```js
// @file src/core/global-api/extend.js
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}
```

```js
// @file src/core/instance/state.js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

上面的是`Vue.extend`源码的片段。如果是通过`Vue.extend`扩展得到的类`Vue`的构造函数如`SubVue`创建的实例组件，组件对所有继承而来的共有的`prop`的访问将挂载在`SubVue.prototype`上，而`SubVue.prototype`定义的访问器属性最终拿到的是实例的`this._props[key]`。

因此，通过将组件继承而来的共有`prop`挂载在原型链上，而仅在`vm`上挂载组件特有的`prop`。如此这般设计，确实优化了对共有`prop`的访问性能。

注意：如果是通过`new Vue(options)`得到的实例，所有的`props`都是挂载在`vm`上的。


### `observerState.shouldConvert`的作用

在决定是否要给某个数据做响应式处理转换时，需要使用到`observerState.shouldConvert`，只有其中为`true`时，才进行响应式处理转换。（目前只遇到过为`true`的情况，别的地方有为`false`的情况，但源码还没读到）

```js
// @file src/core/observer/index.js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```


## 源码

```js
// @file src/core/instance/state.js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  observerState.shouldConvert = isRoot
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.

    // 注意此处，in 操作符枚举出原型上的所有属性，所以这里只会把组件独有的 prop 的访问挂载在 vm 上，而共有的 prop 会自动通过 vm.constructor.prototype 访问，详情请查看 Vue.extend 的实现
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
```
