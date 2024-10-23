# useContext

若想详细了解，请阅读如下官方文档：

- [React 官方文档 - useContext](https://zh-hans.react.dev/reference/react/useContext)
- [React 官方文档 - 使用 Context 深层传递参数](https://zh-hans.react.dev/learn/passing-data-deeply-with-context)，如何想详细了解如何使用 Context，可以精度这篇文章。

## Context 的背景

通常来说，你会通过 `props` 将信息从父组件传递到子组件。但是，如果你必须通过许多中间组件向下传递 `props`，或是在你应用中的许多组件需要相同的信息，传递 `props` 会变的十分冗长和不便。Context 允许父组件向其下层无论多深的任何组件提供信息，而无需通过 `props` 显式传递。

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

## 写在你使用 context 之前

使用 Context 看起来非常诱人！然而，这也意味着它也太容易被过度使用了。如果你只想把一些 `props` 传递到多个层级中，这并不意味着你需要把这些信息放到 `context` 里。

在使用 `context` 之前，你可以考虑以下几种替代方案：

- **从传递 `props` 开始**。 如果你的组件看起来不起眼，那么通过十几个组件向下传递一堆 `props` 并不罕见。这有点像是在埋头苦干，但是**这样做可以让哪些组件用了哪些数据变得十分清晰**！维护你代码的人会很高兴你用 `props` 让数据流变得更加清晰。
- **抽象组件并将 JSX 作为 `children` 传递给它们**。 如果你通过很多层不使用该数据的中间组件（并且只会向下传递）来传递数据，这通常意味着你在此过程中忘记了抽象组件。举个例子，你可能想传递一些像 `posts` 的数据 `props` 到不会直接使用这个参数的组件，类似 `<Layout posts={posts} />`。取而代之的是，让 Layout 把 `children` 当做一个参数，然后渲染 `<Layout><Posts posts={posts} /></Layout>`。这样就减少了定义数据的组件和使用数据的组件之间的层级。

如果这两种方法都不适合你，再考虑使用 `context`。

## Context 的使用场景

- **主题**： 如果你的应用允许用户更改其外观（例如暗夜模式），你可以在应用顶层放一个 `context provider`，并在需要调整其外观的组件中使用该 `context`。
- **当前账户**： 许多组件可能需要知道当前登录的用户信息。将它放到 `context` 中可以方便地在树中的任何位置读取它。某些应用还允许你同时操作多个账户（例如，以不同用户的身份发表评论）。在这些情况下，将 UI 的一部分包裹到具有不同账户数据的 `provider` 中会很方便。
- **路由**： 大多数路由解决方案在其内部使用 `context` 来保存当前路由。这就是每个链接“知道”它是否处于活动状态的方式。如果你创建自己的路由库，你可能也会这么做。
- **状态管理**： 随着你的应用的增长，最终在靠近应用顶部的位置可能会有很多 `state`。许多遥远的下层组件可能想要修改它们。通常 将 `reducer` 与 `context` 搭配使用来管理复杂的状态并将其传递给深层的组件来避免过多的麻烦。

Context 不局限于静态值。如果你在下一次渲染时传递不同的值，React 将会更新读取它的所有下层组件！这就是 `context` 经常和 `state` 结合使用的原因。

一般而言，如果树中不同部分的远距离组件需要某些信息，`context` 将会对你大有帮助。
