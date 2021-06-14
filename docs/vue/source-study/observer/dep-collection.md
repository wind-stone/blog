# 依赖收集

[[toc]]

我们调用`defineReactive`给响应式属性添加了`get`特性，`get`函数将在该属性被访问时调用并将返回作为属性值。

`get`特性函数执行时，第一步是先计算出响应式属性的值。之后，就是收集依赖的过程。

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
          // 2、子属性的依赖收集（仅当该属性值为对象时）：
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
    }
  }
}
```

## 属性的依赖收集

我们知道，在 Watcher 计算其表达式时，会将当前`Dep.target`设置为该`Watcher`。若是 Watcher 在计算表达式的过程中访问了响应式属性，那么就会在此时做依赖收集的工作。

`dep`是响应式属性的闭包`dep`，调用`dep.depend()`，进而调用了`Dep.target.addDep()`方法将`dep`添加到了`Dep.target`的`newDeps`里，这样`dep`就成为了`Dep.target`这个 Watcher 的依赖了。与此同时，`dep`也会将`Dep.target`这个 Watcher 添加到`dep.subs`，这样`Dep.target`就成为了`dep`的订阅者了。

```js
// src/core/observer/dep.js
export default class Dep {
  // ...
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  // ...
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // ...
}
```

```js
// src/core/observer/watcher.js
export default class Watcher {
  // ...
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        // 若是该 watcher 之前没有过该 dep，则将 watcher 添加到 dep.subs（订阅者） 里
        dep.addSub(this)
      }
    }
  }
  // ...
}
```

## 属性的值的依赖收集

需要注意的是，此处的闭包`dep`所关联的是响应式属性自身，也就意味着只有当属性值整个被替换时，才会去通知订阅者。但若是属性值是引用类型比如对象，给对象添加/删除属性，对象的引用并没有改变，此时无法触发`dep.notify()`来通知订阅者，那该怎么办呢？（可先阅读下一节`通知更新`，再回来阅读下面的内容）

```js
let childOb = !shallow && observe(val)
```

注意到，我们在给响应式属性添加`get`和`set`之前，执行了上面这一句，而这就是响应式属性值处理为响应式对象（若属性值是对象或数组的话）并返回了属性值的观察者对象`childOb`，而观察者对象的`childOb.dep`也是跟闭包`dep`一样的依赖对象。紧接着，调用`childOb.dep.depend`将当前`Dep.target`与`childOb.dep`关联起来，`Dep.target`成为了`childOb.dep`的订阅者，`childOb.dep`也成为了`Dep.target`的依赖。若响应式属性的值为数组，还会调用`dependArray(value)`以遍历数组每个元素来收集依赖。最终在响应式属性值内部的子属性或元素发生变化时，也能通知到订阅者了（详情请见`通知更新`）。

```js
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
```

## 总结

Watcher 在计算表达式的值的时候，会将响应式属性的闭包`dep`作为依赖。若响应式属性的值是引用类型，还会将响应式属性的值对应的观察者对象的`dep`作为依赖。这样的话，无论是响应式属性改变，还是响应式属性值的子元素/子属性改变，都能调用不同的`dep.notify`通知到订阅者进行更新。
