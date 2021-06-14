# 归并排序

## 示意图

![归并排序示意图](./index.gif)

## 实现

```js
function mergeSort(arr) {
  const len = arr.length
  if (len < 2) {
    return arr
  }
  const middle = Math.floor(len/2)
  const left = arr.slice(0, middle)
  const right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))
}

function merge(arrA, arrB) {
  let lenA = arrA.length, i = 0
  let lenB = arrB.length, j = 0
  const result = []
  while (i < lenA && j < lenB) {
    if (arrA[i] > arrB[j]) {
      result.push(arrB[j++])
    } else {
      result.push(arrA[i++])
    }
  }
  while (i < lenA) {
    result.push(arrA[i++])
  }
  while (j < lenB) {
    result.push(arrB[j++])
  }
  return result
}
```

## Reference

- [js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)
- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
