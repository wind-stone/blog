# 【初级】变量命名风格转换

## 【初级】将连字符命名转换成小驼峰命名

将连字符（hyphens）命名的变量名转换成小驼峰命名，比如：

```js
'get-element-by-id'   ==>    'getElementById'
```

```js
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})
```

## 将小驼峰命名转换成连字符命名

将连字符（hyphens）命名的变量名转换成小驼峰命名，比如：

```js
/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g; //  \B 匹配非单词边界
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}
```
