---
sidebarDepth: 0
---

# 创建 AST

[[toc]]

`parse`函数接收`template`和`options`为参数，返回 AST 的根节点。

```js
// src/compiler/index.js

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 解析模板字符串，创建 AST（本节即将讲述的内容）
  const ast = parse(template.trim(), options)

  // 标记 AST Tree 里可优化的节点
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

其内部的主要处理是，调用`parseHTML(template, options)`先对`template`字符串进行 HTML 解析，每当解析出不同的 HTML 内容时，`parseHTML`会调用`options`里不同的回调函数，以对解析的内容进行不同的处理，最终产生 AST 抽象语法树，并返回其根节点。

## parse 函数结构

`parse`函数里处理的内容主要有：

1. 对传入的`options`做处理，比如获取一些需要的辅助方法、属性等
2. 将`options.modules`里的各个模块的`preTransformNode`/`transformNode`/`postTransformNode`方法提取到`preTransforms`/`transforms`/`postTransforms`
    - 创建好 AST 节点之后，处理节点的特性之前，会遍历调用`preTransforms`里的各个`preTransformNode`函数
    - 处理元素相关的特性时，会遍历调用`transforms`里的各个`transformNode`函数
    - 处理好节点的特性之后，关闭节点前，会滴遍历调用`postTransforms`里的各个`postTransformNode`函数
3. 调用`parseHTML`函数，传入`template`，以及选项对象。`parseHTML`函数执行中会不断调用选项对象里的`start`/`end`/`chars`/`comment`回调函数进行不同的处理。
    - `start`：处理解析出的开始标签及特性
    - `end`：处理解析出的结束标签
    - `chars`：处理解析出的文本内容
    - `comment`：处理解析出的注释内容
4. 返回 AST 根节点

选项对象里的各个回调函数的功能，将在下一节详细介绍。

```js
// src/compiler/parser/index.js

import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { parseFilters } from './filter-parser'
import { genAssignmentCode } from '../directives/model'
import { extend, cached, no, camelize } from 'shared/util'
import { isIE, isEdge, isServerRendering } from 'core/util/env'

import {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  pluckModuleFunction
} from '../helpers'

export const onRE = /^@|^v-on:/
export const dirRE = /^v-|^@|^:/
export const forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g

const argRE = /:(.*)$/
export const bindRE = /^:|^v-bind:/
const modifierRE = /\.[^.]+/g

const decodeHTMLCached = cached(he.decode)

// configurable state
export let warn: any
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace

type Attr = { name: string; value: string };

export function createASTElement (
  tag: string,
  attrs: Array<Attr>,
  parent: ASTElement | void
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}

export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  warn = options.warn || baseWarn

  // 判断是否是 pre 标签
  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || no

  // 获取每个 modules 对应的 transformNode、preTransformNode、postTransformNode 函数
  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters

  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false

  function warnOnce (msg) { ... }
  function closeElement (element) { ... }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start () { ... },
    end () { ... },
    chars () { ... },
    comment () { ... }
  }
  // 返回 AST 根节点
  return root
}
function processPre () { ... }
function processRawAttrs () { ... }
export function processElement () { ... }
function processKey () { ... }
function processRef () { ... }
export function processFor () { ... }
export function parseFor () { ... }
function processIf () { ... }
function processIfConditions () { ... }
function findPrevElement () { ... }
export function addIfCondition () { ... }
function processOnce () { ... }
function processSlot () { ... }
function processComponent () { ... }
function processAttrs () { ... }
function checkInFor () { ... }
function parseModifiers () { ... }
function makeAttrsMap () { ... }
function isTextTag () { ... }
function isForbiddenTag () { ... }
function guardIESVGBug () { ... }
function checkForAliasModel () { ... }
```

## parseHTML

关于`parseHTML`是如何解析并获取 HTML 开始标签、结束标签等内容的，可以参考[解析模板字符串](/vue/source-study/compile/parse-html.html)。

## parse 处理

`parse`函数的主要处理过程都分散在调用`parseHTML`传入的选项的四个回调方法上，尤其是`start`方法，会创建 AST 元素并处理所有的特性。

### start

`parseHTML`函数每一次解析到开始标签后，都将调用`start`函数进行处理，并传入标签名称、特性对象数组、是否一元标签这些数据作为参数。`start`函数内详细的处理过程为：

1. 创建 AST 元素
2. 调用各模块的`preTransformNode`函数
3. 判断元素是否存在`v-pre`特性
4. 判断元素是否是`pre`标签
5. 根据元素的祖先元素或其自身是否存在`v-pre`特性，进行不同处理：
    - 元素的祖先或其自身存在`v-pre`特性：将元素上的所有特性当做原生特性处理
    - 否则，处理如下特性
      - `v-for`指令
      - `v-if`/`v-else`/`v-else-if`指令
      - `v-once`指令
      - 处理元素相关的特性
        - 特殊特性
          - `key`特性
          - `ref`特性
          - `slot`/`scope-slot`特性
          - `is`特性
        - 调用各模块的`transformNode`函数
        - 其他剩余特性
          - `v-bind`指令，数据绑定相关
          - `v-on`指令，事件绑定相关
          - 一般指令
          - 非指令特性
6. 若根节点不存在，设置 AST 根节点，并（在生产环境下）检查根节点的约束条件
7. 若根节点存在，且栈不为空，且该节点带`v-else`/`v-else-if`，检查该节点作为根节点的约束条件
8. 若父元素存在
    - 情况一：处理元素带`v-else`/`v-else-if`的情况
    - 情况二：若该元素存在`element.slotScope`，即该元素是作用域插槽，将作用域插槽放入父元素的`scopedSlots`里
    - 情况三：将元素作为父元素的子节点，设置元素的父节点
9. 判断元素是否是一元标签，做出不同处理
    - 若元素是非一元标签，推入`stack`栈中，更新`currentParent`为当前元素
    - 否则，调用`closeElement`关闭元素、清理 inVPre、inPre 标记，调用各模块的`postTransformNode`函数

```js
  parseHTML(template, {
    // ...
    /**
     * 处理开始标签：创建 AST 元素，处理指令、事件、特性等等，最后压入栈中
     * @param {String} tag 元素的标签名
     * @param {Array} attrs 特性对象数组，形如 [{ name, value }, ...]
     * @param {Boolean} unary 是否是一元标签
     */
    start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      // 创建 AST 元素
      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        // 模板内不能存在 style 和 type 为 text/javascript 的 script 标签
        element.forbidden = true
        process.env.NODE_ENV !== 'production' && warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.'
        )
      }

      // apply pre-transforms
      // 转换前的预处理，比如：input 元素上具有 v-model 指令并且 type 是动态绑定的情况
      for (let i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element
      }

      if (!inVPre) {
        processPre(element)
        // 存在 v-pre 特性
        if (element.pre) {
          inVPre = true
        }
      }
      // 判断是否是 pre 标签
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }
      if (inVPre) {
        // 若元素有 v-pre 指令，则处理原生的特性
        processRawAttrs(element)
      } else if (!element.processed) {
        // structural directives
        processFor(element)
        processIf(element)
        processOnce(element)
        // element-scope stuff
        processElement(element, options)
      }

      /**
       * 检查 AST 根节点是否满足约束条件
       *
       * 1. 根节点不能是 slot/template 标签
       * 2. 根节点上不能有 v-for 指令
       *
       * 上述这两个都可能导致存在多个根节点的情况
       */
      function checkRootConstraints (el) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              `Cannot use <${el.tag}> as component root element because it may ` +
              'contain multiple nodes.'
            )
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            )
          }
        }
      }

      // tree management
      // 设置 AST 树的根节点
      // 非生产环境下，检查约束条件
      if (!root) {
        root = element
        checkRootConstraints(root)
      } else if (!stack.length) {
        // root 存在 && 栈为空，说明 element 是跟 root 平级的节点
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element)
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          })
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`
          )
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          // 处理元素带有 v-else-if/v-else 指令的情况
          // 需要注意的是，针对带有 v-else-if/v-else 指令的元素，不会作为该元素的父元素的子元素，
          // 而是放置在该元素对应的带有 v-if 指令的元素的 ifConditions 属性里
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
      if (!unary) {
        // 非一元标签，推入栈中，更新 currentParent
        currentParent = element
        stack.push(element)
      } else {
        // 一元标签，关闭元素
        closeElement(element)
      }
    }
    // ...
  }
```

#### AST 所有属性

经过对开始标签上的各个特性进行处理后，AST 元素的结构如下所示，这里包含的属性是全集，有些属性是互斥的，有些属性仅在元素带有某些指令的情况下存在。

```js
const astEl = {
  type: 1, // 节点类型，1 元素节点；2. 带插值的文本节点；3. 静态文本节点/注释节点
  tag, // 元素节点的标签
  attrsList: attrs, // 元素节点的特性对象数组
  attrsMap: makeAttrsMap(attrs), // 元素节点的特性对象
  parent, // 节点的父节点
  children: [] // 节点的子节点数组

  pre: Boolean, // （可选）若元素节点带有 v-pre 指令，则为 true
  attrs: [ // 分三类：
    // 1. value 经过处理的数据绑定 v-bind 特性
    // 2. 非指令特性（value 为经过 JSON.stringify() 处理的字符串）
    { name, value }, ...
    // 3. slot
    // 若元素 element 是父组件模板里子组件里的分发内容，会有这一项，比如父组件模板里，<child><h1 slot="header"></h1></child>，这里 slotTarget 即为 header，element 为 h1 元素。注意：若是 element 为 template 标签，不会有该项
    { name: 'slot', value: slotTarget }
  ],

  /**
   * (可选)分两类：
   * 1. 必须要使用 property 来做数据绑定的特性
   * 2. 某些指令产生的特性，比如
   *   - v-model: value 或 checked 属性
   *   - v-text: textContent 属性
   *   - v-html: innerHTML 属性
   *
   * AST 元素上的 astEl.props 在代码生成阶段，最终将转变成数据对象上的 data.domProps（在 genData 函数里处理的）
   */
  props: [
    { name, value },
    ...
  ],

  // 指令
  directives: [
    { name, rawName, value, arg, modifiers },
    ...
  ],

  // 组件上的原生事件
  nativeEvents: {
    // key 为事件名称；value 为事件监听器，可以是单个对象，或者对象数组
    [eventName]: [
      {
        value, // {String} 方法名称/内联 JavaScript 语句/函数表达式
        modifiers // {Object} 事件修饰符对象
      }
    ]
  },

  // 组件上的非原生事件、普通元素上的事件
  events: {
    // key 为事件名称；value 为事件监听器，可以是单个对象，或者对象数组
    [eventName]: [
      {
        value, // {String} 方法名称/内联 JavaScript 语句/函数表达式
        modifiers // {Object} 事件修饰符对象
      }
    ]
  },

  /**
   * （可选）若元素存在以下属性时，则该值为 false，即元素不是纯元素
   *    - attrs
   *    - props
   *    - directives，
   *    - nativeEvents/events
   *    - scopedSlots
   *    - key
   *    - 除了结构性指令外，还存在其他特性
   */
  plain: Boolean,


  // 以下是存在 v-for 指令时，独有的属性
  //   主要用三种形式（in 和 of 都行）：
  //   1. value in object/array/number
  //   2. (value, key) in object/array/number
  //   3. (value, key, index) in object
  for,        // 要循环的 数组 或 对象
  alias,      // value
  iterator1,  // （可选）key
  iterator2,  // （可选）index


  // 以下为存在 v-if/v-else/v-else-if 指令时，独有的属性
  if, // 带 v-if 指令的元素的独有属性，其值为表达式
  ifConditions: [ // 带 v-if 指令的元素的独有属性，其中 vIfEl/vElseIfEl/vElseEl 都是对应的元素节点
    { exp, block: vIfEl }, // v-if
    { exp, block: vElseIfEl }, // （可选）可能存在多个 v-else-if
    { exp, block: vElseEl }  // （可选）v-else
  ],
  else: true, // （可选）带 v-else 指令的元素的独有属性
  elseif, // （可选）带 v-else-if 指令的元素的独有属性，其值为表达式

  once: Boolean, // （可选）v-once


  key, // key


  ref, // ref
  refInFor: Boolean, // ref 是否在 v-for 里，即该元素自身及其子孙元素是否包含 v-for 指令


  // 有 slotTarget/slotScope 时，该元素是父组件模板里的！
  slotTarget, // 插槽内容要填充到的子组件模板里的名称，比如子组件里，<slot name="header"></slot>，则 slotTarget 即为 header
  slotScope, // 元素作用域插槽 slot-scope 的表达式

  // 有 slotName 时，该元素时子组件模板里的占位元素
  slotName, // 子组件里的 slot 占位标签，会将父组件对应的 slot 内容填充进去

  scopedSlots: {
    [scopedSlotName]: scopedSlot
  },


  // 组件占位标签
  component, // （可选）is 特性的值
  inlineTemplate, // （可选）是否是内联模板


  hasBindings, // （可选）元素有动态绑定指令时为 true

  // （可选）静态 style 对象字符串，前后都有双引号 "
  // 注意，这里的 staticStyle 已经处理成对象形式
  // 示例： "{font-size: 12px}"
  staticStyle: JSON.stringify({
    [属性名]: 属性值
  }),
  styleBinding, // （可选）动态绑定的 style 字符串，其值可能是对象的字符串形式、数组的字符串形式、以及绑定的表达式
}
```

#### 结构性指令

- `v-for`
- `v-if`/`v-else`/`v-else-if`
- `v-once`

### end

`parseHTML`函数每一次解析到结束标签后，都将调用`end`函数进行处理。`end`函数内详细的处理过程为：

1. 若节点的最后一个子节点是空格文本节点，且元素及其祖先元素不是`pre`标签，则删除最后一个子节点
2. 将栈顶的最后一个元素推出
3. 重置`currentParent`为栈顶节点
4. 调用`closeElement`关闭元素、清理`inVPre`、`inPre`标记，调用各模块的`postTransformNode`函数

```js
  parseHTML(template, {
    // ...
    /**
     * 处理关闭标签（仅针对非一元标签）：元素出栈，再做一些清理工作
     */
    end () {
      // remove trailing whitespace
      const element = stack[stack.length - 1]
      const lastNode = element.children[element.children.length - 1]
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        // 若节点的最后一个子节点是空格文本节点，则删除
        element.children.pop()
      }
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      closeElement(element)
    },
    // ...
  }
```

### chars

`parseHTML`函数每一次解析到文本节点，都将调用`chars`函数进行处理，并传入文本的内容作为参数，生成 AST 文本节点。`chars`函数内详细的处理过程为：

1. 若不存在`currentParent`，直接返回；（非生产环境）给出警告
2. 若父元素为 IE 下`textarea`标签，且文本内容与父元素的`placeholder`特性的值相同，则直接返回
3. 针对不同情况，决定是否对文本做解码处理
    - 若文本是在`pre`标签内或文本`text.trim()`之后不为空
      - 若文本的父节点是`script`、`style`，则不需要对文本解码
      - 否则，对文本做 HTML 解码
    - 若文本不在`pre`标签内并且`text.trim()`为空（即文本是多个空白字符的情况）
      - 若是传入的配置里要求保留空格，并且父节点的子节点不为空，将`text`设置为空格`' '`
      - 若是传入的配置里不要求保留空格，或者父节点的子节点为空，将`text`设置为空字符串`''`
4. 创建 AST 文本节点
    - 若元素的祖先节点不带`v-pre`指令，并且文本不为`' '`并且文本带插值，则创建带插值的 AST 文本节点
    - 除了忽略文本为`' '`且父元素的最后一个子节点也为`' '`的情况外，其他情况都创建常规的 AST 文本节点

```js
  parseHTML(template, {
    // ...
    /**
     * 处理文本内容
     */
    chars (text: string) {
      if (!currentParent) {
        // 不存在父节点，警告
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            )
          } else if ((text = text.trim())) {
            warnOnce(
              `text "${text}" outside root element will be ignored.`
            )
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      const children = currentParent.children
      text = inPre || text.trim()
        // 若是 script、style 里的文本，则不需要对做 html 解码；否则，解码
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : ''
      if (text) {
        let res
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          // 带插值的文本节点
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          })
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          // 静态文本节点
          children.push({
            type: 3,
            // text 可能为 ' '
            text
          })
        }
      }
    },
    // ...
  }
```

### comment

`parseHTML`函数每一次解析到注释时，都将调用`comment`函数进行处理，并传入注释的内容作为参数，生成 AST 注释节点。

```js
  parseHTML(template, {
    // ...
    comment (text: string) {
      // 静态注释节点
      currentParent.children.push({
        type: 3,
        text,
        isComment: true
      })
    }
    // ...
  }
```
