# 选择排序

## 示意图

![选择排序示意图](./index.gif)

## 实现

```js
function selectionSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    let min = i
    for (let j = i + 1; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j
      }
    }
    if (min !== i) {
      let temp = arr[i]
      arr[i] = arr[min]
      arr[min] = temp
    }
  }
  return arr
}
```

## 分析

- 时间复杂度上表现最稳定的排序算法之一，因为无论什么数据进去都是O(n<sup>2</sup>)的时间复杂度
- 数据规模越小越好

## Reference

- [js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)
- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
