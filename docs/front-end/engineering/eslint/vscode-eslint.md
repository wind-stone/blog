# VSCode 配置 ESlint 扩展

## 安装 ESLint 扩展

在 VSCode Extensions 里，搜索`ESLint`并安装。

## User Setting 添加配置

Code -> 首选项（`Preferences`） -> 设置（`Settings`），添加如下配置：

```json
{
    // Format a file on save. A formatter must be available, the file must not be auto-saved, and editor must not be shutting down.
    "editor.formatOnSave": true,
    // 关闭编辑器对 js 文件的格式化，交给 ESlint 来做格式化
    "[javascript]": {
        "editor.formatOnSave": false
    },
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
    // Turns auto fix on save on or off.
    "eslint.autoFixOnSave": true,

    // Vetur
    "vetur.completion.tagCasing": "initial",
    "vetur.experimental.templateInterpolationService": true,
    "vetur.format.options.tabSize": 4,
    // 关闭 vetur 对 template 的 lint，交给 eslint，详见：https://vuejs.github.io/vetur/linting-error.html#linting-for-template
    "vetur.validation.template": false,
    // 关闭 vetur 对 html 和 js 的格式化，交给 ESlint
    "vetur.format.defaultFormatter.html": "none",
    "vetur.format.defaultFormatter.js": "none",
}
```

配置此项，VSCode 可对`.html`、`.js`和`.vue`等文件的 ESlint 检查。VSCode 配置完了之后，如果不可用，可重启下 VSCode。
