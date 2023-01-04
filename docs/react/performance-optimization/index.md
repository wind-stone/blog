# React 性能优化

- [React - 性能优化](https://zh-hans.reactjs.org/docs/optimizing-performance.html)

## shouldComponentUpdate

```js
shouldComponentUpdate(nextProps, nextState) {
    // 当前 this.props 与 nextProps 进行比较
    // 当前 this.state 与 nextState 进行比较
    // 返回 true 表示需要更新，false：不需要更新
    return true;
}
```

`shouldComponentUpdate`默认实现总是返回`true`，让 React 执行更新。

## React.PureComponent

`React.PureComponent`是基于`shouldComponentUpdate`的简单实现，会对组件的`props`和`state`中的所有字段，采用“浅比较”的方式来决定组件是否需要更新。

如果`props`和`state`里的字段是个引用类型，则只要引用类型的值不改变，就不会触发组件更新，比如`state.list.push(1)`。


