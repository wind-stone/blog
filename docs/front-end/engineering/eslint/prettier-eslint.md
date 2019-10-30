# Prettier 与 ESLint 的集成

## Prettier 简介

Prettier 是由 Facebook 公司开发的`opinionated`的代码格式化工具，它移除了代码的原始风格，并确保所有输出的代码遵守一致的风格。

所谓`opinionated`，就是指 Prettier 强制规定了一些风格，你必须按照它指定的方式去组织代码。要是不赞成 Prettier 的风格，就不要使用它。

Prettier 也提供了极少的、必要的配置项，允许用户对一些较有争议的选项进行定制，除此之外的大部分规则都不允许配置，因为配置项越多，关于风格的争吵就会越多。

Prettier 会忽略代码的原始风格，并将代码解析为 AST，按照 Prettier 自己的规则并将最大行长度纳入考虑范围内，将 AST 重新输出为新的风格的代码。

### 为什么使用 Prettier

- 构建和强制一套风格指南
  - 到目前为止，采用 Prettier 最大的原因是，停止一切正在进行的关于风格的争吵。众所周知，通用的风格指南对项目和团队都是特别有价值的，但是达成通用的风格指南是非常痛苦的过程，也是不值得的。人们对以一种特定的方式写代码是非常有情绪的，没有人愿意花时间写和接受`nits`。
  - 因此，选择 Prettier 而不是其他风格指南的原因是，它是唯一自动化的风格指南。即使 Prettier 不能 100% 按照你想要的方式格式化所有的代码，但是鉴于 Prettier 独一无二的优势，有一些“牺牲”也是值得的。
- 帮助新手，比如
  - 以前使用另一个代码风格指南的人
  - 从其他编程语言转过的人
- 编写代码
  - 帮助开发者自动格式化代码，节省大量时间
- 易于采用
- ...

### Prettier 与 Linters

校验工具如 ESLint 等，一般有两类规则：

- 格式化类的规则，比如
  - [max-len](https://eslint.org/docs/rules/max-len)
  - [no-mixed-spaces-and-tabs](https://eslint.org/docs/rules/no-mixed-spaces-and-tabs)
  - [keyword-spacing](https://eslint.org/docs/rules/keyword-spacing)
  - [comma-style](https://eslint.org/docs/rules/comma-style)
- 代码质量类的规则，比如
  - [no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)
  - [no-extra-bind](https://eslint.org/docs/rules/no-extra-bind)
  - [no-implicit-globals](https://eslint.org/docs/rules/no-implicit-globals)
  - [prefer-promise-reject-errors](https://eslint.org/docs/rules/prefer-promise-reject-errors)

Prettier 可以完全消除对整个格式化类规则的需要！Prettier 将以一致化的风格重新输出整个项目，因此程序员再也不会有格式化方面的错误了。

但是 Prettier 对代码质量类的规则毫无用处，这也是校验工具提供的最重要的功能，因为它们可以捕获你代码里真正的 bug。

## eslint-config-prettier

[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)是 ESLint 的配置库，用于关闭那些不需要或与 Prettier 冲突的 ESLint 规则。这可以让你在使用 Prettier 时，可以使用你最喜欢的 ESLint 共享配置而不使用该共享配置里有关样式的规则。注意，这个配置只是关闭规则，因此仅在与其他配置一起使用时才有意义。

若是单独使用`eslint-config-prettier`（即不使用`eslint-plugin-prettier`），则应该如下继承配置:

```json
// .eslintrc.*
{
  "extends": ["some-other-config-you-use", "prettier"]
}
```

因为`eslint-config-prettier`是要关闭其他配置的样式规则，所以必须放在其他 ESLint 配置之后。

## eslint-plugin-prettier

[`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier)是使用 Prettier 进行格式化的 ESLint 插件，它会将 Pretter 作为 ESLint 的一条规则来运行并进行格式化，然后与格式化之前的代码进行对比，如果出现了不一致，这个地方就会被 Prettier 进行标记并报告出来。

若是单独使用`eslint-plugin-prettier`（即不使用`eslint-config-prettier`），则应该如下进行配置:

```json
// .eslintrc.*
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

若是你禁用了所有其他与代码格式化相关的 ESLint 规则，则`eslint-plugin-prettier`插件将工作地最好。若是使用了另一个在代码格式化方面与 Prettier 不一致的 ESLint 规则，则引起校验错误是无可避免的。正如上面`eslint-config-prettier`所介绍的，你可以使用`eslint-config-prettier`来禁用所有 ESLint 的与格式化相关的规则。

## eslint-config-prettier 和 eslint-plugin-prettier 的集成

因此，正常情况下，会同时使用`eslint-plugin-prettier`和`eslint-config-prettier`，其配置为:

```json
// .eslintrc.*
{
  "extends": ["some-other-config-you-use", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

## 推荐配置

以上这种方式的集成配置较为繁琐，`eslint-plugin-prettier`提供了一种简单的配置方式。

### 安装依赖

```sh
npm install -D --save-exact prettier
npm install -D eslint-plugin-prettier eslint-config-prettier
```

### 配置 .eslintrc.\*

`.eslintrc.*`文件:

```json
{
  "extends": ["plugin:prettier/recommended"]
}
```

上面这一行配置做了三件事情:

- 启用了`eslint-plugin-prettier`插件
- 设置了`"prettier/prettier"`规则为`"error"`
- 继承了`eslint-config-prettier`配置

若是打开`node_modules/eslint-plugin-prettier/eslint-plugin-prettier.js`文件，可以看到:

```js
module.exports = {
  configs: {
    recommended: {
      extends: ["prettier"],
      plugins: ["prettier"],
      rules: {
        "prettier/prettier": "error"
      }
    }
  }
  // ...
};
```

即`"extends": ["plugin:prettier/recommended"]`这一行实际上是以下配置的缩写方式。

```json
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

### 配置 Prettier 规则

以上的配置都是使用的 Prettier 的默认配置，若是想要自定义 Prettier 的配置，需要做两件事情:、

1. 针对不会被 ESLint 格式化的文件类型，需要在项目根目录添加一个`.prettierrc`的配置文件
2. 针对会被 ESLint 格式化的文件类型，Prettier 会作为 ESLint 的一个规则运行并格式化文件，因此需要在`.eslintrc.*`的`rule`里添加如下配置

`.prettierrc`配置如下:

```json
{
  "tabWidth": 4,
  "singleQuote": true
}
```

`.eslintrc.*`配置如下:

```json
{
  "extends": ["plugin:prettier/recommended"],
  "rules": {
    "prettier/prettier": [
      "error",
      // 针对会被 ESLint 格式化的文件类型，Prettier 会作为 ESLint 的一个规则运行并格式化文件，因此需要添加如下配置
      {
        "tabWidth": 4,
        "singleQuote": true
      }
    ]
    // ...
  }
}
```

#### Prettier 所有配置项

| 配置项                    | 默认值      | 建议取值    | 意义                                                         |
| ------------------------- | ----------- | ----------- | ------------------------------------------------------------ |
| printWidth                | 80          | 120         | 行宽                                                         |
| tabWidth                  | 2           | 4           | 指定每个缩进的空格数量                                       |
| useTabs                   | false       | false       | 行的缩进是否使用 Tab 而不是空格                              |
| semi                      | true        | true        | 语句行尾是否添加分号                                         |
| singleQuote               | false       | true        | 字符串是否使用单引号而不是双引号                             |
| quoteProps                | "as-needed" | "as-needed" | 对象的属性是否要加引号                                       |
| jsxSingleQuote            | false       | false       | JSX 里是否使用单引号而不是双引号                             |
| trailingComma             | "none"      | "es5"       | 多行时任何可能的地方是否添加尾逗号                           |
| bracketSpacing            | true        | true        | 对象字面量的大括号内部是否添加空格                           |
| jsxBracketSameLine        | true        | false       | 是否将`>`放置在多行 JSX 元素最后一行的结尾，而不是放在下一行 |
| arrowParens               | "avoid"     | "avoid"     | 箭头函数只有一个参数时，参数是否使用圆括号                   |
| rangeStart                | 0           | 0           | 被格式化文件的行起点                                         |
| rangeEnd                  | Infinity    | Infinity    | 被格式化文件的行终点                                         |
| parser                    | -           | -           | 指定使用的解析器                                             |
| filepath                  | -           | -           | 指定使用哪个文件来指明使用哪个解析器                         |
| requirePragma             | false       | false       | 是否在文件顶部包含`@prettier`或`@format`的注释时才格式化     |
| insertPragma              | false       | false       | 是否在文件顶部添加`@format`标记来指明该文件已经被格式化      |
| proseWrap                 | "preserve"  | "preserve"  | 指定如何处理 Markdown 文本的换行                             |
| htmlWhitespaceSensitivity | "css"       | "strict"    | 指定如何 HTML 文件里的全局空白敏感的行为                     |
| endOfLine                 | "auto"      | "lf"        | 采用哪一种行尾换行符                                         |

## 集成其他 ESLint 插件

此外，为了支持特殊的 ESLint 插件（比如，`eslint-plugin-vue`），你可以如下添加额外的配置:

```json
{
  "extends": ["plugin:prettier/recommended", "prettier/vue"]
}
```

## VS Code 配置

安装 VS Code 的 ESLint 插件和 Prettier - Code formatter 插件，并在 Code -> 首选项（`Preferences`） -> 设置（`Settings`），添加如下配置：

```json
{
  // Format a file on save. A formatter must be available, the file must not be auto-saved, and editor must not be shutting down.
  "editor.formatOnSave": true,
  // 设置文件默认的格式化工具为 Prettier - Code formatter
  // 当文件存在多个 VS Code 的 formatter 插件对同一个文件类型进行格式化时，需要手动选择 prettier-vscode 即 Prettier - Code formatter 插件
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    // 关闭编辑器对 js 文件的格式化，交给 ESLint 来做格式化，否则会格式化两次
    "editor.formatOnSave": false
  },

  // Eslint 插件配置，详见 https://github.com/microsoft/vscode-eslint
  // Enables auto fix on save. Please note auto fix on save is only available if VS Code's files.autoSave is either off, onFocusChange or onWindowChange. It will not work with afterDelay.
  "eslint.autoFixOnSave": true,
  "eslint.alwaysShowStatus": true,
  // An array of language ids which should be validated by ESLint
  "eslint.validate": [
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ],

  // Vetur（若安装了此插件的话）
  // 关闭 vetur 的格式化功能
  "vetur.format.enable": false,
  // 关闭 vetur 对 template 的检查，交给 eslint，详见：https://vuejs.github.io/vetur/linting-error.html#linting-for-template
  "vetur.validation.template": false
}
```

主要的配置内容有:

- 关闭 Vetur 对文件的格式化及对`<template>`的检查（若是存在 Vetur 插件）
- 启用 ESLint 插件对文件的自动格式化和修复功能
- 设置文件的格式化工具为 Prettier - Code formatter（当出现对同一文件类型的多个 formatter 时，需要手动选择使用 Prettier - Code formatter）
