---
sidebarDepth: 0
---

# style 模块

[[toc]]

创建 DOM 元素节点和修补 DOM 元素节点时，可能需要添加/修改元素节点的`style`属性。`style`模块将`style`的添加和修改合并成了同一个函数`updateStyle`。

## 更新 style

更新`class`的步骤为：

1. 若新旧 VNode 都不存在`style`/`staticStyle`数据，则无需更新
2. 将`vnode.data.style`规范化成对象形式的`style`
3. 若`style`是响应式的，克隆一份数据
4. 合并新 VNode 上的`style`和`staticStyle`，形成最终的对象形式的`style`（包括向上向下处理连续嵌套组件的情况）
5. 删除不在新`style`里的老`style`的属性
6. 将新`style`设置到 DOM 元素节点上

::: tip 提示
编译阶段已经将`vnode.data.staticStyle`处理成了对象形式，但`vnode.data.style`仍可能是字符串形式、对象形式或对象数组形式。
:::

```js
// src/platforms/web/runtime/modules/style.js
import { getStyle, normalizeStyleBinding } from 'web/util/style'
import { cached, camelize, extend, isDef, isUndef } from 'shared/util'

const cssVarRE = /^--/
const importantRE = /\s*!important$/

/**
 * 设置 el.style 属性
 *
 * @param {*} el 元素
 * @param {*} name css 属性名
 * @param {*} val css 属性值
 */
const setProp = (el, name, val) => {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val)
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important')
  } else {
    const normalizedName = normalize(name)
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (let i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i]
      }
    } else {
      el.style[normalizedName] = val
    }
  }
}

const vendorNames = ['Webkit', 'Moz', 'ms']

let emptyStyle

/**
 * 标准化 property 的名称
 */
const normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style
  prop = camelize(prop)
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  const capName = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (let i = 0; i < vendorNames.length; i++) {
    const name = vendorNames[i] + capName
    if (name in emptyStyle) {
      return name
    }
  }
})

/**
 * 更新 DOM 元素节点的 style 特性
 */
function updateStyle (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const data = vnode.data
  const oldData = oldVnode.data

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    // 若新旧 VNode 都不存在 style/staticStyle 属性，则直接返回
    return
  }

  let cur, name
  const el: any = vnode.elm
  const oldStaticStyle: any = oldData.staticStyle
  const oldStyleBinding: any = oldData.normalizedStyle || oldData.style || {}

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  // 若是 staticStyle 存在，就使用 staticStyle
  // 因为 stylebinding 的数据已经在 getStyle 时通过 normalizeStyleData 合并到 stylebinding 了
  const oldStyle = oldStaticStyle || oldStyleBinding

  // 将 vnode.data.style 规范化成对象形式
  const style = normalizeStyleBinding(vnode.data.style) || {}

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  // 若 style 是响应式的，克隆一份数据
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style

  // 获取最新的 style，对象形式
  const newStyle = getStyle(vnode, true)

  // 删除不在新 style 里的老 style
  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '')
    }
  }
  // 设置新 style
  for (name in newStyle) {
    cur = newStyle[name]
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur)
    }
  }
}

export default {
  create: updateStyle,
  update: updateStyle
}
```

```js
// src/platforms/web/util/style.js
import { cached, extend, toObject } from 'shared/util'

/**
 * 解析 html 标签上 style 属性里的各个声明，转换成对象格式
 * @return {Object} {声明的属性: 声明的值}
 */
export const parseStyleText = cached(function (cssText) {
  const res = {}
  // 匹配 css 声明之间分隔的 ;
  // 正向否定查找，匹配分号“;”，仅当“;”后面不跟着某个表达式
  // 这个表达式是：[^(]*\)，即非(的零到多个字符且以)结尾，TODO: 这是什么情况下的？
  const listDelimiter = /;(?![^(]*\))/g
  // 匹配声明里属性和值之间分隔的 :
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter)
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return res
})

// merge static and dynamic style data on the same vnode
/**
 * 合并同一 VNode 节点上的 style 和 staticStyle，返回新的对象形式的 style
 */
function normalizeStyleData (data: VNodeData): ?Object {
  const style = normalizeStyleBinding(data.style)
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  // 编译阶段已经将 staticStyle 预处理成了对象形式，而且这个对象是新的引用
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
/**
 * 规格化数组/字符串形式的 style 为对象形式
 */
export function normalizeStyleBinding (bindingStyle: any): ?Object {
  if (Array.isArray(bindingStyle)) {
    // 将对象数组合并为单个对象，如 [{a: 1}, {b: 2}] --> {a: 1, b: 2}
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    // 将字符串形式的 style 转为对象
    return parseStyleText(bindingStyle)
  }
  // 对象形式的 style，直接返回
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
/**
 * 合并新 VNode 上的 style 和 staticStyle，形成最终的对象形式的 style（包括向上向下处理连续嵌套组件的情况）
 */
export function getStyle (vnode: VNodeWithData, checkChild: boolean): Object {
  const res = {}
  let styleData
  // 若该 VNode 是组件占位 VNode，则先合并子组件渲染 VNode 根元素的 style，包括连续嵌套组件
  if (checkChild) {
    let childNode = vnode
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData)
      }
    }
  }

  // 再合并该 VNode 的 style
  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData)
  }

  let parentNode = vnode
  // 若该 VNode 是组件渲染 VNode，则最后合并父组件占位 VNode 上的 style，包括连续嵌套组件
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData)
    }
  }
  return res
}
```
