# 130. 被围绕的区域[中等]

- 题目：[130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/description/)
- 题解：[被围绕的区域](https://leetcode.cn/problems/surrounded-regions/solutions/369110/bei-wei-rao-de-qu-yu-by-leetcode-solution/)

思路：深度优先搜索，或广度优先搜索。

## AC 代码

复杂度分析

- 时间复杂度：O(m×n)，其中 m 和 n 分别为矩阵的行数和列数。深度优先搜索过程中，每一个点至多只会被标记一次。
- 空间复杂度：O(m×n)，其中 m 和 n 分别为矩阵的行数和列数。主要为深度优先搜索的栈的开销。

```js
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
    let rowCount = board.length;
    let columnCount = board[0].length;

    if (rowCount < 2 || columnCount < 2) {
        return board;
    }

    const O = 'O';
    const X = 'X';
    const A = 'A'; // 原本是 O，但是有与它连通的 O 在边界上

    // 将原 O 设置成 A
    const dfs = (i, j) => {
        // 边界判断
        if (i < 0 || i >= rowCount || j < 0 || j >= columnCount) {
            return;
        }

        if (board[i][j] !== O) {
            return;
        }

        board[i][j] = A;

        dfs(i - 1, j);
        dfs(i + 1, j);
        dfs(i, j - 1);
        dfs(i, j + 1);
    };

    // 处理第一列和最后一列的元素
    for (let i = 0; i < rowCount; i++) {
        dfs(i, 0);
        dfs(i, columnCount - 1);
    }

    // 处理第一行和最后一行的元素
    for (let i = 1; i < columnCount - 1; i++) {
        dfs(0, i);
        dfs(rowCount - 1, i);
    }

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < columnCount; j++) {
            if (board[i][j] === A) {
                board[i][j] = O;
            } else if (board[i][j] === O) {
                board[i][j] = X;
            }
        }
    }
};

const input = [
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'X'],
    ['X', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'X'],
];
solve(input);
console.log(input);
```
