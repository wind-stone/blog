# cross-env 跨平台设置环境变量

`windows`和`POSIX`命令行使用环境变量的方式是有差异的，对于`POSIX`，是使用`$ENV_VAR`；对于`windows`，则使用`%ENV_VAR%`。

`cross-env`解决了跨平台设置和使用环境变量的问题，你只需要像在使用`POSIX`系统时那样设置就行，`cross-env`将帮你解决跨平台的问题。

```sh
# 安装
npm install --save-dev cross-env
```

```json
// package.json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```
