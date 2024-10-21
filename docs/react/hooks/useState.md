# useState

- [React 官方文档 - useState](https://zh-hans.react.dev/reference/react/useState)

##

- 调用 useState 返回的数据的第二项（即 `set` 函数），会更新 `state` 的值并触发函数组件的重新渲染。

## 注意事项

新手使用`useState`，需要注意如下事项。

### set 函数仅更新下一次渲染的状态变量

`set` 函数仅更新下一次渲染的状态变量。如果在调用 `set` 函数后读取状态变量，则仍会得到在调用之前显示在屏幕上的旧值。

```js
function App() {
    const [number, setNumber] = useState(0);
    const onButtonClick = () => {
        setNumber(state => state + 1);
        console.log(number); // 当第一次点击时，这里打印的值仍为 0；上一行的赋的值，只会影响下一次渲染中 useState 返回的内容
    }

    return (
        <div className="App">
            <button onClick={onButtonClick}>+1（当前值为 {number}）</button>
        </div>
    );
}
```

### 新值与旧值相同时跳过组件的重新渲染

如果你提供的新值与当前 `state` 相同（由 `Object.is` 比较确定），React 将跳过重新渲染该组件及其子组件。这是一种优化。虽然在某些情况下 React 仍然需要在跳过子组件之前调用你的组件，但这不应影响你的代码。

```js
let clickTimes = 0;
function App() {
    const [number, setNumber] = useState(0);
    const onButtonClick = () => {
        setNumber(0);
        clickTimes++;
        console.log('onButtonClick', clickTimes) // 点击多次按钮，会打印多次
    }

    console.log('函数组件渲染', clickTimes); // 这里只会在组件初始化时打印一次，因为 onButtonClick 里给 number 赋的新值与旧值相同，不会触发组件的重新渲染

    return (
        <div className="App">
            <button onClick={onButtonClick}>+1（当前值为 {number}）</button>
        </div>
    );
}
```

### 批量处理状态更新

React 会 批量处理状态更新。它会在所有 事件处理函数运行 并调用其 set 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在某些罕见情况下，你需要强制 React 更早地更新屏幕，例如访问 DOM，你可以使用 flushSync。

```js
function App() {
    const [number, setNumber] = useState(0);
    const onButtonClick = () => {
        setNumber(state => state + 1);
        setNumber(state => state + 1);
        setNumber(state => state + 1);
    }

    console.log('函数组件渲染', number); // 点击一次按钮，会触发一次重新渲染，而不是三次，这里只会打印一次，打印结果是：函数组件渲染 3

    return (
        <div className="App">
            <button onClick={onButtonClick}>+1（当前值为 {number}）</button>
        </div>
    );
}
```

### 更新状态中的对象和数组

你可以将对象和数组放入状态中。在 React 中，状态被认为是只读的，因此 你应该替换它而不是改变现有对象。例如，如果你在状态中保存了一个 `form` 对象，请不要改变它：

```js
// 🚩 不要像下面这样改变一个对象：
form.firstName = 'Taylor';
```

相反，可以通过创建一个新对象来替换整个对象：

```js
// ✅ 使用新对象替换 state
setForm({
    ...form,
    firstName: 'Taylor'
});

```

### 避免重复创建初始状态

React 只在初次渲染时保存初始状态，后续渲染时将其忽略。

```js
function TodoList() {
    const [todos, setTodos] = useState(createInitialTodos); // 每次渲染都会调用 createInitialTodos
    // ...
}
```

尽管 `createInitialTodos()` 的结果仅用于初始渲染，但你仍然在每次渲染时调用此函数。如果它创建大数组或执行昂贵的计算，这可能会浪费资源。

为了解决这个问题，你可以将它 作为初始化函数传递给 `useState`：

```js
function TodoList() {
    const [todos, setTodos] = useState(createInitialTodos); // 仅在组件初始化时调用一次 createInitialTodos
    // ...
    }
```

请注意，你传递的是 `createInitialTodos` 函数本身，而不是 `createInitialTodos()` 调用该函数的结果。如果将函数传递给 `useState`，React 仅在初始化期间调用它。

### 使用 key 重置组件状态

在 渲染列表 时，你经常会遇到 `key` 属性。然而，它还有另外一个用途。

你可以通过向组件传递不同的 `key` 来重置组件的状态。在这个例子中，重置按钮改变 `version` 状态变量，我们将它作为一个 `key` 传递给 `Form` 组件。当 `key` 改变时，React 会从头开始重新创建 `Form` 组件（以及它的所有子组件），所以它的状态被重置了。

```js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');
  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

操作步骤，上述组件渲染后，`p` 标签内显示的是 `Hello, Taylor.`。

此时修改 `input` 的值为 `Taylor2`，则 `p` 标签内显示的是 `Hello, Taylor2.`。

紧接着，点击 `button` 会将 `version` 改为 `1`，此时会发现`p` 标签内被重置为 `Hello, Taylor.`

### 如何将 state 设置成一个函数

你不能像这样把函数放入状态：

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
    setFn(someOtherFunction);
}
```

因为你传递了一个函数，React 认为 `someFunction` 是一个初始化函数，而 `someOtherFunction` 是一个 更新函数，于是它尝试调用它们并存储结果。要实际 存储一个函数，你必须在两种情况下在它们之前加上 `() =>`。然后 React 将存储你传递的函数。

```js
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
