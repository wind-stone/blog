# 【初级】给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效

有效字符串需满足：

- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。

```text
输入：s = "()[]{}"
输出：true

输入：s = "([)]"
输出：false

输入：s = "([])"
输出：true
```

```js
var isValid = function(s) {
    const stack = []

    for (let i = 0, len = s.length; i < len; i++) {
        const lastCh = stack[stack.length - 1] || '';
        const pair = lastCh + s[i];

        // ()[]{}
        if (pair === '()' || pair === '[]' || pair === '{}') {
            stack.pop();
        } else {
            stack.push(s[i])
        }
    }

    if (!stack.length) {
        return true;
    }
    return false;
};
```
