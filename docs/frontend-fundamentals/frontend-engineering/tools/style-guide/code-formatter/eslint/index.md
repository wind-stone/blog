# ESLint

[[toc]]

参考 & 引用文档

- [ESLint 中文官方文档](https://cn.eslint.org/)

## 规则

### 规则配置

- `off`或`0` - 关闭规则
- `warn`或`1` - 开启规则，使用警告级别的错误：`warn`(不会导致程序退出)
- `error`或`2` - 开启规则，使用错误级别的错误：`error`(当被触发的时候，程序会退出)

Reference: [Configuring Rules](http://eslint.cn/docs/user-guide/configuring#configuring-rules)

### 行内方式关闭规则

[ESlint - Disabling Rules with Inline Comments](https://eslint.org/docs/2.13.1/user-guide/configuring#disabling-rules-with-inline-comments)

## ESLint 插件和配置

### Vue 相关

- Babel 相关
  - [babel-eslint](https://github.com/babel/babel-eslint)，`ESLint`的第三方解析器，用于解析那些将交于 Babel 转义的实验性、非标准的语法的源码。
- `Vue.js`相关
  - `eslint-plugin-vue`
  - `vue-eslint-parser`

### 与 Prettier 的集成

[Prettier 与 ESLint 的集成](./prettier-eslint.md)

## 集成

### 源码控制

若是想在项目里配置`pre-commit`钩子来进行提交前的`eslint`校验，可在项目里添加如下代码.

#### husky + lint-staged（推荐）

[`lint-staged`](https://github.com/okonet/lint-staged)，只会让 ESLint 校验暂存区的文件，而不是整个工作目录里的所有文件。

```sh
# 快速安装 husky 和 lint-staged
npx mrm lint-staged
```

`package.json`添加如下内容：

```json
{
    // ...
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged",
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    },
    "lint-staged": {
        // 将每一个暂存区的 .js、.vue 文件作为参数，依次传给 eslint --fix 和 git add 执行
        "*.{js,vue}": [
            "eslint --fix",
            "git add"
        ]
    },
    // ...
}
```
