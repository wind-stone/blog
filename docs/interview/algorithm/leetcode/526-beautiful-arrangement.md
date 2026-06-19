# 526. 优美的排列[中等]

- 题目：[526. 优美的排列](https://leetcode.cn/problems/beautiful-arrangement/description/)
- 题解：[优美的排列](https://leetcode.cn/problems/beautiful-arrangement/solutions/937821/you-mei-de-pai-lie-by-leetcode-solution-vea2/)

## AC 代码

复杂度分析

时间复杂度：O(n!)，其中 n 为排列的长度。预处理 match 数组的时间复杂度为 O(n<sup>2</sup>)，回溯的时间复杂度为 O(n!)，因此总时间复杂度为 O(n<sup>2</sup>+n!)=O(n!)。

空间复杂度：O(n<sup>2</sup>)，我们需要 O(n<sup>2</sup>) 的空间保存 match 数组，递归的栈空间大小为 O(n)，因此总空间复杂度为 O(n<sup>2</sup>+n)=O(n<sup>2</sup>)。

```js
/**
 * @param {number} n
 * @return {number}
 */
var countArrangement = function (n) {
    const visited = new Array(n + 1).fill(false);
    const match = new Array(n + 1);
    let count = 0;

    for (let i = 0; i <= n; i++) {
        match[i] = [];
    }

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (i % j === 0 || j % i === 0) {
                match[i].push(j);
            }
        }
    }

    const backtrack = (index, n) => {
        if (index === n + 1) {
            // 说明 1 到 n 的所有位置都已经成功放置了合法的数字，找到了一个完整的优美排列，计数器 num 加 1 并返回。
            count++;
            return;
        }

        for (const x of match[index]) {
            if (!visited[x]) {
                // 该 index 位置，使用了 x 这个数字
                visited[x] = true;

                // 递归进入下一个位置
                backtrack(index + 1, n);

                // 从下一个位置退出后，将 x 置为未使用，继续尝试 match[index] 里的其他数字
                visited[x] = false;
            }
        }
    };

    backtrack(1, n);
    return count;
};
```
