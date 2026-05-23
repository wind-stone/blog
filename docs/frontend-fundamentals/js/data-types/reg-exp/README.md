# 正则表达式

[[toc]]

## 正则方法

### 字符串的正则方法

#### `String.prototype.match(reg)`

- 参数
  - regexp：正则表达式（如果参数不是正则表达式，通过`RegExp()`构造函数将其转换成正则表达式）
- 返回
  - 无匹配：返回`null`
  - 正则表达式没有全局修饰符`g`，则不执行全局检索，返回数组`result`
    - `result[0]`：匹配的字符串
    - `result[1..n]`：正则表达式中用圆括号括起来的子表达式1...n
    - `result.index`：发生匹配的字符在 str 中的开始位置
    - `result.input`：所检索的字符串
  - 正则表达式有全局修饰符`g`，则执行全局检索，返回有匹配结果组成的数组 result
    - `result[0..n]`：匹配结果1..n+1

#### `String.prototype.search(reg)`

- 参数
  - reg：正则表达式（如果参数不是正则表达式，通过`RegExp()`构造函数将其转换成正则表达式）
- 返回
  - 无匹配：返回`-1`
  - 有匹配，返回第一个与之匹配的字串的起始位置（不支持全局搜索，会忽略全局修饰符 g）

#### `String.prototype.replace(reg, str)`

- 功能：执行检索和替换操作
- 在替换字符串（第二个参数）中出现了 $ 加数字，代表正则表达式中与圆括号相匹配的字表达式
- 正则表达式中是否有全局修饰符 g
  - 有：替换所有匹配的字符串
  - 没有：只替换匹配的第一个字符串

#### `String.prototype.splice(reg)`

- 参数
  - reg：正则表达式
- 返回
  - 以 reg 拆分成的各个子串的数组

### 正则表达式的字符串方法

#### `RegExp.prototype.test(str)`

执行检索，查看正则表达式与指定的字符串是否匹配，返回`true`或`false`。

如果正则表达式设置了全局标志`g`，`test()`的执行会改变正则表达式`lastIndex`属性。连续的执行`test()`方法，后续的执行将会从`lastIndex`处开始匹配字符串。

#### `RegExp.prototype.exec(str)`

- 返回
  - 无匹配：返回`null`
  - 有匹配：返回`result`，结构同`String.prototype.match(reg)`方法正则无全局匹配的结果
    - `result[0]`：匹配的字符串
    - `result[1..n]`：正则表达式中用圆括号括起来的字表达式1...n
    - `result.index`：发生匹配的字符在`str`中的开始位置
    - `result.input`：所检索的字符串
    - 如果设置了全局匹配，`reg.lastIndex`将是下一次匹配开始的位置（初始为0）

## 实例

### 千分位表示法

```js
function thousandsFormat(str) {
    const reg = /\B(?=(?:\d{3})+$)/g
    // const reg = /(?!\b)(?=(?:\d{3})+$)/g
    return str.replace(reg, ',');
};
```

说明：

- `\B`：匹配不是单词开头或结束的位置，即非边界位置
- `(?=exp)`：零宽度正预测先行断言，如`/^Java(?=Script$)/`，匹配`JavaScript`里的`Java`，不匹配`Javascript`里的`Java`
- `(?:exp)`：匹配`exp`，但不捕获匹配的文本，也不给此分组分配组号（即仅把`exp`组合成一个整体）

非正则方法

```js
function formatCash(str) {
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev
    })
}
console.log(formatCash('1234567890')) // 1,234,567,890
```

```js
function format(num) {
    num = num + '';
    const arr = num.split('').reverse();
    for (let i = 3; i < arr.length + 1; i += 4) {
        if (arr[i] !== undefined) {
            arr.splice(i, 0, ',');
        }
    }
    return arr.reverse().join('');
}
```

### 千分位表示法（带小数）

先将整数部分提取出来，再将提取出来的整数用千分位表示，小数部分保持不变。

```js
const reg = /\B(?=(?:\d{3})+$)/g
function thousandsFormat(decimalsStr) {
    return decimalsStr.replace(/\d+/, (num) => {
        return num.replace(reg, ',')
    })
};
```

### 去掉小数点后面多余的 0

```js
// 正则
const regexp = /(?:\.0*|(\.\d+?)0+)$/

// 测试用例
const arr = [
    '1200.00100',
    '1200.00000',
    '1200.',
    '1200',
    '1200.10000',
    '0.120010000',
    '0.000011111'
]
arr.forEach((item)=>{
    console.log(item.replace(regexp,'$1'))
})
```
