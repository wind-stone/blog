# 项目初始化

## 使用 husky 添加 git hooks

- 官方文档: [ESLint - 中文](https://cn.eslint.org/)
- [风动之石的博客 - ESlint](../tools/eslint.md)

[husky](https://github.com/typicode/husky)可以让我们更加简单地添加一些钩子函数，比如在提交代码前校验代码风格和校验提交说明等。

### 安装依赖

```sh
# 安装 husky，以更加容易地使用各个钩子
npm install -D husky

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
    "eslint": "sh eslint.sh"
    // ...
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run eslint",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### ESlint 配置

项目根目录下添加`eslint.sh`文件:

```sh
#!/bin/bash

# 仅校验暂存区的修改
for file in $(git diff --cached --name-only | grep -E '\.(js|jsx|vue)$')
do
  git show ":$file" | node_modules/.bin/eslint --stdin --stdin-filename "$file" # we only want to lint the staged changes, not any un-staged changes
  if [ $? -ne 0 ]; then
    echo "ESLint failed on staged file '$file'. Please check your code and try again. You can run ESLint manually via npm run eslint."
    exit 1 # exit with failure status
  fi
done
```

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
    'no-console': 1,
    'no-unused-vars': 0,
    'semi': 2,
    // ...
  }
}
```

### commitlint 配置

项目根目录下添加`commitlint.config.js`文件：

```js
// 配置 commitlint 使用 conventional 配置来校验提交说明
module.exports = {
    extends: [
        '@commitlint/config-conventional'
    ]
};
```

#### 提交说明里的 type

- `feat`：新功能（`feature`）
- `fix`：修补`bug`
- `docs`：文档（`documentation`）
- `style`： 格式（不影响代码运行的变动）
- `refactor`：重构（即不是新增功能，也不是修改`bug`的代码变动）
- `test`：增加测试
- `chore`：构建过程或辅助工具的变动
- `revert`：撤销之前的`commit`
