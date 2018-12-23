# 概览

## 代码生成阶段往 AST 上增加的属性

### v-model 指令

```js
el.model = {
  value: `(${value})`,
  expression: `"${value}"`,
  callback: `function (${baseValueExpression}) {${assignment}}`
}
```
