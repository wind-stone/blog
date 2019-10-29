# 项目初始化 #

## 添加 .npmrc 文件 ##

项目根目录下添加`.npmrc`文件，以设置项目独有的`npm`配置，比如`registry`，可按照需求选择使用公司的、淘宝的或是官方的`registry`。

```txt
registry=https://registry.npmjs.org/
```

## 代码格式化、校验 ##

### .eslintrc 配置 ###

项目根目录下添加`.eslintrc.js`，再按需进行配置。

```js
module.exports = {
  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended' // eslint-plugin-vue
  ],
  parser: 'vue-eslint-parser',
  // If you want to use custom parsers such as babel-eslint or @typescript-eslint/parser, you have to use parserOptions.parser option instead of parser option. Because the eslint-plugin-vue plugin requires vue-eslint-parser to parse .vue files, so the eslint-plugin-vue plugin doesn't work if you overwrote parser option.
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    'no-console': 'warning',
    'no-unused-vars': 'warning',
    'semi': 'error'
    // ...
  }
}
```

### VS Code 配置 ###

下载如下插件：

- ESLint 插件
- Vetur 插件: 可对 Vue 文件进行语法高亮、代码片段、Emmet 支持、Lint/错误检查、格式化、智能提示、等等功能

需要作出如下配置:

```json
{
  "editor.formatOnSave": true, //
  // Eslint 插件配置，详见 https://github.com/microsoft/vscode-eslint
  "eslint.autoFixOnSave": true, // Enables auto fix on save. Please note auto fix on save is only available if VS Code's files.autoSave is either off, onFocusChange or onWindowChange. It will not work with afterDelay.
  "eslint.validate": [ // An array of language ids which should be validated by ESLint，详见
    "html",
    "javascript",
    "javascriptreact",
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  // Vetur 插件配置，详见 https://vuejs.github.io/vetur/
  "vetur.validation.template": false, // 关闭 vetur 对 <template> 的 lint 校验，交给 ESLint 来做校验，详见 https://vuejs.github.io/vetur/linting-error.html#linting-for-template
  "vetur.format.defaultFormatter.html": "prettier", // 设置使用 prettier 来对 <template> 做格式化，详见 https://vuejs.github.io/vetur/formatting.html#formatters
}
```

注意，VS Code 的 ESLint 插件会使用项目根目录下的`.eslintrc.*`文件。

## 使用 husky 添加 git hooks ##

- 官方文档: [ESLint - 中文](https://cn.eslint.org/)
- [风动之石的博客 - ESLint](../tools/eslint.md)

[husky](https://github.com/typicode/husky)可以让我们更加简单地添加一些钩子函数，比如在提交代码前校验代码风格和校验提交说明等。

### 安装依赖 ###

```sh
# 安装 husky，以更加容易地使用各个钩子
npm install -D husky

# 安装 lint-staged，仅对暂存区的文件进行校验
npm install -D lint-staged

# 安装 commitlint，以校验提交说明
npm install -D @commitlint/{config-conventional,cli}

# 安装 eslint，以及按需安装 babel-eslint、eslint-plugin-vue 等
npm install -D eslint babel-eslint eslint-plugin-vue vue-eslint-parser
```

`package.json`里添加`husky`相关配置:

```json
{
  "scripts": {
    // ...
    "lint": "lint-staged"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

### commitlint 配置 ###

项目根目录下添加`commitlint.config.js`文件：

```js
// 配置 commitlint 使用 conventional 配置来校验提交说明
module.exports = {
    extends: [
        '@commitlint/config-conventional'
    ]
};
```

#### 提交说明里的 type ####

- `feat`：新功能（`feature`）
- `fix`：修补`bug`
- `docs`：文档（`documentation`）
- `style`： 格式（不影响代码运行的变动）
- `refactor`：重构（即不是新增功能，也不是修改`bug`的代码变动）
- `test`：增加测试
- `chore`：构建过程或辅助工具的变动
- `revert`：撤销之前的`commit`
