# 394. 字符串解码[中等]

- 题目：[394. 字符串解码](https://leetcode.cn/problems/decode-string/description/)
- 题解：[颜色分类](https://leetcode.cn/problems/sort-colors/solutions/437968/yan-se-fen-lei-by-leetcode-solution/)

## AC 代码

### 方法一：栈操作

遇到非 `]` 都入栈，遇到 `]` 处理最后的 `[xxx]` 里的字符串，处理完后再入栈

```js
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
    const stack = [];
    const len = s.length;

    const isNumber = s => {
        return /^[0-9]$/.test(s);
    };

    const decode = () => {
        console.log('新一轮 decode ——————————————————————————————————————');
        console.log('当前 stack', stack.join(''));

        let str = '';
        let char = '';
        while ((char = stack.pop())) {
            if (char !== '[') {
                str = char + str;
            } else {
                break;
            }
        }

        console.log('str', str);

        let timesStr = '';

        while ((char = stack.pop())) {
            if (isNumber(char)) {
                timesStr = char + timesStr;

                if (!stack.length) {
                    break;
                }
            } else {
                stack.push(char);
                break;
            }
        }

        const times = +timesStr;

        console.log('times', times);

        let expr = new Array(times).fill(str).join('');

        console.log('expr', expr);

        stack.push(expr);
    };

    for (let i = 0; i < len; i++) {
        if (s[i] !== ']') {
            stack.push(s[i]);
        } else {
            decode();
        }
    }

    return stack.join('');
};
```
