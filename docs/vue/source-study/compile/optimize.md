---
sidebarDepth: 0
---

# 优化 AST 树

[[toc]]

`template`字符串经过`parse`之后会生成一颗 AST Tree，并返回树的根节点。

我们知道，Vue.js 是基于响应式的数据驱动，但是视图里的所有节点不一定全是响应式的，有些不涉及到数据变化的静态节点在每次渲染时生成的 DOM 节点都是完全相同的。而`optimize`函数就是对 AST 树做优化：将这些静态根节点标记出来。

这样，在生成`render`函数时就可以对静态根节点做特殊处理，在首次渲染即`render`函数首次执行后，将静态根节点的 VNode 缓存起来，以后再执行`render`函数时，不再为静态根节点生成新的 VNode 对象而是使用缓存的 VNode。同时，在非第一次的`patch`过程中，也将跳过对静态跟节点的`patch`。

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

  // 优化 AST（本节即将讲述的内容）
  if (options.optimize !== false) {
    optimize(ast, options)
  }

  // 基于 AST 生成字符串形式的`render`/`staticRenderFns`
  const code = generate(ast, options)
  return {
    ast,
    // 字符串形式的 render/staticRenderFns
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

## optimize 函数

```js
/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 *
 * 优化的目标：遍历由模板生成的 AST 树，检测子树是否是纯静态的，比如部分 DOM 从来不需要改变。
 *
 * 一旦我们检测到这些子树，我们可以：
 * 1. 将它们提升为常量，以便我们在每次重新渲染时不再创建新的节点
 * 2. 在`patch`过程中完全跳过它们
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  // 判断 key 是否是静态 key，带缓存功能
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}
```

优化过程会进行两轮遍历，第一轮遍历是通过`markStatic`标记节点是否是静态节点，第二轮遍历是通过`markStaticRoots`标记元素节点是否是静态元素根节点。

## markStatic

`isStatic`函数是判断节点是否是静态节点，以下是判断的标准：

- 带有插值的文本节点，不是静态节点
- 纯文本节点，是静态节点
- 带有`v-pre`的元素节点，是静态节点
- 符合以下全部条件的节点，是静态节点
  - 没有动态绑定的特性
  - 没有 v-if 指令
  - 没有 v-for 指令
  - 不是内置标签如 slot,component
  - 必须是平台保留的标签，针对浏览器端，就是 html 标签和 svg 标签等
  - 不是带有 v-for 指令的 template 元素的直接子元素
  - 节点上仅包含静态的特性
    - `staticClass`/`staticStyle`
    - `type`/`tag`/`attrsList`/`attrsMap`/`plain`/`parent`/`children`/`attrs`

针对元素节点，不仅要元素节点自身满足静态的标准，还要满足以下条件，才为静态节点：

- 元素节点的所有子节点也要是静态节点
- 元素若存在`v-if`指令，还需要与其平级的`v-else`/`v-else-if`元素节点也是静态节点

```js
/**
 * 递归地确定元素是否是静态节点
 */
function markStatic (node: ASTNode) {
  node.static = isStatic(node)

  // 元素节点
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      //针对非平台保留标签，并且不是 slot 元素节点，并且不是组件内联模板的元素
      // 不需要针对子元素及平级的条件元素来判断元素是否是静态的
      return
    }
    // 若子元素不是静态的，则父元素也不是静态的
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
    // 若元素对应的条件元素不是静态的，则元素也不是静态的
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        // TODO: 既然带有 v-if 的元素已经在 isStatic 判断为 node.static = false，这里是不是就没有必要了？
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

/**
 * 判断是否是静态的 AST node
 *
 * 1. 带有插值的文本节点，不是静态的
 * 2. 纯文本节点，是静态的
 * 3. 带有 v-pre 的元素节点，是静态的
 * 4. 符合以下全部条件的节点是静态的
 *    - 没有动态绑定的特性
 *    - 没有 v-if 指令
 *    - 没有 v-for 指令
 *    - 不是内置标签如 slot,component
 *    - 必须是平台保留的标签，针对浏览器端，就是 html 标签和 svg 标签等
 *    - 不是带有 v-for 指令的 template 元素的直接子元素
 *    - 节点上仅包含静态的 key 属性
 */
function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    // 带有插值的文本节点，不是静态的
    return false
  }
  if (node.type === 3) { // text
    // 纯文本，是静态的
    return true
  }
  return !!(node.pre || (
    // 没有动态绑定的特性，在 processAttrs 的时候会赋值
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    // 不是内置标签如 slot,component
    !isBuiltInTag(node.tag) && // not a built-in
    // 是平台保留的标签，针对浏览器端，就是 html 标签和 svg 标签等
    isPlatformReservedTag(node.tag) && // not a component
    // 不是带有 v-for 的 template 元素的直接子元素
    !isDirectChildOfTemplateFor(node) &&
    // 元素拥有的所有属性都是静态的，比如：
    // 1、staticClass,staticStyle
    // 2、type,tag,attrsList,attrsMap,plain,parent,children,attrs
    Object.keys(node).every(isStaticKey)
  ))
}

/**
 * 判断元素是否是带有 v-for 的 template 元素的直接子元素
 */
function isDirectChildOfTemplateFor (node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}
```

## markStaticRoots

`markStaticRoots`函数判断元素节点是否是静态元素根节点，该元素节点必须满足：

- 元素节点是静态节点
- 元素节点包含子节点
- 子节点不能是这种情况：仅有一个子节点，且是静态文本子节点

当元素节点不满足以下三条静态元素根节点的条件时，还将：

- 若存在子节点，递归地判断所有子节点是否是静态元素根节点
- 若存在平级的`v-else`/`v-else-if`节点，判断它们是否是静态元素根节点

```js
/**
 * 判断元素节点是否是静态元素根节点
 * @param {*} node AST 元素
 * @param {*} isInFor 是否在 v-for 指令里，即祖先元素是否存在 v-for 特性
 */
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    // 策略：节点是静态的 && 节点有子元素 && 节点不能只有一个静态文本/注释子节点
    // 满足这三个条件才将该节点设置为 staticRoot
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}
```
