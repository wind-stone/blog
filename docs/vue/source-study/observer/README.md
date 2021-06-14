# Observer

目录

[[toc]]

## 响应式对象/属性

### observe

```js
function initData (vm: Component) {
  // ...
  // observe data
  observe(data, true /* asRootData */)
}
```

初始化组件的`props`数据和`data`数据时，会为`data`和单个`prop`调用`observe`来创建观察者对象，以便在`data`内和某个`prop`内的数据发生变化时，依赖于该数据的 Watcher 可以接收到通知进而重新计算 Watcher 表达式的值。

经过`observe`处理的对象，我们姑且先称之为被观察对象；`Observer`实例我们姑且先称之为观察者对象。

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    // 非服务端渲染
    !isServerRendering() &&
    // value 是对象或数组
    (Array.isArray(value) || isPlainObject(value)) &&
    // 对象是可扩展的
    Object.isExtensible(value) &&
    // 非根组件
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

调用`observe`会返回为被观察对象（非 Vnode 的数组或对象）创建的观察者对象。若之前已经为该被观察对象创建过观察者对象，则直接返回；否则调用`new Observer(value)`创建一新的观察者对象并返回。如此，针对可以被观察的对象和数组，调用`observe`会为其绑定一观察者对象。

那观察者对象的作用是什么呢？需要我们详细了解下创建观察者对象的过程中究竟发生了哪些事情。

### Observer 类

```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value

    // ob 对象的 dep 属性，也是用来收集订阅者，但只有在发生以下情况时，才会通知所有的订阅者
    // 1. 对象添加/删除属性
    // 2. 数组执行了变异方法，导致数组增加、删除元素、重排序
    this.dep = new Dep()

    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组，则重写数组的变异方法（变异方法执行后，将通知依赖方数组已经改变，如有必要，将给新增的元素做响应式处理）
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   *
   * 遍历对象里的每个 key-value，为子属性添加响应式处理
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

创建被观察对象的`Observer`实例（即观察者）时，会先将被观察对象和观察者相互绑定在一起，被观察对象的`__ob__`属性指向观察者对象，观察者对象的`value`指向被观察对象，从而实现相互引用，一一映射。

```js
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

之后，会为观察者对象创建依赖对象`dep`，`dep`对象将保存所有依赖于被观察对象`value`的 Watcher（在获取被观察对象`value`的值时会收集所有依赖于被观察对象的 Watcher，详见“依赖收集”一节），并在被观察对象`value`内部发生改变时通知所有的 Watcher。

最后，若是被观察对象`value`是数组，则将遍历数组的每一个元素，依次调用`observe`为数组的每一个元素创建自己的观察者对象（若数组元素是对象或数组的话）。此外，还需要改写数组所有的变异方法，以便在数组的引用不变但数组发生变异后通知 Watcher。这一功能我们在解析数组的响应式一节再详细说明。

若被观察对象是常规的对象类型，将遍历对象的每一个属性，调用`defineReactive`将该属性处理为响应式属性，以便该属性值发生变化时，可以告知所有依赖该属性的 Watcher。

### defineReactive

Vue.js 的整套响应式系统的精华几乎都在`defineReactive`里，它的主要功能就是将对象的属性转换为响应式属性，为该属性添加访问器描述符的`get`和`set`特性。当获取该响应式属性的值时，`get`特性被调用，进而进行依赖收集；当设置该响应式属性时，`set`特性被调用，重新设置该响应式属性的值，如有必要，通知所有依赖该属性的值发生了变化。

```js
/**
 * Define a reactive property on an Object.
 *
 * 在对象上定义响应式属性
 *
 * @param {*} obj 属性所在的对象
 * @param {*} key 属性名称
 * @param {*} val 属性值
 * @param {*} val customSetter
 * @param {*} val shallow
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 闭包 dep，该 dep 收集的订阅者，会在该属性值自身发生变化时通知收集的订阅者
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  // 处理属性为访问器属性的情况
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    // 未传入属性值时，若属性不是访问器属性（而是数据属性）或者是访问器属性且 getter、setter 都存在，
    // 则设置属性值
    val = obj[key]
  }

  // 递归地对 val 进行响应式处理，并返回 val 对应的 __ob__
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 每次获取当前属性值时，都要收集订阅者、
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        // 1、依赖收集：
        //   - 该属性值的闭包 dep 将当前 Dep.target 作为订阅者
        //   - 当前 Dep.target 将该属性值的闭包 dep 作为依赖
        // 以便该属性值自身变化时，通知订阅者
        dep.depend()
        if (childOb) {
          // 2、子属性的依赖收集（仅当该属性值为对象或数组时）：
          //   - 该属性值对应的观察对象的属性 dep 将当前 Dep.target 作为订阅者
          //   - 当前 Dep.target 将该属性值对应的观察对象的属性 dep 作为依赖
          // 以便该属性值动态增加/删除 属性/元素 的时候通知 watcher
          childOb.dep.depend()
          if (Array.isArray(value)) {
            // 3、若该属性值是数组，还需递归针对数组每个元素进行子属性的依赖收集
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
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
  })
}
```

定义响应式属性的第一步，就是创建[Dep](/vue/source-study/observer/dep.html)的实例`dep`，这个`dep`是个闭包对象，我们可以称之为响应式属性的“闭包`dep`”。既然是闭包，那就只能在`defineReactive`这个函数内访问到，这也就意味着，每一个闭包`dep`都唯一地对应着一个响应式属性。闭包`dep`里会记录着依赖于该响应式属性的所有订阅者，详情将在`依赖收集`一节里说明。

`defineReactive`的第三个参数是要定义的响应式属性的属性值`val`，但我们在`Observer`类的`walk`方法里调用`defineReactive`时只传入了两个参数而没有传入属性值`val`，对于此种情况，需要先设置属性值`val`。若是传入了属性值`val`，则不需要设置，而采用传入的属性值`val`。

我们的属性值`val`可能是任何类型，比如原始值、对象。若属性值是原始值时，属性值整个被替换了，我们知道属性改变了。但是，若属性值是对象/数组时，不仅整个对象/数组被替换时我们知道属性改变了，当对象添加、删除属性，数组添加、删除元素以及重排序时，我们也认为属性改变了。因此针对属性值是对象/数组的情况，我们还需要调用`observe`为属性值创建观察者对象，以递归地将属性值下的所有子孙属性/元素定义为响应式的。

最后，就是修改响应式属性的描述符，定义响应式属性的`get`和`set`特性。`get`特性的功能是收集依赖，`set`特性的功能是当响应式属性值改变后通知更新。

## 释疑

### Watcher 为什么要知道它有哪些依赖呢？

我们知道，`dep.subs`里是所有依赖于`dep`的订阅者，当`dep`发生改变时，可以通知到订阅者。那么为什么订阅者还要用`watcher.deps`来记录它有哪些依赖呢？

