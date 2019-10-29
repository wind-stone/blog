# VSCode 配置 ESLint 扩展

## 安装 ESLint 扩展

在 VSCode Extensions 里，搜索`ESLint`并安装。

## User Setting 添加配置

Code -> 首选项（`Preferences`） -> 设置（`Settings`），添加如下配置：

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

  // Vetur
  // 关闭 vetur 的格式化功能
  "vetur.format.enable": false,
  // 关闭 vetur 对 template 的检查，交给 eslint，详见：https://vuejs.github.io/vetur/linting-error.html#linting-for-template
  "vetur.validation.template": false
}
```

配置此项，VSCode 可对`.html`、`.js`和`.vue`等文件的 ESLint 检查。VSCode 配置完了之后，如果不可用，可重启下 VSCode。
