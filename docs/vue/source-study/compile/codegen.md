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

`genElement`函数会针对每个 AST 节点生成代码片段。在正式生成代码片段之前，会针对各种情况先进行预处理，这些情况有：

- 静态根节点 && 未经过`genStatic`处理
- 节点存在[v-once](https://cn.vuejs.org/v2/api/#v-once)指令 && 未经过`genOnce`处理
- 节点存在`v-for`指令 && 未经过`genFor`处理
- 节点存在`v-if`指令 && 未经过`genIf`处理
- 节点是`template`标签 && 该节点不是父组件里的插槽内容 && 该节点不是某个带有`v-pre`指令的节点的子孙节点

等这些预处理完成后会再次调用`genElement`函数并走到最后一个`else`分支里，为原 AST 节点生成代码片段。

```js
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

`genElement`函数里的最后一个`else`，会为组件或元素生成代码片段。

#### 

#### genStatic 处理静态根节点

在[优化 AST 树](/vue/source-study/compile/optimize.html)一节里，我们讲述了如何识别和标记 AST Tree 中的静态子树。而在生成`render`函数时，也会针对静态子树做特殊处理。

若 AST 节点是静态根节点，则调用`genStatic`生成代码片段。

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
  // 将静态根节点生成的代码片段保存在 staticRenderFns 函数里
  state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
  state.pre = originalPreState
  return `_m(${
    state.staticRenderFns.length - 1
  }${
    el.staticInFor ? ',true' : ''
  })`
}
```

`genStatic`函数里，会先将该 AST 节点标记为已经过静态处理，然后再次调用`genElement`函数获取代码片段，此时在`genElement`函数里发现`el.staticProcessed`为`true`就不会再调用`genStatic`函数。若是没命中其他的`if else`条件（即使命中了也会调用对应的函数进行处理，最后递归调用`genElement`也会再次不命中），会走到最后一个`else`里去生成代码片段。

获取到代码片段年后，会将代码片段包装起来存放在`staticRenderFns`数组里，方便以后在`render`函数执行时从`staticRenderFns`数组里获取该 AST 节点的静态渲染函数并执行获得对应的 VNode。

最后，`genStatic`函数会返回`_m`包裹的代码片段，这段代码片段会成为`render`函数体的一部分，当`render`函数执行时，`_m`函数也会随之执行。这里可以看到，`_m`的第一个参数就是该 AST 节点对应的静态渲染函数在`staticRenderFns`数组里的下标。

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
  // 标记该 vnode 节点是静态的
  markStatic(tree, `__static__${index}`, false)
  return tree
}
```

`renderStatic`函数执行时会根据下标获取到`staticRenderFns`数组里的静态渲染函数并执行生成 VNode 节点，并将该 VNode 节点缓存下来。这样的话，下次再次调用`render`函数导致`_m`函数再次执行时，就会根据传入的下标获取到第一次生成的 VNode 节点，而不必再次执行`staticRenderFns`数组里对应的静态渲染函数了。

这就是在`优化 AST 树`一节里标记 AST Tree 里的静态子树后的第一次具体的优化，这次优化发生的`render`函数生成 VNode 的时候（不包括第一次调用`render`函数）。
