# 622. 设计循环队列

## 背景知识介绍-循环队列

循环队列（Circular Queue），又称为环形缓冲（Ring Buffer），是一种**逻辑上首尾相连**的线性数据结构。它通过数组来实现，其核心思想是将数组的最后一个位置与第一个位置连接起来，形成一个环。

### 1. 为什么需要循环队列？（解决普通数组队列的痛点）

在使用普通数组实现队列时，出队（Dequeue）操作通常需要移除数组的第一个元素。这会导致后面的所有元素都要向前移动一位，时间复杂度高达 $O(n)$。
为了避免元素移动，我们通常使用两个指针：

- **队头指针（Front）**：指向队列的第一个元素。
- **队尾指针（Rear）**：指向队列最后一个元素的下一个位置。

**普通数组的缺陷**：随着不断的入队和出队，`Rear` 指针会不断向后移动。即使数组前面因为出队空出了很多位置，当 `Rear` 达到数组的物理最大长度时，依然会提示“队列已满”，导致无法继续入队（这就是著名的**假溢出**问题）。

**循环队列的解决方案**：当 `Rear` 指针移动到数组末尾时，如果数组前面还有空位，`Rear` 会“绕回”到数组的起始位置（下标 0），从而完美利用空间。

### 2. 核心操作与指针移动公式

在循环队列中，指针的移动不再简单地 `+1` 或 `-1`，而是通过**取模运算（%）**来实现“绕环”：

- **入队（Enqueue）**：将元素放入 `Rear` 指向的位置，然后 `Rear = (Rear + 1) % maxSize`。
- **出队（Dequeue）**：取出 `Front` 指向的元素，然后 `Front = (Front + 1) % maxSize`。
- **计算队列长度**：`(Rear - Front + maxSize) % maxSize`。

### 3. 如何判断“队空”与“队满”？

这是循环队列最经典的问题。当 `Front == Rear` 时，既可能是队列为空，也可能是队列刚好被填满。通常有两种解决方案：

- **方案 A（牺牲一个存储单元，最常用）**：规定队列**最多只能存放 `maxSize - 1` 个元素**。
    - 队空条件：`Front == Rear`
    - 队满条件：`(Rear + 1) % maxSize == Front`
- **方案 B（引入计数器）**：额外维护一个 `size` 变量，记录当前队列中的元素个数。入队时 `size++`，出队时 `size--`。
    - 队空条件：`size == 0`
    - 队满条件：`size == maxSize`

### 4. 循环队列的典型应用场景

- **操作系统中的缓冲区**：例如键盘输入缓冲、音频/视频播放缓冲（生产者-消费者模型）。
- **网络数据包处理**：网卡接收到的数据包会先存入循环队列，再由 CPU 逐个处理，防止数据丢失。
- **固定大小的历史记录**：例如记录最近 100 条日志或最近 10 步操作，满了之后自动覆盖最旧的数据。
- **广度优先搜索（BFS）**：在图或树的遍历中，如果节点数量已知且固定，使用循环队列可以避免频繁创建和销毁对象，提升性能。

## AC 代码 - 方案 A

本实现是使用**方案 A（牺牲一个存储单元，最常用）**来实现的。

复杂度分析

- 时间复杂度：初始化和每项操作的时间复杂度均为 O(1)。
- 空间复杂度：O(k)，其中 k 为给定的队列元素数目。

```js
/**
 * @param {number} k
 */
var MyCircularQueue = function (k) {
    // k: 循环队列的容量，即队列中最多可以容纳的元素数量
    // capacity: k + 1，数组的长度，设置成 k + 1，其中最后一个元素不能使用，用来区分循环队列 为空 或 满了
    // front：队列首元素对应的数组的索引。
    // rear：队列尾元素对应的索引的下一个索引。
    this.capacity = k + 1;
    this.elements = new Array(this.capacity).fill(0); //
    this.front = this.rear = 0;
};

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function (value) {
    if (this.isFull()) {
        return false;
    }

    this.elements[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    return true;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function () {
    if (this.isEmpty()) {
        return false;
    }

    this.front = (this.front + 1) % this.capacity;

    return true;
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function () {
    if (this.isEmpty()) {
        return -1;
    }
    return this.elements[this.front];
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function () {
    if (this.isEmpty()) {
        return -1;
    }
    return this.elements[(this.rear - 1 + this.capacity) % this.capacity];
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function () {
    return this.front === this.rear;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function () {
    // 因为 elements 数组冗余了一个元素不用，所以判断循环队列的为空的条件如下
    return (this.rear + 1) % this.capacity === this.front;
};
```

## AC 代码 - 方案 B

```js
/**
 * @param {number} k
 */
var MyCircularQueue = function (k) {
    this.maxSize = k;
    this.elements = new Array(k).fill(0);
    this.front = this.rear = 0;
    this.size = 0;
};

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function (value) {
    if (this.isFull()) {
        return false;
    }

    this.elements[this.rear] = value;
    this.rear = (this.rear + 1) % this.maxSize;
    this.size++;
    return true;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function () {
    if (this.isEmpty()) {
        return false;
    }

    this.front = (this.front + 1) % this.maxSize;
    this.size--;

    return true;
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function () {
    if (this.isEmpty()) {
        return -1;
    }
    return this.elements[this.front];
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function () {
    if (this.isEmpty()) {
        return -1;
    }
    return this.elements[(this.rear - 1 + this.maxSize) % this.maxSize];
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function () {
    return this.size === 0;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function () {
    return this.size === this.maxSize;
};
```
