# 格式化

[[toc]]

## 数字

### 金额格式化

**去除金额里小数点后无意义的`0`**，可使用`parseFloat`方法

```js
parseFloat('2.00') // 2
parseFloat('2.20') // 2.2
parseFloat('2.02') // 2.02
```

### 将数字转换成亿、万

```js
function formatCount(count, precision = 1) {
  if (count > 100000000) {
    return parseFloat((count / 100000000).toFixed(precision)) + '亿';
  }
  if (count > 10000) {
    return parseFloat((count / 10000).toFixed(precision)) + '万';
  }
  return count;
}
```

加`parseFloat`的原因是，将`2.0`转成`2`。

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
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}
```

```js
/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}
```
