---
sidebarDepth: 0
---

# 生成 render 函数

[[toc]]

核心编译`baseCompile`函数的最后一步，就是基于优化过的 AST Tree 生成字符串形式的`render`/`staticRenderFns`。最后再封装成最终的`render`函数和`staticRenderFns`函数，挂载到`vm.$options`上。

```js
// src/compiler/index.js

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 解析模板字符串，创建 AST
  const ast = parse(template.trim(), options)

  // 标记 AST Tree 哪些节点可以优化
  if (options.optimize !== false) {
    optimize(ast, options)
  }

  // 基于 AST 生成字符串形式的`render`/`staticRenderFns`（本节即将讲述的内容）
  const code = generate(ast, options)
  return {
    ast,
    // 字符串形式的 render/staticRenderFns
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

## generate 函数

`generate`函数相当简洁，就是将传入的 AST 根节点生成字符串格式的代码，并拼接成字符串格式的函数体。

```js
// src/compiler/codegen/index.js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  // _c: createElement
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```

### CodegenState 和 options

`generate`函数里的第一步，就是以`options`对象为参数（`options`对象的结构可见[options 对象](/vue/source-study/compile/base-compile.html#options-对象)），新创建出一个代码生成阶段要使用的状态对象`state`。

```js
// src/compiler/codegen/index.js
import baseDirectives from '../directives/index'

export class CodegenState {
  options: CompilerOptions;
  warn: Function;
  transforms: Array<TransformFunction>;
  dataGenFns: Array<DataGenFunction>;
  directives: { [key: string]: DirectiveFunction };
  maybeComponent: (el: ASTElement) => boolean;
  onceId: number;
  staticRenderFns: Array<string>;
  pre: boolean;

  constructor (options: CompilerOptions) {
    this.options = options
    this.warn = options.warn || baseWarn
    // 提取各个模块的 transformCode 和 genData 函数
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    // 合并指令
    this.directives = extend(extend({}, baseDirectives), options.directives)
    const isReservedTag = options.isReservedTag || no
    this.maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)
    this.onceId = 0
    this.staticRenderFns = []
    this.pre = false
  }
}
```

`CodegenState`类的构造器里主要是将`options.modules`上的`transformCode`和`genData`提取出来，并将`baseDirectives`（`on`/`bind`/`cloak`）和`options.directives`合并，再添加一些辅助函数。

### genElement 函数

`genElement`函数会针对每个 AST 节点生成代码，所有 AST 节点的代码，将组成最终的`render`函数的函数体。在正式生成 AST 节点的代码之前，会针对各种情况先进行预处理，这些情况有：

- 静态根节点 && 未经过`genStatic`处理
- 节点存在[v-once](https://cn.vuejs.org/v2/api/#v-once)指令 && 未经过`genOnce`处理
- 节点存在`v-for`指令 && 未经过`genFor`处理
- 节点存在`v-if`指令 && 未经过`genIf`处理
- 节点是`template`标签 && 该节点不是父组件里的插槽内容 && 该节点不是某个带有`v-pre`指令的节点的子孙节点

等这些预处理完成后会再次调用`genElement`函数并走到最后一个`else`分支里，为原 AST 节点生成代码。

```js
// src/compiler/codegen/index.js
/**
 * 生成 vnode 节点
 */
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  if (el.staticRoot && !el.staticProcessed) {
    // el 是静态根节点 && 没经过 genStatic 处理
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    // 节点存在 v-once 指令 && 未经过 genOnce 处理
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    // 节点存在 v-for 指令 && 未经过 genFor 处理
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    // 节点存在 v-if 指令 && 未经过 genIf 处理
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    // 节点是 template 标签 && 该节点不是父组件里的插槽内容 && 该节点不是某个带有 v-pre 指令的节点的子孙节点
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    // 节点是（子组件里的） slot 节点
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      // 动态组件，el.component 是组件 is 特性的值
      code = genComponent(el.component, el, state)
    } else {
      // 常规组件/HTML 标签
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}
```

`genElement`函数里的最后一个`else`，是最终为 AST 节点生成代码的地方。在这里，也分为两种情况：

- 动态组件
- 常规组件/HTML 标签

针对动态组件，将使用`genComponent`为其生成`code`。动态组件会使用`is`特性对应的组件名称作为标签名称。

```js
// src/compiler/codegen/index.js
/**
 * 生成动态组件的 code
 */
// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName: string,
  el: ASTElement,
  state: CodegenState
): string {
  const children = el.inlineTemplate ? null : genChildren(el, state, true)
  return `_c(${componentName},${genData(el, state)}${
    children ? `,${children}` : ''
  })`
}
```

而常规组件使用组件名称作为标签名称，HTML 标签则直接使用自身的标签名称。

之后，无论是动态组件还是常规组件/HTML 标签，都会调用`genData`函数为该节点生成数据对象，再调用`genChildren`生成该节点的子 VNode。最后，组装成`_c(tag, data, children)`形成最后的`code`。

#### genData

`genData`函数是将 AST 节点上的所有数据转成数据对象的字符串形式。

转换之前，AST 节点的数据结构可参见[创建 AST - AST 所有属性](https://blog.windstone.cc/vue/source-study/compile/parse.html#ast-%E6%89%80%E6%9C%89%E5%B1%9E%E6%80%A7)

转换之后，数据对象的数据结构可见[渲染函数 & JSX - 深入 data 对象](https://cn.vuejs.org/v2/guide/render-function.html?#%E6%B7%B1%E5%85%A5-data-%E5%AF%B9%E8%B1%A1)

```js
// src/compiler/codegen/index.js
/**
 * 生成 createElement(name, data, children) 中的 data 数据
 *
 * 返回 data 对象
 */
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.

  // 生成 directives 数据
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','

  // key
  if (el.key) {
    data += `key:${el.key},`
  }
  // ref
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  if (el.refInFor) {
    data += `refInFor:true,`
  }
  // pre
  if (el.pre) {
    data += `pre:true,`
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += `tag:"${el.tag}",`
  }
  // module data generation functions
  // 添加 style/staticStyle、class/staticClass 等
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el)
  }
  // attributes
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`
  }
  // DOM props
  if (el.props) {
    data += `domProps:${genProps(el.props)},`
  }
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  // slot target
  // only for non-scoped slots
  // 普通插槽
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  // scoped slots
  // 该元素拥有的所有的作用域插槽（带模板内容）
  if (el.scopedSlots) {
    data += `${genScopedSlots(el, el.scopedSlots, state)},`
  }
  // component v-model
  if (el.model) {
    data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`
  }
  // inline-template
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state)
    if (inlineTemplate) {
      data += `${inlineTemplate},`
    }
  }
  data = data.replace(/,$/, '') + '}'
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  if (el.dynamicAttrs) {
    data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
  }
  // v-bind data wrap
  if (el.wrapData) {
    // 将 data 封装一层，封装的逻辑里会处理 v-bind 的数据，最终返回 data 对象
    // (将 v-bind 指令的数据放在 data.domProps 或 data.attrs 或 data 或 data.on（双向绑定） 上)
    data = el.wrapData(data)
  }
  // v-on data wrap
  if (el.wrapListeners) {
    // 将 data 封装一层，封装的逻辑里会处理 v-on 的数据，最终返回 data 对象
    // (将 v-on 指令里指令名称和回调放到 data.on 上)
    data = el.wrapListeners(data)
  }
  return data
}
```

#### genChildren

```js
// src/compiler/codegen/index.js
/**
 * 递归地为节点的所有子节点生成代码
 */
export function genChildren (
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  const children = el.children
  if (children.length) {
    const el: any = children[0]
    // 若父节点只有一个子节点，且该子节点是非 template、非 slot、带有 v-for 的 AST 节点，则进行优化处理
    // optimize single v-for
    if (children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      const normalizationType = checkSkip
        ? state.maybeComponent(el) ? `,1` : `,0`
        : ``
      return `${(altGenElement || genElement)(el, state)}${normalizationType}`
    }
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0

    // 遍历所有子节点，生成子节点的代码
    const gen = altGenNode || genNode
    return `[${children.map(c => gen(c, state)).join(',')}]${
      normalizationType ? `,${normalizationType}` : ''
    }`
  }
}
```

注意: 在生成子节点的代码时，子节点的代码字符串后面可能会带另一个`normalizationType`参数，作为`_c`函数的第四个参数。

#### _c

`genElement`函数里，在生成 AST 节点的数据对象字符串及子节点的代码后，会使用`_c(tag, data, children)`组装成最终的代码。而`_c`函数是在初始化组件实例时加入到`vm`上的，其实际上是对`createElement`函数的封装，在`render`函数运行时，`createElement`会为该 AST 节点生成 VNode 对象。

```js
// src/core/instance/render.js
export function initRender (vm: Component) {
  // ...
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  // ...
}
```

注意，`_c`函数与[渲染函数 & JSX - createElement 参数](https://cn.vuejs.org/v2/guide/render-function.html?#createElement-%E5%8F%82%E6%95%B0)略微不同，不同的地方是传给`createElement`函数的第 5 个参数，该参数表示是否要始终对子节点数组进行规范化处理，针对用户编写的`render`函数该参数为`true`，而对从模板生成的`render`函数该参数为`false`，详见[创建 VNode Tree - 规范化子 VNode](https://blog.windstone.cc/vue/source-study/vdom/vnode-tree-create.html#%E8%A7%84%E8%8C%83%E5%8C%96%E5%AD%90-vnode)。

关于`createElement`函数如何创建 VNode，可查看[创建 VNode Tree](https://blog.windstone.cc/vue/source-study/vdom/vnode-tree-create.html)。

### genElement 函数的预处理

上一节讲述了在调用`genElement`函数为 AST 节点生成代码时走到最后一个`else`块的处理逻辑，而在此之前有多个`if`/`else if`的预处理，每个经过`if`/`else-if`块预处理过的 AST 节点，最终都会再次调用`genElement`并走到最后一个`else`块进行处理，不过有的 AST 节点可能会经过多个不同的`if`/`else-if`块的预处理。

这一小节将讲述这些预处理的逻辑。

#### genStatic

在[优化 AST 树](/vue/source-study/compile/optimize.html)一节里，我们讲述了如何识别和标记 AST Tree 中的静态子树。而在生成`render`函数时，也会针对静态子树做特殊处理。

若 AST 节点是静态根节点，则调用`genStatic`生成代码。

```js
/**
 * 生成静态节点的 code
 *
 * 注意，此时已经调用 genElement 先生成了 code，并放置在 staticRenderFns 里，方便以后直接使用
 */
function genStatic (el: ASTElement, state: CodegenState): string {
  el.staticProcessed = true
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  const originalPreState = state.pre
  if (el.pre) {
    state.pre = el.pre
  }
  // 将静态根节点生成的代码保存在 staticRenderFns 函数里
  state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
  state.pre = originalPreState
  return `_m(${
    state.staticRenderFns.length - 1
  }${
    el.staticInFor ? ',true' : ''
  })`
}
```

`genStatic`函数里，会先将该 AST 节点标记为已经过静态处理，然后再次调用`genElement`函数获取代码，此时在`genElement`函数里发现`el.staticProcessed`为`true`就不会再调用`genStatic`函数。若是没命中其他的`if else`条件（即使命中了也会调用对应的函数进行处理，最后递归调用`genElement`也会再次不命中），会走到最后一个`else`里去生成代码。

获取到代码年后，会将代码包装起来存放在`staticRenderFns`数组里，方便以后在`render`函数执行时从`staticRenderFns`数组里获取该 AST 节点的静态渲染函数并执行获得对应的 VNode。

最后，`genStatic`函数会返回`_m`包裹的代码，这段代码会成为`render`函数体的一部分，当`render`函数执行时，`_m`函数也会随之执行。这里可以看到，`_m`的第一个参数就是该 AST 节点对应的静态渲染函数在`staticRenderFns`数组里的下标。

```js
// src/core/instance/render-helpers/index.js
export function installRenderHelpers (target: any) {
  // ...
  target._m = renderStatic
  // ...
}
```

`_m`方法是挂载在`vm`上的方法，指向`renderStatic`函数。

```js
// src/core/instance/render-helpers/render-static.js
/**
 * Runtime helper for rendering static trees.
 *
 * 渲染静态节点树，生成 vnode 节点后，将 vnode 节点 缓存在 this._staticTrees 上，方便下次直接使用
 */
export function renderStatic (
  index: number,
  isInFor: boolean
): VNode | Array<VNode> {
  const cached = this._staticTrees || (this._staticTrees = [])
  let tree = cached[index]
  // 查看是否存在缓存的 VNode，若存在就直接返回
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  // 渲染出 Vnode 节点
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  )
  // 将 VNode 标记为静态的，并给个独立无二的 key
  markStatic(tree, `__static__${index}`, false)
  return tree
}

/**
 * 将 Vnode 或 Vnode 数组里的各个 Vnode 标记为静态的
 * 类似 v-for 的节点会产生 VNode 数组
 */
function markStatic (
  tree: VNode | Array<VNode>,
  key: string,
  isOnce: boolean
) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], `${key}_${i}`, isOnce)
      }
    }
  } else {
    markStaticNode(tree, key, isOnce)
  }
}

/**
 * 将 Vnode 节点标记为静态的，并标记是否是带有 v-once 指令
 */
function markStaticNode (node, key, isOnce) {
  node.isStatic = true
  node.key = key
  node.isOnce = isOnce
}
```

`renderStatic`函数执行时会根据下标获取到`staticRenderFns`数组里的静态渲染函数并执行生成 VNode 节点，并将该 VNode 节点缓存下来。这样的话，下次再次调用`render`函数导致`_m`函数再次执行时，就会根据传入的下标获取到第一次生成的 VNode 节点，而不必再次执行`staticRenderFns`数组里对应的静态渲染函数了。

这就是在`优化 AST 树`一节里标记 AST Tree 里的静态子树后的第一次具体的优化，这次优化发生的`render`函数生成 VNode 的时候（不包括第一次调用`render`函数）。

::: tip
`genStatic`里会将所有的静态根节点的`render`函数保存在`state.staticRenderFns`数组里，在`generate`函数里会和最终的`render`函数体（字符串形式）一起返回。
:::

#### genOnce

若 AST 节点是带有`v-once`指令的节点，则调用`genOnce`生成代码。

```js
/**
 * 生成 v-once 节点的 code
 */
function genOnce (el: ASTElement, state: CodegenState): string {
  el.onceProcessed = true
  if (el.if && !el.ifProcessed) {
    // 针对存在 v-if 指令且未经过 genIf 处理的节点，先经过 genIf 处理（经过 genIf 处理完之后，会再次调用 genOnce）
    return genIf(el, state)
  } else if (el.staticInFor) {
    // 该节点是静态节点或带有 v-once 的节点，并且是带有 v-for 指令的节点的子孙节点
    let key = ''
    let parent = el.parent
    while (parent) {
      if (parent.for) {
        key = parent.key
        break
      }
      parent = parent.parent
    }
    if (!key) {
      // 若该节点是存在 v-for 指令但没有 key 的节点的子孙节点，开发环境给出警告
      process.env.NODE_ENV !== 'production' && state.warn(
        `v-once can only be used inside v-for that is keyed. `,
        el.rawAttrsMap['v-once']
      )
      // 忽略 v-once 指令，再次调用 genElement 生成代码
      return genElement(el, state)
    }
    // _o 是 markOnce
    return `_o(${genElement(el, state)},${state.onceId++},${key})`
  } else {
    // 当做静态根节点处理
    return genStatic(el, state)
  }
}
```

`genOnce`函数里会先判断该 AST 节点是否还带有`v-if`指令且未经过`genIf`处理，若是则先调用`genIf`进行处理。

之后，若判断出该节点是带有`v-for`指令的节点的子孙节点，则判断其带有`v-for`指令的祖先节点是否带有`key`。若没有`key`，则忽略`v-once`指令，再次调用`genElement`生成代码；否则，再次调用`genElement`生成代码，并使用`_o`即`markOnce`函数包裹起来，`_o`函数的第一个参数是该 AST 节点的代码，第二个参数是自增的`onceId`，第三个参数是`key`。

```js
// src/core/instance/render-helpers/index.js
export function installRenderHelpers (target: any) {
  target._o = markOnce
  // ...
}
```

```js
// src/core/instance/render-helpers/render-static.js
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}
```

`render`函数执行时，`_o`函数即`markOnce`函数也会随之执行，`markOnce`里会将该 AST 节点生成的 VNode 节点标记为静态节点，并分配一个独立无二的`key`，以及标记该 VNode 节点是个带有`v-once`指令的节点。

与`genStatic`对静态根节点处理不能的是，带有`v-once`的 AST 节点在每次`render`执行时，仍然会再次生成 VNode 节点，而不是像静态根节点那样使用缓存的 VNode。

#### genFor

若 AST 节点是带有`v-for`指令的节点，则调用`genFor`生成代码。

```js
// src/compiler/codegen/index.js
export function genFor (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altHelper?: string
): string {
  // 以下是存在 v-for 指令时，AST 上独有的属性
  //   主要用三种形式（in 和 of 都行）：
  //   1. value in object/array/number
  //   2. (value, key) in object/array/number
  //   3. (value, key, index) in object
  // for,        // 要遍历的数组或对象
  // alias,      // value
  // iterator1,  // （可选）key
  // iterator2,  // （可选）index

  const exp = el.for
  const alias = el.alias
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    // 针对组件上的 v-for 指令，若不存在 key 则警告
    state.warn(
      `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
      `v-for should have explicit keys. ` +
      `See https://vuejs.org/guide/list.html#key for more info.`,
      el.rawAttrsMap['v-for'],
      true /* tip */
    )
  }

  el.forProcessed = true // avoid recursion
  // _l 即 renderList，调用后会返回 VNode 数组
  return `${altHelper || '_l'}((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
      `return ${(altGen || genElement)(el, state)}` +
    '})'
}
```

带有`v-for`指令的 AST 节点生成代码是用`_l`即`renderList`函数包裹起来，第一个参数是要遍历的对象/数组，第二个参数是单个节点的`render`函数，在`renderList`函数里会遍历调用`render`函数。

```js
// src/core/instance/render-helpers/index.js
export function installRenderHelpers (target: any) {
  // ...
  target._l = renderList
  // ...
}
```

`renderList`函数里，会遍历对象或数组，最终生成**VNode 数组**。

```js
// src/core/instance/render-helpers/render-list.js
/**
 * 生成列表的 VNode 数组，比如 v-for
 * @param {*} val 要遍历的对象或数组
 * @param {*} render v-for 所在节点的 render 函数，调用后会获取一个 VNode 节点；可传不同参数多次调用获取 VNode 数组
 * @returns VNode 数组
 */
export function renderList (
  val: any,
  render: (
    val: any,
    keyOrIndex: string | number,
    index?: number
  ) => VNode
): ?Array<VNode> {
  let ret: ?Array<VNode>, i, l, keys, key
  if (Array.isArray(val) || typeof val === 'string') {
    // 数组、字符串
    ret = new Array(val.length)
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    // 数字
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i)
    }
  } else if (isObject(val)) {
    // 对象
    if (hasSymbol && val[Symbol.iterator]) {
      // 若对象存在遍历器方法，调用遍历器方法获取对象的 key
      ret = []
      const iterator: Iterator<any> = val[Symbol.iterator]()
      let result = iterator.next()
      while (!result.done) {
        ret.push(render(result.value, ret.length))
        result = iterator.next()
      }
    } else {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
    }
  }
  if (!isDef(ret)) {
    ret = []
  }
  (ret: any)._isVList = true
  return ret
}
```

#### genIf

若 AST 节点带有`v-if`指令，则调用`genIf`生成代码。

BTW，节点的`ifConditions`属性是个数组，数组的第一个元素是带有`v-if`指令的 AST 节点自身，之后的元素存放了对应的`v-else-if`/`v-else`节点。

```js
// src/compiler/codegen/index.js

// 以下为存在 v-if/v-else/v-else-if 指令时，AST 节点独有的属性
// if, // 带 v-if 指令的元素的独有属性，其值为表达式
// ifConditions: [ // 带 v-if 指令的元素的独有属性，其中 vIfEl/vElseIfEl/vElseEl 都是对应的元素节点
//   { exp, block: vIfEl }, // v-if
//   { exp, block: vElseIfEl }, // （可选）可能存在多个 v-else-if
//   { exp, block: vElseEl }  // （可选）v-else
// ],
// else: true, // （可选）带 v-else 指令的元素的独有属性
// elseif, // （可选）带 v-else-if 指令的元素的独有属性，其值为表达式
export function genIf (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  el.ifProcessed = true // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  if (!conditions.length) {
    // _e: createEmptyVNode
    return altEmpty || '_e()'
  }

  const condition = conditions.shift()
  // 判断 condition.exp 是否 falsy，主要是因为 v-else 指令元素的 condition.exp 为 undefined
  if (condition.exp) {
    // v-if、v-else-if
    return `(${condition.exp})?${
      genTernaryExp(condition.block)
    }:${
      // 若前一个条件不成立，则使用剩余的条件递归调用 genIfConditions
      genIfConditions(conditions, state, altGen, altEmpty)
    }`
  } else {
    // v-else
    return `${genTernaryExp(condition.block)}`
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}
```

`genIf`函数返回的代码是一到多个三元操作符表达式的字符串，嵌套的三元操作符表达式的数量取决于`v-else-if`/`v-else`的数量，但是最终只会针对单个 AST 节点生成 VNode。

#### genSlot

详见[编译专题 - 插槽 - genSlot 生成插槽标签的代码片段](/vue/source-study/compile/topics/slot.html#genslot-生成插槽标签的代码片段)
