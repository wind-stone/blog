# 【中级】合并有序数组

参考答案：

```js
var a = [1,3,5,7,9]
var b = [2,4,6,8,9]

// 合并有序数组
function merge(a, b) {
}
=> [1,2,3,4,5,6,7,8,9,9]
```

## 参考答案

```js
function merge(a, b) {
    const aLen = a.length;
    const bLen = b.length;

    if (aLen === 0) {
        return b;
    }

    if (bLen === 0) {
        return a;
    }

    const res = [];
    let i = 0;
    let j = 0;

    while(i < aLen && j < bLen) {
        if (a[i] < b[j]) {
            res.push(a[i]);
            i++;
        } else {
            res.push(b[j]);
            j++;
        }
    }

    while(j < bLen) {
        res.push(b[j]);
        j++
    }

    while(i < aLen) {
        res.push(a[i]);
        i++;
    }

    return res;
}
```
