# props 源码学习及收获

Vue.js 版本：2.5.13


## 分析

主要内容
- `initProps`解析
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
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
```


### props.js

```js
/* @flow */

import { warn } from './debug'
import { observe, observerState } from '../observer/index'
import {
  hasOwn,
  isObject,
  toRawType,
  hyphenate,
  capitalize,
  isPlainObject
} from 'shared/util'

type PropOptions = {
  type: Function | Array<Function> | null,
  default: any,
  required: ?boolean,
  validator: ?Function
};

export function validateProp (
  key: string,
  propOptions: Object,
  propsData: Object,
  vm?: Component
): any {
  const prop = propOptions[key]
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      // 如果 type 为 Boolean 类型 && 没有提供初始值 && 没有默认值，则将其值置为 false
      value = false
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      // 如果 type 为 Boolean 类型 && type 不为 String 类型 && (value === '' || value 跟 key 的连字符格式值相等)，将其值置为 true
      //
      // 举例：
      //
      // prop 定义时：
      //
      //  props: {
      //    'is-validate': {
      //      type: Boolean
      //    },
      //    'selected': {
      //      type: Boolean
      //    }
      //  }
      //
      // 使用时： <some-component is-validate selected></some-component>
      value = true
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldConvert = observerState.shouldConvert
    observerState.shouldConvert = true
    // 尽管在 initProps() 里调用 validateProp 后调用了 observe，但是在其他地方调用 validateProp 后可能并没有调用 observe，因此需要在此对默认值为对象的 prop 预先调用 observe 进行响应式处理
    observe(value)
    observerState.shouldConvert = prevShouldConvert
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(__WEEX__ && isObject(value) && ('@binding' in value))
  ) {
    // 注意：production 环境，将不对 key-value 进行验证
    assertProp(prop, key, value, vm, absent)
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm: ?Component, prop: PropOptions, key: string): any {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  const def = prop.default
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    )
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  // 待确定这是什么逻辑 ？？？
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 * 需要做以下三个验证
 * case 1: 验证 required 属性
 *   case 1.1: prop 定义时是 required，但是调用组件时没有传递该值（报错）
 *   case 1.2: prop 定义时是非 required 的，且 value === null || value === undefined（符合要求，返回）
 * case 2: 验证 type 属性-- value 的类型必须是 type 数组里的其中之一
 * case 3: 验证自定义验证函数
 */
function assertProp (
  prop: PropOptions,
  name: string,
  value: any,
  vm: ?Component,
  absent: boolean
) {
  if (prop.required && absent) {
    // case 1.1
    warn(
      'Missing required prop: "' + name + '"',
      vm
    )
    return
  }
  if (value == null && !prop.required) {
    // case 1.2
    return
  }
  let type = prop.type
  let valid = !type || type === true
  const expectedTypes = []
  // case 2
  if (type) {
    if (!Array.isArray(type)) {
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const assertedType = assertType(value, type[i])
      expectedTypes.push(assertedType.expectedType || '')
      valid = assertedType.valid
    }
  }
  if (!valid) {
    warn(
      `Invalid prop: type check failed for prop "${name}".` +
      ` Expected ${expectedTypes.map(capitalize).join(', ')}` +
      `, got ${toRawType(value)}.`,
      vm
    )
    return
  }
  // case 3
  const validator = prop.validator
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      )
    }
  }
}

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

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (let i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}
```

### `observerState.shouldConvert`的作用

在决定是否要给某个数据做响应式处理转换时，需要使用到`observerState.shouldConvert`，只有其中为`true`时，才进行响应式处理转换。（目前只遇到过为`true`的情况，别的地方有为`false`的情况，但源码还没读到）

```js
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
