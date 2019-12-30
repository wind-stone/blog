# Virtual DOM

## 什么是 Virtual DOM

本质上，Virtual DOM 就是 JavaScript 对象，这个对象就是对 DOM 更加轻量级的描述。

## 为什么要使用 Virtual DOM

DOM 是复杂的，对它的操作（尤其是查询和创建）是非常慢、非常耗费资源的。仅创建一个空白的`div`，其实例属性就达到 246 个。

```js
// Chrome v78
const div = document.createElement('div');
let m = 0;
for (let k in div) {
  m++;
}
console.log(m); // 246
```

对于 DOM 这么多属性，其实大部分属性对于做 Diff 是没有任何用处的，所以如果用更轻量级的 JS 对象来代替复杂的 DOM 节点，然后把对 DOM 的 diff 操作转移到 JS 对象，就可以避免大量对 DOM 的查询操作。这个更轻量级的 JS 对象就称为 Virtual DOM。

引入 Virtual DOM 后，对 DOM 的 Diff 操作就变成了这样：

- 维护一个使用 JS 对象表示的 Virtual DOM，与真实 DOM 一一对应
- 对前后两个 Virtual DOM 做 diff，生成变更（Mutation）
- 把变更应用于真实 DOM，生成最新的真实 DOM

可以看出，因为要把变更应用到真实 DOM 上，所以还是避免不了要直接操作 DOM ，但是 React 的 diff 算法会把 DOM 改动次数降到最低。

虚拟 DOM 和 Diff 算法的出现是为了解决由命令式编程转变为声明式编程、数据驱动后所带来的性能问题的。换句话说，直接操作 DOM 的性能并不会低于虚拟 DOM 和 Diff 算法，甚至还会优于。这么说的原因是因为 Diff 算法的比较过程，比较是为了找出不同从而有的放矢的更新页面。但是比较也是要消耗性能的。而直接操作 DOM 就是有的放矢，我们知道该更新什么不该更新什么，所以不需要有比较的过程。所以直接操作 DOM 效率可能更高。React 厉害的地方并不是说它比 DOM 快，而是说不管你数据怎么变化，我都可以以最小的代价来进行更新 DOM。方法就是我在内存里面用新的数据刷新一个虚拟 DOM 树，然后新旧 DOM 进行比较，找出差异，再更新到 DOM 树上。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。

## Virtual DOM 的作用

很多人会把 Diff、数据更新、提升性能等概念绑定起来，但是你想想这个问题：React 由于只触发更新,而不能知道精确变化的数据,所以需要 diff 来找出差异然后 patch 差异队列。Vue 采用数据劫持的手段可以精准拿到变化的数据,为什么还要用 Virtual DOM？

Virtual DOM 的作用如下：

- Virtual DOM 在牺牲(牺牲很关键)部分性能的前提下，增加了可维护性，这也是很多框架的通性。
- 实现了对 DOM 的集中化操作，在数据改变时先对虚拟 DOM 进行修改，再反映到真实的 DOM 中，用最小的代价来更新 DOM，提高效率。
- 可以渲染到 DOM 以外的端，使得框架跨平台，比如 ReactNative，React VR 等。
- 可以更好的实现 SSR，同构渲染等。
- 组件的高度抽象化。

Vue 2.0 引入 vdom 的主要原因是 vdom 把渲染过程抽象化了，从而使得组件的抽象能力也得到提升，并且可以适配 DOM 以外的渲染目标。

## Virtual DOM 的缺点

- 首次渲染大量 DOM 时，由于多了一层 Virtual DOM 的计算，会比 innerHTML 插入慢。（时间上）
- Virtual DOM 需要在内存中的维护一份 DOM 的副本。（空间上）
- 如果 Virtual DOM 大量更改，这是合适的。但是单一的、频繁的更新的话，Virtual DOM 将会花费更多的时间处理计算的工作。所以，如果你有一个 DOM 节点相对较少页面，用 Virtual DOM，它实际上有可能会更慢。但对于大多数单页面应用，这应该都会更快。

## 错误观念纠正

很多人认为 Virtual DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 带来的性能消耗。

虽然这是 Virtual DOM 带来的一个优势，但并不是全部。Virtual DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种 GUI。

## 参考

- [从 React 历史的长河里聊虚拟DOM及其价值](https://cloud.tencent.com/developer/article/1560877)，本文绝大多数内容 copy 于此。
- [React 是怎样炼成的](https://segmentfault.com/a/1190000013365426)，上一篇文章主要是参考于此。
