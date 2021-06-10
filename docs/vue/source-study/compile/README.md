---
sidebarDepth: 0
---

# 编译概览

[[toc]]

完整版的 Vue.js 包含了运行时 + 编译器，而编译器的作用就是在客户端编译模板。这样，我们就不需要提前通过 Webpack 的`vue-loader`去预编译模板，而是在浏览器运行时去编译模板。比如组件选项对象里传入一个字符串给`template`选项，或挂载到一个元素上并以其 DOM 内部的 HTML 作为模板。经过编译后，原先的模板字符串将转换为[`render`函数](https://cn.vuejs.org/v2/guide/render-function.html)。

## 编译流程

整个编译过程分为如下几步：

- 解析模板字符串，生成 AST
- 标记 AST Tree 里可优化的节点
- 基于 AST 生成字符串形式的`render`/`staticRenderFns`
- 基于字符串形式的`render`/`staticRenderFns`，生成函数形式`render`/`staticRenderFns`

## 编译入口

### Vue.prototype.$mount

完整版的 Vue.js 会对`Vue.prototype.$mount`方法做一层封装，在封装的函数内，若不存在`render`函数，则调用`compileToFunctions`函数将`template`字符串转换为`render`函数。

转换之前的`template`模板字符串的值，有如下几种可能：

1. 组件选项对象里存在`template`选项
    - `template`是以`#app`开头的字符串，则查询`id`为`app`的 DOM 元素，取`appDom.innerHTML`作为模板字符串
    - `template`是 DOM 元素节点，则取`dom.innerHTML`作为模板字符串
2. 组件选项对象里不存在`template`选项，但存在`el`选项：将整个`el`元素的`el.outerHTML`作为模板字符串

```js
// src/platforms/web/entry-runtime-with-compiler.js

import { compileToFunctions } from './compiler/index'
const mount = Vue.prototype.$mount
/**
 * 封装 Vue.prototype.$mount，将 template 编译为 render 函数
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        // X-Template
        // https://cn.vuejs.org/v2/guide/components-edge-cases.html#X-Templates
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        // template 是 DOM 元素
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 若 options.template 不存在，则将挂载元素作为模板
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 将 template 编译成 render 函数
      const { render, staticRenderFns } = compileToFunctions(template, {
        // 编译模板时，是否要对换行符（\n）进行解码
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        // 模板内表达式前后的分隔符，默认是 ["{{", "}}"]
        delimiters: options.delimiters,
        // 是否保留且渲染模板中的 HTML 注释，默认为 false
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

### compileToFunctions

`Vue.prototype.$mount`里调用的`compileToFunctions`是 Web 版编译器实例的一个方法，而编译器实例是调用核心版本里`createCompiler`函数即编译器生成器，并传入基础配置选项`baseOptions`后返回的编译器实例对象。

```js
// src/platforms/web/compiler/index.js

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```

### 编译器生成器

`createCompiler`函数即编译器生成器，是调用创建编译器生成器`createCompilerCreator`函数生成的，调用时会传入`baseCompile`函数，`baseCompile`函数的作用是完成基础编译工作，包括：

- 解析模板字符串，生成 AST
- 标记 AST Tree 里可优化的节点
- 基于 AST 生成字符串形式的`render`/`staticRenderFns`

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
  // 解析模板，生成 AST
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    // 字符串形式的 render/staticRenderFns
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

### 创建编译器生成器

调用`createCompilerCreator`函数会返会编译器生成器函数`createCompiler`，调用编译器生成函数会返回编译器对象`{ compile, compileToFunctions }`

```js
// src/compiler/create-compiler.js

import { extend } from 'shared/util'
import { detectErrors } from './error-detector'
import { createCompileToFunctionFn } from './to-function'

export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // finalOptions.__proto__ = baseOptions
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
      }

      // 合并 baseOptions 和传入的 options
      // modules 是数组，合并数组
      // directives 是对象，合并对象，options.directives 可能会覆盖 baseOptions.directives 里同名的属性
      // 其他属性优先使用 options.xxx
      if (options) {
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

      // 编译
      const compiled = baseCompile(template, finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast))
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

### createCompileToFunctionFn

在生成编译器对象里的`compileToFunctions`方法时，是调用`createCompileToFunctionFn`函数返回的`compileToFunctions`。

```js
// src/compiler/to-function.js

import { noop, extend } from 'shared/util'
import { warn as baseWarn, tip } from 'core/util/debug'

type CompiledFunctionResult = {
  render: Function;
  staticRenderFns: Array<Function>;
};

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}

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

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      // 检测可能存在的 CSP（Content Security Policy） 限制
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          )
        }
      }
    }

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

    // check compilation errors/tips
    // 检测编译错误/提示
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn(
          `Error compiling template:\n\n${template}\n\n` +
          compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
          vm
        )
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(msg => tip(msg, vm))
      }
    }

    // turn code into functions
    // 将 res.render/staticRenderFns 字符串转换成函数
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    // 若基于 res.render/staticRenderFns 字符串生成 render/staticRender 函数时出错
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        )
      }
    }

    return (cache[key] = res)
  }
}
```

### 编译入口总结

以上的一步步获取编译器的过程是逆序的，让我们顺序地总结下编译器对象是如何生成的。

- 调用`createCompilerCreator`函数，传入（平台无关的）`baseCompile`函数参数，返回`createCompiler`函数
- 调用`createCompiler`函数，传入（平台相关的）`baseOptions`对象参数，返回编译器对象实例`{ compile, compileToFunctions }`
  - `createCompiler`函数内，内置了`compile`函数
  - 调用`createCompileToFunctionFn`函数，传入`compile`作为参数，返回`compileToFunctions`
  - 返回编译器对象实例`{ compile, compileToFunctions }`

通过函数柯里化的技巧，将`baseCompile`、`baseOptions`作为闭包参数，可以在`compile`函数内使用到；`compileToFunctions`里又能使用到`compile`函数。之所以这么做，是因为 Vue.js 不止在一个平台编译，若是将`baseCompile`、`baseOptions`写死，则不太灵活。采用这里函数柯里化的方式，在不同平台编译时，调用`createCompiler`时传入不同的`baseOptions`，返回的编译器对象`{ compile, compileToFunctions }`的`compile`方法里，既能访问到平台无关的`baseCompile`，也能访问到平台有关的`baseOptions`，且`compileToFunctions`里可以访问到`compile`方法。

经过上面的编译入口分析，最终在`Vue.prototype.$mount`里是调用的`compileToFunctions`，因此我们在分析源码时，也可以先从`createCompileToFunctionFn`生成的`compileToFunctions`函数开始。
