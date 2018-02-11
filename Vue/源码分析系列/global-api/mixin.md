# `Vue.mixin`源码学习及收获

`Vue.mixin`方法，主要是将传入的`mixin`对象合并到构造函数`Vue`或其子类`SubVue`的`options`属性里，形成新的`Vue.options`或`SubVue.options`
（`SubVue`是通过`Vue.extend`扩展而来的构造函数，即`Vue`的子类，详情请参考`Vue.extend`）

```js
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```