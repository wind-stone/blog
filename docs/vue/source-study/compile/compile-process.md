---
sidebarDepth: 0
---

# 编译流程

[[toc]]

经过上一节的概览介绍，我们知道整个编译的大致流程，以及编译的入口是在`compileToFunctions`函数，该节将详细介绍`compileToFunctions`函数内都做了哪些工作。

## compileToFunctions

`compileToFunctions`会在`Vue.prototype.$mount`里调用，传入模板字符串`template`、选项`options`和组件实例`vm`，返回一对象，包括`render`/`staticRenderFns`函数。其内做的主要工作有：

1. （非生产环境）检测可能存在的 CSP（Content Security Policy）限制
2. 在缓存对象`cache`里查看传入的`template`是否已经编译过，若有，则直接返回
3. 调用`compile`进行编译，返回编译结果对象
4. （非生产环境）检测上一步产生的编译错误/提示，发出警告/提示
5. 将`render`/`staticRenderFns`字符串转换成`render`/`staticRenderFns`函数，并收集期间产生的错误
6. （非生产环境）对于上一步收集的错误，发出警告

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
      // 检测可能存在的 CSP（Content Security Policy）限制
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

### compile

若传入`compileToFunctions`的模板字符串`template`未曾编译过，会调用`compile`并传入`template`和`options`，进行编译，返回编译结果以及编译过程中产生的错误和提示。

`compile`函数内的主要工作有：

1. 合并平台有关的`baseOptions`和传入的`options`为`finalOptions`
2. 调用`baseCompile`并传入`template`和`finalOptions`，进行基础编译工作，获取基础编译结果
3. 调用`detectErrors`获取基础编译结果里 AST 节点上的错误
4. 返回基础编译结果

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

#### baseCompile

详见

#### detectErrors

`detectErrors`的作用是检查 AST 树中各个节点上的某些特性的值是否符合要求，具体有：

规则有：

- 符合表达式规则
  - 表达式剥离字符串部分后，包含的属性不能是关键字
  - 表达式不能无效
- 符合标识符规则
  - 所给的字符需要能作为常规的标识符

节点上要校验的项目有：

- 元素节点
  - `v-for`特性的值为`(alia, iterator1, iterator2) in list`
    - `list`要符合表达式规则
    - `alia`/`iterator1`/`iterator2`字符串需要符合标识符规则
  - `v-on:click="hander"`特性的值
    - `hander`表达式里，不能用一元操作符做为属性，比如`<ul @click="delete">`是不允许的
    - `hander`要符合表达式规则
  - 其他指令的值的表达式，要符合表达式规则
- 带插值的文本节点
  - 插值的表达式要符合表达式规则

```js
// src/compiler/error-detector.js

import { dirRE, onRE } from './parser/index'

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
// 以下这些单词不能出现在模板内的表达式里，但是像 typeof、instanceof、in 这样的操作符可以
// \b 元字符匹配单词边界，比如/oo\b/ 不匹配 "moon" 中的 'oo'，但匹配 "moo" 中的 'oo'
const prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b')

// these unary operators should not be used as property/method names
// 一元操作符不能作为属性/方法的名称
const unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)')

// strip strings in expressions
/**
 * 剥离字符串左右两边的引号，这个引号包括单引号、双引号、模板字符串符号
 * 拆解正则
 * /
 *  1. 单引号包裹的，任意个如下类型的字符，其中“\.”代表一个转义字符，比如“\n”。可以匹配：'ab\n'
 *    1.1 “非单引号非反斜杠”字符
 *    1.2 “\.”
 *  '(?:[^'\\]|\\.)*'|
 *  2. 单引号包裹的，任意个如下类型的字符，其中“\.”代表一个转义字符，比如“\n”。可以匹配："ab\n"
 *    2.1 “非双引号非反斜杠”字符
 *    2.2 “\.”
 *  "(?:[^"\\]|\\.)*"|
 *  3. 单个模板字符串，右边是任意个“非模板字符串符号非反斜杠”字符，再右边是“${”，比如匹配：`one${
 *  `(?:[^`\\]|\\.)*\$\{|
 *  4. "}"，右边是任意个“非模板字符串符号非反斜杠”字符，比如匹配 }another`。
 *  \}(?:[^`\\]|\\.)*`|
 *  5. 模板字符串包裹的，任意个如下类型的字符，其中“\.”代表一个转义字符，比如“\n”。可以匹配：`ab\n`
 *    5.1 “非模板字符串符号非反斜杠”字符
 *    5.2 “\.”
 *  `(?:[^`\\]|\\.)*`
 * /
 *
 * PS：上面的第 3. 和 4. 两点，正好会剥离模板字符串的字符串部分，把标识符留下来了，比如，
 *
 * const str = `one${Identifier}another`
 * str = str.replace(stripStringRE, '')
 * console.log(str)  // 结果是 Identifier
 */
const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g

// detect problematic expressions in a template
export function detectErrors (ast: ?ASTNode): Array<string> {
  const errors: Array<string> = []
  if (ast) {
    checkNode(ast, errors)
  }
  return errors
}

function checkNode (node: ASTNode, errors: Array<string>) {
  if (node.type === 1) {
    for (const name in node.attrsMap) {
      // 检查指令
      // dirRE = /^v-|^@|^:/
      if (dirRE.test(name)) {
        const value = node.attrsMap[name]
        if (value) {
          if (name === 'v-for') {
            checkFor(node, `v-for="${value}"`, errors)
          } else if (onRE.test(name)) {
            // onRE = /^@|^v-on:/
            checkEvent(value, `${name}="${value}"`, errors)
          } else {
            checkExpression(value, `${name}="${value}"`, errors)
          }
        }
      }
    }
    // 递归地检查子节点
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors)
      }
    }
  } else if (node.type === 2) {
    // 带插值的文本节点
    checkExpression(node.expression, node.text, errors)
  }
}

/**
 * 检查事件的表达里是否使用了一元操作符作为了属性名称，以及 checkExpression
 */
function checkEvent (exp: string, text: string, errors: Array<string>) {
  const stipped = exp.replace(stripStringRE, '')
  const keywordMatch: any = stipped.match(unaryOperatorsRE)
  // 避免在事件的表达式里使用一元操作符，比如 <ul @click="delete">、<ul @click="`${delete}`">
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      `avoid using JavaScript unary operator as property name: ` +
      `"${keywordMatch[0]}" in expression ${text.trim()}`
    )
  }
  checkExpression(exp, text, errors)
}

function checkFor (node: ASTElement, text: string, errors: Array<string>) {
  checkExpression(node.for || '', text, errors)
  checkIdentifier(node.alias, 'v-for alias', text, errors)
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors)
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors)
}

/**
 * 检查所给的字符串是否能作为标识符
 */
function checkIdentifier (
  ident: ?string,
  type: string,
  text: string,
  errors: Array<string>
) {
  if (typeof ident === 'string') {
    try {
      new Function(`var ${ident}=_`)
    } catch (e) {
      errors.push(`invalid ${type} "${ident}" in expression: ${text.trim()}`)
    }
  }
}

/**
 * 检查表达式是否存在问题，以下两种情况不允许
 *
 * 1. 剥离字符串部分的表达式里，包含的属性是关键字
 * 2. 表达式无效
 */
function checkExpression (exp: string, text: string, errors: Array<string>) {
  try {
    new Function(`return ${exp}`)
  } catch (e) {
    // 禁止在表达式里出现 关键字
    const keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE)
    if (keywordMatch) {
      errors.push(
        `avoid using JavaScript keyword as property name: ` +
        `"${keywordMatch[0]}"\n  Raw expression: ${text.trim()}`
      )
    } else {
      errors.push(
        `invalid expression: ${e.message} in\n\n` +
        `    ${exp}\n\n` +
        `  Raw expression: ${text.trim()}\n`
      )
    }
  }
}
```
