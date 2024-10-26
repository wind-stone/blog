# useSyncExternalStore

- [React 官方文档 - useSyncExternalStore](https://zh-hans.react.dev/reference/react/useSyncExternalStore)

## 用法

`useSyncExternalStore` 是一个让你订阅外部 `store` 的 React Hook。

## 注意事项

- `subscribe` 参数需要自己实现，实现的内容是如何监听 `store` 的变更。

## 重新渲染时要传入相同的 subscribe 参数，否则 subscribe 会被再次调用

如果在重新渲染时传入一个不同的 `subscribe` 函数，React 会用新传入的 `subscribe` 函数重新订阅该 `store`。你可以通过在组件外声明 `subscribe` 来避免。

## getSnapshot 返回的 store 快照必须是不可变的

`getSnapshot` 返回的 `store` 快照必须是不可变的。如果底层 `store` 有可变数据，要在数据改变时返回一个新的不可变快照。否则，返回上次缓存的快照。
