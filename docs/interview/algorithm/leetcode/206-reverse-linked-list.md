# 206. 反转链表[简单]

- 题目：[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/description/)
- 题解：[反转链表](https://leetcode.cn/problems/reverse-linked-list/solutions/551596/fan-zhuan-lian-biao-by-leetcode-solution-d1k2/)
- 系列题目
    - [92. 反转链表 II](/interview/algorithm/leetcode/92-reverse-linked-list-ii.md)

## AC 代码

### 方法一：迭代

复杂度分析

- 时间复杂度：O(n)，其中 n 是链表的长度。需要遍历链表一次。
- 空间复杂度：O(1)。

```js
var reverseList = function (head) {
    let pre = null;
    let cur = head;
    while (cur) {
        const next = cur.next; // 先记录下当前节点的下一个节点，作为下次 while 的 cur
        cur.next = pre; // 当前节点指向它上一个节点，此时已经完成 cur 元素的逆转

        // 准备下一次循环的 pre 和 cur，方便处理下一个节点
        pre = cur;
        cur = next;
    }
    return pre;
};
```

### 方法二：递归

复杂度分析

- 时间复杂度：O(n)，其中 n 是链表的长度。需要对链表的每个节点进行反转操作。
- 空间复杂度：O(n)，其中 n 是链表的长度。空间复杂度主要取决于递归调用的栈空间，最多为 n 层。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    if (!head || !head.next) {
        return head;
    }

    const newHead = reverseList(head.next);

    // 比如输入是 1 2 3 4，经过一轮递归后，当前 head 是 2，尽管 2 之后的 3、4 已经翻转了（此时有：1 -> 2 -> 3 <- 4）
    // 但 2 -> 3 的指向还没有变。（这是重点）
    // 此时 head.next 是 3，所以 head.next.next = head 后，就变成了 1 <-> 2 <- 3 <- 4
    head.next.next = head;

    // 需要将当前 2 的指向清空，即变成了 1 -> 2 <- 3 <- 4
    head.next = null;

    return newHead;
};
```
