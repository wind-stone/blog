# useRef/forwardRef/useImperativeHandle

- [React 官方文档 - useRef](https://zh-hans.react.dev/reference/react/useRef)
- [React 官方文档 - forwardRef](https://zh-hans.react.dev/reference/react/forwardRef)
- [React 官方文档 - useImperativeHandle](https://zh-hans.react.dev/reference/react/useImperativeHandle)

`useRef`，帮助引用一个不需要渲染的值，比如可以用于引用一个 JSX 节点，定时器 ID 等。

`forwardRef` 允许子组件使用 `ref` 将 DOM 节点暴露给父组件。

`useImperativeHandle`，它能让你自定义由 ref 暴露出来的句柄，而不是整个 DOM 节点。

## useRef 的好处

使用 `ref` 可以确保：

- 可以在重新渲染之间存储信息（普通对象存储的值每次渲染都会重置）。
- 改变它，不会触发重新渲染（状态变量会触发重新渲染）。
- 对于组件的每个副本而言，这些信息都是本地的（外部变量则是共享的）。

因此，**我们使用可以`useRef`来缓存一些不参与渲染的数据，当这些数据变化时，不会导致组件重新渲染。**

## 用法

### 通过 ref 操作 DOM

```js
import { useRef } from 'react';

function MyComponent() {
    // 首先，声明一个初始值为 null 的 ref 对象
    const inputRef = useRef(null);
    // ...

    const handleClick = () => {
        inputRef.current.focus();
        inputRef.current.style.backgroundColor = 'red';
    }

    // 然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX：
    return (
        <>
            <input ref={inputRef} />
            <button onClick={handleClick}>
                聚焦输入框
            </button>
        </>
    );
}
```

当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 `ref` 对象的 `current` 属性。现在可以借助 `ref` 对象访问 `<input>` 的 DOM 节点，并且可以调用类似于 `focus()` 的方法。

当节点从屏幕上移除时，React 将把 `current` 属性设置回 `null`。

### 将 DOM 节点暴露给父组件

有时可能想让父级组件在组件中操纵子组件内的 DOM。例如，假设正在编写一个 `MyInput` 组件，但希望父组件能够聚焦 `MyInput` 组件里的 `input`（不过父组件无法直接访问）。此时可以使用组件组合，通过 `useRef` 持有输入框并通过 `forwardRef` 将其暴露给父组件。

如果尝试像这样传递 `ref` 到自定义组件：

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

你可能会在控制台中得到这样的错误：

```js
❌ Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

**默认情况下，每个组件的 DOM 节点都是私有的。组件不会暴露它们内部 DOM 节点的 `ref`。**

为了解决这个问题，首先，找到想获得 `ref` 的组件：

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

然后像这样将其包装在 `forwardRef` 里：

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

最后，父级组件就可以得到它的 ref。

### 在多个组件中转发 ref

除了将 `ref` 转发到 DOM 节点外，还可以将其转发到自定义组件，例如 MyInput 组件：

```js
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

如果 MyInput 组件将 `ref` 转发给它的 `<input>`，那么 FormField 的 `ref` 将会获得该 `<input>`：

```js
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Form 组件定义了一个 `ref` 并将其传递给 FormField。FormField 组件将该 `ref` 转发给 MyInput，后者又将其转发给浏览器的 `<input>` DOM 节点。这就是 Form 获取该 DOM 节点的方式。

### 暴露命令式句柄而非 DOM 节点

可以使用被称为命令式句柄（imperative handle）的自定义对象暴露一个更加受限制的方法集，而非整个 DOM 节点。为了实现这个目的需要定义一个单独的 `ref` 存储 DOM 节点：

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

将收到的 `ref` 传递给 `useImperativeHandle` 并指定你想要暴露给 `ref` 的值：

```js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

如果某个组件得到了 MyInput 的 `ref`，则只会接收到 `{ focus, scrollIntoView }` 对象，而非整个 DOM 节点。现在，如果你的父组件获得了 MyInput 的 `ref`，就能通过该 `ref` 来调用 `focus` 和 `scrollIntoView` 方法。然而，它的访问是受限的，无法读取或调用下方 `<input>` DOM 节点的其他所有属性和方法。

## 注意事项

### ref.current 是可变的，修改 ref.current，React 不会重新渲染组件

可以修改 `ref.current` 属性。与 `state` 不同，它是可变的。然而，如果它持有一个用于渲染的对象（例如 `state` 的一部分），那么就不应该修改这个对象。

**改变 `ref.current` 属性时，React 不会重新渲染组件**。React 不知道它何时会发生改变，因为 `ref` 是一个普通的 JavaScript 对象。

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  console.log('组件渲染'); // 仅在组件首次渲染时打印。当点击按钮时，不会打印（因为 ref.current 改变后不会触发组件重新渲染）

  return (
    <button onClick={handleClick}>
      点击！
    </button>
  );
}
```

这个组件使用 `ref` 记录按钮被点击的次数。注意，在这里使用 `ref` 而不是 `state` 是可以的，因为点击次数**只在事件处理程序中被读取和写入**，而不是用于组件渲染。如果在 JSX 中显示 `{ref.current}`，数字不会在点击时更新。这是因为修改 ref.current 不会触发重新渲染——用于渲染的信息应该使用 `state`。

### 不要在渲染期间写入或者读取 ref.current

除了初始化外，不要在渲染期间写入或者读取 `ref.current`，否则会使组件行为变得不可预测。

React 期望组件主体表现得像一个纯函数：

- 如果输入的（`props`、`state` 与上下文）都是一样的，那么就应该返回一样的 JSX。
- 以不同的顺序或用不同的参数调用它，不应该影响其他调用的结果。

在渲染期间读取或写入 `ref` 会破坏这些预期行为。

```js
function MyComponent() {
  // ...
  // 🚩 不要在渲染期间写入 ref
  myRef.current = 123;
  // ...
  // 🚩 不要在渲染期间读取 ref
  return <h1>{myOtherRef.current}</h1>;
}
```

可以在事件处理程序或者 Effect 中读取和写入 `ref`。

```js
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 可以在 Effect 中读取和写入 ref
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 可以在事件处理程序中读取和写入 ref
    doSomething(myOtherRef.current);
  }
  // ...
}
```

如果不得不在渲染期间读取或者写入，那么应该使用 `state` 代替。

当打破这些规则时，组件可能仍然可以工作，但是我们为 React 添加的大多数新功能将依赖于这些预期行为。

### 避免重复创建 ref 的内容

React 会保存 `ref` 初始值，并在后续的渲染中忽略它。

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
}
```

虽然 `new VideoPlayer()` 的结果只会在首次渲染时使用，但是依然在每次渲染时都在调用这个方法。如果是创建昂贵的对象，这可能是一种浪费。

为了解决这个问题，你可以像这样初始化 `ref`：

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
}
```

通常情况下，在渲染过程中写入或读取 `ref.current` 是不允许的。然而，在这种情况下是可以的，因为结果总是一样的，而且条件只在初始化时执行，所以是完全可预测的。

### 避免在初始化 useRef 之后进行 null 的类型检查

如果使用了类型检查器，并且不想总是检查 `null`，可以尝试用这样的模式来代替：

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
}
```

在这里，`playerRef` 本身是可以为空的。然而，应该能够使类型检查器确信，不存在 `getPlayer()` 返回 `null` 的情况。然后在事件处理程序中调用 `getPlayer()`。
