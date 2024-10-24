# useEffect/useLayoutEffect

若想详细了解，请阅读如下官方文档：

- [React 官方文档 - useEffect](https://zh-hans.react.dev/reference/react/useEffect)
- [React 官方文档 - useLayoutEffect](https://zh-hans.react.dev/reference/react/useLayoutEffect)

## 运行时机

- `useEffect` 是在浏览器绘制屏幕之后执行的，即 `useEffect` 执行顺序是：组件更新挂载完成 -> 浏览器 DOM 绘制完成 -> 执行 `useEffect` 回调。
- `useLayoutEffect` 是在浏览器重新绘制屏幕之前触发。即 `useLayoutEffect` 执行顺序是：组件更新挂载完成 -> 执行 `useLayoutEffect` 回调 -> 浏览器 DOM 绘制完成。`useLayoutEffect` 内部的代码和所有计划的状态更新会阻塞浏览器重新绘制屏幕。如果过度使用，这会使你的应用程序变慢。如果可能的话，尽量选择 `useEffect`。

此外，`useEffect` 和 `useLayoutEffect` 都只在客户端上运行，在服务端渲染中不会运行。

## 依赖项

- 如果将 `useEffect` 的第二个参数即依赖项设置为空数组，则 `useEffect` 第一个参数即 `setup` 函数仅会在函数组件初始渲染后执行一次，后续（在组件任何的 props 或 state 发生改变时）将不再执行。
- 如果完全不传递依赖数组，则 Effect 会在组件的每次单独渲染（和重新渲染）之后运行。

## 注意事项

### 使用 useEffect 尽量在 setup 函数里返回一个 cleanup 函数以在组件卸载时做一些清除操作

### Effect 中的数据请求有什么好的替代方法

在 Effect 中使用 `fetch` 是 请求数据的一种流行方式，特别是在完全的客户端应用程序中。然而，这是一种非常手动的方法，而且有很大的缺点：

- Effect 不在服务器上运行。这意味着初始服务器渲染的 HTML 将只包含没有数据的 loading 状态。客户端电脑仅为了发现它现在需要加载数据，将不得不下载所有的脚本来渲染你的应用程序。这并不高效。
- 在 Effect 中直接请求数据很容易导致“网络瀑布”。当你渲染父组件时，它会请求一些数据，再渲染子组件，然后重复这样的过程来请求子组件的数据。如果网络不是很快，这将比并行请求所有数据要慢得多。
- 在 Effect 中直接请求数据通常意味着你不会预加载或缓存数据。例如，如果组件卸载后重新挂载，它不得不再次请求数据。
- 这不符合工效学。在调用 `fetch` 时，需要编写大量样板代码，以避免像 竞争条件 这样的 bug。

这些缺点并不仅仅体现在 React 上，它可能出现在所有挂载时请求数据的地方。与路由一样，要做好数据请求并非易事，因此我们推荐以下方法：

- 如果正在使用[框架](https://zh-hans.react.dev/learn/start-a-new-react-project#production-grade-react-frameworks)，那么请使用其内置的数据获取机制。现代 React 框架已经集成了高效的数据获取机制，不会受到上述问题的影响。
- 否则，请考虑使用或构建客户端缓存。流行的开源解决方案包括 [React Query](https://tanstack.com/query/latest)、[useSWR](https://beta.reactrouter.com/en/main/start/overview) 和 [React Router v6.4+](https://beta.reactrouter.com/en/main/start/overview)。你也可以构建自己的解决方案，在这种情况下，你将在底层使用 Effect，但还需添加逻辑以避免重复请求、缓存响应并避免网络瀑布效应（通过预加载数据或将数据需求提升到路由级别）。

如果这两种方法都不适合你，可以继续直接在 Effect 中请求数据。

### 在 useLayoutEffect 的 setup 里修改了响应式字段

如下所示，在 `useLayoutEffect` 的 setup 函数中修改响应式字段 `tooltipHeight`，会导致 Tooltip 组件渲染两次，但是第二次渲染会阻塞浏览器重新绘制屏幕，只有当第二次渲染完成后，浏览器才会重新渲染屏幕。

```js
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 它不适合上方，因此把它放在下面。
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

## 关于 useEffectEvent

- [React 官方文档 - experimental_useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent)

`useEffectEvent` 这个 React Hook 让你可以提取非响应式逻辑到 Effect Event 中。

```js
import { useEffect, useEffectEvent } from 'react';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  // 尽管 useEffect 使用到了 onReceiveMessage，但是 onReceiveMessage 改变后并不需要重新运行 useEffect 里的 setup 函数
  // onMessage 被调用时，onReceiveMessage 是最新传入进来的
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明所有依赖
}
```
