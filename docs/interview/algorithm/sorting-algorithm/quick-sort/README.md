---
sidebarDepth: 0
---

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
    const pivot = left;
    let index = pivot + 1;
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

结合示意图和代码，来了解如何分区的：

- `pivot`是基准（黄色），分区时要与这个数做比较，将所有数字分为比基于小的部分和比基准大的部分
- `index`是下一个要被替换的位置，`index`位置左边的数都比`pivot`小
- 在分区过程中，绿色表示比基准`pivot`小的，紫色表示比基准`pivot`大的（第一个紫色表示`index`），红色表示当前`i`，
- 每一次循环后，要把`pivot`与`index - 1`的数互换，返回新的`pivot`位置，即`index - 1`

如果示意图过快无法了解分区过程，可以将`gif`图下载到本地，一帧一帧查看。

## Reference

- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
