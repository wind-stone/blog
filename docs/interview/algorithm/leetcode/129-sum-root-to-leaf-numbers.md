# 129. 求根节点到叶节点数字之和[中等]

- 题目：[129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/description/)
- 题解：[求根到叶子节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/solutions/464666/qiu-gen-dao-xie-zi-jie-dian-shu-zi-zhi-he-by-leetc/)

## AC 代码

### 方法一：深度优先搜索

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumNumbers = function (root) {
    const dfs = (node, preSum) => {
        if (!node) {
            return 0;
        }

        const sum = preSum * 10 + node.val;

        // 如果是叶子节点
        if (!node.left && !node.right) {
            return sum;
        }

        // 非叶子节点
        return dfs(node.left, sum) + dfs(node.right, sum);
    };

    return dfs(root, 0);
};
```

### 方法二

基本上跟方法一本质上一样。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumNumbers = function (root) {
    let sum = 0;
    const dfs = (node, currentString) => {
        if (!node) {
            return;
        }

        let nodeSelfString = String(node.val);
        let nodeString = currentString + nodeSelfString;

        if (!node.left && !node.right) {
            sum += Number(nodeString);
        }

        if (node.left) {
            dfs(node.left, nodeString);
        }

        if (node.right) {
            dfs(node.right, nodeString);
        }
    };

    dfs(root, '');

    return sum;
};
```
