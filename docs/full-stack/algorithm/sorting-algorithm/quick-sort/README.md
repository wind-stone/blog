# 快速排序

## 示意图

![快速排序示意图](./index.gif)

## 实现

```js
function quickSort(arr, left, right) {
  left = left !== undefined ? left : 0
  right = right !== undefined ? right : arr.length - 1

  if (left < right) {
    const partitionIndex = partition(arr, left, right)
    quickSort(arr, left, partitionIndex - 1)
    quickSort(arr, partitionIndex + 1, right)
  }
  return arr
}

function partition(arr, left, right) {
  const pivot = left
  let index = pivot + 1
  for (let i = index; i <= right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index)
      index++
    }
  }
  swap(arr, pivot, index - 1)
  return index - 1
}

function swap(arr, i, j) {
  const temp = arr[j]
  arr[j] = arr[i]
  arr[i] = temp
}
```

## Reference

- [js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)
- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
