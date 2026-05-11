# 【初级】数组去重

```js
function unique(arr) {
    // TODO
}
unique([1,3,2,3,1]) // [1,3,2]
```

参考答案：[JavaScript数组去重（12种方法，史上最全）](https://segmentfault.com/a/1190000016418021)

```js
function unique(arr) {
    return Array.from(new Set(arr));
}
```
