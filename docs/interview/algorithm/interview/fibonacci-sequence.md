# 斐波那契数列

[[toc]]

斐波那契数列的定义如下：

```js
F(0) = 0,
F(1) = 1,
F(N) = F(N - 1) + F(N - 2), 其中 N > 1
```

斐波那契数列由`0`和`1`开始，之后的斐波那契数就是由之前的两数相加而得出。

## 递归 + 缓存

```js
const cache = {};

function fibonacci(n) {
    if (n < 2) {
        return n;
    }

    // 优先查看缓存里是否有数据
    if (cache[n]) {
        return cache[n];
    }

    // 计算结果，并放入缓存
    const result = fibonacci(n - 1) + fibonacci(n - 2);
    cache[n] = result;

    return result;
}
```

复杂度分析:

- 时间复杂度：O(n)
- 空间复杂度：O(n)

## 动态规划

```js
var fib = function(n) {
    const MOD = 1000000007; // 为防止数字过大，需要进行取模
    if (n < 2) {
        return n;
    }
    let p = 0, q = 0, r = 1;
    for (let i = 2; i <= n; ++i) {
        // p 表示 fib(n-2)
        // q 表示 fib(n-1)
        // r 表示 fib(n)
        p = q;
        q = r;
        r = (p + q) % MOD;
    }
    return r;
};
```

复杂度分析:

- 时间复杂度：O(n)
- 空间复杂度：O(1)

解法详见: [LeetCode - 斐波那契数列 - 官方解答](https://leetcode-cn.com/problems/fei-bo-na-qi-shu-lie-lcof/solution/fei-bo-na-qi-shu-lie-by-leetcode-solutio-hbss/)

## 矩阵快速幂

复杂度分析

- 时间复杂度：O(logn)
- 空间复杂度：O(1)

涉及到线性代数，实在看不懂，了解有这么个解法就行。详见：[LeetCode - 斐波那契数列 - 官方解答](https://leetcode-cn.com/problems/fei-bo-na-qi-shu-lie-lcof/solution/fei-bo-na-qi-shu-lie-by-leetcode-solutio-hbss/)
