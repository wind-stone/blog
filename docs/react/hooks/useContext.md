# useContext

若想详细了解，请阅读如下官方文档：

- [React 官方文档 - useContext](https://zh-hans.react.dev/reference/react/useContext)

## 用法

在组件的最顶级调用 `useContext` 来读取和订阅 [context](https://zh-hans.react.dev/learn/passing-data-deeply-with-context)。

```js
import { useContext } from 'react';

function Button() {
    const theme = useContext(ThemeContext);
    // ...
}
```

`useContext` 返回你向 `context` 传递的 `context value`。为了确定 `context` 值，React 搜索组件树，为这个特定的 `context` 向上查找最近的 `context provider`。

若要将 `context` 传递给 `Button`，请将其或其父组件之一包装到相应的 `context provider`：

```js
import { createContext } from 'react';

const ThemeContext = createContext(null);

function MyPage() {
    const [theme, setTheme] = useState('dark');
    return (
        <ThemeContext.Provider value={theme}>
            <span onClick={() => {
                setTheme('light');
            }}>Switch to light theme</span>
            <Form />
        </ThemeContext.Provider>
    );
}

function Form() {
  // ... 在内部渲染 buttons ...
}
```

`provider` 和 `Button` 之间有多少层组件并不重要。当 `Form` 中的任何位置的 `Button` 调用 `useContext(ThemeContext)` 时，它都将接收 `"dark"` 作为值。

### provider 默认值与实际提供值

如果 React 没有在父树中找到该特定 `context` 的任何 `provider`，`useContext()` 返回的 `context` 值将等于你在创建 `context` 时指定的默认值：

```js
import { createContext, useContext, useState } from 'react';

// 创建 context 时指定默认值为 light，默认值从不改变
const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
        {/* 实际提供的值，可以通过 useState 来提供 state，后续使用 setState 可以更改，进而重新渲染 MyApp 组件及所有子组件 */}
        <ThemeContext.Provider value={theme}>
            <Form />
        </ThemeContext.Provider>
        <Button onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
        }}>
            Toggle theme
        </Button>
    </>
  )
}
```

### 多次嵌套和覆盖 provider

通过在 `provider` 中使用不同的值包装树的某个部分，可以覆盖该部分的 `context`。

```js
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

你可以根据需要多次嵌套和覆盖 `provider`。

经典案例：自动嵌套标题。最终 App.js 渲染出来的 Heading 组件，按嵌套次序，Heading 组件依次渲染成 H1/H2/H3/H4。

```js
// App.js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
        {/* H1 */}
        <Heading>Title</Heading>
        <Section>
            {/* H2 */}
            <Heading>Heading</Heading>
            <Heading>Heading</Heading>
            <Heading>Heading</Heading>
            <Section>
                {/* H3 */}
                <Heading>Sub-heading</Heading>
                <Heading>Sub-heading</Heading>
                <Heading>Sub-heading</Heading>
                <Section>
                    {/* H4 */}
                    <Heading>Sub-sub-heading</Heading>
                    <Heading>Sub-sub-heading</Heading>
                    <Heading>Sub-sub-heading</Heading>
                </Section>
            </Section>
        </Section>
    </Section>
  );
}
```

```js
// Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js
// Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js
// LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

## 注意事项

### 当 useContext 接收到新值后，React 自动重新渲染使用了该特定 context 的所有子级

从 `provider` 接收到不同的 `value` 开始，React 自动重新渲染使用了该特定 `context` 的所有子级。先前的值和新的值会使用 `Object.is` 来做比较。使用 `memo` 来跳过重新渲染并不妨碍子级接收到新的 `context` 值。

### 如何寻找 provider？

`useContext()` 总是在调用它的组件上面寻找最近的 `provider`。它向上搜索，不考虑调用 `useContext()` 的组件中的 `provider`。
