# React

## 描述 UI

### 保持组件纯粹

[React - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

- 组件必须纯粹，这也就是说：
  - 组件只负责自己的逻辑，不能修改该组件渲染之前已经存在的对象或变量
  - 相同的输入，要有相同的输出。给了相同的输入，组件应该返回相同的 JSX
- 渲染会在任何时候发生，因此组件不应该依赖于其他组件的渲染顺序
- 用于组件渲染的输入，比如`props`、`state`和`context`，不能对这些输入做修改。如果想更新视觉，可以使用`setState`，而不是修改已存在的对象
- 努力争取通过返回的 JSX 来表达出你组件的逻辑，数据变更只能在事件处理函数里做，万不得已时也可以在`useEffect`里做
- 写纯函数需要大量的练习，但是这也 React 范式的强大所在。

注意：React 提供了“严格模式”，开启“严格模式”后，在开发环境时每个组件的渲染函数会执行两次，来帮助组件发现有哪些打破“纯粹”规则的地方。详见官方文档里的**Detecting impure calculations with StrictMode**。

## React Hooks

Hook 这个单词的意思是"钩子"。

React Hooks 的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来。 React Hooks 就是那些钩子。

- [阮一峰 - 轻松学会 React 钩子：以 useEffect() 为例](https://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)，了解 Hooks 的设计思想
- [阮一峰 - React Hooks 入门教程](https://www.ruanyifeng.com/blog/2019/09/react-hooks.html)

### useRef

[React - useRef](https://react.dev/reference/react/useRef)

```ts
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(0);
  // ...
}
```

主要作用：

- 引用一个不参与渲染的值
  - 可以在多次渲染之间引用一个不变的对象`myRef`，对象的`current`属性即`myRef.current`用于存放数据
  - 不能在渲染里读取或修改`myRef.current`，可以在`useEffect`或事件处理函数里读取或修改`myRef.current`
  - 修改`myRef.current`，不会导致组件的重新渲染
- 操作 DOM 节点（类似于 Vue 里的`ref`），还可以配合使用`forwardRef`将子组件的 DOM 节点暴露给父组件

### useCallback

[React - useCallback](https://react.dev/reference/react/useCallback)

```ts
import { useCallback } from 'react';

function MyComponent() {
  const cachedFn = useCallback(fn, dependencies)
  // ...
}
```

`useCallback`可以在多次渲染之间缓存同一个函数。

- 组件首次渲染时，useCallback 的返回值即`cachedFn`就是`fn`自身。在之后的渲染中，如果`dependencies`无变化，则会返回跟上次一样的函数；否则，返回当前渲染中传入的新`fn`。
- 应用场景：
  - 场景一：子组件使用`memo`来做性能优化，父组件需要给子组件传递一个回调函数`fn`（或者事件处理函数），此时需要将`fn`用`useCallback`缓存一下，防止父组件每次重新渲染都导致子组件也渲染。只有当`fn`依赖的数据有变化时，才需要获取一个新的`fn`传入到子组件以便让子组件重新渲染。
  - 场景二：函数`fn`用于某些 Hook 的依赖。比如，另一个使用`useCallback`包装的函数依赖于`fn`，或者在`useEffect`钩子依赖`fn`
    - 写自定义 Hook 时返回的函数，建议用`useCallback`包装，[Optimizing a custom Hook](https://react.dev/reference/react/useCallback#optimizing-a-custom-hook)
- `useCallback`和`useMemo`的区别，详见：[React - How is useCallback related to useMemo?](https://react.dev/reference/react/useCallback#how-is-usecallback-related-to-usememo)
  - `useCallback`缓存函数本身
  - `useMemo`缓存函数执行的结果
