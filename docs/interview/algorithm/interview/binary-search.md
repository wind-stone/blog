# 【初级】二分查找

输入一个已排序的数组如 [ 'a', 'c', 'f' ]（至少两个不同字母，可能存在重复的字符），一个字符如 b，找出大于所给字符的最小字母，如果没有，则返回第一个字母。

```js
function getFirstBiggerChar(arr, ch) {
  // 实现代码 
}


getFirstBiggerChar(['a', 'c', 'f'], 'b') // c
getFirstBiggerChar(['a', 'c', 'f'], 'c') // f

```

参考答案：

```js
function getFirstBiggerChar(arr, ch) {
    if (arr.length < 2) {
        return;
    }
    let left = 0;
    let right = arr.length - 1;

    if (ch < arr[left] || ch >= arr[right] ) {
        // 比第一个小、比最后一个大，说明不存在，返回第一个
        return arr[0];
    }
    if (ch === arr[left]) {
        // 跟第一个相等，返回第二个
        return arr[left + 1];
    }

    while (left < right) {
        const middle = Math.floor((left + right) / 2);
        if (ch >= arr[middle]) {
            left = middle + 1;
        } else {
            right = middle;
        }
    }
    return arr[right];
}
```

