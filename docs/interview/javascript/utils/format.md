---
sidebarDepth: 0
---

# 格式化

[[toc]]

## 字符串格式化

### 命名方法转换

- 小驼峰命名法，camelCase
- 大驼峰命名法，UpperCamelCase，也称为 Pascal 命名法。
- 中划线命名法，kebab-case
- 下划线命名法，snake_case

```js
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})
```

```js
/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})
