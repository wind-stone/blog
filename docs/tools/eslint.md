---
sidebarDepth: 0
---

# ESlint

## Vue 项目配置 ESlint

### `.eslintrc` 文件配置

```json
{
    // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找
    "root": true,
    // 将解析器替换为：vue-eslint-parser
    "parser": "vue-eslint-parser",
    // 对解析器进行配置选项
    "parserOptions": {
        // If you already use other parser (e.g. "parser": "babel-eslint"), please move it into parserOptions, so it doesn't collide with the vue-eslint-parser used by this plugin's configuration
        // The vue-eslint-parser uses the parser which is set by parserOptions.parser to parse scripts.
        "parser": "babel-eslint",
        "sourceType": "module",
        "ecmaVersion": 2018,
        "ecmaFeatures": {
            "globalReturn": false,
            "impliedStrict": false,
            "jsx": false
        }
    },
    "env": {
        "browser": true,
        "node": true
    },
    "plugins": [
        "vue"
    ],
    "extends": [
        "eslint:recommended",
        // "plugin:vue/recommended"
        "plugin:vue/essential"
    ],
     "rules": {
        // ....
     }
}
```

### 需要增加的`devDependencies`

- babel-eslint
- [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser)
- [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)

### VSCode 里的 User Setting 增加配置

```json
{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "vue"
    ]
}
```

[配置此项](https://github.com/vuejs/eslint-plugin-vue#why-doesnt-it-work-on-vue-file)，VSCode 可增加对`.vue`文件的 ESlint 检查。

### 说明

VSCode 配置完了之后，如果不可用，可重启下 VSCode。
