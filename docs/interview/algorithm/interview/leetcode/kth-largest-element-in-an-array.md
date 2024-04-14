# LeetCode - 数组中的第K个最大元素

## 【Medium】获取第 K 大的数

参考：[Leetcode - 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

参考答案：

方法一：先排序，后获取，比如快排

- 时间复杂度 `O(nlogn)`
- 空间复杂度 `O(logn)`

方法二：基于堆排序的选择算法，[风动之石的博客 - 堆](https://blog.windstone.cc/interview/data-structure/heap/)

```js
function TopK(array, maxIndex) {
    const heap = new Heap();
    array.forEach(item => {
        heap.push(item);
        if (heap.size > maxIndex) {
            heap.pop();
        }
    });
    return heap.pop();
}
```

- 时间复杂度：`O(nlogk)`，其中，每次调整堆的时间复杂度为`O(logk)`
- 空间复杂度：`O(k)`

方法三：快排的变种，适用确定数量的情况下寻找第 K 大的数，因为已确定 K，可将快排里针对两边递归优化为只针对一边进行递归

- 时间复杂度：最坏情况 `O(n^2)`，平均情况为`O(n)`
- 空间复杂度：`O(logn)`
