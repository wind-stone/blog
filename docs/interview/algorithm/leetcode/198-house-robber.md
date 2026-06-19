# 198. 打家劫舍[中等]

- 题目：[198. 打家劫舍](https://leetcode.cn/problems/house-robber/description/)
- 题解：[打家劫舍](https://leetcode.cn/problems/house-robber/solutions/263856/da-jia-jie-she-by-leetcode-solution/)
- 系列题目：
    - [213. 打家劫舍 II](/interview/algorithm/leetcode/213-house-robber-ii.md)

## AC 代码

复杂度分析

- 时间复杂度：O(n)，其中 n 是数组长度。只需要对数组遍历一次。
- 空间复杂度：O(1)。使用滚动数组，可以只存储前两间房屋的最高总金额，而不需要存储整个数组的结果，因此空间复杂度是 O(1)。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */

var rob = function (nums) {
    if (!nums || !nums.length) {
        return 0;
    }

    const len = nums.length;
    if (len === 1) {
        return nums[0];
    }

    const dp = [];

    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < len; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }

    return dp[len - 1];
};
```

上述方法使用了数组存储了每一个元素对应的结果。考虑到每间房屋的最高总金额只和该房屋的前两间房屋的最高总金额相关，因此可以使用滚动数组，在每个时刻只需要存储前两间房屋的最高总金额。

```js
var rob = function (nums) {
    if (!nums || !nums.length) {
        return 0;
    }

    const len = nums.length;
    if (len === 1) {
        return nums[0];
    }

    const dp = [];

    let first = nums[0];
    let second = Math.max(nums[0], nums[1]);

    for (let i = 2; i < len; i++) {
        const res = Math.max(second, first + nums[i]);
        first = second;
        second = res;
    }

    return second;
};
```
