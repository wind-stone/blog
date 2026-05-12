# 判断字符串里的括号是否闭合

给定一个字符串，请实现一个函数，判断其中的括号（圆括号、方括号、花括号）是否闭合。

```js
function isBracketsBalanced(str) {}

// 测试用例
console.log(isBracketsBalanced('()')); // true
console.log(isBracketsBalanced('()[]{}')); // true
console.log(isBracketsBalanced('({[]})')); // true
console.log(isBracketsBalanced('(]')); // false
console.log(isBracketsBalanced('([)]')); // false
console.log(isBracketsBalanced('((()))')); // true
console.log(isBracketsBalanced('((())')); // false
console.log(isBracketsBalanced('')); // true
console.log(isBracketsBalanced('hello (world)!')); // true
console.log(isBracketsBalanced('({[})')); // false
```

## 参考答案

```js
function isBracketsBalanced(str) {
    // 使用 Map 存储括号的对应关系
    const bracketMap = new Map([
        [')', '('],
        [']', '['],
        ['}', '{'],
    ]);

    // 左括号集合，用于快速判断
    const leftBrackets = new Set(['(', '[', '{']);

    const stack = [];

    for (const char of str) {
        if (leftBrackets.has(char)) {
            // 遇到左括号，入栈
            stack.push(char);
        } else if (bracketMap.has(char)) {
            // 遇到右括号
            if (stack.length === 0) {
                // 栈为空，没有对应的左括号
                return false;
            }

            const top = stack.pop();
            if (top !== bracketMap.get(char)) {
                // 括号类型不匹配
                return false;
            }
        }
        // 其他字符忽略
    }

    // 栈为空说明所有括号都匹配
    return stack.length === 0;
}
```

复杂度分析

- 时间复杂度：O(n)，其中 n 是字符串的长度，只需要遍历一次
- 空间复杂度：O(n)，最坏情况下栈中可能存储所有左括号

注意这里 `Map` 的用法：

```js
const kvArray = [
    ['key1', 'value1'],
    ['key2', 'value2'],
];

// 使用常规的 Map 构造函数可以将一个二维的键值对数组转换成一个 Map 对象
const myMap = new Map(kvArray);

console.log(myMap.get('key1')); // "value1"
```
