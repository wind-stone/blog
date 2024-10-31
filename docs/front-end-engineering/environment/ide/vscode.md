# VSCode

[[toc]]

## JavaScript 配置

### 使用 webpack alias

针对非 TypeScript 的 JavaScript 项目，VSCode 的 IntelliSense 无法识别 Webpack 的`alias`，因此无法点击跳转。可在项目根目录下配置`jsconfig.json`来解决这个问题。详见[VSCode - jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig)。

::: tip 提示
TypeScript 项目可在`tsconfig.json`里进行配置。
:::

### monorepo 架构子应用里 vue 文件内 Vetur 报错

若工程的仓库采用 monorepo 架构，则该工程的目录结构如下所示：

```txt
├── apps
│   ├── appA
│   │   ├── src
│   │   │   ├── App.vue
│   │   │   └── main.ts
│   │   ├── .eslintrc.js
│   │   ├── package.json
│   │   ├── README.md
│   │   └── ...
│   ├── appB
│   └── ...
├── packages
│   ├── packageA
│   ├── packageB
│   └── ...
├── package.json
├── README.md
└── ...
```

若是使用 VSCode 打开 monorepo 的根目录，则在 appA 子应用里的 Vue 文件内引入（通过 Webpack 配置了别名的）模块时，Vetur 会报错：

```js
Cannot find module '@/common/log' or its corresponding type declarations.
```

且无法通过 Command ⌘ 键 + 鼠标左键跳转到引入模块的文件里。

解决办法：直接使用 VSCode 打开 appA 目录，让 appA 目录成为 VSCode 窗口的根路径。

详见: [vscode中vetur插件提示找不到设置了alias的模块](https://segmentfault.com/q/1010000021004226)

## 扩展

介绍一些 VS Code 的常用扩展，以及根据个人/团队/项目的需求作出的自定义配置。

### ESLint

```json
{
    // Turns auto fix on save on or off. Please note auto fix on save is only available if VS Code's files.autoSave is either off, onFocusChange or onWindowChange. It will not work with afterDelay.
    "eslint.autoFixOnSave": true,

    // An array of language ids which should be validated by ESLint
    "eslint.validate": [
        "html",
        "javascript",
        "javascriptreact",
        // You can also control which plugins should provide auto fix support. To do so simply provide an object literal in the validate setting with the properties language and autoFix instead of a simple string.
        {
            "language": "html",
            "autoFix": true
        }
    ]
}
```

注意，VS Code 的 ESLint 插件，默认会相对于工作目录来解析配置文件（比如`.eslintrc`/`.eslintignore`文件），可通过`eslint.workingDirectories`进行修改，但是一般不需要。

### Vetur

```json
{
    // 这些是默认值
    "vetur.format.defaultFormatter.html": "prettyhtml",
    "vetur.format.defaultFormatter.css": "prettier",
    "vetur.format.defaultFormatter.postcss": "prettier",
    "vetur.format.defaultFormatter.scss": "prettier",
    "vetur.format.defaultFormatter.less": "prettier",
    "vetur.format.defaultFormatter.stylus": "stylus-supremacy",
    "vetur.format.defaultFormatter.js": "prettier",
    "vetur.format.defaultFormatter.ts": "prettier",

    // 这些会覆盖默认值
    "vetur.format.defaultFormatter.html": "prettier",

    // 格式化配置
    "vetur.format.options.tabSize": 4,
    "vetur.format.options.useTabs": false
}
```

注意，针对格式化的配置，若是本地存在配置文件（比如`.prettierrc`），Vetur 会优先使用本地配置文件里的配置项，详见[Vetur Formatter Config](https://vuejs.github.io/vetur/formatting.html#settings)。

### 快速收起 node_modules

详见：[一键收起 node_modules 文件夹](https://zhuanlan.zhihu.com/p/176873873)

### 行内显示错误信息

详见: [VSCode 插件 - Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
