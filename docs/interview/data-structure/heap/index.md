---
sidebarDepth: 0
---

# 堆

[[toc]]

数据结构里，需要满足下面两个条件的就是堆：

- 堆是一个完全二叉树
- 堆上的任意节点值都必须大于等于（大顶堆）或小于等于（小顶堆）其左右子节点值

## 堆的实现

### 堆的类定义

```js
class Heap {
    /**
     * 构造函数
     * @param {array} array 可选，初始数组
     * @param {function} compare 可选，优先级比较函数，默认按数字/字母从小到大排序
     */
    constructor(array, compare) {}

    /**
     * 元素入堆
     */
    push(item) {}

    /**
     * 元素出堆
     */
    pop() {}

    /**
     * 返回堆顶元素，但不删除
     */
    peek() {}


    /**
     * 堆里节点数量
     */
    get size()
}
```

### 堆的实现源码

使用数组来实现堆时，若数组的索引从`0`开始的话，则某个索引为`i`的节点的相关节点索引为：

- 父节点索引为：`Math.floor((i - 1) / 2)`
- 左子节点索引为：`2i + 1`
- 右子节点所以为：`2i + 2`

@[code js](./heap.js)

### 复杂度分析

#### 时间复杂度

往堆里插入`n`个元素，时间复杂度: `O(nlogn)`。

- 每次插入一个元素调整堆: `O(logn)`
- 需要插入`n`次

每次删除一个元素，时间复杂度: `O(logn)`

#### 空间复杂度

`O(n)`

## 大顶堆和小顶堆

如果堆上的任意节点都大于等于子节点值，则称为大顶堆。如果堆上的任意节点都小于等于子节点值，则称为小顶堆。

也就是说，在大顶堆中，根节点是堆中最大的元素；在小顶堆中，根节点是堆中最小的元素。

大顶堆是指堆顶的优先级最高，小顶堆是指堆顶的优先级最低，可通过实例化`Heap`时传入不同的`compare`函数来分别实现大顶堆和小顶堆。

```js
// 大顶堆
new Heap((a, b) => b > a);

// 小顶堆（默认）
new Heap((a, b) => a > b);
new Heap();
```

## 应用

### 获取无序数组里第 K 大的数

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