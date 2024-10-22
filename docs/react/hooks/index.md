# 总览

Hook 这个单词的意思是"钩子"。

React Hooks 的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来。 React Hooks 就是那些钩子。

## Hooks 的使用

- 所有 Hooks 只能在组件的顶层或自己的 Hook 中调用它，而不能在循环或者条件内部调用。如果需要，抽离出一个新组件并将 `state` 移入其中。

### 依赖项

Hooks 里涉及依赖项的如 `useEffect`、`useMemo`、`useCallback` 等，需要注意：

- 依赖项包括 `props`、`state` 以及所有直接在组件内部声明的变量和函数。
- React 将使用 `Object.is` 来比较每个依赖项和它先前的值。
- 如果省略此依赖项，则在每次重新渲染组件之后，将重新运行对应的 Hooks。

## 注意事项

### 哪些 hooks 会触发组件的重新渲染？

- `useState` 里的 `setState` 调用后
- `useReducer` 里的 `dispatch` 调用后
- `useContext` 里返回的 `context` 变化后

### 哪些 hooks 不会触发组件的重新渲染？

- `useRef`，修改 `ref.current` 不会触发组件的重新渲染
