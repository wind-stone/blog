# 11. 盛最多水的容器[中等]

- 题目：[11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/description/)
- 题解：[盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/solutions/207215/sheng-zui-duo-shui-de-rong-qi-by-leetcode-solution/)

## AC 代码

### 方法一：双指针（推荐）

具体实现方式看题解，题解总结（一句话概括）：我们 left++ 和 right-- 都是为了尝试取到更多的水，如果短的板不动的话，取到的水永远不会比上次多。

复杂度分析

- 时间复杂度：O(N)，双指针总计最多遍历整个数组一次。
- 空间复杂度：O(1)，只需要额外的常数级别的空间。

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
    let max = 0;
    let left = 0;
    let right = height.length - 1;

    while (left < right) {
        const res = Math.min(height[left], height[right]) * (right - left);
        max = Math.max(max, res);

        if (height[left] <= height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return max;
};
```

### 暴力求解

复杂度分析

- 时间复杂度：O(N<sup>2</sup>)。
- 空间复杂度：O(1)，只需要额外的常数级别的空间。

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
    let max = 0;
    let len = height.length;

    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            const value = Math.min(height[i], height[j]);

            max = Math.max(max, value * (j - i));
        }
    }

    return max;
};
```
