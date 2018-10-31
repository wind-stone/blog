---
sidebarDepth: 0
---

# 通知更新

[[toc]]

## 值类型

响应式属性的`set`特性，在该响应式属性被赋予新值时调用，主要做了这么几件事：

1. 获取旧的属性值，若新旧值相同，则返回，不做任何处理
2. 设置新的属性值
3. 为新属性值创建新的观察者对象
4. 通知订阅者进行更新

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // ...
  const dep = new Dep()

  const getter = property && property.get

  // 递归地对 val 进行响应式处理，并返回 val 对应的 __ob__
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    // ...
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        // 新旧值相同，或同为`NaN`，则不做任何处理
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 属性值自身发生改变，通知订阅者
      dep.notify()
    }
  }
}
```

```js
// src/core/observer/dep.js
export default class Dep {
  // ...
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

最后一步，也就是最为关键的一步是，调用`dep.notify()`通知所有在响应式属性`get`时添加的订阅者，响应式属性的值改变了！

`dep.notify()`做的就是，遍历所有的订阅者并调用`watcher.update()`方法，进而引起 Watcher 的重新计算。

需要注意的是，响应式属性的`set`特性里对新旧值的比较，是通过`newVal === value`来判断，这对于值类型的原始值来说，自然没有问题。但是对于引用类型的对象和数组来说，可能引用不变，但是对象会添加、删除属性，数组会添加元素、删除元素、重新排序，这是无法通过`newVal === value`来判断出来的，故而无法检测出引用类型发生的变化。

因此，通过给响应式属性添加`set`特性的方式来通知更新，只适用于属性值为值类型的情况。

## 引用类型

在 Vue 里，若响应式属性值是引用类型时，会有另外一套通知更新的方式，其核心就是引用类型的观察者对象的`dep`属性即`childOb.dep`，它跟闭包`dep`一样都记录着依赖于当前引用类型的对象/数组的订阅者。

### Object.defineProperty 的不足

目前 Vue 里的响应式是使用`Object.defineProperty`来实现的，但是存在一些局限：

- 对属性的添加、删除动作的监测
- 对数组基于下标的修改、对于 .length 修改的监测
- 对 Map、Set、WeakMap 和 WeakSet 的支持

### 对象添加/删除属性，数组添加/删除元素

我们知道，要给响应式对象添加属性或给响应式数组添加元素，需要使用`Vue.set`或组件实例的`vm.$set`方法；要删除响应式对象的属性或数组的元素，需要使用`Vue.delete`或`vm.$delete`方法。

实际上，`vm.$set`是`Vue.set`的别名，`vm.$delete`是`Vue.delete`的别名。

```js
// src/core/global-api/index.js
import { set, del } from '../observer/index'
export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  Vue.set = set
  Vue.delete = del
  // ...
}
```

```js
// src/core/instance/state.js
import { set, del } from '../observer/index'
export function stateMixin (Vue: Class<Component>) {
  // ...
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  // ...
}
```

#### set

```js
// src/core/observer/index.js
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    // 若 target 存在自有的 key 属性
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    // 未经过响应式处理的引用类型
    target[key] = val
    return val
  }
  // 给新增的属性做响应式处理，并通知依赖方
  defineReactive(ob.value, key, val)
  // 注意：这里使用的是 ob.dep，而不是 defineReactive 函数里的闭包 dep，两个 dep 的作用不同
  ob.dep.notify()
  return val
}
```

`set`方法里，首先会做对传入的参数做一些判断，然后针对数组和对象分别进行不同的处理。

1. 设置数组的元素：调用数组的`splice`方法替换元素的值，直接返回。
2. 设置对象的属性：
    - 若设置的是对象已存在的自身属性，则直接赋值并返回
      - 若对象是响应式对象，响应式对象自身属性值的变化，已经通过给属性添加访问器描述符的`set`特性来处理
      - 若对象不是响应式的，则不涉及到通知更新
    - 若设置的是对象不存在的属性，即新增属性
      - 若对象没有观察者对象，则说明对象不是响应式对象，不涉及到通知更新，直接赋值并返回
      - 若对象存在观察者对象`ob`，即说明对象是响应式对象，
        - 调用`defineReactive`将新增的属性处理为响应式属性
        - 调用`ob.dep.notify()`，通知所有依赖于该对象的订阅者进行更新
3. 返回对象的属性值或数组的元素`val`

需要注意的是，数组的`splice`方法是经过改写的，具有检测数组变化后通知订阅者的能力，可详见下一节的`数组变异方法`。

#### delete

```js
// src/core/observer/index.js
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 数组
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    // 没有 key 的情况
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  // 通知依赖方
  ob.dep.notify()
}
```

`delete`方法里，也是先对传入的参数做一些判断，然后针对数组和对象分别进行不同的处理。

1. 删除数组的元素：调用数组的`splice`方法删除元素，直接返回。
2. 删除对象的属性：
    - 对象自身不存在该属性：直接返回
    - 对象自身存在该属性：用`delete`操作符删除对象的属性
      - 对象不是响应式对象：直接返回
      - 对象是响应式对象：调用`ob.dep.notify()`通知所有依赖于该对象的订阅者进行更新

同样，数组的`splice`方法是经过改写的，具有检测数组变化后通知订阅者的能力，可详见下一节的`数组变异方法`。

#### ob.dep.notify()

`set`和`delete`方法最终都会调用`ob.dep.notify()`来通知订阅者进行更新。在`依赖收集`一章中，我们了解到，当订阅者依赖的属性的值是引用类型时，不仅会将属性的闭包`dep`作为依赖，也会将属性值的观察者对象的`dep`（即这里的`ob.dep`）作为依赖。因此`ob.dep.subs`也记录着所有的订阅者，调用`ob.dep.notify()`就能通知到这些订阅者进行更新。

### 数组变异方法

上一节我们在处理数组添加/删除元素时，都是在调用数组的`splice`方法之后就直接返回了，并没有看到显式的通知更新的操作。原因是，像`splice`这样的数组编译方法已经经过改写，通知更新的操作都已经存在这些改写后的变异方法之内了。而改写数组的变异方法就是在为数组创建观察者对象的时候完成的。

```js
// src/core/observer/index.js
import { arrayMethods } from './array'
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    // ...
    if (Array.isArray(value)) {
      // 如果是数组，则改写数组的变异方法（变异方法执行后，将通知依赖方数组已经改变，如有必要，将给新增的元素做响应式处理）
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
}

function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

```js
// src/core/util/env.js
export const hasProto = '__proto__' in {}
```

创建观察者对象时，若发现`value`是数组，就会改写数组的变异方法。

这里改写变异方法的方式也有些意思。若是对象存在`__proto__`属性，就改写当前数组实例的`__proto__`即数组实例的原型，达到改写数组变异方法的效果；否则，给数组实例自身添加变异方法，这些方法会覆盖`Array.prototype`同名的方法，如此也达到了改写数组变异方法的目的。

那么这些被改写变异方法都有哪些，以及是如何改写的呢？

```js
// src/core/observer/array.js
import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 如果新增了元素，则对新增的元素做响应式处理
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 通知订阅者
    ob.dep.notify()
    return result
  })
})
```

可以看到，涉及到数组元素数量的改变、元素值的改变、元素顺序的改变的方法，都将被封装了一层，并挂载在`arrayMethods`对象上，在创建数组的观察者对象时被添加到数组实例或者原型上。在封装后的方法里，仍保持了对`Array.prototype`上原方法的引用。

封装之后，调用封装后的方法时：

1. 调用原先的方法，获得结果
2. 若该方法是给数组增加了新的元素，将调用数组对应的观察者对象的`ob.observeArray`方法将新增的元素处理成响应式对象
3. 调用`ob.dep.notify()`通知订阅者
4. 返回结果

需要注意的是，不管是通过哪种方式改写数组的变异方法，都不会涉及到`Array.prototype`的修改。

此外，`arrayMethods`是继承自`Array.prototype`。因此在在原型链上查找方法时，对于封装的变异方法来说，查找到`arrayMethods`就能找到；而其他`arrayMethods`上没有的数组方法，会继续查找到`Array.prototype`上。
