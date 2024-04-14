# 【中级】求二叉树所有节点个数

二叉树找出树中所有节点的个数，节点结构如图代码所示，补完countsNodes部分

```js
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

function countsNodes(root) {

}
```

参考答案：

1、递归

```js
function countsNodes(root) {
    if (!root) {
        return 0;
    }
    return 1 + countsNodes(root.left) + countsNodes(root.right);
}

```

2、迭代

```js
function countsNodes(root) {
    let sum = 0;
    const arr = [root];

    while (arr.length) {
        const node = arr.shift();
        if (node.left) {
            arr.push(node.left);
        }

        if (node.right) {
            arr.push(node.right);
        }
        sum++;
    }

    return sum;
}
```

或者

```js
function countsNodes(root) {
    let sum = 0;
    const arr = [root];

    for (let i = 0; i < arr.length; i++) {
        const node = arr[i];
        if (node) {
            sum++;
            if (node.left) {
                arr.push(node.left);
            }
            if (node.right) {
                arr.push(node.right);
            }
        } else {
            break;
        }
    }

    return sum;
}
```
