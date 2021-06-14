# attrs

[[toc]]

创建 DOM 元素节点和修补 DOM 元素节点时，可能需要添加/修改元素节点的特性`attribute`。`attrs`模块将`attribute`的添加和修改合并成了同一个函数`updateAttrs`。

## 更新 attrs

更新`attribute`的步骤为：

1. 若是组件占位 VNode，且组件设置了不继承非`props`的特性，则无需更新，直接返回
2. 若新旧 VNode 上都不存在`attrs`数据，则无需更新，直接返回
3. 若`attrs`是响应式对象，则克隆一份数据
4. 添加/修改新 VNode 里的`attribute`
5. 移除在旧 VNode 里但不在新 VNode 里的`attribute`

`attribute`的设置稍微复杂一些，要考虑到各种兼容问题，还要考虑布尔特性、枚举特性、Xlink 命名空间等等。

```js
// src/platforms/web/runtime/modules/attrs.js
import { isIE, isIE9, isEdge } from 'core/util/env'

import {
  extend,
  isDef,
  isUndef
} from 'shared/util'

import {
  isXlink,
  xlinkNS,
  getXlinkProp,
  isBooleanAttr,
  isEnumeratedAttr,
  isFalsyAttrValue
} from 'web/util/index'

/**
 * 更新 attributes
 */
function updateAttrs (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const opts = vnode.componentOptions
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    // 若是组件占位 VNode，且组件设置了不继承非 props 的特性，则无需更新
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    // 若新旧 VNode 上都不存在 attrs 数据，则无需更新
    return
  }
  let key, cur, old
  const elm = vnode.elm
  const oldAttrs = oldVnode.data.attrs || {}
  let attrs: any = vnode.data.attrs || {}
  // clone observed objects, as the user probably wants to mutate it
  // vm.$attrs 是响应式的，且指向了 vnode.data.attrs，且为 vm.$attrs 添加响应式的操作在前，因此 vnode.data.attrs 也是响应式的
  // 为了防止用户直接修改 attribute 的值，此处克隆一份数据
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs)
  }

  // 更新特性
  for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur)
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value)
  }
  // 删除已不存在的旧特性
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key)
      }
    }
  }
}

/**
 * 设置 DOM 元素节点的 attribute
 */
function setAttr (el: Element, key: string, value: any) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value)
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      // 特性的值为 null 和 false，移除特性
      el.removeAttribute(key)
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key
      el.setAttribute(key, value)
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true')
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key))
    } else {
      el.setAttributeNS(xlinkNS, key, value)
    }
  } else {
    baseSetAttr(el, key, value)
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    // 特性的值为 null 和 false，移除特性
    el.removeAttribute(key)
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {
      const blocker = e => {
        e.stopImmediatePropagation()
        el.removeEventListener('input', blocker)
      }
      el.addEventListener('input', blocker)
      // $flow-disable-line
      el.__ieph = true /* IE placeholder patched */
    }
    // 设置特性
    el.setAttribute(key, value)
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}
```
