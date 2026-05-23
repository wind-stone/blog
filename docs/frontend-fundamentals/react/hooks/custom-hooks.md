# 自定义 Hooks

- [React 官方文档 - 使用自定义 Hook 复用逻辑](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks#there-is-more-than-one-way-to-do-it)

## 命名公约

- React 组件名称必须以大写字母开头，比如 `StatusBar` 和 `SaveButton`。React 组件还需要返回一些 React 能够显示的内容，比如一段 JSX。
- Hook 的名称必须以 `use` 开头，然后紧跟一个大写字母，就像内置的 `useState` 或者自定义的 `useOnlineStatus`。Hook 可以返回任意值。

这个公约保证你始终能一眼识别出组件并且知道它的 `state`，Effect 以及其他的 React 特性可能“隐藏”在哪里。

### 渲染期间调用的所有函数都应该以 use 前缀开头么？

不。没有 调用 Hook 的函数不需要 变成 Hook。

如果你创建的函数没有调用任何 Hook 方法，在命名时应避免使用 use 前缀，把它当成一个常规函数去命名。

```js
// 🔴 Avoid: 没有调用其他 Hook 的 Hook
function useSorted(items) {
  return items.slice().sort();
}
```

```js
// ✅ Good: 没有使用 Hook 的常规函数
function getSorted(items) {
  return items.slice().sort();
}

function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ 在条件分支里调用getSorted()是没问题的，因为它不是Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

这保证你的代码可以在包含条件语句在内的任何地方调用这个常规函数。

## 使用场景

### 什么时候使用自定义 Hook

- 但是每当你写 Effect 时，考虑一下把它包裹在自定义 Hook 是否更清晰。
- 自定义 Hook 让你可以在组件间共享逻辑。

## 注意事项

### 自定义 Hook 共享的只是状态逻辑而不是状态本身

自定义 Hook 共享的只是状态逻辑而不是状态本身。对 Hook 的每个调用完全独立于对同一个 Hook 的其他调用。
