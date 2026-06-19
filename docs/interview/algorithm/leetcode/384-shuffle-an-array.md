# 384. 打乱数组[中等]

- 题目：[384. 打乱数组](https://leetcode.cn/problems/shuffle-an-array/description/)
- 题解：[打乱数组](https://leetcode.cn/problems/shuffle-an-array/solutions/1113741/da-luan-shu-zu-by-leetcode-solution-og5u/)

## AC 代码

### 方案一：暴力

复杂度分析

- 时间复杂度：
    - 初始化：O(n)，其中 n 为数组中的元素数量。我们需要 O(n) 来初始化 original。
    - reset：O(n)。我们需要 O(n) 将 original 复制到 nums。
    - shuffle：O(n<sup>2</sup>)。我们需要遍历 n 个元素，每个元素需要 O(n−k) 的时间从 nums 中移除第 k 个元素。
- 空间复杂度：O(n)。记录初始状态和临时的乱序数组均需要存储 n 个元素。

```js
/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
    this.nums = nums.slice(0);
    this.origin = nums.slice(0);
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function () {
    this.nums = this.origin.slice(0);
    return this.nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function () {
    const newNums = new Array(this.nums.length);
    const nums = this.nums.slice(0);

    for (let i = 0; i < this.nums.length; i++) {
        newNums[i] = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
    }

    this.nums = newNums.slice();
    return newNums;
};
```

### 方案二：Fisher-Yates 洗牌算法

请参考：[大白话讲解「洗牌算法」](https://leetcode.cn/problems/shuffle-an-array/solutions/2587553/da-bai-hua-jiang-jie-xi-pai-suan-fa-by-h-qb15/)

复杂度分析

- 时间复杂度：
    - 初始化：O(n)，其中 n 为数组中的元素数量。我们需要 O(n) 来初始化 original。
    - reset：O(n)。我们需要 O(n) 将 original 复制到 nums。
    - shuffle：O(n)。我们只需要遍历 n 个元素即可打乱数组。
- 空间复杂度：O(n)。记录初始状态需要存储 n 个元素。

```js
/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
    this.nums = nums.slice(0);
    this.origin = nums.slice(0);
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function () {
    this.nums = this.origin.slice(0);
    return this.nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function () {
    for (let i = 0; i < this.nums.length; i++) {
        const j = Math.floor(Math.random() * (this.nums.length - i)) + i;
        const temp = this.nums[i];
        this.nums[i] = this.nums[j];
        this.nums[j] = temp;
    }
    return this.nums;
};
```
