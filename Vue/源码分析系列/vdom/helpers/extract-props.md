# extract-props 源码学习及收获

提取出组件`data`里的`prop`

## 分析

```js
<template>
  <div class="root">
    <some-componet non-prop-attr="true"><some-component>
  </div>
</template>
```

组件可能会存在[非 Prop 特性](https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E-Prop-%E7%89%B9%E6%80%A7)，这些非 prop 特性，会直接传入组件并被添加到组件的根元素上，而不需要定义相应的 prop。

如果组件存在非 prop 特性，当将`template`编译成`render`函数时，我们就无法判断该特性是否是组件内定义的`prop`，因此`createElement`里的`data`就会包含`attrs`和`props`，需要我们自行根据组件选项对象里的`props`去筛选出需要的`prop`。本文件就是为了根据组件选项对象里的`props`去提取出`data.attrs/props`里的`prop`。


## 源码

```js
/* @flow */

import {
  tip,
  hasOwn,
  isDef,
  isUndef,
  hyphenate,
  formatComponentName
} from 'core/util/index'

export function extractPropsFromVNodeData (
  data: VNodeData,
  Ctor: Class<Component>,
  tag?: string
): ?Object {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  const propOptions = Ctor.options.props
  if (isUndef(propOptions)) {
    return
  }
  const res = {}
  const { attrs, props } = data
  if (isDef(attrs) || isDef(props)) {
    for (const key in propOptions) {
      const altKey = hyphenate(key)
      if (process.env.NODE_ENV !== 'production') {
        const keyInLowerCase = key.toLowerCase()
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            `Prop "${keyInLowerCase}" is passed to component ` +
            `${formatComponentName(tag || Ctor)}, but the declared prop name is` +
            ` "${key}". ` +
            `Note that HTML attributes are case-insensitive and camelCased ` +
            `props need to use their kebab-case equivalents when using in-DOM ` +
            `templates. You should probably use "${altKey}" instead of "${key}".`
          )
        }
      }
      // 从 attrs 和 props 里提取出 prop
      // 从 attrs 里提取之后，要删除 attrs 对应的属性
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false)
    }
  }
  return res
}

function checkProp (
  res: Object,
  hash: ?Object,
  key: string,
  altKey: string,
  preserve: boolean
): boolean {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key]
      if (!preserve) {
        delete hash[key]
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey]
      if (!preserve) {
        delete hash[altKey]
      }
      return true
    }
  }
  return false
}
```
