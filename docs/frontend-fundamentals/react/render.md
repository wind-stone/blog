# React 渲染机制和原理

- 默认情况下，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件。

## 渲染期间调用 useState 的 set 函数等导致重新渲染的函数时，会直接重新渲染，DOM 最终统一更新

如下代码，

```js
import { useState } from 'react';

let rerenderTime = 1;
export default function RerenderDemo() {
    const [count, setCount] = useState(0);

    rerenderTime++;

    if (rerenderTime < 2) {
        setCount(1);
    }

    console.log('rerender', rerenderTime);

    let startTime = performance.now();
    while (performance.now() - startTime < 5000) {
      // 在 5000 毫秒内不执行任何操作以模拟极慢的代码
    }

    return (
        <>
            <h1>{count}</h1>
        </>
    );
}
```

## 注意事项

React 提供了“严格模式”，开启“严格模式”后，在开发环境时每个组件的渲染函数会执行两次，来帮助组件发现有哪些打破“纯粹”规则的地方。详见官方文档里的**Detecting impure calculations with StrictMode**。
