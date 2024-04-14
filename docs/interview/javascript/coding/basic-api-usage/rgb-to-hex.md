# 【初级】颜色转换，rgbToHex

输入：'RGB(0, 10, 255)'

输出：'#000AFF'

参考答案：

```js
function rgbToHex(color) {
    const rgbNumList = color.replace(/(?:\(|\)|rgb|RGB|\s+)*/gi, '').split(',');

    // const rgbNumList = color.match(/\d+/g);
    let HexStr = '#';

    rgbNumList.forEach(num => {
        let hex = Number(num).toString(16).toUpperCase();

        if (hex.length < 2) {
            hex = '0' + hex;
        }

        HexStr = HexStr + hex;
    })

    return HexStr;
}
```
