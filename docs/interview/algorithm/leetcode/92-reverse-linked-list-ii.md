# 92. 反转链表 II[中等]

- 题目：[92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/description/)
- 题解：[反转链表](https://leetcode.cn/problems/reverse-linked-list/solutions/551596/fan-zhuan-lian-biao-by-leetcode-solution-d1k2/)
- 系列题目
    - [206. 反转链表](/interview/algorithm/leetcode/206-reverse-linked-list.md)

## AC 代码

### 方式一：穿针引线

复杂度分析

- 时间复杂度：O(N)，其中 N 是链表总节点数。最坏情况下，需要遍历整个链表。
- 空间复杂度：O(1)。只使用到常数个变量。

这个方法需要遍历两次 left -> right，第一次是确定 left/right 节点，第二次是逆转 left -> right。

```js
function ListNode(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
}

var reverseList = function (head) {
    if (!head || !head.next) {
        return head;
    }

    let newHead = reverseList(head.next);

    head.next.next = head;
    head.next = null;

    return newHead;
};

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
    // 因为头节点有可能发生变化，使用虚拟头节点可以避免复杂的分类讨论
    const virtualHead = new ListNode(-1, head);

    // 第 1 步：从虚拟头节点走 left - 1 步，来到 left 节点的前一个节点
    // 建议写在 for 循环里，语义清晰
    let leftBeforeNode = virtualHead; // left 的前一个节点

    // 确定 leftBeforeNode
    for (let i = 0; i < left - 1; i++) {
        leftBeforeNode = leftBeforeNode.next;
    }

    const leftNode = leftBeforeNode.next; // left 节点

    // 第 2 步：从 leftNode 再走 right - left 步，来到 right 节点
    let rightNode = leftNode;
    for (let i = 0; i < right - left; i++) {
        rightNode = rightNode.next;
    }

    // 第 3 步：确定 right 节点的下一个节点，方便逆转后拼接
    let rightNextNode = rightNode.next;

    // 第 4 步：切断出一个子链表（截取链表）
    leftBeforeNode.next = null;
    rightNode.next = null;

    // 第 5 步：同第 206 题，反转链表的子区间
    reverseList(leftNode);

    // 第 6 步：接回到原来的链表中
    leftBeforeNode.next = rightNode;
    leftNode.next = rightNextNode;

    return virtualHead.next;
};
```

### 方式二：一次遍历「穿针引线」

复杂度分析：

- 时间复杂度：O(N)，其中 N 是链表总节点数。最多只遍历了链表一次，就完成了反转。
- 空间复杂度：O(1)。只使用到常数个变量。

这个方法只遍历了一次。

```js
function ListNode(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
}

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
    // 因为头节点有可能发生变化，使用虚拟头节点可以避免复杂的分类讨论
    const virtualHead = new ListNode(-1, head);

    // 第 1 步：从虚拟头节点走 left - 1 步，来到 left 节点的前一个节点
    // 建议写在 for 循环里，语义清晰
    let leftBeforeNode = virtualHead; // left 的前一个节点

    // 确定 leftBeforeNode
    for (let i = 0; i < left - 1; i++) {
        leftBeforeNode = leftBeforeNode.next;
    }

    let cur = leftBeforeNode.next;

    for (let i = 0; i < right - left; i++) {
        const next = cur.next;
        cur.next = next.next;
        // 注意：这里不能写成 next.next = cur; 因为下一步中，leftBeforeNode.next 会改变，不等同于 cur
        next.next = leftBeforeNode.next;
        leftBeforeNode.next = next;
    }

    return virtualHead.next;
};
```
