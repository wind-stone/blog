# String.prototype.padStart

[[toc]]

## 题目描述

```js
// 实现
String.prototype.padStart = function padStart(targetLength, padString = ' ') {

}

// 测试用例

// case 1： padString 不传时，默认为 空格
"abc".padStart(10); // "       abc"

// case 2: 用 padString 重复填充
"abc".padStart(8, "0"); // "00000abc"

// case 3: padString 重复填充时，超过部分会被截断
"abc".padStart(10, "foo"); // "foofoofabc"

// case 4: padString 过长，会被截断
"abc".padStart(6, "123465"); // "123abc"

// case 5: targetLength 比原字符串长度小，则返回原字符串
"abc".padStart(1); // "abc"
```

## 实现

```js
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}
```

[MDN - String.prototype.padStart()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
