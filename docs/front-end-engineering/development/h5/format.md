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
