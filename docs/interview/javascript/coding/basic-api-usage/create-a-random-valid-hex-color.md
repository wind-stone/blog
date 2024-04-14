# 【高级】随机生成一个合法的 css 颜色值，比如 #c1c1c1

## 方式一：遍历生成每一组数字

```js
function randomColor() {
    let color = '#';
    for(let i = 0; i < 3; i++) {
        const random = Math.floor(Math.random() * 256);
        color += random.toString(16);
    }
    return color;
}
```

## 方式二：生成 6 位随机数

```js
function randomColor() {
    return '#' + ('00000' + (Math.random() * 0xffffff | 0).toString(16)).slice(-6);
}
```

其中，`Math.random() * 0xffffff | 0`是将生成的数字与`0`进行按位或操作，实际是将数字取整。

此外，加`00000`的原因是，

```js
'1'.toString(16); // 1
'01'.toString(16); // 01
'000001'.toString(16); // 000001
```
