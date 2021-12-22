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

## 复杂度分析

### 时间复杂度

- 最好情况：每次递归都平分数组，移动需要递归`O(logn)`次，每次递归需要遍历`n`次，时间复杂度为`O(nlogn)`
- 最差情况：每次递归都把数组分为`1`和`n-1`，一共需要递归`n`次，每次递归需要遍历`n`次，时间复杂度为`O(n^2)`
- 平均时间复杂度：`O(nlogn)`

### 空间复杂度

- 最好情况：`O(logn)`
- 最差情况：`O(n)`
- 平均空间复杂度：`O(logn)`

注意，空间复杂度不是`O(1)`，因为每次递归都在不同的函数栈里，每次递归时需要`O(1)`空间，且不同函数栈里的`O(1)`空间不能复用。

## Reference

- [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)
