# 213. 打家劫舍 II[中等]

- 题目：[213. 打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/description/)
- 题解：[打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/solutions/722767/da-jia-jie-she-ii-by-leetcode-solution-bwja/)
- 系列题目：
    - [打家劫舍](/interview/algorithm/leetcode/198-house-robber.md)

## AC 代码

```js
var rob = function (nums) {
    const length = nums.length;
    if (length === 1) {
        return nums[0];
    } else if (length === 2) {
        return Math.max(nums[0], nums[1]);
    }
    return Math.max(robRange(nums, 0, length - 2), robRange(nums, 1, length - 1));
};

const robRange = (nums, start, end) => {
    let first = nums[start],
        second = Math.max(nums[start], nums[start + 1]);
    for (let i = start + 2; i <= end; i++) {
        const temp = second;
        second = Math.max(first + nums[i], second);
        first = temp;
    }
    return second;
};
```
