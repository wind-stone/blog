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

`parse`函数接收`template`和`options`为参数，返回 AST 的根节点，详情请见[解析模板字符串，创建 AST](/vue/source-study/compile/parse.html)

## 优化 AST

## 生成 render 字符串