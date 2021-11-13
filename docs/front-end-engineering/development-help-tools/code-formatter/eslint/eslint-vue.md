# ESLint - Vue 项目配置

[`eslint-plugin-vue`](https://github.com/vuejs/eslint-plugin-vue)，是针对 Vue.js 的官方 ESLint 插件。

该插件允许我们使用 ESLint 来检查`.vue`文件里的`<template>`和`<script>`模块。

- 发现语法错误
- 发现[Vue.js 指令](https://vuejs.org/v2/api/#Directives)的使用错误
- 发现违反[Vue.js 样式指南](https://vuejs.org/v2/style-guide/)的用法

ESLint 编辑器集成对实时检查代码是非常有用的。

## 安装依赖

```sh
npm install -S eslint eslint-plugin-vue babel-eslint
```

## .eslintrc 配置

```json
{
  "root": true,
  "extends": [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',

    // 使用 eslint-plugin-vue 插件，并继承 eslint-config-vue 的 recommended 配置
    "plugin:vue/recommended"
  ],
  // 自定义 parser，详见 https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "rules": {
    // 覆盖 ESLint 的规则
    // ...
    // 覆盖 eslint-plugin-vue 配置的规则
    // ...
  }
}
```

### plugin:vue/recommended 隐含的配置

打开`node_modules/eslint-plugin-vue`可以看到，若是在`extends`里添加了`plugin:vue/recommended`，默认会包含以下配置，因此这些配置我们都不需要显示写在`.eslintrc`里。

```js
// node_modules/eslint-plugin-vue/lib/configs/base.js
// recommended 继承了 base
module.exports = {
  parser: require.resolve("vue-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ["vue"],
  rules: {
    "vue/comment-directive": "error",
    "vue/jsx-uses-vars": "error"
  }
};
```

## 命令行运行

若是想在命令行运行 ESLint，确保使用`--ext`选项包含`.vue`扩展名，或使用 glob 模式，因为 ESLint 默认只校验`.js`文件。

```sh
eslint --ext .js,.vue src
eslint "src/**/*.{js,vue}"
```
