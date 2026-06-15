# LeetCode - 将数组分成和相等的三个部分

## 1 【中级-LeetCode Easy】[将数组分成和相等的三个部分](https://leetcode.cn/problems/partition-array-into-three-parts-with-equal-sum/)

给你一个整数数组 arr，只有可以将其划分为三个和相等的 非空 部分时才返回 true，否则返回 false。

形式上，如果可以找出索引 i + 1 < j 且满足 (arr[0] + arr[1] + ... + arr[i] == arr[i + 1] + arr[i + 2] + ... + arr[j - 1] == arr[j] + arr[j + 1] + ... + arr[arr.length - 1]) 就可以将数组三等分。

```js
示例 1：
输入：arr = [0,2,1,-6,6,-7,9,1,2,0,1]
输出：true
解释：0 + 2 + 1 = -6 + 6 - 7 + 9 + 1 = 2 + 0 + 1

示例 2：
输入：arr = [0,2,1,-6,6,7,9,-1,2,0,1]
输出：false
示例 3：

输入：arr = [3,3,6,5,-2,2,5,1,-9,4]
输出：true
解释：3 + 3 = 6 = 5 - 2 + 2 + 5 + 1 - 9 + 4
```

答案：[https://leetcode.cn/problems/partition-array-into-three-parts-with-equal-sum/solution/1013-jiang-shu-zu-fen-cheng-he-xiang-deng-de-san-2/](https://leetcode.cn/problems/partition-array-into-three-parts-with-equal-sum/solution/1013-jiang-shu-zu-fen-cheng-he-xiang-deng-de-san-2/)

## 2 【中级】划分数组

给定一个长度为 n (n <= 10^6) 的数组，包含 n 个整数 a[i] (-10^9 <= a[i] <= 10^9)。将数组的所有元素分成三个连续的非空子数组，使得每个部分的元素之和相等，求划分的方案数。

```text
输入
[1, 2, 3, 0, 3]
[0, 1, -1, 0]
[1, 1]



输出
2
1
0
```

样例解释

样例 1 可以划分为 [1, 2] [3] [0, 3] 或 [1, 2] [3, 0] [3]；

样例 2 只可能划分为 [0] [1, -1] [0]；

样例 3 无法进行合法的划分。

参考答案

```js
let sums = [0];
for (let i = 1; i < n; ++i) {
    sums[i] = sums[i - 1] + a[i - 1];
}
let count = 0;
let result = 0;

// 总和不是 3 的倍数，返回 0

const twoThirds = 总和的三分之二
const oneThird = 总和的三分之一

for (let i = 1; i < n; ++i) {
    // 三分之二处
    if (sums[i] === twoThirds) {
        result += count;
    }
    // 三分之一处
    if (sums[i] === oneThird) {
        ++count;
    }
}
return result;
```

- B - O(n^2)，暴力枚举划分点 O(n^2)，利用前缀和求区间和 O(1)，要求边界条件实现完美
- A - O(nlogn)，暴力枚举一个划分点 O(n)，在前缀和序列中二分查找另一个划分点的范围
- S - O(n)，线性扫描，利用前缀和快速统计，思路类似下面的代码
