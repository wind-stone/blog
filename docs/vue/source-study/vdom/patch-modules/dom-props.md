# dom-props 模块

[[toc]]

创建 DOM 元素节点和修补 DOM 元素节点时，可能需要添加/修改元素节点的属性`property`。`dom-props`模块将`property`的添加和修改、删除合并成了同一个函数`updateDOMProps`。

## 更新 property

更新`property`的步骤为：

1. 若新旧 VNode 都不存在`domProps`数据，则无需更新，直接返回
2. 若`domProps`是响应式对象，则克隆一份数据
3. 清空 DOM 元素节点上不在新 VNode 里的老`property`
4. 将新 VNode 上的`domProps`设置到 DOM 元素节点上
    - 处理`property`为`textContent`/`innerHTML`的情况
      - 清空新 VNode 的所有子 VNode
      - 处理 Chrome 55 及以下版本的 bug
    - 设置`property`的值
      - 处理`property`为`value`的情况（TODO: 待学习模板编译之后，再来分析详细情况）
      - 若`property`不为`value`，直接设置新值

```js
// src/
import { isDef, isUndef, extend, toNumber } from 'shared/util'

function updateDOMProps (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    // 若新旧 VNode 都不存在 domProps 数据，则无需更新
    return
  }
  let key, cur
  const elm: any = vnode.elm
  const oldProps = oldVnode.data.domProps || {}
  let props = vnode.data.domProps || {}
  // clone observed objects, as the user probably wants to mutate it
  // TODO: 待确定哪里对 domProps 进行了响应式处理
  // 为了防止用户直接修改 attribute 的值，此处克隆一份数据
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props)
  }

  // 清空不在新 VNode 里的老的 domProp
  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = ''
    }
  }
  // 设置 domProp
  for (key in props) {
    cur = props[key]
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    // 若设置的是 textContent 和 innerHTML 属性，则该 DOM 元素的子节点就可以忽略了
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) vnode.children.length = 0
      if (cur === oldProps[key]) continue
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0])
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur
      // avoid resetting cursor position when value is the same
      const strCur = isUndef(cur) ? '' : String(cur)
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur
      }
    } else {
      // 设置 DOM 元素节点的 property
      elm[key] = cur
    }
  }
}

// check platforms/web/util/attrs.js acceptValue
type acceptValueElm = HTMLInputElement | HTMLSelectElement | HTMLOptionElement;

function shouldUpdateValue (elm: acceptValueElm, checkVal: string): boolean {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm: acceptValueElm, checkVal: string): boolean {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  let notInFocus = true
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm: any, newVal: string): boolean {
  const value = elm.value
  const modifiers = elm._vModifiers // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

export default {
  create: updateDOMProps,
  update: updateDOMProps
}
```
