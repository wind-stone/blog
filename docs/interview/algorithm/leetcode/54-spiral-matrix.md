# 54. 螺旋矩阵[中等]

- 题目：[54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/description/)
- 题解：[螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/solutions/275393/luo-xuan-ju-zhen-by-leetcode-solution/)

## AC 代码

### 方法一：模拟【推荐】

跟方法二本质上是一样的，只是在换方向时采用了更巧妙的方法。

```js
var spiralOrder = function (matrix) {
    if (!matrix.length || !matrix[0].length) {
        return [];
    }
    const rows = matrix.length,
        columns = matrix[0].length;
    const visited = new Array(rows).fill(0).map(() => new Array(columns).fill(false));
    const total = rows * columns;
    const order = new Array(total).fill(0);

    let directionIndex = 0,
        row = 0,
        column = 0;
    const directions = [
        [0, 1], // 向右
        [1, 0], // 向下
        [0, -1], // 向左
        [-1, 0], // 向上
    ];
    for (let i = 0; i < total; i++) {
        order[i] = matrix[row][column];
        visited[row][column] = true;

        // 下一个元素的 i, j
        const nextRow = row + directions[directionIndex][0],
            nextColumn = column + directions[directionIndex][1];
        if (
            !(
                0 <= nextRow &&
                nextRow < rows &&
                0 <= nextColumn &&
                nextColumn < columns &&
                !visited[nextRow][nextColumn]
            )
        ) {
            // 如果元素下标越界，或者已经访问过，更换方向
            directionIndex = (directionIndex + 1) % 4;
        }
        row += directions[directionIndex][0];
        column += directions[directionIndex][1];
    }
    return order;
};
```

### 方法二：按层模拟

先遍历最外一圈，再依次向内遍历

```js
var spiralOrder = function (matrix) {
    if (!matrix.length || !matrix[0].length) {
        return [];
    }

    const rows = matrix.length,
        columns = matrix[0].length;
    const order = [];
    let left = 0, // 左侧可用边界
        right = columns - 1, // 右侧可用边界
        top = 0, // 上侧可用边界
        bottom = rows - 1; // 下侧可用边界
    while (left <= right && top <= bottom) {
        for (let column = left; column <= right; column++) {
            // 向右遍历
            order.push(matrix[top][column]);
        }
        for (let row = top + 1; row <= bottom; row++) {
            // 向下遍历
            order.push(matrix[row][right]);
        }

        if (left < right && top < bottom) {
            for (let column = right - 1; column > left; column--) {
                // 向左遍历
                order.push(matrix[bottom][column]);
            }
            for (let row = bottom; row > top; row--) {
                // 向上遍历
                order.push(matrix[row][left]);
            }
        }
        [left, right, top, bottom] = [left + 1, right - 1, top + 1, bottom - 1];
    }
    return order;
};
```

### 方法二：暴力求解

自己写的

```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
    if (matrix.length <= 1) {
        // 单行
        return matrix[0] || [];
    } else if (matrix[0].length === 1) {
        // 单列
        return matrix.map(row => row[0]);
    }

    let direct = 'right';
    let i = 0;
    let j = 0;
    let rowCount = matrix.length;
    let columnCount = matrix[0].length;
    const res = [];

    let rowStart = 0; // 可用的行，开始下标
    let rowEnd = rowCount - 1; // 可用的行，结束下标
    let columnStart = 0; // 可用的列，开始下标
    let colunmEnd = columnCount - 1; // // 可用的列，结束下标

    while (direct) {
        if (matrix[i][j] === undefined || i < 0 || i >= rowCount || j < 0 || j >= columnCount) {
            console.log('break', i, j);
            break;
        }

        res.push(matrix[i][j]);
        matrix[i][j] = undefined;

        if (direct === 'right') {
            // 向右移动
            if (j < colunmEnd) {
                // 未移动到最后一列，继续向右
                j++;
            } else {
                // 移动到最后一列，向下
                i++;
                rowStart++;
                direct = 'down';
            }
        } else if (direct === 'down') {
            // 向下移动
            if (i < rowEnd) {
                // 未移动到最后一行，继续向下
                i++;
            } else {
                j--;
                colunmEnd--;
                direct = 'left';
            }
        } else if (direct === 'left') {
            // 向左移动
            if (j > columnStart) {
                // 未移动到第一列，继续向左
                j--;
            } else {
                // 移动到第一列，向上
                i--;
                rowEnd--;
                direct = 'up';
            }
        } else if (direct === 'up') {
            // 向上移动
            if (i > rowStart) {
                // 未移动到第一行，继续向上
                i--;
            } else {
                j++;
                columnStart++;
                direct = 'right';
            }
        }
    }

    return res;
};
```
