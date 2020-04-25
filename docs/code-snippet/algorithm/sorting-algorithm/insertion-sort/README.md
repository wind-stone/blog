---
sidebarDepth: 0
---

# 插入排序

## 示意图

![插入排序示意图](./index.gif)

## 实现

```js
function insertionSort(arr) {
  const len = arr.length
  for (let i = 1; i < len; i++) {
    let key = arr[i]
    let j = i - 1
    while(j >= 0 && key < arr[j]) {
      arr[j+1] = arr[j]
      j--
    }
    arr[j+1] = key
    console.log(arr)
  }
  return arr
}
```

## 分析

注意：如果插入时发现前一位置与插入值相等，则插入在其后。

## 优化

### 二分法插入排序

```js
function insertionSort(arr) {
  const len = arr.length
  for (let i = 1; i < len; i++) {
    let key = arr[i]
    let left = 0, right = i - 1
    while(left <= right) {
      let middle = Math.floor((left + right)/2)
      if (key < arr[middle]) {
        right = middle - 1
      } else {
        left = middle + 1
      }
    }
    for (let j = i - 1; j >= left; j--) {
      arr[j+1] = arr[j]
    }
    arr[left] = key
  }
  return arr
}
```

## Reference

- [js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)
- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
