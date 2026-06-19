# 695. 岛屿的最大面积[中等]

- 题目：[695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/description/)
- 题解：[岛屿类问题的通用解法、DFS 遍历框架](https://leetcode.cn/problems/number-of-islands/solutions/211211/dao-yu-lei-wen-ti-de-tong-yong-jie-fa-dfs-bian-li-/)
- 系列题目
    - [200. 岛屿数量](/interview/algorithm/leetcode/200-number-of-islands.md)

## AC 代码

复杂度分析

- 时间复杂度：O(m×n)。其中 m 是给定网格中的行数，n 是列数。我们访问每个网格最多一次。
- 空间复杂度：O(m×n)，递归的深度最大可能是整个网格的大小，因此最大可能使用 O(m×n) 的栈空间。

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid) {
    const rowCounts = grid.length;
    const columnCounts = grid[0].length;
    const ISLAND = 1;
    const CALCULATED = 2;
    let maxArea = 0;

    const calculateIslandArea = (i, j) => {
        // 越界判断
        if (i < 0 || i >= rowCounts || j < 0 || j >= columnCounts) {
            return 0;
        }

        // 不是岛屿
        if (grid[i][j] !== ISLAND) {
            return 0;
        }

        grid[i][j] = CALCULATED;

        return (
            1 +
            // 上
            calculateIslandArea(i - 1, j) +
            // 下
            calculateIslandArea(i + 1, j) +
            // 左
            calculateIslandArea(i, j - 1) +
            // 右
            calculateIslandArea(i, j + 1)
        );
    };

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === ISLAND) {
                maxArea = Math.max(maxArea, calculateIslandArea(i, j));
            }
        }
    }

    return maxArea;
};
```
