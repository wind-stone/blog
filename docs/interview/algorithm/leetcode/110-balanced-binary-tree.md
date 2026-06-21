# 110. 平衡二叉树[简单]

- 题目：[110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/description/)
- 题解：[平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/solutions/377216/ping-heng-er-cha-shu-by-leetcode-solution/)

## AC 代码

如果是平衡二叉树，需要满足以下两个条件：

1. 节点的左子树的深度与右子树的深度的差不能超过 1
2. 左子树是平衡的，右子树也是平衡的

### 方法一：自顶向下的递归

#### 写法一

```js
const getDepth = node => {
    if (!node) {
        return 0;
    }
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
};

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
 * @return {boolean}
 */
var isBalanced = function (root) {
    if (!root) {
        return true;
    }

    return Math.abs(getDepth(root.left) - getDepth(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right);
};
```

#### 写法二

这种写法性价较差，因为它会计算所有节点的深度。

```js
var isBalanced = function (root) {
    if (!root) {
        return true;
    }

    let balanced = true;

    const getDepth = node => {
        if (!node) {
            return 0;
        }

        if (!node.left && !node.right) {
            return 1;
        }

        const leftDepth = getDepth(node.left);
        const rightDepth = getDepth(node.right);

        if (Math.abs(leftDepth - rightDepth) > 1) {
            balanced = false;
        }

        const depth = 1 + Math.max(leftDepth, rightDepth);

        return depth;
    };

    return Math.abs(getDepth(root.left) - getDepth(root.right)) <= 1 && balanced;
};
```

#### 写法三（推荐）

这种写法性能是最好的，在 getDepth 里不仅计算了节点的深度，同时还判断了节点左右子树是否是平衡二叉树。

```js
const getDepth = node => {
    if (!node) {
        return 0;
    }

    const leftDepth = getDepth(node.left);

    if (leftDepth === -1) {
        // 左子树不是平衡二叉树
        return -1;
    }

    const rightDepth = getDepth(node.right);

    if (rightDepth === -1) {
        // 右子树不是平衡二叉树
        return -1;
    }

    if (Math.abs(leftDepth - rightDepth) > 1) {
        return -1;
    }
    return 1 + Math.max(leftDepth, rightDepth);
};

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
 * @return {boolean}
 */
var isBalanced = function (root) {
    if (!root) {
        return true;
    }

    return getDepth(root) !== -1;
};
```
