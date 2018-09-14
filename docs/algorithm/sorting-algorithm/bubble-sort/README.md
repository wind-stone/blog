---
sidebarDepth: 0
---

# 冒泡排序

## 示意图

![选择排序示意图](./index.gif)

## 实现

```js
function bubbleSort(arr) {
  let len = arr.length, temp
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        temp = arr[j+1]
        arr[j+1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
```

## 分析

- 什么情况下，排序最快？
  - 输入的数据已经是正序
- 什么情况下，排序最慢？
  - 输入的数据是反序

### 优化

#### 优化一

设置一个 flag，如果一趟排序后元素没有发生交换，则证明该序列已经有序，结束排序。

```js
function bubbleSort(arr) {
  let len = arr.length, temp
  let isSorted  // flag
  for (let i = 0; i < len && !isSorted; i++) {
    isSorted = true
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        isSorted = false
        temp = arr[j+1]
        arr[j+1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
```

#### 优化二

每一趟排序后，记录该趟最终的交互位置，该位置之后的所有元素都是有序的，无需再排。

其中的`pos`有两个作用：

- 同优化一里的 flag，表明是否发生了交互
- 记录最终交互的位置

与优化一没有本质区别。

```js
function bubbleSort(arr) {
  let i = arr.length - 1
  while (i > 0) {
    let pos = 0  // 每趟开始时，无记录交换
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j+1]) {
        pos = j  // 该趟排序最终的交换位置
        let temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = temp
      }
    }
    i = pos  // i 是最大数索引的前一位置的索引
  }
  return arr
}
```

## Reference

- [js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)
- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
