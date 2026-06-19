# 179. 最大数[中等]

- 题目：[179. 最大数](https://leetcode.cn/problems/largest-number/description/)
- 题解：[最大数-官方题解](https://leetcode.cn/problems/largest-number/solutions/715680/zui-da-shu-by-leetcode-solution-sid5/)
- 注意点：
    - 不能简单地比较最高位（次高位，以此类推）的大小，因为会存在数字位数不一样的情况，比如`4`和`42`，没办法确定这两个谁在前
    - 只有将两个数字拼接在一起，看哪个大，才能确定谁放在前面，比如比较`442`和`424`，才能确定将`4`放在前面

## AC 代码

```js
/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function (nums) {
    nums.sort((a, b) => {
        // 假设 a = 2, b = 21，则 ab 拼接为 221，ba 拼接为 212，ab 拼接更大，因此 a 要放在 b 前面
        // 因此比较函数应该返回负值，因此使用 return ba - ab
        const ab = String(a) + String(b);
        const ba = String(b) + String(a);

        return ba - ab;
    });

    return nums.join('');
};
```
