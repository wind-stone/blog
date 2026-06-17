# 114. 二叉树展开为链表

- 题目：[114. 二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/description/)
- 题解：别看题解了，直接看下面的代码吧

## AC 代码

```js
var flatten = function (root) {
    // 该函数返回以 node 为根的子树展开后的【最后一个节点】
    function dfs(node) {
        if (!node) return null;

        // 1. 记录原始的左右子树
        let leftChild = node.left;
        let rightChild = node.right;

        // 2. 断开左指针（题目要求）
        node.left = null;

        // 3. 递归处理左右子树，获取它们展开后的尾节点
        let leftTail = leftChild ? dfs(leftChild) : null;
        let rightTail = rightChild ? dfs(rightChild) : null;

        // 4. 核心拼接逻辑
        if (leftChild) {
            // 如果有左子树，将左子树挂到右边
            node.right = leftChild;

            // 如果还有原右子树，将其拼接到左子树的尾部
            if (rightChild) {
                leftTail.right = rightChild;
            }
        } else if (rightChild) {
            // 如果没有左子树，但有右子树，直接把右子树挂在右边
            node.right = rightChild;
        }
        // 如果既没有左也没有右，什么都不用做（叶子节点）

        // 5. 返回当前整棵树展开后的【最后一个节点】
        // 优先级：右子树尾节点 > 左子树尾节点 > 自身（叶子节点）
        if (rightTail) return rightTail;
        if (leftTail) return leftTail;
        return node;
    }

    dfs(root);
};
```
