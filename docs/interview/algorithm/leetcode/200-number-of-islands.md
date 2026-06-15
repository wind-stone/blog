# 200. 岛屿数量

- 题目：[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/description/)
- 题解：[岛屿类问题的通用解法、DFS 遍历框架](https://leetcode.cn/problems/number-of-islands/solutions/211211/dao-yu-lei-wen-ti-de-tong-yong-jie-fa-dfs-bian-li-/)
- 同系列题目
    - 待补充

## AC 代码

```js
const one = '1'; // 岛屿
const handled = '2'; // 已处理过

// 判断坐标 (r, c) 是否在网格中
const inArea = (grid, r, c) => {
    return 0 <= r && r < grid.length && 0 <= c && c < grid[r].length;
};

// 处理相邻岛屿
const handleIslandNeighbors = (grid, r, c) => {
    if (!inArea(grid, r, c)) {
        return;
    }

    if (grid[r][c] !== one) {
        return;
    }

    // 标记为已处理过
    grid[r][c] = handled;

    // 上
    handleIslandNeighbors(grid, r - 1, c);

    // 下
    handleIslandNeighbors(grid, r + 1, c);

    // 左
    handleIslandNeighbors(grid, r, c - 1);

    // 右
    handleIslandNeighbors(grid, r, c + 1);
};

const numIslands = grid => {
    let count = 0;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === one) {
                count++;
                handleIslandNeighbors(grid, r, c);
            }
        }
    }

    console.log('count', count);
    return count;
};

numIslands([
    ['1', '1', '1', '1', '0'],
    ['1', '1', '0', '1', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '0', '0', '0'],
]);

numIslands([
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
]);
```
