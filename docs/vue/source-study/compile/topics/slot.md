---
sidebarDepth: 0
---

# slot

[[toc]]

## 普通插槽 VS 作用域插槽

- 编译作用域
  - 普通插槽：父组件
  - 作用域插槽：子组件

- VNode 的生成方式
  - 普通插槽：父组件编译时，直接生成普通插槽的 VNode，作为子组件的`children`
  - 作用域插槽：父组件编译时，生成子组件数据对象上的`data.scopedSlots`里的`key-fn`对，`fn`是作用域插槽生成函数；在运行时阶段子组件`render`函数执行时动态生成作用域插槽的 VNode

- 默认插槽与默认作用域插槽不能共存，若共存，则只有默认作用域插槽生效

- 父组件模板里，插槽必须作为子组件标签的直接子元素

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

代码生成阶段，若子组件里的元素是`slot`标签，则子组件`render`函数里`slot`标签最终生成的代码为`_t(slotName, children)`（作为对比，非`slot`标签生成的为`_c(tag, data, children)`），`_t`函数是`renderSlot`，会在运行时阶段执行。

需要注意，普通插槽元素，`_t`的第三个参数`attrs`对象和`bind`对象是无用的，它们在作用域插槽中会用到。

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

若`slot`节点是普通插槽，就在子组件实例`vm.$slots`里查找`slot`节点对应的 VNode 数组。

若能找到，则使用`vm.$slots`里的 VNode 数组。（此时该 VNode 数组的编译作用域是父组件）

若找不到，则使用子组件模板里的`slot`标签下的默认内容的 VNode 数组。（此时默认内容的 VNode 数组的编译作用域是子组件）

```js
/**
 * Runtime helper for rendering <slot>
 * 返回子组件里 slot 元素节点的 VNode 数组
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

### 示例

```js
const ChildComp = {
  name: 'ChildComp',
  template: `
    <div class="child-root">
      <slot text="hello"></slot>
      <slot name="world" text="world" :message="'你好！'"></slot>
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
        <div slot-scope="props">{{ props.text }}</div>
        <div slot="world" slot-scope="props">{{ props.text }}, {{ props.message }}</div>
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

```js
<div class="parent-root">
  <div class="child-root">
    <div>hello</div>
    <div>world, 你好！</div>
  </div>
</div>
```

### 编译阶段

编译阶段仍然是先编译父组件，后编译子组件。

父组件编译时，若模板里的元素是带有`slot`属性，则其为作用域插槽的内容，此时会往作用域插槽内容元素的 AST 上添加`el.slotScope`。

```js
function processSlot (el) {
  if (el.tag === 'slot') {
    // ...
  } else {
    // 父组件模板里子组件标签内的插槽元素
    let slotScope

    // 处理作用于插槽 slot-scope
    if (el.tag === 'template') {
      // 示例：
      // <template slot-scope="props">
      //   <span>hello from parent</span>
      //   <span>{{ props.text }}</span>
      // </template>
      slotScope = getAndRemoveAttr(el, 'scope')
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && slotScope) {
        warn(
          `the "scope" attribute for scoped slots have been deprecated and ` +
          `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
          `can also be used on plain elements in addition to <template> to ` +
          `denote scoped slots.`,
          true
        )
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && el.attrsMap['v-for']) {
        warn(
          `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
          `(v-for takes higher priority). Use a wrapper <template> for the ` +
          `scoped slot to make it clearer.`,
          true
        )
      }
      el.slotScope = slotScope
    }
    // 命名插槽 slot
    const slotTarget = getBindingAttr(el, 'slot')
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      // 若是一般插槽（非作用域插槽），将要分发到的 slot 的名称保存在元素的 slot 特性里
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget)
      }
    }
  }
}
```

紧接着`processSlot`之后，会对作用域插槽内容元素做以下处理：

```js
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          // 处理元素带有 v-else-if/v-else 指令的情况
          processIfConditions(element, currentParent)
        } else if (element.slotScope) { // scoped slot
          // 将作用域插槽放入父元素的 scopedSlots 里，而不是作为父元素的 child
          currentParent.plain = false
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        } else {
          // 作为父节点的子节点
          currentParent.children.push(element)
          element.parent = currentParent
        }
      }
```

可以发现，针对作用域插槽来说，并不会加入到父节点的`children`作为子节点来处理，而是将其放置在父节点的 AST 的`parentEl.scopedSlots`里，作用域插槽的`name`作为`key`，作用域插槽的内容元素作为`value`。

### 代码生成阶段

#### 父组件模板里子组件内的作用域插槽

```js
export function genData (el: ASTElement, state: CodegenState): string {
  // ...
  // scoped slots
  // 该元素拥有的所有的作用域插槽（带模板内容）
  if (el.scopedSlots) {
    data += `${genScopedSlots(el.scopedSlots, state)},`
  }
  // ...
}

function genScopedSlots (
  slots: { [key: string]: ASTElement },
  state: CodegenState
): string {
  return `scopedSlots:_u([${
    Object.keys(slots).map(key => {
      return genScopedSlot(key, slots[key], state)
    }).join(',')
  }])`
}

/**
 * 获取 scoped slot 模板函数，最终 data.scopedSlots 的数据结构是 { key: fn, ... }
 * @param {*} key slot 的名称
 * @param {*} el 分发内容的元素
 * @param {*} state
 */
function genScopedSlot (
  key: string,
  el: ASTElement,
  state: CodegenState
): string {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  // 生成分发内容模板
  const fn = `function(${String(el.slotScope)}){` +
    `return ${el.tag === 'template'
      ? el.if
        ? `${el.if}?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`
  return `{key:${key},fn:${fn}}`
}
```

代码生成阶段，若元素含有作用域插槽，就需要往元素的数据对象上添加`data.scopedSlots`属性，该属性值是`_u([{key, fn}, ...])`的形式，其中`_u`是`resolveScopedSlots`函数，将在运行时阶段执行，等之后再详细说，先来看看`_u`函数的参数数组里的每一项都是什么。

数组里的每一项都是一对象，`key`是作用于插槽的名称，`fn`是拼接生成的函数代码。

`fn`的生成类似于`render`函数的生成，但`fn`的参数是`el.slotScope`，即作用域插槽内容元素的`slot-scope`属性的值。`fn`函数体里，调用了`genElement`/`genChildren`等函数去生成代码。

```js
// 父组件的 render 函数
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
                    {
                        scopedSlots: _u(
                            [
                                {
                                    key: "default",
                                    fn: function(props) {
                                        return _c('div', {}, [_v(_s(props.text))])
                                    }
                                },
                                {
                                    key: "world",
                                    fn: function(props) {
                                        return _c('div', {}, [_v(_s(props.text) + ", " + _s(props.message))])
                                    }
                                }
                            ]
                        )
                    }
                )
            ],
            1
        )
    }
})
```

#### 子组件模板里的作用域插槽元素

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

```js
// 子组件的 render 函数
(function anonymous() {
    with (this) {
        return _c(
            'div', {
                staticClass: "child-root"
            },
            [
                _t(
                    "default",
                    null,
                    {
                        text: "hello"
                    }
                ),
                _v(" "),
                _t(
                    "world",
                    null,
                    {
                        text: "world",
                        message: '你好！'
                    }
                )
            ],
            2
        )
    }
})
```

### 运行时阶段

#### 父组件的 render 函数执行

运行时阶段，在父组件`render`函数执行时，会先执行`_u`即`resolveScopedSlots`函数，以获得最终的`scopedSlots`。

`resolveScopedSlots`函数就是将传入的对象数组，平铺化为对象，对象的`key`是作用域插槽的名称，`value`是作用域插槽的生成函数`fn`。

```js
export function resolveScopedSlots (
  fns: ScopedSlotsData, // see flow/vnode
  res?: Object
): { [key: string]: Function } {
  res = res || {}
  for (let i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res)
    } else {
      res[fns[i].key] = fns[i].fn
    }
  }
  return res
}
```

#### 子组件的 vm.$scopedSlots

接下来，在子组件实例化之后，调用`_render`方法生成子组件的 VNode Tree 时会将子组件占位节点数据对象上的`scopedSlots`（即上一步`resolveScopedSlots`的结果）赋值给子组件实例的`vm.$scopedSlots`。

```js
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // 若是组件实例，则会存在 _parentVnode
    const { render, _parentVnode } = vm.$options

    // reset _rendered flag on slots for duplicate slot check
    if (process.env.NODE_ENV !== 'production') {
      for (const key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
    }
    // ...
  }
```

#### 子组件的 render 函数执行

子组件的`render`函数执行时，会执行`_t`即`renderSlot`，返回作用域插槽元素的 VNode 数组。

不同于普通插槽，作用域插槽是从子组件实例的`vm.$scopedSlots`获取作用域插槽的生成函数，传入`props`作为参数来调用生成函数，返回作用域插槽的 VNode 数组。

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
  // v-bind 指令的值，对象类型
  bindObject: ?Object
): ?Array<VNode> {
  const scopedSlotFn = this.$scopedSlots[name]
  let nodes
  if (scopedSlotFn) { // scoped slot
    props = props || {}
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        )
      }
      props = extend(extend({}, bindObject), props)
    }
    // 生成 vnode 节点
    nodes = scopedSlotFn(props) || fallback
  } else {
    // ...
  }

  // target 为 slot 的名称，仅在节点 tag 为 template 下才有 slot 属性
  // 使用 template 的原因是，插槽的默认内容可以是多个元素？
  const target = props && props.slot
  if (target) {
    // 一般插槽：生成分发内容的 VNode，target 为要分发到的 slot 名称
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    // 作用域插槽
    return nodes
  }
}

```

## 疑惑

### 默认插槽和默认作用域插槽不能同时生效？

作用域插槽是插槽的特殊形式，因此不能同时存在默认普通插槽和默认作用域插槽，只能存在一个默认普通插槽/作用域插槽。

PS：经测试，同时存在默认普通插槽和默认作用域插槽时，最终只有默认作用域插槽生效。只有默认作用域插槽生效的原因是：子组件里`render`函数执行时，调用`renderSlot`为默认插槽标签寻找插槽内容时，会优先查找到作用域操作内容，而忽略默认普通插槽。

```js
export function renderSlot (
  // 插槽的名称
  name: string,
  // fallback 是 slot 标签内的插槽默认内容的 VNode 数组。若该 slot 没有分发内容，则使用默认内容
  fallback: ?Array<VNode>,
  // slot 元素上的特性对象
  props: ?Object,
  // v-bind 指令的值，对象类型
  bindObject: ?Object
): ?Array<VNode> {
  const scopedSlotFn = this.$scopedSlots[name]
  let nodes
  // 在此处会找到名为 default 的作用域插槽，而跳过 else 里的普通插槽的查找过程，导致有默认作用域插槽生效
  if (scopedSlotFn) { // scoped slot
    // 生成作用域插槽的 VNode
  } else {
    // 生成普通插槽的 VNode
  }
}
```

### slot 内容元素声明的位置

::: warning 警告
无论是普通插槽还是作用域插槽，在声明时，都要作为子组件标签的直接子元素。只要直接子元素上没有`slot`属性，都会当成默认插槽。
:::

```js
const ChildComp = {
  name: 'ChildComp',
  template: `
    <div class="child-root">
      <slot></slot>
      <slot name="test"></slot>
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
        <div>
          <p slot="test">hello</p>
        </div>
        <div>world</div>
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
    <div>
      <p slot="test">hello</p>
    </div>
    <div>world</div>
  </div>
</div>
```
