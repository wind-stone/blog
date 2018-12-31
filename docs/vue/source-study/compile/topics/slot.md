---
sidebarDepth: 0
---

# slot

[[toc]]

## 普通插槽

### 示例

开始讲述`slot`的完整过程之前，先给出一示例，方便后续理解。

```js
const ChildComp = {
  name: 'ChildComp',
  template: `
    <div class="child-root">
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer">
        <footer>footer 插槽的默认内容</footer>
      </slot>
    </div>
  `,
  mounted () {
    console.log('this.$options.render', this.$options.render)
  }
}

const ParentComp = {
  name: 'ParentComp',
  template: `
    <div class="parent-root">
      <ChildComp>
        <header slot="header">具名插槽-header</header>
        <div>默认插槽-内容</div>
      </ChildComp>
    </div>
  `,
  components: {
    ChildComp
  },
  mounted () {
    console.log('this.$options.render', this.$options.render)
  }
}

new Vue({
  el: '#app',
  components: { ParentComp },
  template: '<ParentComp></ParentComp>'
})
```

最终生成的 HTML 为：

```html
<div class="parent-root">
  <div class="child-root">
    <header>具名插槽-header</header>
    <div>默认插槽-内容</div>
    <footer>footer 插槽的默认内容</footer>
  </div>
</div>
```

### 编译阶段

::: tip 提示
编译阶段发生在组件的`vm.$mount`函数里，父组件会先编译，并产出`render`函数，再执行`mountComponent`函数，运行`render`函数生成 VNode Tree 进行`patch`；在`patch`阶段，创建子组件实例，再调用子组件的`vm.$mount`进行子组件的编译。总而言之，父组件先编译，子组件后编译。
:::

在编译阶段，若元素是`slot`标签，或元素有`slot`/`slot-scope`属性，则需要进行插槽相关的处理。

```js
function processSlot (el) {
  if (el.tag === 'slot') {
    // 子组件模板里的 slot 占位标签
    el.slotName = getBindingAttr(el, 'name')
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`
      )
    }
  } else {
    // 父组件模板里子组件标签内的插槽元素

    // 作用域插槽 slot-scope
    if (el.tag === 'template') {
      // ...
    }
    // 普通插槽
    const slotTarget = getBindingAttr(el, 'slot')
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      // 若是一般插槽（非作用域插槽），将要分发到的 slot 的名称保存在元素的 el.attrs.slot 特性里
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget)
      }
    }
  }
}
```

父组件编译时，遇到父组件模板里子组件标签下的插槽内容元素，会往插槽内容元素的 AST 上添加`el.slotTarget`，以标记这个插槽内容是给子组件模板里的哪个`slot`元素使用的（即，将替换掉子组件模板里的哪个`slot`元素。若父组件里的插槽内容元素没有`slot`属性即未命名插槽，则将其作为默认插槽。

子组件编译时，遇到子组件模板里的`slot`元素，会往`slot`元素的 AST 上添加`el.slotName`属性。

### 代码生成阶段

#### 父组件模板里子组件内的插槽

代码生成阶段，针对父组件模板里子组件内的普通插槽，会在数据对象`data`上添加`data.slot`属性。

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  // ...
  // slot target
  // only for non-scoped slots
  // 该元素是父组件模板里子组件标签内的普通插槽，在数据对象上添加`data.slot`属性
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  // ...
}
```

#### 子组件模板里的插槽元素

代码生成阶段，若子组件里的元素是`slot`标签，则子组件`render`函数里`slot`标签最终生成的代码为`_t(slotName, children, attrs对象, bind对象)`（作为对比，非`slot`标签生成的为`_c(tag, data, children)`），`_t`函数是`renderSlot`，会在运行时阶段执行。

```js
/**
 * （针对子组件里的 slot 标签）
 * 生成 slot 标签的内容
 *
 * 最终拼装成 _t(slotName, children, attrs对象, bind对象)
 */
function genSlot (el: ASTElement, state: CodegenState): string {
  const slotName = el.slotName || '"default"'
  // children 是 slot 标签内的节点，若该 slot 没有分发内容，则显示默认内容即 children
  const children = genChildren(el, state)
  let res = `_t(${slotName}${children ? `,${children}` : ''}`
  const attrs = el.attrs && `{${el.attrs.map(a => `${camelize(a.name)}:${a.value}`).join(',')}}`
  const bind = el.attrsMap['v-bind']
  if ((attrs || bind) && !children) {
    res += `,null`
  }
  if (attrs) {
    res += `,${attrs}`
  }
  if (bind) {
    res += `${attrs ? '' : ',null'},${bind}`
  }
  return res + ')'
}
```

#### 示例的 render 函数

```js
// 父组件 render 函数
(function anonymous() {
    with (this) {
        return _c(
            'div',
            {
                staticClass: "parent-root"
            },
            [
                _c(
                    'ChildComp',
                    [
                        _c(
                            'header',
                            {
                                attrs: {
                                    "slot": "header"
                                },
                                slot: "header"
                            },
                            [
                                _v("具名插槽-header")
                            ]
                        ),
                        _v(" "),
                        _c(
                            'div',
                            [
                                _v("默认插槽-内容")
                            ]
                        )
                    ]
                )
            ],
            1
        )
    }
})
```

观察父组件的`render`函数，我们可以发现，在`_c`函数执行时，会先对`_c`函数内的`children`数组求值，即元素的子节点会先创建 VNode 节点。

这也就是说，在子组件创建组件占位 VNode 之前，父组件模板里子组件标签下的插槽内容会先创建出 VNode。如此在创建子组件 VNode 时，父组件的插槽内容已经可用了。

```js
// 子组件的 render 函数
(function anonymous() {
    with (this) {
        return _c(
            'div',
            // 数据对象
            {
                staticClass: "child-root"
            },
            // 子元素 children
            [
                _t("header"),
                _v(" "),
                _t("default"),
                _v(" "),
                _t(
                    "footer",
                    [
                        _c(
                            'footer',
                            [
                                _v(
                                    "footer 插槽的默认内容"
                                )
                            ]
                        )
                    ]
                )
            ],
            2
        )
    }
})
```

### 运行时阶段

#### 子组件 vm.$slots

运行时阶段，调用`_c`创建子组件的占位 VNode 时，会将父组件模板里子组件内的`slot`内容都挂载在子组件 VNode 的`vnode.componentOptions.children`上。

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  // return a placeholder vnode
  // 注意：针对所有的组件，返回的 vnode 都是占位 vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    // vnode.componentOptions
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  // ...
  return vnode
}
```

子组件在初始化实例时，`Vue.prototype._init`里将调用`initInternalComponent`初始化内部组件的选项，进而将`slot`内容赋值给组件的`vm.$options._renderChildren`。

```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag

    // a flag to avoid this being observed
    // 标明是 vue 实例
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // 通过 patch 函数里的 createComponent 来生成组件 vnode 的组件实例时（实际上是在vnode.data.hook.init 里调用 new vnode.componentOptions.Ctor(options) 生成组件实例）

      // 调用 initInternalComponent 函数后，合并的 options 已经挂载到 vm.$options
      initInternalComponent(vm, options)
    }
    // ...
    initRender(vm)
    // ...
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  // 子组件的占位 VNode
  const parentVnode = options._parentVnode
  // 创建子组件时的活动实例
  opts.parent = options.parent
  // opts._parentVnode：组件实例对应的 vnode 的父 vnode
  opts._parentVnode = parentVnode

  // 将组件占位 VNode 上有关组件的数据，转存到 vm.$options 上
  const vnodeComponentOptions = parentVnode.componentOptions
  // ...
  opts._renderChildren = vnodeComponentOptions.children
  // ...
}
```

紧接着，会调用`initRender`来初始化`render`相关的内容，此时会处理`slot`内容，将所有`slot`的`name`及其 VNode 节点数组都挂载在`vm.$slots`里，`vm.$slots`的结构为：`{ slot名称: slot内容的 VNode 节点数组 }`。

```js
// src/core/instance/render.js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  // options._parentVnode 是子组件的组件占位 VNode，因此根组件不存在
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // ...
}
```

```js
/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 * 返回子组件标签里所有 slot 内容的 VNode 节点数组
 * { slot名称: slot内容的 VNode 节点数组 }
 */
export function resolveSlots (
  children: ?Array<VNode>,
  context: ?Component
): { [key: string]: Array<VNode> } {
  const slots = {}
  if (!children) {
    return slots
  }
  for (let i = 0, l = children.length; i < l; i++) {
    const child = children[i]
    const data = child.data
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      // 命名插槽
      const name = data.slot
      const slot = (slots[name] || (slots[name] = []))
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || [])
      } else {
        slot.push(child)
      }
    } else {
      // 默认插槽
      (slots.default || (slots.default = [])).push(child)
    }
  }
  // ignore slots that contains only whitespace
  for (const name in slots) {
    if (slots[name].every(isWhitespace)) {
      delete slots[name]
    }
  }
  return slots
}
```

示例里子组件`ChildComp`的`vm.$slots`为：

```js
{
  default: [
    空白节点的 VNode,
    div 默认插槽的 VNode
  ],
  header: [
    div(slot="header")的 VNode
  ]
}
```

#### renderSlot

在代码生成阶段我们知道，子组件模板里的`slot`标签，在子组件的`render`里生成的代码为`_t(slotName, children, attrs对象, bind对象)`，`_t`函数是`renderSlot`，其作用就是针对子组件模板里的`slot`节点，返回该节点的 VNode。

若`slot`节点是普通插槽，就在子组件实例`vm.$slots`里查找`slot`节点对应的 VNode。

若能找到，则使用`vm.$slots`里的 VNode。（此时该 VNode 的编译作用域是父组件）

若找不到，则使用子组件模板里的`slot`标签下的默认内容的 VNode。（此时默认内容的 VNode 的编译作用域是子组件）

```js
/**
 * Runtime helper for rendering <slot>
 * 返回 slot 节点的 VNode 数组
 */
export function renderSlot (
  // 插槽的名称
  name: string,
  // fallback 是 slot 标签内的插槽默认内容的 VNode 数组。若该 slot 没有分发内容，则使用默认内容
  fallback: ?Array<VNode>,
  // slot 元素上的特性对象
  props: ?Object,
  bindObject: ?Object
): ?Array<VNode> {
  const scopedSlotFn = this.$scopedSlots[name]
  let nodes
  if (scopedSlotFn) { // scoped slot
    // ...
  } else {
    const slotNodes = this.$slots[name]
    // warn duplicate slot usage
    if (slotNodes) {
      if (process.env.NODE_ENV !== 'production' && slotNodes._rendered) {
        warn(
          `Duplicate presence of slot "${name}" found in the same render tree ` +
          `- this will likely cause render errors.`,
          this
        )
      }
      slotNodes._rendered = true
    }
    nodes = slotNodes || fallback
  }

  const target = props && props.slot
  if (target) {
    // TODO: 这是什么场景？
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    // 一般情况下，走这条分支
    return nodes
  }
}
```

如此，在生成子组件的 VNode Tree 时，子组件`render`函数里的`_t("header")`/`_t("default")`/`_t("footer")`都能返回 VNode，子组件成功地拿到了在父组件编译作用域下产生的 VNode 节点。

## 作用域插槽

::: warning 警告
作用域插槽是插槽的特殊形式，因此不能同时存在默认普通插槽和默认作用域插槽，只能存在一个默认普通插槽/作用域插槽。PS：经测试，同时存在默认普通插槽和默认作用域插槽时，最终只有默认作用域插槽生效（TODO: 为什么这个生效？）。
:::
