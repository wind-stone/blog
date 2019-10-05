# VSCode 配置 ESlint 扩展

## 安装 ESLint 扩展

在 VSCode 商店里，搜索`ESLint`并安装。

## User Setting 添加配置

Code -> 首选项 -> 设置，添加如下配置：

```json
{
    // An array of language ids which should be validated by ESLint
    "eslint.validate": [
        "html",
        "javascript",
        "javascriptreact",
        "vue"
    ],
    // Turns auto fix on save on or off.
    "eslint.autoFixOnSave": true
}
```

配置此项，VSCode 可对`.html`、`.js`和`.vue`等文件的 ESlint 检查。VSCode 配置完了之后，如果不可用，可重启下 VSCode。
