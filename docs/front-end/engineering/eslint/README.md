# ESlint #

参考 & 引用文档

- [ESlint 中文官方文档](https://cn.eslint.org/)

## 规则 ##

### 规则配置 ###

- `off`或`0` - 关闭规则
- `warn`或`1` - 开启规则，使用警告级别的错误：`warn`(不会导致程序退出)
- `error`或`2` - 开启规则，使用错误级别的错误：`error`(当被触发的时候，程序会退出)

Reference: [Configuring Rules](http://eslint.cn/docs/user-guide/configuring#configuring-rules)

## ESlint 插件和配置 ##

### Vue 相关 ###

- Babel 相关
    - [babel-eslint](https://github.com/babel/babel-eslint)，`ESlint`的第三方解析器，用于解析那些将交于 Babel 转义的实验性、非标准的语法的源码。
- `Vue.js`相关
    - `eslint-plugin-vue`
    - `vue-eslint-parser`

### Prettier 相关 ###

#### eslint-config-prettier ####

[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)是 ESlint 的配置库，用于关闭那些不需要或与 Prettier 冲突的 ESlint 规则。这可以让你在使用 Prettier 时，可以使用你最喜欢的 ESlint 共享配置而不使用该共享配置里有关样式的规则。注意，这个配置只是关闭规则，因此仅在与其他配置一起使用时才有意义。

```json
// .eslintrc.*
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}
```

因为`eslint-config-prettier`是要关闭其他配置的样式规则，所以必须放在其他 ESlint 配置之后。

## 集成 ##

### 源码控制 ###

若是想在项目里配置`pre-commit`钩子来进行提交前的`eslint`校验，可在项目里添加如下代码.

#### husky + lint-staged（推荐） ####

[`lint-staged`](https://github.com/okonet/lint-staged)，只会让 ESlint 校验暂存区的文件，而不是整个工作目录里的所有文件。

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
