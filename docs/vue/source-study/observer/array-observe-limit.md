# 数组的响应式限制

> 由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
>
> 1. 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
> 2. 当你修改数组的长度时，例如：vm.items.length = newLength

以上是 Vue 2.x 官方文档里的说明，但是这到底是因为什么限制呢？

## 数组的 length

数组的`length`属性是不可配置、不可枚举的。因为该项限制，导致无法通过`Object.defineProperty`给数组的`length`属性添加`getter`和`setter`。

```js
const array = [];

Object.getOwnPropertyDescriptor(a, 'length')
// 结果
// {
//     configurable: false
//     enumerable: false
//     value: 0
//     writable: true
// }

Object.defineProperty(array, 'length', {
    get() {},
    set() {}
})
// Uncaught TypeError: Cannot redefine property: length
```

## 数组项

数组项是可以通过`Object.defineProperty`设置`getter`和`setter`的，但是为什么 Vue 也不允许基于索引修改数组项呢？

- 动态添加的数组项无法通过`Object.defineProperty`设置`getter`和`setter`，而数组的长度是可变的，会经常添加新数组项和删除数组项。
- 当数组较大时，给数组的每一项都设置`getter`和`setter`，效率太低性能太差。
- 当数组的`length`为`5`时，未必索引就有`4`，索引可能不存在，就没法`setter`。

针对最后一点，其前提是假设给数组的每个元素设置`getter`和`setter`时，是通过`Object.keys()`来获取数组的所有属性的；若是`for (let i = 0; i < array.length; i++)`来设置`getter`和`setter`，倒是可以，但是这样效率太低性能太差。

```js
const array = [];

array[5] = 5;

console.log(Object.keys(array)) // ['5']
```

## 参考文档

- [为什么直接修改数组长度或设置数组项的索引时，Vue不能检测到数组的变动？](https://www.zhihu.com/question/51520173/answer/126401087)
- [Vue为什么不能检测到以元素赋值方式的数组变动](https://juejin.im/post/6844904029370187784)
