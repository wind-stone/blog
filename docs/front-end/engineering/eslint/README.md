# ESlint

参考 & 引用文档

- [ESlint 中文官方文档](https://cn.eslint.org/)

## 各类 eslint 插件

- Babel 相关
    - [babel-eslint](https://github.com/babel/babel-eslint)，`ESlint`的第三方解析器，用于解析那些将交于 Babel 转义的实验性、非标准的语法的源码。
- `Vue.js`相关
    - `eslint-plugin-vue`
    - `vue-eslint-parser`

## 规则

### 规则配置

- `off`或`0` - 关闭规则
- `warn`或`1` - 开启规则，使用警告级别的错误：`warn`(不会导致程序退出)
- `error`或`2` - 开启规则，使用错误级别的错误：`error`(当被触发的时候，程序会退出)

Reference: [Configuring Rules](http://eslint.cn/docs/user-guide/configuring#configuring-rules)

## 集成

### 源码控制

若是想在项目里配置`pre-commit`钩子来进行提交前的`eslint`校验，可在项目里添加如下代码.

#### git pre-commit 钩子

```sh
#!/bin/zsh

# TODO: 以下代码有问题，无法 run 起来，待解决
function lintit () {
  OUTPUT=$(git diff --name-only | grep -E '(.js)$')
  a=("${(f)OUTPUT}")
  e=$(eslint -c eslint.json $a)
  echo $e
  if [[ "$e" != *"0 problems"* ]]; then
    echo "ERROR: Check eslint hints."
    exit 1 # reject
  fi
}
lintit
```

Copy from [eslint pre-commit hook](https://coderwall.com/p/zq8jlq/eslint-pre-commit-hook)

#### git pre-commit 钩子（仅校验暂存区的改变）

```sh
#!/bin/bash

for file in $(git diff --cached --name-only | grep -E '\.(js|jsx)$')
do
  git show ":$file" | node_modules/.bin/eslint --stdin --stdin-filename "$file" # we only want to lint the staged changes, not any un-staged changes
  if [ $? -ne 0 ]; then
    echo "ESLint failed on staged file '$file'. Please check your code and try again. You can run ESLint manually via npm run eslint."
    exit 1 # exit with failure status
  fi
done
```

Copy from [pre-commit.sh](https://gist.github.com/dahjelle/8ddedf0aebd488208a9a7c829f19b9e8)
