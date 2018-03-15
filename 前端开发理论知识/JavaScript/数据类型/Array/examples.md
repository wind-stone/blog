## 合并两个数组
- `Array.prototype.push.apply(array1, array2)`
    - `array1`是合并后的数组
    - 会改写`array1`
- `array1.concat(array2)`
    - 返回新数组
    - `array1`和`array2`保持不变


## 如何消除一个数组里面重复的元素？

- ES6：`let newArray = new Set(array)`

- indexOf + splice

```js
function deleteRepeat(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr.indexOf(arr[i]) !== i) {
      arr.splice(i, 1)
    }
  }
  return arr
}
```

- hash map

```js
function deleteRepeat(array){
  let newArray = []
  let obj = {}
  let index = 0
  let len = array.length
  for(let i = 0; i < len; i++){
    const type = typeof array[i]
    const key = type + array[i]
    if(obj[key] === undefined) {
      obj[key] = true
      newArray[index++] = array[i]
    }
  }
  return newArray
}
```

以上几种方法，无法针对不同引用的对象去重。比如`array = [{a: 1}, {a: 1}]`
