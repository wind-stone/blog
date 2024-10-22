# useReducer

若想详细了解，请阅读如下官方文档：

- [React 官方文档 - useReducer](https://zh-hans.react.dev/reference/react/useReducer)
- [React 官方文档 - 迁移状态逻辑至 Reducer 中](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

当 State 及其处理逻辑逐渐增加时（比如一个任务列表的 State，对应的处理逻辑可能有增加任务、修改任务状态、删除任务等），为了降低复杂度，就需要将所有处理逻辑都存放在一个易于理解的地方，而在组件之外承载这些状态和处理逻辑的地方就叫 Reducer。

## 解惑

### 为什么称之为 reducer?

尽管 `reducer` 可以 “减少” 组件内的代码量，但它实际上是以数组上的 `reduce()` 方法命名的。

`reduce()` 允许你将数组中的多个值 “累加” 成一个值：

```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

你传递给 `reduce` 的函数被称为 “reducer”。它接受 目前的结果 和 当前的值，然后返回 下一个结果。React 中的 `reducer` 和这个是一样的：它们都接受 目前的状态 和 `action` ，然后返回 下一个状态。这样，`action` 会随着时间推移累积到状态中。

### 对比 useState 和 useReducer

Reducer 并非没有缺点！以下是比较它们的几种方法：

- **代码体积**：通常，在使用 `useState` 时，一开始只需要编写少量代码。而 `useReducer` 必须提前编写 `reducer` 函数和需要调度的 `actions`。但是，当多个事件处理程序以相似的方式修改 `state` 时，`useReducer` 可以减少代码量。
- **可读性**：当状态更新逻辑足够简单时，`useState` 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，`useReducer` 允许你将状态更新逻辑与事件处理程序分离开来。
- **可调试性**：当使用 `useState` 出现问题时, 你很难发现具体原因以及为什么。而使用 `useReducer` 时，你可以在 `reducer` 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 `action`）。 如果所有 `action` 都没问题，你就知道问题出在了 `reducer` 本身的逻辑中。然而，与使用 `useState` 相比，你必须单步执行更多的代码。
- **可测试性**：`reducer` 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 `action`，断言 `reducer` 返回的特定状态会很有帮助。
- **个人偏好**：并不是所有人都喜欢用 `reducer`，没关系，这是个人偏好问题。你可以随时在 `useState` 和 `useReducer` 之间切换，它们能做的事情是一样的！

如果你在修改某些组件状态时经常出现问题或者想给组件添加更多逻辑时，我们建议你还是使用 `reducer`。当然，你也不必整个项目都用 `reducer`，这是可以自由搭配的。你甚至可以在一个组件中同时使用 `useState` 和 `useReducer`。

### 如何编写一个好的 reducer

首先，**`reducer` 需要是个纯函数**，即当输入相同时，输出也是相同的。它们不应该包含异步请求、定时器或者任何副作用（对组件外部有影响的操作）。它们应该以不可变值的方式去更新对象和数组，因此当 `state` 是对象或数据时，不能直接修改 `state`，而是应该返回一个新的对象或数据。如上一小节的所示。

其次，**每个 `action` 都描述了一个单一的用户交互**，即使它会引发数据的多个变化。举个例子，如果用户在一个由 `reducer` 管理的表单（包含五个表单项）中点击了 重置按钮，那么 `dispatch` 一个 `reset_form` 的 `action` 比 `dispatch` 五个单独的 `set_field` 的 `action` 更加合理。如果你在一个 `reducer` 中打印了所有的 `action` 日志，那么这个日志应该是很清晰的，它能让你以某种步骤复现已发生的交互或响应。这对代码调试很有帮助！

## 注意事项

### state 是只读的，即使是对象或数组也不要尝试修改它

```js
function reducer(state, action) {
    switch (action.type) {
        case 'incremented_age': {
            // 🚩 不要像下面这样修改一个对象类型的 state：
            state.age = state.age + 1;
            return state;
        }
    }
}
```

正确的做法是返回新的对象：

```js
function reducer(state, action) {
    switch (action.type) {
        case 'incremented_age': {
            // ✅ 正确的做法是返回新的对象
            return {
                ...state,
                age: state.age + 1
            };
        }
    }
}
```

### 避免重新创建初始值

React 会保存 `state` 的初始值并在下一次渲染时忽略它。

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
}
```

虽然 `createInitialState(username)` 的返回值只用于初次渲染，但是在每一次渲染的时候都会被调用。如果它创建了比较大的数组或者执行了昂贵的计算就会浪费性能。

你可以通过给 `useReducer` 的第三个参数传入初始化函数来解决这个问题：

```js
function createInitialState(username) {
    console.log('createInitialState 执行'); // 只会在组件初始化渲染时执行，后续调用 dispatch 修改 state 导致重新渲染时，createInitialState 不再执行
    // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);

  // 调用 dispatch 修改 state
  // ...
}
```

需要注意的是你传入的参数是 `createInitialState` 这个函数自身，而不是执行 `createInitialState()` 后的返回值。这样传参就可以保证初始化函数不会再次运行。

在上面这个例子中，`createInitialState` 有一个 `username` 参数。如果初始化函数不需要参数就可以计算出初始值，可以把 `useReducer` 的第二个参数改为 `null`。

### dispatch 了一个 action，不会改变当前渲染的 state

类似 `useState`，`useReducer` 里 `dispatch` 了一个 `action`，不会改变当前渲染的 `state`。

```js
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // 用 43 进行重新渲染（下一次）
  console.log(state.age);  // 还是 42！

  setTimeout(() => {
    console.log(state.age); // 一样是 42！
  }, 5000);
}
```

这是因为 `state` 的行为和快照一样。更新 `state` 会使用新的值来对组件进行重新渲染，但是不会改变当前执行的事件处理函数里面 `state` 的值。

如果你需要获取更新后的 `state`，可以手动调用 `reducer` 来得到结果：

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

### 我收到了一个报错：“Too many re-renders”

你可能会收到这样一条报错信息：`Too many re-renders. React limits the number of renders to prevent an infinite loop.`。这通常是在渲染期间  `dispatch` 了 `action` 而导致组件进入了无限循环：`dispatch`（会导致一次重新渲染）、渲染、`dispatch`（再次导致重新渲染），然后无限循环。大多数这样的错误是由于事件处理函数中存在错误的逻辑：

```js
// 🚩 错误：渲染期间调用了处理函数
return <button onClick={handleClick()}>Click me</button>

// ✅ 修复：传递一个处理函数，而不是调用
return <button onClick={handleClick}>Click me</button>

// ✅ 修复：传递一个内联的箭头函数
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

如果你没有发现上述错误，在控制台点开报错旁边的箭头以查看错误堆栈，从中查找是哪个 `dispatch` 函数引发的错误。

### 使用 Immer 简化 reducer

与在平常的 `state` 中修改对象和数组一样，你可以使用 Immer 这个库来简化 `reducer`。在这里，`useImmerReducer` 让你可以通过 `push` 或 `arr[i] =` 来修改 `state`：

```js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTasks = [
    {id: 0, text: '参观卡夫卡博物馆', done: true},
    {id: 1, text: '看木偶戏', done: false},
    {id: 2, text: '打卡列侬墙', done: false},
];

function tasksReducer(draft, action) {
    switch (action.type) {
        case 'added': {
            // 可以直接使用 push
            draft.push({
                id: action.id,
                text: action.text,
                done: false,
            });
            break;
        }
        case 'changed': {
            const index = draft.findIndex((t) => t.id === action.task.id);
            // 可以直接使用 arr[i] = xxx
            draft[index] = action.task;
            break;
        }
        // ...
    }
}

export default function TaskApp() {
    // 将 useReducer 改成 useImmerReducer
    const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

    function handleAddTask(text) {
        dispatch({
            type: 'added',
            id: nextId++,
            text: text,
        });
    }

    function handleChangeTask(task) {
        dispatch({
            type: 'changed',
            task: task,
        });
    }

    return (
        <>
            <h1>布拉格的行程安排</h1>
            <AddTask onAddTask={handleAddTask} />
            <TaskList
                tasks={tasks}
                onChangeTask={handleChangeTask}
                onDeleteTask={handleDeleteTask}
            />
        </>
    );
}
```

Reducer 应该是纯净的，所以它们不应该去修改 `state`。而 Immer 为你提供了一种特殊的 `draft` 对象，你可以通过它安全地修改 `state`。

**在底层，Immer 会基于当前 `state` 创建一个副本**。这就是通过 `useImmerReducer` 来管理 `reducer` 时，可以修改第一个参数，且不需要返回一个新的 `state` 的原因。
