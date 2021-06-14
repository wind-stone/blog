# 插槽

[[toc]]

本节讲述的内容及源码的 Vue.js 的版本是：v2.6.12

Vue.js v2.6.0 开始，统一了常规插槽和作用域插槽的语法，采用`v-slot`指令表示。常规插槽和作用域插槽本质上是一样的，只是作用域插槽的`v-slot`指令具有值，而常规插槽的`v-slot`指令没有值。

## 常规插槽 VS 作用域插槽

### 插槽的作用域

无论是常规插槽还是作用域插槽，都是在父组件作用域里编译的，可以访问到父组件上的实例属性。

不同的是，作用域插槽可以访问到子组件传入的插槽`prop`，即可以访问到子组件里针对该插槽保留的实例属性。

### 插槽 VNode 的生成方式

- VNode 的生成方式
  - 普通插槽：父组件编译时，直接生成普通插槽的 VNode，作为子组件的`children`
  - 作用域插槽：父组件编译时，生成子组件数据对象上的`data.scopedSlots`里的`key-fn`对，`fn`是作用域插槽生成函数；在运行时阶段子组件`render`函数执行时动态生成作用域插槽的 VNode

- 默认插槽与默认作用域插槽不能共存，若共存，则只有默认作用域插槽生效

- 父组件模板里，插槽必须作为子组件标签的直接子元素

## 创建 AST 时处理插槽

在为模板里的各个节点创建 AST 节点时，会在每个节点标签关闭时调用`closeElement`来处理节点上的各种指令，其中会在`processElement`函数里处理插槽相关的内容，主要分为两块：

- 处理插槽内容，即父组件模板里带有`v-slot`指令的节点，包括带有`v-slot`指令的子组件标签和带有`v-slot`指令的子组件直接子节点
- 处理子组件标签模板里的`slot`标签

```js
// src/compiler/parser/index.js
  function closeElement (element) {
    trimEndingWhitespace(element)
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }
    // ...
  }
```

```js
// src/compiler/parser/index.js
export function processElement (
  element: ASTElement,
  options: CompilerOptions
) {
  // ...
  // 处理（父组件模板里）子组件标签上的 v-slot 指令或子组件直接子节点上的 v-slot 指令
  processSlotContent(element)
  // 处理子组件模板里的 slot 标签元素，增加 slotName 属性
  processSlotOutlet(element)
  // ...
  return element
}
```

### processSlotContent 处理插槽内容

历史上，Vue.js 2.x 插槽内容共存在 3 种语法，按时间顺序从前往后一次是：

- `slot`/`scope`特性
- `slot`/`slot-scope`特性
- v2.6.0 及以后版本的`v-slot`指令

因此，v2.6.0 之后的版本，除了最新的`v-slot`指令，还要对之前版本的语法进行兼容，同时在非生产环境给出旧语法的警告，因此这块的源码相对较多。学习源码时，可以忽略对旧语法的兼容，直接学习对`v-slot`指令的处理

```js
// src/compiler/parser/index.js
/**
 * 处理 slot 内容，该节点是在父组件模板里声明子组件时，作为子组件的 children
 * Vue.js v2.6.0 以后，普通插槽和作用域插槽采用了统一的语法，v-slot 指令
 *
 * 比如：
 * <template>
 *   <div>
 *     <child-component>
 *        <template v-slot:slotName="slotProps"></template>
 *
 *        <!-- 未包含在 template 里的内容，作为默认插槽的内容，比如这里的 div 和 p -->
 *        <div></div>
 *        <p></p>
 *     </child-component>
 *   </div>
 * </template>
 *
 * 注意，插槽所在的 template 标签只能作为组件标签的直接子节点
 */
// handle content being passed to a component as slot,
// e.g. <template slot="xxx">, <div slot-scope="xxx">
function processSlotContent (el) {
  let slotScope
  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope')
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && slotScope) {
      // 对 v2.5.0 以前的 scope 语法进行警告
      warn(
        `the "scope" attribute for scoped slots have been deprecated and ` +
        `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
        `can also be used on plain elements in addition to <template> to ` +
        `denote scoped slots.`,
        el.rawAttrsMap['scope'],
        true
      )
    }
    // 兼容 v2.6.0 以前的 slot-scope 语法
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
  } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && el.attrsMap['v-for']) {
      warn(
        `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
        `(v-for takes higher priority). Use a wrapper <template> for the ` +
        `scoped slot to make it clearer.`,
        el.rawAttrsMap['slot-scope'],
        true
      )
    }
    el.slotScope = slotScope
  }

  // 获取 :slot 或 v-bind:slot 或 slot 特性的值
  // slot="xxx"
  const slotTarget = getBindingAttr(el, 'slot')
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
    }
  }

  // 2.6 v-slot syntax
  if (process.env.NEW_SLOT_SYNTAX) {
    if (el.tag === 'template') {
      // v-slot on <template>

      // slotRE = /^v-slot(:|$)|^#/ ，该正则匹配三种写法
      // 1. 只有 v-slot，无参数
      // 2. v-slot:xxx 带参数
      // 3. v-slot 的缩写方式 #
      const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
      if (slotBinding) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.slotTarget || el.slotScope) {
            warn(
              `Unexpected mixed usage of different slot syntaxes.`,
              el
            )
          }
          if (el.parent && !maybeComponent(el.parent)) {
            // 插槽所在的 template 标签只能作为组件标签的直接子节点
            warn(
              `<template v-slot> can only appear at the root level inside ` +
              `the receiving component`,
              el
            )
          }
        }
        const { name, dynamic } = getSlotName(slotBinding)
        // 目标插槽，指向子组件里 <slot name="xxx"> 标签，xxx 即这里 name
        el.slotTarget = name
        // 是否是动态插槽
        el.slotTargetDynamic = dynamic
        // 作用域插槽的 slotProps，若是普通插槽，强制转为作用域插槽
        // 注意，template 节点表示的作用域插槽挂载到子组件 scopedSlots 上的操作，是在处理 template 节点的 closeElement 函数里完成的
        // 此时，子组件节点还没有调用 closeElement
        el.slotScope = slotBinding.value || emptySlotScopeToken // force it into a scoped slot for perf
      }
    } else {
      // 组件上的 v-slot 指令，在这种情况下，
      // 详见: https://cn.vuejs.org/v2/guide/components-slots.html#%E7%8B%AC%E5%8D%A0%E9%BB%98%E8%AE%A4%E6%8F%92%E6%A7%BD%E7%9A%84%E7%BC%A9%E5%86%99%E8%AF%AD%E6%B3%95
      // v-slot on component, denotes default slot
      const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
      if (slotBinding) {
        if (process.env.NODE_ENV !== 'production') {
          if (!maybeComponent(el)) {
            warn(
              `v-slot can only be used on components or <template>.`,
              slotBinding
            )
          }
          if (el.slotScope || el.slotTarget) {
            warn(
              `Unexpected mixed usage of different slot syntaxes.`,
              el
            )
          }
          if (el.scopedSlots) {
            warn(
              `To avoid scope ambiguity, the default slot should also use ` +
              `<template> syntax when there are other named slots.`,
              slotBinding
            )
          }
        }
        // 此时 el 是组件的 AST 节点
        // add the component's children to its default slot
        const slots = el.scopedSlots || (el.scopedSlots = {})
        const { name, dynamic } = getSlotName(slotBinding)

        // 将子组件上存在 v-slot 默认插槽的形式，通过新创建一个 template 的 AST 节点，改成 template 标签存在 v-slot 指令的形式
        const slotContainer = slots[name] = createASTElement('template', [], el)
        slotContainer.slotTarget = name
        slotContainer.slotTargetDynamic = dynamic

        // 将组件节点上的非作用域插槽节点的子节点，都改作为新的 template 节点的子节点
        // BTW，processSlotContent 函数是在 processElement 函数里调用的，而 processElement 函数是在 closeElement 函数里调用的
        // 因此在处理组件节点的 v-slot 时，组件的子节点早已经处理完毕且子节点的 parent 都指向了组件节点
        slotContainer.children = el.children.filter((c: any) => {
          if (!c.slotScope) {
            c.parent = slotContainer
            return true
          }
        })
        slotContainer.slotScope = slotBinding.value || emptySlotScopeToken

        // 清空子组件的 children 数组，因为子组件的 children 都是插槽，都已经挂载子组件的 scopedSlots 里了
        // remove children as they are returned from scopedSlots now
        el.children = []
        // mark el non-plain so data gets generated
        el.plain = false
      }
    }
  }
}

/**
 * 从特性对象里提取出 slot 特性的名称
 * @param {*} binding 对象，结构为
 *   {
 *     name,  // 特性的名称，包含指令和参数
 *     value, // 特性的值，不包含单双引号
 *     dynamic?,
 *     start?,
 *     end?
 *   }
 * @returns
 */
function getSlotName (binding) {
  // slotRE = /^v-slot(:|$)|^#/
  let name = binding.name.replace(slotRE, '')
  if (!name) {
    if (binding.name[0] !== '#') {
      name = 'default'
    } else if (process.env.NODE_ENV !== 'production') {
      // 无名称的默认插槽不能使用缩写形式 #
      warn(
        `v-slot shorthand syntax requires a slot name.`,
        binding
      )
    }
  }
  // dynamicArgRE = /^\[.*\]$/
  return dynamicArgRE.test(name)
    // dynamic [name]
    ? { name: name.slice(1, -1), dynamic: true }
    // static name
    : { name: `"${name}"`, dynamic: false }
}
```

`v-slot`指令的使用有两种方式：

- 子组件标签直接子节点`template`上的`v-slot`指令
- 子组件标签的`v-slot`指令

#### 子组件标签直接子节点 template 上的 v-slot 指令

针对子组件标签直接子节点`template`上的`v-slot`指令，会从`el.attrsList`中提取与指令有关的`slotBinding`对象，获取到`v-slot`指令的参数、指令值。提取出的`slotBinding`对象的结构为：

```js
{
  name,  // 特性的名称，包含指令和参数
  value, // 特性的值，不包含单双引号
  dynamic?,
  start?,
  end?
}
```

`v-slot`指令的参数表示子组件模板里对应的占位的`slot`标签，`v-slot`指令的值表示子组件暴露的插槽`prop`对象，最终会往 AST 节点上增加三个新属性：

```js
el.slotTarget         // 目标插槽，指向子组件模板里 <slot name="xxx"> 标签
el.slotTargetDynamic  // 是否是动态插槽
el.slotScope          // 作用域插槽的 slotProps
```

只有作用域插槽会存在`slotScope`属性，但是这里针对常规插槽做了处理，统一处理成作用域插槽，`slotScope`赋值为`_empty_`。也就是说，即使`v-slot`指令没有对应的指令值的常规插槽在创建 AST 时也会转换成作用域插槽。

之后，在`closeElement`函数的末尾，会将作用域插槽内容节点挂载到子组件标签的 AST 节点的`scopedSlots`属性上，方便在之后为子组件标签的 AST 节点生成数据对象时进行处理。

```js
  function closeElement (element) {
    // ...
    if (currentParent && !element.forbidden) {
      if (element.elseif || element.else) {
        // 处理元素带有 v-else-if/v-else 指令的情况
        // 需要注意的是，针对带有 v-else-if/v-else 指令的元素，不会作为该元素的父元素的子元素，
        // 而是放置在该元素对应的带有 v-if 指令的元素的 ifConditions 属性里
        processIfConditions(element, currentParent)
      } else {
        // 将父组件里跟子组件有关的作用域插槽的 AST 节点挂载到子组件 AST 节点的 scopedSlots 上
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can
          // find it as the prev node.
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        }
        // 子节点与父节点相互关联
        currentParent.children.push(element)
        element.parent = currentParent
      }
    }
    // ...
  }
```

这里尤其需要注意，父组件模板里跟子组件相关的作用域插槽，是挂载在子组件的 AST 节点的`scopedSlots`属性上的，而不是父组件 AST 节点上。

#### 子组件标签上的 v-slot 指令

按照官方的推荐写法，若是子组件标签上存在`v-slot`指令，则表示子组件下的所有直接子节点都是默认插槽的内容，不应该存在其他插槽。

针对子组件标签上的`v-slot`指令，同样会提取出`slotBinding`对象并获取到`v-slot`指令的参数和指令值。

之后，会新创建一个`template`标签，将子组件标签下的所有未指定插槽直接子节点都改作为这个新的`template`节点的直接子节点，这样就将“子组件标签上的`v-slot`指令”这种写法处理成了“子组件标签直接子节点`template`上的`v-slot`指令”的写法了。

此外，子组件标签上添加`v-slot`指令这种独占默认插槽的写法会让子组件标签下未指定插槽的内容都作为默认插槽内容，因此会将子组件的`children`数组清空，表示子组件下只存在一个默认插槽（且这个默认插槽已经挂载到子组件 AST 节点的`scopedSlots`上了）。

### processSlotOutlet 处理插槽标签

处理子组件模板里的`slot`标签时，只是提取出`slotName`属性，表示这是哪个插槽内容的占位节点。

```js
// src/compiler/parser/index.js
// handle <slot/> outlets
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`,
        getRawBindingAttr(el, 'key')
      )
    }
  }
}
```

```js
// src/compiler/helpers.js
/**
 * 获取 AST 元素上绑定的特性的值；若绑定值不存在，获取静态值
 */
export function getBindingAttr (
  el: ASTElement,
  name: string,
  getStatic?: boolean
): ?string {
  const dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name)
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    const staticValue = getAndRemoveAttr(el, name)
    if (staticValue != null) {
      // 如是静态值的话，或经过 JSON.stringify
      return JSON.stringify(staticValue)
    }
  }
}
```

## 生成 render 函数及运行时阶段

### 插槽内容数据对象上的 scopedSlots

生成父组件的`render`函数阶段，会为父组件模板里带有作用域插槽的子组件节点以及带有插槽内容的`template`节点生成数据对象。

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  // ...

  // el 是插槽内容 template 的 AST 节点，这是 v2.6.0 之前的语法，不再详细说明
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }

  // el 是子组件标签的 AST 节点
  // scoped slots
  if (el.scopedSlots) {
    data += `${genScopedSlots(el, el.scopedSlots, state)},`
  }
  // ...
}
```

若是带有作用域插槽的子组件节点，会生成数据对象的`scopedSlots`属性。

```js
// src/compiler/codegen/index.js
/**
 * 生成子组件节点数据对象上的 scopedSlots 属性，这里传入的 el 是指子组件标签 AST 节点
 */
function genScopedSlots (
  el: ASTElement,
  slots: { [key: string]: ASTElement },
  state: CodegenState
): string {
  // 常规情况下，当父组件更新时，父组件模板里的跟子组件相关的作用域插槽被认为是稳定的（不需要更新）。
  // 但是，当这些出现如下情况时，这些作用域插槽却是要强制更新的：
  // - 子组件标签上存在 v-for 指令
  // - 与该子组件有关的作用域插槽满足以下条件之一
  //   - 作用域插槽是动态插槽
  //   - 作用域插槽存在 v-if 指令
  //   - 作用域插槽存在 v-for 指令
  //   - 作用域插槽节点的子孙节点包含了 slot 标签
  // by default scoped slots are considered "stable", this allows child
  // components with only scoped slots to skip forced updates from parent.
  // but in some cases we have to bail-out of this optimization
  // for example if the slot contains dynamic names, has v-if or v-for on them...
  let needsForceUpdate = el.for || Object.keys(slots).some(key => {
    const slot = slots[key]
    return (
      slot.slotTargetDynamic ||
      slot.if ||
      slot.for ||
      containsSlotChild(slot) // is passing down slot from parent which may be dynamic
    )
  })

  // #9534: if a component with scoped slots is inside a conditional branch,
  // it's possible for the same component to be reused but with different
  // compiled slot content. To avoid that, we generate a unique key based on
  // the generated code of all the slot contents.
  let needsKey = !!el.if

  // OR when it is inside another scoped slot or v-for (the reactivity may be
  // disconnected due to the intermediate scope variable)
  // #9438, #9506
  // TODO: this can be further optimized by properly analyzing in-scope bindings
  // and skip force updating ones that do not actually use scope variables.
  if (!needsForceUpdate) {
    let parent = el.parent
    while (parent) {
      if (
        (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
        parent.for
      ) {
        needsForceUpdate = true
        break
      }
      if (parent.if) {
        needsKey = true
      }
      parent = parent.parent
    }
  }

  // 针对每一个作用域插槽生成代码，再拼接成一个字符串
  const generatedSlots = Object.keys(slots)
    .map(key => genScopedSlot(slots[key], state))
    .join(',')

  // 生成子组件标签的 scopedSlots 属性
  return `scopedSlots:_u([${generatedSlots}]${
    needsForceUpdate ? `,null,true` : ``
  }${
    !needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``
  })`
}

/**
 * 获取作用域插槽的代码，其格式为：
 * {
 *   // key: 作用域插槽的 name（或者说是 target）
 *   // fn: 作用域插槽的 render 函数，运行时调用该函数可以获取到作用域插槽节点的 VNode 节点
 *   key: fn,
 *   ...
 * }
 * 最终 data.scopedSlots 的数据结构是 { key: fn, ... }
 * @param {*} el 作用域插槽内容的 template AST 节点
 * @param {*} state
 */
function genScopedSlot (
  el: ASTElement,
  state: CodegenState
): string {
  const isLegacySyntax = el.attrsMap['slot-scope']
  if (el.if && !el.ifProcessed && !isLegacySyntax) {
    // 先处理作用域插槽节点的 v-if 指令，再递归调用 genScopedSlot 处理作用域插槽
    return genIf(el, state, genScopedSlot, `null`)
  }
  if (el.for && !el.forProcessed) {
    // 先处理作用域插槽节点的 v-for 指令，再递归调用 genScopedSlot 处理作用域插槽
    return genFor(el, state, genScopedSlot)
  }
  // 获取作用域插槽的 slotProps
  const slotScope = el.slotScope === emptySlotScopeToken
    ? ``
    : String(el.slotScope)
  // 生成作用域插槽的 render 函数，render 函数里包含了作用域插槽节点集齐子孙节点的代码
  const fn = `function(${slotScope}){` +
    `return ${el.tag === 'template'
      ? el.if && isLegacySyntax
        ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`
  // reverse proxy v-slot without scope on this.$slots
  const reverseProxy = slotScope ? `` : `,proxy:true`
  return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
}
```

子组件标签的数据对象里的`scopedSlots`属性的值，是`_u`函数包裹的字符串，其结构为：

```js
scopedSlots: _u(
  [
    {key: fn}
    ...
  ],
  null, // 可选
  needsForceUpdate, // 可选。父组件更新时，作用域插槽是否需要强制更新
  contentHashKey，// 可选。作用域插槽代码的 hash
)
```

这里的结构即父组件`render`函数的一部分，位于子组件数据对象里。

`_u`函数的第一个参数是个数组，数组的每一项是作用域插槽内容的代码对象，该对象的结构为：

```js
{
  // key: 作用域插槽的 name（或者说是 target）
  // fn: 作用域插槽的 render 函数，运行时调用该函数可以获取到作用域插槽节点的 VNode 节点
  key: fn
}
```

`_u`函数即是`resolveScopedSlots`函数。

```js
// src/core/instance/render-helpers/index.js
export function installRenderHelpers (target: any) {
  target._u = resolveScopedSlots
}
```

```js
// src/core/instance/render-helpers/resolve-scoped-slots.js
export function resolveScopedSlots (
  fns: ScopedSlotsData, // see flow/vnode
  res?: Object,
  // the following are added in 2.6
  hasDynamicKeys?: boolean,
  contentHashKey?: number
): { [key: string]: Function, $stable: boolean } {
  res = res || { $stable: !hasDynamicKeys }
  for (let i = 0; i < fns.length; i++) {
    const slot = fns[i]
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys)
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true
      }
      res[slot.key] = slot.fn
    }
  }
  if (contentHashKey) {
    (res: any).$key = contentHashKey
  }
  return res
}
```

在运行时阶段，父组件的`render`函数会执行，导致子组件的数据对象上的`scopedSlots`的值即`resolveScopedSlots`执行，并返回一个对象，因此在运行时`scopedSlots`的最终结构为：

```js
scopedSlots: {
  作用域插槽 key1: 作用域插槽 render1 函数,
  作用域插槽 key2: 作用域插槽 render2 函数,
  ...
  $stable, // 父组件更新时，作用域插槽是否需要强制更新
  $key, // 作用域插槽代码的 hash，作为该作用域插槽的唯一标志
}
```

### genSlot 生成插槽标签的代码

若 AST 节点是`slot`标签，则在`genElement`里调用`genSlot`生成`slot`标签的代码。

```js
// src/compiler/codegen/index.js
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }
  // ...
  else if (el.tag === 'slot') {
    // 节点是（子组件里的） slot 节点
    return genSlot(el, state)
  } else {
    ...
  }
}
```

```js
/**
 * 生成 slot 标签的内容
 *
 * 最终拼装成 _t(slotName, children, attrs对象, bind对象)
 */
function genSlot (el: ASTElement, state: CodegenState): string {
  // 注意，这里的 el.slotName 若是动态值，则是个字符串；若是静态值，则会经过 JSON.stringify，类似于 "default"
  const slotName = el.slotName || '"default"'
  // children 是 slot 标签内的节点，若该 slot 没有分发内容，则显示默认内容即 children
  const children = genChildren(el, state)
  let res = `_t(${slotName}${children ? `,${children}` : ''}`
  const attrs = el.attrs || el.dynamicAttrs
    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
        // slot props are camelized
        name: camelize(attr.name),
        value: attr.value,
        dynamic: attr.dynamic
      })))
    : null

  // 获取 v-bind 指令（没有指令参数）的值
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

`genSlot`函数返回的代码是用`_t`即`renderSlot`函数包裹的字符串，第一个参数是`slot`标签对应的插槽内容的名称，第二个参数是`slot`标签的子节点数组（后备内容，当没有提供内容的时候被渲染），第三个参数是标签上的`attrs`对象，第四个参数是`bind`对象。

因此，子组件的`render`函数里的子节点数组里，`slot`标签的表示形式为`_t(slotName, children, attrs对象, bind对象)`。

### 运行时生成插槽内容的 VNode

运行时阶段，当子组件生成 VNode 时，会为子组件模板里的所有节点生成 VNode，包括`slot`标签节点。

```js
// src/compiler/codegen/index.js
function installRenderHelpers (target) {
  target._t = renderSlot;
}
```

```js
// src/core/instance/render-helpers/render-slot.js
/**
 * Runtime helper for rendering <slot>
 */
export function renderSlot (
  name: string,
  // slot 标签内的子节点，即后备内容，若该 slot 没有分发内容，则显示后备内容
  fallback: ?Array<VNode>,
  props: ?Object,
  bindObject: ?Object
): ?Array<VNode> {
  // 子组件标签上的 scopedSlots 会挂载到子组件实例 $scopedSlots 上，因此在这里可以取到 slot 标签的 render 函数
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
      // 将 slot 标签上的特性都合并在一起
      props = extend(extend({}, bindObject), props)
    }
    // 调用作用域插槽的 render 函数生成 VNode 节点
    nodes = scopedSlotFn(props) || fallback
  } else {
    // 这里是为了兼容 v2.6.0 以前的旧语法
    nodes = this.$slots[name] || fallback
  }

  const target = props && props.slot
  if (target) {
    // 这里是为了兼容 v2.6.0 以前的旧语法
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}
```

`renderSlot`里会从子组件实例的`$scopedSlots`上取到对应作用域插槽的`render`函数并执行生成 VNode 节点。

## 示例

注意，本系列源码里讲述的`render`函数的生成，是采用完整版的 Vue.js（运行时 + 编译器），与单文件组件使用`vue-loader`处理的`render`函数有略微差异，不过`_c`函数里的内容部分基本一样。

### 父组件

```js
// Parent.js
import Son from './Son'

export default {
  template: `
    <Son>
      <template v-slot>
        <div>默认的插槽内容</div>
      </template>
      <template v-slot:greeting="slotProps">
        <div>{{ hello }}, {{ slotProps.world }}</div>
      </template>
    </Son>
  `,
  components: {
    Son
  },
  data () {
    return {
      hello: 'hello'
    }
  },
  mounted () {
    console.log(this.$options.render)
  }
}
```

### 子组件

```js
// Son.js
export default {
  template: `
    <div class="content">
      <slot></slot>
      <slot name="greeting" :world="world"></slot>
    </div>
  `,
  data () {
    return {
      world: 'world'
    }
  },
  mounted () {
    console.log(this.$options.render)
  }
}

```

### 父组件的 render 函数

```js
(function anonymous() {
    with (this) {
        return _c(
            'Son',
            // 子组件标签节点的数据对象
            {
                scopedSlots: _u([
                    // 默认插槽
                    {
                        key: "default",
                        fn: function() {
                            return [
                                _c(
                                    'div',
                                    [
                                        _v("默认的插槽内容")
                                    ]
                                )
                            ]
                        },
                        proxy: true
                    },
                    // greeting 插槽
                    {
                        key: "greeting",
                        fn: function(slotProps) {
                            return [
                                _c(
                                    'div',
                                    [
                                        _v(_s(hello) + ", " + _s(slotProps.world))
                                    ]
                                )
                            ]
                        }
                    }
                ])
            }
        )
    }
})
```

### 子组件的 render 函数

```js
(function anonymous() {
    with (this) {
        return _c(
            'div',
            // 数据对象
            {
                staticClass: "content"
            },
            // 子节点
            [
                _t("default"),
                _v(" "),
                _t(
                    "greeting",
                    null,
                    {
                        "world": world
                    }
                )
            ],
            2
        )
    }
})
```
