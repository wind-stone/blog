# Vue 项目配置 ESlint

## 安装依赖

Vue 项目配置`ESlint`，除了基本的`eslint`和`babel-eslint`依赖之外，还需要:

- [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)，官方的针对`Vue.js`的`ESlint`插件。
- [vue-eslint-parser](https://github.com/mysticatea/vue-eslint-parser)，`ESlint`的第三方解析器，用于解析`.vue`文件。

```sh
npm install -D eslint babel-eslint eslint-plugin-vue vue-eslint-parser
```

## `.eslintrc.js` 文件配置

```js
module.exports = {
    // ESLint 一旦发现配置文件中有 root: true，它就会停止在父级目录中寻找
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    plugins: [
        'vue'
    ],
    // 将解析器替换为：vue-eslint-parser
    parser: 'vue-eslint-parser',
    // 对解析器进行配置选项
    parserOptions: {
        // If you want to use custom parsers such as babel-eslint or @typescript-eslint/parser, you have to use parserOptions.parser option instead of parser option. Because the eslint-plugin-vue plugin requires vue-eslint-parser to parse .vue files, so the eslint-plugin-vue plugin doesn't work if you overwrote parser option.
        parser: 'babel-eslint',
        sourceType: 'module',
        ecmaVersion: 2018,
        ecmaFeatures: {
            globalReturn: false,
            impliedStrict: false,
            jsx: false
        }
    },
    env: {
        browser: true,
        node: true
    },
     rules: {
        // ....
     }
}
```
