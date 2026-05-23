# 校验规则

[[toc]]

## 身份证有效性校验

```js
// 18 号身份证号码校验，根据 ISO 7064:1983.MOD 11-2 算法进行校验
function checkCardID(cardID) {
    cardID = cardID.toUpperCase();

    // 18位身份证号码，前17位为数字，最后一位是校验位，可能为数字或字符X
    if (!/^\d{17}([0-9]|X)$/.test(cardID)) {
        return false;
    }

    // 校验位按照 ISO 7064:1983.MOD 11-2 的规定生成，X 可以认为是数字10。
    let checkSum = 0; // 校验和
    let checkDigit; // 校验位
    let checkDigitArray = [
        '1',
        '0',
        'X',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2'
    ]; // 校验位数组
    let weightArray = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 权重数组

    for (let i = 0; i < 17; i++) {
        checkSum += cardID.substr(i, 1) * weightArray[i];
    }

    checkDigit = checkDigitArray[checkSum % 11];

    return checkDigit === cardID.substr(17, 1) ? true : false;
}
```

## 中文名称校验

```js
/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
```

UTF-8 (Unicode)编码里，中文的编码范围是 u4e00-u9fa5，中文名称包含汉字以及 ·
