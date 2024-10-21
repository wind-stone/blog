# useMemo/useCallback/memo

- [React 官方文档 - useMemo](https://zh-hans.react.dev/reference/react/useMemo)
- [React 官方文档 - useCallback](https://zh-hans.react.dev/reference/react/useCallback)
- [React 官方文档 - memo](https://zh-hans.react.dev/reference/react/memo)

官方文档已经讲得足够详细。

```js
// 缓存子组件，当依赖项不变时，防止子组件重新渲染
const UseMemoExample = (props) => {
    const SelectList =  useMemo(
        () => (
            <ul>
                {
                    props.selectList.map((i, v) => (
                        <li key={i.name}>
                            {i.name}
                        </li>
                    ))
                }
            </ul>
        ),
        [props.selectList]
    );

    return SelectList
}

// 缓存数据，当依赖项不变时，数据无需重新计算
const TodoList = ({ todos, tab, theme }) => {
    const visibleTodos = useMemo(
        () => filterTodos(todos, tab),
        [todos, tab]
    );
    // ...
}
```

## useMemo 与 useCallback 的区别

简单说，`useMemo` 缓存的是一个值（当然也可以是函数），`useCallback` 缓存的是一个函数，因此可以简单理解为： `useCallback` 是 `useMemo` 缓存函数的简写方式。

详细说：

`useMemo` 经常与 `useCallback` 一同出现。当尝试优化子组件时，它们都很有用。他们会 记住（或者说，缓存）正在传递的东西：

```js
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // 调用函数并缓存结果
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // 缓存函数本身
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

区别在于你需要缓存什么:

- `useMemo` 缓存函数调用的结果。在这里，它缓存了调用 `computeRequirements(product)` 的结果。除非 `product` 发生改变，否则它将不会发生变化。这让你向下传递 `requirements` 时而无需不必要地重新渲染 `ShippingForm`。必要时，React 将会调用传入的函数重新计算结果。
- `useCallback` 缓存函数本身。不像 `useMemo`，它不会调用你传入的函数。相反，它缓存此函数。从而除非 `productId` 或 `referrer` 发生改变，`handleSubmit` 自己将不会发生改变。这让你向下传递 `handleSubmit` 函数而无需不必要地重新渲染 `ShippingForm`。直至用户提交表单，你的代码都将不会运行。

如果你已经熟悉了 `useMemo`，你可能发现将 `useCallback` 视为以下内容会很有帮助：

```js
// 在 React 内部的简化实现
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

## useMemo 和 memo 的区别

- `useMemo` 可以缓存任何类型的数据，而 `memo` 只能缓存组件。
- `useMemo` 需要显示声明依赖项，而 `memo` 可以不声明，默认使用 `Object.is` 比较依赖项是否发生改变。
