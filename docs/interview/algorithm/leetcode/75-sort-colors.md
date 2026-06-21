# 75. 颜色分类[中等]

- 题目：[75. 颜色分类](https://leetcode.cn/problems/sort-colors/description/)
- 题解：[颜色分类](https://leetcode.cn/problems/sort-colors/solutions/437968/yan-se-fen-lei-by-leetcode-solution/)

## AC 代码

### 方法一：单指针

复杂度分析

- 时间复杂度：O(n)，其中 n 是数组 nums 的长度。
- 空间复杂度：O(1)。

该方法遍历了两次数组。

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
    let head = 0; // 头部区域的下一个待填充的下标
    let len = nums.length;

    const swap = (nums, i, j) => {
        const temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    };

    // 先把所有 0 移到头部区域
    for (let i = 0; i < len; i++) {
        if (nums[i] === 0) {
            swap(nums, i, head);
            head++;
        }
    }

    // 先把所有 1 移到头部区域
    for (let i = head; i < len; i++) {
        if (nums[i] === 1) {
            swap(nums, i, head);
            head++;
        }
    }
    return nums;
};
```

### 方法二：双指针

复杂度分析

- 时间复杂度：O(n)，其中 n 是数组 nums 的长度。
- 空间复杂度：O(1)。

该方法只遍历了一次数组。

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
    let left = 0;
    let right = nums.length - 1;

    const swap = (nums, i, j) => {
        const temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    };

    for (let i = 0; i <= right; i++) {
        if (nums[i] === 0) {
            // 将所有的 0 都移到左边
            swap(nums, i, left);
            left++;
        } else if (nums[i] === 2) {
            // 将所有的 2 都移到右边
            swap(nums, i, right);

            right--;

            // 注意：新的 nums[i] 可能还是 2，需要再次处理 nums[i]
            i--;
        }
    }
    return nums;
};
```

### 方法三：暴力求解

复杂度分析

- 时间复杂度：O(n)，其中 n 是数组 nums 的长度。
- 空间复杂度：O(n)。

该方法额外使用了 O(n) 的空间存储，且需要遍历 2 次数组长度。

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
    let len = nums.length;
    const redArray = []; // 0
    const whiteArray = []; // 1
    const blueArray = []; // 2

    for (let i = 0; i < len; i++) {
        if (nums[i] === 0) {
            redArray.push(nums[i]);
        } else if (nums[i] === 1) {
            whiteArray.push(nums[i]);
        } else {
            blueArray.push(nums[i]);
        }
    }

    let i = 0;
    while (redArray.length) {
        nums[i++] = redArray.pop();
    }
    while (whiteArray.length) {
        nums[i++] = whiteArray.pop();
    }
    while (blueArray.length) {
        nums[i++] = blueArray.pop();
    }
    return nums;
};
```
