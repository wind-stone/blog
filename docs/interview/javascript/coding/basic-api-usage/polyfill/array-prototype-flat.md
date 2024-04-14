# 【中级】实现 Array.prototype.flat 方法

实现一个 flat 方法，可以根据传入的层级展开对应深度的数组嵌套

```js
Array.prototype.flat = function(depth = 1) {
   // 实现代码
}

// 示例
var arr1 = [1, 2, [3, 4], [5, 6]];
arr1.flat();
// [1, 2, 3, 4, 5, 6]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]
arr2.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr3 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr3.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

```

参考答案：

```js
Array.prototype.flat = function(depth = 1) {
   let res = [];
   this.forEach(item => {
       if (!Array.isArray(item) || depth === 0) {
           res.push(item)
       } else {
           res.push.apply(res, item.flat(depth === Infinity ? Infinity : depth - 1))
       }
   })

   return res;
}
```
