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
