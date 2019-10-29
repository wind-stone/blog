# Prettier 与 ESLint 的集成

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
npm install -S --save-exact prettier
npm install -S eslint-plugin-prettier eslint-config-prettier
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
