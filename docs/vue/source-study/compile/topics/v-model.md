# v-model

[[toc]]

`v-model`指令是 Vue.js 实现数据双向绑定的重要方式之一。如果不了解`v-model`的实现原理，我们真的会以为`v-model`会对数据进行双向绑定，但是实际上，Vue.js 里无论哪一种形式的双向绑定，其内部实现都是单向的。

使用`v-model`时，当改变视图，Vue.js 内部会将由视图改变的值，通过触发事件的方式反馈到数据层，通过预先添加的事件处理方法，改变数据的值。这一过程，我们仅仅通过使用`v-model`是无法知晓的，进而通过表象认为“使用`v-model`能做到数据的双向绑定”。

接下来，我们将从编译阶段、代码生成阶段、运行时阶段，一步一步分析`v-model`是如何实现的。

## 编译阶段

### processAttrs

在`parse`阶段会对元素节点上的所有特性进行处理。`processAttrs`函数里将解析特性的修饰符，当识别出`v-model`是指令且不是`v-bind`和`v-on`指令时，会将其当做常规指令来处理：解析出指令的参数，并调用`addDirective`添加指令。

```js
/**
 * 处理 attributes，包括指令和非指令
 */
function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, isProp
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    // const dirRE = /^v-|^@|^:/
    if (dirRE.test(name)) {
      // 处理指令

      // mark element as dynamic
      // 标记元素是动态的，在优化 AST 阶段，若 el.hasBindings 为 true，则该元素就不是静态节点
      el.hasBindings = true
      // modifiers
      // 处理修饰符
      modifiers = parseModifiers(name)
      // 移除修饰符
      // modifierRE = /\.[^.]+/g
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (bindRE.test(name)) { // v-bind
        // 处理数据绑定 v-bind 指令
        // ...
      } else if (onRE.test(name)) { // v-on
        // 处理事件监听
        // ...
      } else { // normal directives
        // 处理常规指令
        // dirRE = /^v-|^@|^:/
        name = name.replace(dirRE, '')
        // parse arg
        // argRE = /:(.*)$/
        // 解析指令的参数
        const argMatch = name.match(argRE)
        const arg = argMatch && argMatch[1]
        if (arg) {
          name = name.slice(0, -(arg.length + 1))
        }
        addDirective(el, name, rawName, value, arg, modifiers)
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value)
        }
      }
    }
  }
}
```

### addDirective

```js
/**
 * 添加指令
 * @param {*} el 元素
 * @param {*} name 指令名称（经过处理，去除了 v-/@/: 前缀、修饰符、参数）
 * @param {*} rawName 指令名称（未经处理，保留了 v-/@/: 前缀、修饰符、参数）
 * @param {*} value 指令的表达式
 * @param {*} arg 指令的参数
 * @param {*} modifiers 指令的修饰符
 */
export function addDirective (
  el: ASTElement,
  name: string,
  rawName: string,
  value: string,
  arg: ?string,
  modifiers: ?ASTModifiers
) {
  (el.directives || (el.directives = [])).push({ name, rawName, value, arg, modifiers })
  el.plain = false
}
```

## 代码生成阶段

### genData

在生成代码阶段，将调用`genData`函数生成节点的数据对象，在其中调用`genDirectives`生成指令相关的代码。

```js
/**
 * 生成 createElement(name, data, children) 中的 data 数据对象（字符串形式）
 */
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.

  // 生成 directives 数据
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','
  // ...
}
```

### genDirectives

`genDirectives`函数里，会生成指令相关的代码，其主要做了两件事：

1. 针对某些指令进行特殊的处理，调用它们各自的指令生成函数生成该指令的代码，包括：
    - 核心指令
      - v-on
      - v-bind
      - v-cloak
    - Web 平台指令
      - v-model
      - v-text
      - v-html
2. 对于需要运行时的指令，将其拼成指令对象字符串

TODO: 该章节主要是讲述`v-model`指令的代码生成，后续将针对以上所列的其他指令进行详细分析。

```js
/**
 * 生成 data 里 directives 数据
 *
 * el.directive 的数据结构为：[{ name, rawName, value, arg, modifiers }]
 *
 */
function genDirectives (el: ASTElement, state: CodegenState): string | void {
  const dirs = el.directives
  if (!dirs) return
  let res = 'directives:['
  let hasRuntime = false
  let i, l, dir, needRuntime
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i]
    needRuntime = true
    /*
     * state.directives 包含的指令有
     *
     * - 核心指令
     *   - v-on
     *   - v-bind
     *   - v-cloak
     * - Web 平台指令
     *   - v-model
     *   - v-text
     *   - v-html
     */
    const gen: DirectiveFunction = state.directives[dir.name]
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn)
    }
    if (needRuntime) {
      hasRuntime = true
      res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
      }${
        dir.arg ? `,arg:"${dir.arg}"` : ''
      }${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
      }},`
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}
```

#### state.directives 的来源

在`generate`生成`render`函数字符串的最开始，会先基于传入的`options`选项对象生成`CodegenState`的实例`state`，`state`里包含了一些在代码生成过程中需要用到的数据，包括`state.directives`。

```js
import baseDirectives from '../directives/index'

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

export class CodegenState {
  options: CompilerOptions;
  warn: Function;
  transforms: Array<TransformFunction>;
  dataGenFns: Array<DataGenFunction>;
  directives: { [key: string]: DirectiveFunction };
  maybeComponent: (el: ASTElement) => boolean;
  onceId: number;
  staticRenderFns: Array<string>;

  constructor (options: CompilerOptions) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    this.directives = extend(extend({}, baseDirectives), options.directives)
    const isReservedTag = options.isReservedTag || no
    this.maybeComponent = (el: ASTElement) => !isReservedTag(el.tag)
    this.onceId = 0
    this.staticRenderFns = []
  }
}
```

`state.directives`是有两部分组成的，`baseDirectives`和`options.directives`。

##### baseDirectives

`baseDirectives`是核心的指令，独立于平台。

```js
// src/compiler/directives/index.js
import on from './on'
import bind from './bind'
import { noop } from 'shared/util'

export default {
  on,
  bind,
  cloak: noop
}
```

##### options.directives

调用`generate`传入的`options`来源于`baseOptions`和用户调用`compileToFunctions`传入的`options`的合并，详情：[compile 函数之 options 合并](/vue/source-study/compile/compile-process.html#compile)。

实际上调用`compileToFunctions`传入的`options`并没有`directives`。只有`baseOptions`存在`directives`，如下所示：

```js
// src/platforms/web/compiler/directives/index.js
import model from './model'
import text from './text'
import html from './html'

export default {
  model,
  text,
  html
}
```

##### 合并 directives

最终的`state.directives`就是`baseDirectives`和`baseOptions.directives`合并的结果。

```js
export class CodegenState {
  constructor (options: CompilerOptions) {
    this.options = options
    // ...
    this.directives = extend(extend({}, baseDirectives), options.directives)
    // ...
  }
}
```

因此，我们找到了`v-model`的代码生成函数是在`src/platforms/web/compiler/directives/model.js`文件里，我们继续分析。

### 生成 v-model 指令代码

```js
// src/platforms/web/compiler/directives/model.js

/**
 * 生成 v-model 指令的代码
 * @param {*} el AST 元素
 * @param {*} dir 指令对象，结构为 { name, rawName, value, arg, modifiers }
 * @param {*} _warn 警告函数
 * @return {Boolena} 是否需要额外的运行时
 */
export default function model (
  el: ASTElement,
  dir: ASTDirective,
  _warn: Function
): ?boolean {
  warn = _warn
  const value = dir.value
  const modifiers = dir.modifiers
  const tag = el.tag
  const type = el.attrsMap.type

  if (process.env.NODE_ENV !== 'production') {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn(
        `<${el.tag} v-model="${value}" type="file">:\n` +
        `File inputs are read only. Use a v-on:change listener instead.`
      )
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers)
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers)
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers)
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers)
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `<${el.tag} v-model="${value}">: ` +
      `v-model is not supported on this element type. ` +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    )
  }

  // ensure runtime directive metadata
  return true
}
```

纵观如上的`model`函数，我们能够知道，哪些元素可以使用`v-model`指令：

- 动态组件
- `select`元素
- `checkbox`类型的`input`元素
- `radio`类型的`input`元素
- 其他类型的`input`元素
- `textarea`元素
- 自定义组件

我们将一一详细讲解如上的各个元素的`v-model`指令的代码生成。

#### 动态组件、自定义组件

组件的`v-model`的代码生成，最终会往 AST 元素上添加`model`属性，即`el.model = { value, express, callback }`。

其具体的生成过程为：

1. 构造`v-model`指令的`valueExpression`
    - `valueExpression`初始为`$$v`
    - 若存在`.trim`修饰符，加上`trim()`相关的代码
    - 若存在`.number`修饰符，加上`toNumber`相关的代码
2. 基于指令的原始表达式`value`和`valueExpression`构造赋值语句`assignment`
    - 解析`value`
      - 若`value`是属性的方式，则赋值语句为`${value}=${valueExpression}`
      - 若`value`是属性路径的方式，解析出路径最终的`key`和`key`之前的对象`exp`，赋值语句为`$set(${res.exp}, ${res.key}, ${valueExpression})`
3. 往 AST 元素上添加`model`属性，其值为对象，包含如下属性：
    - `value`：`v-model`表达式的字符串形式
    - `expression`：`v-model`表达式字符串的 JSON 形式
    - `callback`：`v-model`的表达式改变时的回调函数，`function (${baseValueExpression}) {${assignment}}`

```js
// src/compiler/directives/model.js
/**
 * Cross-platform code generation for component v-model
 * 跨平台生成组件节点 v-model 指令的代码
 *
 * @param {*} el 组件 AST 节点
 * @param {*} value v-model 的表达式
 * @param {*} modifiers v-model 的修饰符对象
 */
export function genComponentModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const { number, trim } = modifiers || {}

  const baseValueExpression = '$$v'
  let valueExpression = baseValueExpression
  if (trim) {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
      `? ${baseValueExpression}.trim()` +
      `: ${baseValueExpression})`
  }
  if (number) {
    // _n: toNumber，转换为数字
    valueExpression = `_n(${valueExpression})`
  }
  const assignment = genAssignmentCode(value, valueExpression)

  el.model = {
    value: `(${value})`,
    expression: `"${value}"`,
    callback: `function (${baseValueExpression}) {${assignment}}`
  }
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
export function genAssignmentCode (
  value: string,
  assignment: string
): string {
  const res = parseModel(value)
  if (res.key === null) {
    return `${value}=${assignment}`
  } else {
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

let len, str, chr, index, expressionPos, expressionEndPos

type ModelParseResult = {
  exp: string,
  key: string | null
}

/**
 * 解析出 v-model 表达式里的 exp 部分和 key 部分
 * @param {*} val 表达式
 * @return {Object} 结果对象，{ exp、key }
 *
 * 针对可能的表达式返回的结果：
 *
 * - test ：                              {exp: 'test', key: null}
 * - test.test1 :                         {exp: 'test', key: '"test1"'}
 * - test[key]                            {exp: 'test', key: 'key'}
 * - test[test1[key]]                     {exp: 'test', key: 'test1[key]'}
 * - test["a"][key]                       {exp: 'test["a"]', key: 'key'}
 * - xxx.test[a[a].test1[key]]            {exp: 'xxx.test', key: 'a[a].test1[key]'}
 * - test.xxx.a["asa"][test1[key]]        {exp: 'test.xxx.a["asa"]', key: 'test1[key]'}
 */
export function parseModel (val: string): ModelParseResult {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim()
  len = val.length

  // 不存在 [，或 ] 不是最后一位
  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index = val.lastIndexOf('.')
    if (index > -1) {
      return {
        exp: val.slice(0, index),
        key: '"' + val.slice(index + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val
  index = expressionPos = expressionEndPos = 0

  while (!eof()) {
    chr = next()
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr)
    } else if (chr === 0x5B) {
      // 0x5B: 左中括号 [
      parseBracket(chr)
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next (): number {
  return str.charCodeAt(++index)
}

function eof (): boolean {
  return index >= len
}

function isStringStart (chr: number): boolean {
  // 0x22: 双引号 "
  // 0x27: 单引号 '
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr: number): void {
  let inBracket = 1
  expressionPos = index
  while (!eof()) {
    chr = next()
    if (isStringStart(chr)) {
      parseString(chr)
      continue
    }
    // 0x5B: 左中括号 [
    // 0x5D: 右中括号 ]
    if (chr === 0x5B) inBracket++
    if (chr === 0x5D) inBracket--
    if (inBracket === 0) {
      expressionEndPos = index
      break
    }
  }
}

/**
 * 解析字符串，找到下一个相同的符号，比如 " 或 '
 */
function parseString (chr: number): void {
  const stringQuote = chr
  while (!eof()) {
    chr = next()
    if (chr === stringQuote) {
      break
    }
  }
}
```

我们给出一简单示例，方便理解上面的生成代码：

```js
// 父组件
const ParentComponent = {
  name: 'ParentComponent',
  template: `
    <div class="parent-root">
      <ChildComponent v-model="first"></ChildComponent>
    </div>
  `,
  components: {
    ChildComponent
  },
  data () {
    return {
      simpleProperty: 'simpleProperty',
      propertyPath: {
        propertyKey: 'third'
      }
    }
  }
}
```

```js
// 父组件的 render 函数
(function anonymous() {
    with (this) {
        return _c('div', {
            staticClass: "parent-root"
        }, [_c('ChildComponent', {
            // v-model="simpleProperty"
            model: {
                value: (simpleProperty),
                callback: function($$v) {
                    simpleProperty = $$v
                },
                expression: "simpleProperty"
            }

            // v-model.trim="simpleProperty"
            model: {
                value: (singleProperty),
                callback: function($$v) {
                    singleProperty = (typeof $$v === 'string' ? $$v.trim() : $$v)
                },
                expression: "singleProperty"
            }

            // v-model.number="simpleProperty"
            model: {
                value: (singleProperty),
                callback: function($$v) {
                    singleProperty = _n($$v)
                },
                expression: "singleProperty"
            }

            // v-model="propertyPath.propertyKey"
            model: {
                value: (propertyPath.propertyKey),
                callback: function($$v) {
                    $set(propertyPath, "propertyKey", $$v)
                },
                expression: "propertyPath.propertyKey"
            }
        })], 1)
    }
})
```

由此我们看出，组件的`v-model`在代码生成阶段，最终会转换为`render`函数里组件节点数据对象里的`model`相关内容。

PS: 下一步可跳转到本章的“运行时阶段-组件的`v-model`”继续阅读，保持阅读的连贯性。

#### select 元素

若元素是`select`元素，则将生成`select`元素`v-model`指令的代码：往元素上添加`change`事件及事件处理方法。

```js
function genSelect (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  const selectedVal = `Array.prototype.filter` +
    `.call($event.target.options,function(o){return o.selected})` +
    `.map(function(o){var val = "_value" in o ? o._value : o.value;` +
    `return ${number ? '_n(val)' : 'val'}})`

  const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]'
  let code = `var $$selectedVal = ${selectedVal};`
  code = `${code} ${genAssignmentCode(value, assignment)}`
  addHandler(el, 'change', code, null, true)
}
```

我们看到，拼接好事件处理方法的函数体之后，会调用`addHandler`给元素添加`change`事件，最终将通过`addEventListener`添加到`select`元素的 DOM 节点上。`addHandler`之后的处理，可参考[event 之 addhandler](/vue/source-study/compile/topics/event.html#addhandler)

需要注意的是，在`model`函数内调用`genSelect`后，将返回将是`true`，这也意味着`select`元素的`v-model`指令，需要运行时，因此会将`v-model`指令的相关数据放置在元素的数据对象的`data.directives`选项里。

TODO: 为什么需要运行时？

我们通过简单的示例来说明生成的代码是什么样的。

```js
// 源码
const ExampleComp = {
  template: `
      <select v-model="value">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
  `,
  data () {
    return {
      value: 1
    }
  },
  mounted () {
    console.log(this.$options.render)
  }
}

new Vue({
  el: '#app',
  store,
  components: { ExampleComp },
  template: '<ExampleComp></ExampleComp>'
})
```

```js
// ExampleComp 组件的 render 函数
(function anonymous() {
    with (this) {
        return _c(
            'select',
            // select 元素的数据对象
            {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: (value),
                    expression: "value"
                }],
                on: {
                    "change": function($event) {
                        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
                            return o.selected
                        }).map(function(o) {
                            var val = "_value"in o ? o._value : o.value;
                            return val
                        });
                        value = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    }
                }
            },
            // select 元素的子元素
            [
                _c('option', {
                    attrs: {
                        "value": "1"
                    }
                }, [_v("1")]), _v(" "),
                 _c('option', {
                    attrs: {
                        "value": "2"
                    }
                }, [_v("2")]), _v(" "),
                _c('option', {
                    attrs: {
                        "value": "3"
                    }
                }, [_v("3")]), _v(" "),
                _c('option', {
                    attrs: {
                        "value": "4"
                    }
                }, [_v("4")])
            ]
        )
    }
})
```

#### 默认的 input、textarea 元素

若元素是`input`元素且不是`radio`、`checkbox`，或元素是`textarea`元素，就会走该逻辑：

1. （非生产环境）对同时使用`v-model`指令和`v-bind:value`指令且没使用`v-bind:type`的情况给予警告
2. 判断是否需要进行[composition处理](https://segmentfault.com/a/1190000009246058)
3. 判断事件的类型
    - 若有`lazy`修饰符，则使用`change`事件
    - 若没有`lazy`修饰符
      - 若不是`range`，则使用`input`事件
      - 若是`range`，则需要在运行时确定事件类型
4. 生成事件处理方法的函数体部分
5. 往元素上添加名为`value`的`domProps`，
6. 往元素上添加事件及事件处理方法
7. 若存在`trim`和`number`修饰符，则添加`blur`事件，在`blur`事件发生时，对组件进行强制刷新

::: tip 提示
第 5 步添加的`value`是添加到元素数据对象的`domProps`上的
:::

```js
function genDefaultModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const type = el.attrsMap.type

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (process.env.NODE_ENV !== 'production') {
    const value = el.attrsMap['v-bind:value'] || el.attrsMap[':value']
    const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type']
    if (value && !typeBinding) {
      const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value'
      warn(
        `${binding}="${value}" conflicts with v-model on the same element ` +
        'because the latter already expands to a value binding internally'
      )
    }
  }

  const { lazy, number, trim } = modifiers || {}
  const needCompositionGuard = !lazy && type !== 'range'
  const event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input'

  let valueExpression = '$event.target.value'
  if (trim) {
    valueExpression = `$event.target.value.trim()`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }

  let code = genAssignmentCode(value, valueExpression)
  if (needCompositionGuard) {
    // composing 用于处理中文输入截断问题，详见：https://segmentfault.com/a/1190000009246058
    code = `if($event.target.composing)return;${code}`
  }

  // 添加名为 value 的 prop
  addProp(el, 'value', `(${value})`)
  addHandler(el, event, code, null, true)
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()')
  }
}
```

## 运行时阶段

### 组件的 v-model

在运行时阶段，组件的`v-model`将被添加为组件的自定义事件，每次触发`v-model`对应的事件处理方法，将改变`v-model`表达式的值，进而在组件外部看来，组件的`v-model`实现了数据的双向绑定。

#### 将组件的 v-model 添加为自定义事件

在运行时阶段生成组件的 VNode 时，会对`v-model`生成的代码（在`data.model`里）进行处理，处理过程在`transformModel`函数里，包括:

1. 从组件的选项对象里获取自定义的`model`选项，即`model.prop`和`model.event`，若不存在则使用`value`作为`prop`的名称，`input`作为`event`的事件类型
2. 将`v-model`的表达式作为`data.props[prop]`的值
3. 在`data.props`上添加新的`prop`
4. 在`data.on`上添加新的事件和事件处理方法，事件名为`event`的值，事件处理方法为`data.model.callback`

因为组件的`data.on`之后将作为`listeners`，因此对组件上的`v-model`的处理实际上是采用的自定义的事件，而不是原生事件。

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // ...

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  // ...
}
```

```js
/**
 * 将 v-model 转换到子组件的 prop、event
 * @param {*} options 组件选项对象
 * @param {*} data 组件数据对象（从模块解析而来的数据 或 调用 createElement 传入的数据对象）
 */
function transformModel (options, data: any) {
  const prop = (options.model && options.model.prop) || 'value'
  const event = (options.model && options.model.event) || 'input'
  ;(data.props || (data.props = {}))[prop] = data.model.value
  const on = data.on || (data.on = {})
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event])
  } else {
    on[event] = data.model.callback
  }
}
```

#### 如何触发组件 v-model 的自定义事件

如何触发组件`v-model`的自定义事件，相对比较简单，官方已经给出了示例：

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

我们看到，当想要改变组件上的`v-model`的表达式时，需要显式的调用`vm.$emit`去触发`v-model`自定义事件，并传入要变更的值，`v-model`的自定义事件处理方法将执行并更改`v-model`表达式的值。

## 总结

`v-model`的本质是都将指令最终转换为事件。

- 动态组件、自定义组件：转换为组件的自定义事件，需要通过`vm.$emit`触发自定义事件
- `select`元素：转换为 DOM 原生`change`事件，在视图改变时，自动触发`change`事件
