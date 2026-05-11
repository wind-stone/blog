# 【中级】将数组扁平化并去除其中重复部分数据，得到一个升序且不重复的数组

参考答案：

```js
Array.from(
  new Set(arr.flat(Infinity))
).sort((a,b) => {
  return a-b
})
```
