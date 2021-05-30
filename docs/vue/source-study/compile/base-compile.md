---
sidebarDepth: 0
---

# 核心编译

`compile`函数里所使用的`baseCompile`函数是在调用`createCompilerCreator`函数时传入的。`baseCompile`函数里的逻辑是核心的编译流程，与平台无关，具体包括：

- 解析模板字符串，创建 AST
- 优化 AST
- 基于 AST 生成字符串形式的`render`/`staticRenderFns`

最后返回对象`{ ast, render, staticRenderFns }`

```js
// src/compiler/index.js

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 解析模板字符串，创建 AST
  const ast = parse(template.trim(), options)

  // 优化 AST
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

## 解析模板字符串，创建 AST

`parse`函数接收`template`和`options`为参数，返回 AST 的根节点（及 AST Tree），详情请见[解析模板字符串，创建 AST](/vue/source-study/compile/parse.html)

## 优化 AST

获取到 AST Tree 之后，需要识别并标记其中的静态子树（比如永远不需要改变的 DOM），一旦我们检测到这些静态子树：

- 可以将他们提升为常量，在以后的每一次调用`render`方法时不需要再为它们创建新的 VNode
- 在`patch`阶段可以完全跳过它们

详情请见[优化 AST 树](/vue/source-study/compile/optimize.html)

## 生成 render 函数

根据 AST Tree 生成`render`和`staticRenderFns`的字符串形式，详情请见[生成 render 函数](/vue/source-study/compile/codegen.html)

## options 对象

因为在`baseCompile`函数里的三大步骤都需要使用到`options`对象，我们需要确定下 Web 平台下的`options`对象是如何生成的。

```js
// src/platforms/web/entry-runtime-with-compiler.js
// ...
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // ...
  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    // ...
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 将 template 编译成 render 函数
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        // 编译模板时，是否要对换行符（\n）进行解码
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        // 改变纯文本插入分隔符。new Vue({ delimiters: ['${', '}'] }) // 分隔符变成了 ES6 模板字符串的风格
        // 详见 https://cn.vuejs.org/v2/api/#delimiters
        delimiters: options.delimiters,
        // 若 comments 为 true，将会保留渲染模板中的 HTML 注释。默认行为是舍弃它们。
        // 详见 https://cn.vuejs.org/v2/api/#comments
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      // ...
    }
  }
  return mount.call(this, el, hydrating)
}
```

Web 平台上的`Vue.prototype.$mount`方法里，若组件实例上不存在`vm.$options.render`方法，就会调用`compileToFunctions`函数生成`render`方法，`compileToFunctions`函数的第二个参数就是外部传入的`options`，开发者在声明组件的选项对象时可以传入部分选项，用于之后`render`函数的生成，其中的每个字段都已经在上面代码里说明。

```js
// src/compiler/to-function.js
export function createCompileToFunctionFn (compile: Function): Function {
  const cache = Object.create(null)

  // 最终的 compileToFunctions 函数，返回 { render, staticRenderFns }
  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn
    // ...

    // check cache
    // 优先使用缓存结果
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // compile
    // 编译
    const compiled = compile(template, options)
    // ...
  }
}
```

`compileToFunctions`函数里，基本上原封不动地将外部传入的`options`传入到了`compile`函数里。在`compile`函数里，会基于 Web 平台相关的基础选项对象`baseOptions`合并外部传入的选项对象`options`，形成最终传入`baseCompile`函数里的选项对象`finalOptions`。

```js
export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
      // options 是外部传入的选项对象，方便开发者可以控制 render 函数的生成。
      // 开发者可以在组件的选项对象里声明相关选项，这些选项对象将在 src/platforms/web/entry-runtime-with-compiler.js 里调用 compileToFunctions 函数时传入，经过在 compileToFunctions 函数里调用 compile 函数传入到这里
      options?: CompilerOptions
    ): CompiledResult {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []

      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg)
      }

      // 合并 baseOptions 和传入的平台相关的 options
      // modules 是数组，合并数组
      // directives 是对象，合并对象，options.directives 优先使用
      // 其他属性优先使用 options.xxx
      if (options) {
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          // $flow-disable-line
          const leadingSpaceLength = template.match(/^\s*/)[0].length

          warn = (msg, range, tip) => {
            const data: WarningMessage = { msg }
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength
              }
            }
            (tip ? tips : errors).push(data)
          }
        }
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      finalOptions.warn = warn

      const compiled = baseCompile(template.trim(), finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        detectErrors(compiled.ast, warn)
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
```

`baseOptions`是在调用`createCompiler`里传入的，包含 Web 平台相关的一些判断函数和模块。

```js
// src/platforms/web/compiler/index.js
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```

```js
// src/platforms/web/compiler/options.js
import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,
  directives,
  // 函数，判断是否是 <pre> 标签
  isPreTag,
  // 函数，判断是否是一元标签，即一定不会自我闭合，比如 <br>、<hr>
  isUnaryTag,
  // 函数，判断哪些标签的那些 attribute 需要用 props 来实现数据绑定
  mustUseProp,
  // 函数，判断哪些标签是无需显示闭合的
  canBeLeftOpenTag,
  // 保留标签（HTML 标签及 SVG 标签）
  isReservedTag,
  // 函数，获取标签的命名空间
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
```

经过在`compile`函数里的合并之后，最终传入`baseCompile`函数的`finalOptions`的结构为：

```js
finalOptions = {
  outputSourceRange: process.env.NODE_ENV !== 'production',
  // 编译模板时，是否要对换行符（\n）进行解码
  shouldDecodeNewlines,        // src/platforms/web/util/compat.js
  shouldDecodeNewlinesForHref, // src/platforms/web/util/compat.js
  // 改变纯文本插入分隔符。new Vue({ delimiters: ['${', '}'] }) // 分隔符变成了 ES6 模板字符串的风格，详见 https://cn.vuejs.org/v2/api/#delimiters
  delimiters: options.delimiters, // options 是组件（合并后的）选项对象
  // 若 comments 为 true，将会保留渲染模板中的 HTML 注释。默认行为是舍弃它们。详见 https://cn.vuejs.org/v2/api/#comments
  comments: options.comments,     // options 是组件（合并后的）选项对象


  /** 这些属性/方法是从原型上复制过来的 - 开始 **/
  expectHTML: true,
  // 函数，判断是否是 <pre> 标签
  isPreTag, // src/platforms/web/util/element.js
  // 函数，判断是否是一元标签，即一定不会自我闭合，比如 <br>、<hr>
  isUnaryTag, // src/platforms/web/compiler/util.js
  // 函数，判断哪些标签的那些 attribute 需要用 props 来实现数据绑定
  mustUseProp, // src/platforms/web/util/attrs.js
  // 函数，判断哪些标签是无需显示闭合的
  canBeLeftOpenTag, // src/platforms/web/compiler/util.js
  // 保留标签（HTML 标签及 SVG 标签）
  isReservedTag, // src/platforms/web/util/element.js
  // 函数，获取标签的命名空间
  getTagNamespace, // src/platforms/web/util/element.js
  staticKeys: 'staticClass,staticStyle'
  /** 这些属性/方法是从原型上复制过来的 - 结束 **/


  __proto__: {
      modules: [
        klass, // src/platforms/web/compiler/modules/class.js
        style, // src/platforms/web/compiler/modules/style.js
        model, // src/platforms/web/compiler/modules/model.js
      ],
      directives: {
        model, // src/platforms/web/compiler/directives/model.js
        text,  // src/platforms/web/compiler/directives/text.js
        html,  // src/platforms/web/compiler/directives/html.js
      },
  }


  warn, // 警告函数
}
```
