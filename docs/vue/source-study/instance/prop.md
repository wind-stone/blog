---
sidebarDepth: 0
---

# Prop

[[toc]]

组件实例化的过程中，会在`vm._init`里调用`initState()`对组件实例上的状态数据进行初始化，比如`props`、`methods`、计算属性等等。而`initState()`里的第一项就是初始化`props`数据。究其原因就是，`props`数据最优先的数据（通俗地说，组件一出生时爸妈给的数据），是组件其他数据如`data`、`methods`、`computed`等的提前，在这些其他数据里都可以访问到`props`的数据。

## initProps

初始化`prop`时，主要做了三件事情：

1. 对`prop`校验并求值
2. 对`prop`做响应式处理
3. 将对`prop`的访问挂载到`vm`上

`prop`的校验和求值，我们将在下一小节详细说明。

对`prop`做响应式处理后，若是在模板里使用到了某`prop`，在`prop`改变之后，组件的渲染 Wather 就能接收到通知并重新渲染模板。监听`prop`亦然。

在将`prop`的访问挂载到`vm`上后，可以通过`vm.xxx`直接访问`prop`。这里需要注意，我们只是将组件自己独有的`prop`挂载在`vm`上，而组件继承而来的`prop`实际上是通过`vm.constructor.prototype`来访问的，详情可查看`Vue.extend`的实现。

```js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    // 1. 校验 prop 并求值
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
      // 2. 对 prop 做响应式处理
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    // 将对 prop 的访问挂载到 vm 实例上
    // 注意此处，in 操作符枚举出原型上的所有属性，所以这里只会把组件独有的 prop 的访问挂载在 vm 上，而共有的 prop 会自动通过 vm.constructor.prototype 访问，详情请查看 Vue.extend 的实现
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

## prop 的校验与求值

校验`prop`时，主要做了三件事：

1. `prop`为`Boolean`类型时做特殊处理
2. `prop`的值为空时，获取默认值，并作响应式处理
3. `prop`验证

```js
/**
 * 校验 prop 的有效性并返回其值
 * @param {*} key prop 的 key
 * @param {*} propOptions props 选项（组件选项对象里的 props 选项）
 * @param {*} propsData props 的值的对象
 * @param {*} vm vm 实例
 */
export function validateProp (
  key: string,
  propOptions: Object,
  propsData: Object,
  vm?: Component
): any {
  // prop 的定义
  const prop = propOptions[key]
  // 是否缺失 prop 对应的值
  const absent = !hasOwn(propsData, key)
  // prop 的值
  let value = propsData[key]
  // boolean casting
  const booleanIndex = getTypeIndex(Boolean, prop.type)
  // prop 的类型为 Boolean 时，进行特殊处理
  if (booleanIndex > -1) {
    // prop 的 type 包含 Boolean 类型
    if (absent && !hasOwn(prop, 'default')) {
      // prop 没传值，且无默认值的，将值设置 false
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      // 布尔特性的形式

      // 声明时：
      //  props: {
      //    'is-validate': {
      //      type: Boolean
      //    },
      //    'selected': {
      //      type: [Boolean, String]
      //    }
      //  }

      // 使用时：
      // <some-component is-validate selected></some-component>

      // only cast empty string / same name to boolean if
      // boolean has higher priority
      const stringIndex = getTypeIndex(String, prop.type)
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true
      }
    }
  }

  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    // 作响应式处理
    observe(value)
    toggleObserving(prevShouldObserve)
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
```

### Boolean 类型特殊处理

若是定义`prop`的`type`时，`Boolean`为其中之一，则可能有如下情况，则重新设置该`prop`的值。

1. 无值且无默认值的情况：调用组件时未传入`prop`的值 && `prop`定义时未设置默认值，则将`prop`的值置为`false`
2. 针对[布尔特性](https://windstone.cc/knowledge/html-dom/#%E5%B8%83%E5%B0%94%E7%89%B9%E6%80%A7%EF%BC%88boolean-attributes%EF%BC%89)的情况：调用组件时传入的`prop`的值为空字符串 || `prop`的值为`key`的连字符形式，则可能出现如下情况：
    - 该`prop`指定的类型里没有`String`，则将`prop`的值置为`true`
    - 该`prop`指定的类型里有`String`，但是`Boolean`类型在`String`之前，则将`prop`的值置为`false`

经过以上`Boolean`类型的处理之后，若是`prop`的值仍为`undefined`，则将获取`prop`的默认值。

### 获取默认值 && 响应式处理

```js
/**
 * 获取 prop 的默认值
 * @param {*} vm vm 实例
 * @param {*} prop 定义选项
 * @param {*} vmkey prop 的 key
 */
function getPropDefaultValue (vm: ?Component, prop: PropOptions, vmkey: string): any {
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
  // TODO: 待确定这是什么逻辑 ？？？
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
```

获取默认值时，需要先对`prop`的配置进行判断，若是没有配置`default`属性，则直接返回。

此外，在测试环境下，若是`default`的值对`Object`类型，则需要发出警告，因为引用类型的默认值会被多个组件实例共享，进而导致数据混乱，需要通过工厂函数的方式给每个组件实例返回一个独有的默认值。

最后的求值看起来是个三元表达式，第一感觉只有两种情况，实际上存在三种情况。

- `default`是函数 && `prop`配置的`type`里没有`Function`，则返回该函数调用后的返回值作为默认值
- `default`是函数 && `prop`配置的`type`里有`Function`，则返回该函数作为默认值
- `default`为非函数类型，则返回该`default`值作为默认值

如此，`prop`的默认值也就确定了。

而在默认值确定之后，会对默认值做响应式处理，若该`prop`的值是对象类型，则在该`prop`的值的子孙元素变化的时候，依赖该`prop`的 Watcher 都可以接收到通知。

### 验证

在非生产环境下（除去 Weex 的某种情况），将对`prop`进行验证，包括验证`required`、`type`和自定义验证函数。

验证的逻辑较为简单，代码里已经添加注释，不再赘述。

```js
/**
 * Assert whether a prop is valid.
 * 需要做以下三个验证
 * case 1: 验证 required 属性
 *   case 1.1: prop 定义时是 required，但是调用组件时没有传递该值（警告）
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
      // 将 type 转为数组
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const assertedType = assertType(value, type[i])
      expectedTypes.push(assertedType.expectedType || '')
      valid = assertedType.valid
    }
  }

  if (!valid) {
    // 无效，警告
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
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


/**
 * `assertType`函数，验证`prop`的值符合指定的`type`类型，分为三类：
 *   - 第一类：通过`typeof`判断的类型，如`String`、`Number`、`Boolean`、`Function`、`Symbol`
 *   - 第二类：通过`Object.prototype.toString`判断`Object`/`Array`
 *   - 第三类：通过`instanceof`判断自定义的引用类型
 */
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
 *
 * 获取构造函数的名称，比如 Boolean、Number 等
 */
function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}
```
