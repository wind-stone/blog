# 74. 搜索二维矩阵[中等]

- 题目：[74. 搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/description/)
- 题解：[搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/solutions/688117/sou-suo-er-wei-ju-zhen-by-leetcode-solut-vxui/)
- 同系列题目
    - 待补充

## AC 代码

### 方式一：两次二分搜索（不推荐）

复杂度分析

- 时间复杂度：O(logm+logn)=O(logmn)，其中 m 和 n 分别是矩阵的行数和列数。
- 空间复杂度：O(1)。

```js
// 二分搜索相等的值
const binarySearchEqual = (array, target) => {
    let left = 0;
    let right = array.length - 1;

    if (target < array[left] || target > array[right]) {
        return -1;
    }

    while (left < right) {
        const middle = Math.floor((left + right) / 2);

        if (target < array[middle]) {
            right = middle - 1;
        } else if (target === array[middle]) {
            return middle;
        } else {
            left = middle + 1;
        }
    }

    if (target === array[left]) {
        return left;
    }
    return -1;
};

// 二分搜索行号
const binarySearchRow = (array, target) => {
    let left = 0;
    let right = array.length - 1;

    if (target < array[left]) {
        return -1;
    }

    while (left < right) {
        const middle = Math.floor((left + right) / 2);
        if (target < array[middle]) {
            right = middle - 1;
        } else {
            if (target < array[middle + 1]) {
                return middle;
            } else {
                left = middle;
            }
        }
    }
    return left;
};

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    const rowIndex = binarySearchRow(
        matrix.map(item => item[0]),
        target
    );
    // console.log('+++ rowIndex', rowIndex);

    if (rowIndex >= 0) {
        if (target === matrix[rowIndex][0]) {
            return true;
        }
        const result = binarySearchEqual(matrix[rowIndex], target);

        return result >= 0;
    }

    return false;
};
```

### 方式二：一次二分搜索

思路

若将矩阵每一行拼接在上一行的末尾，则会得到一个升序数组，我们可以在该数组上二分找到目标元素。
代码实现时，可以二分升序数组的下标，将其映射到原矩阵的行和列上。

复杂度分析

- 时间复杂度：O(logmn)，其中 m 和 n 分别是矩阵的行数和列数。
- 空间复杂度：O(1)。

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    const rowCount = matrix.length; // 行的数量
    const columnCount = matrix[0].length; // 列的数量

    let left = 0;
    let right = rowCount * columnCount - 1;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const middleValue = matrix[Math.floor(middle / columnCount)][middle % columnCount];

        if (target > middleValue) {
            left = middle + 1;
        } else if (target < middleValue) {
            right = middle - 1;
        } else {
            return true;
        }
    }
    return false;
};
```

### 其他方案见题解
