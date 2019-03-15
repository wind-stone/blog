---
sidebarDepth: 0
---

# 第三方 NPM 工具

## nodemon

[`nodemon`](https://github.com/remy/nodemon)可以在开发`node.js`应用时，监控目录下的文件改变，并自动重启`node.js`应用。

`nodemon`不需要任何关于开发方法或代码上的修改，它是`node`的封装，并代替了`node`。使用`nodemon`时，当执行脚本时，在命令行将原来的`node`替换成`nodemon`即可。

```sh
# 全局/局部安装
npm install -g nodemon
npm install --save-dev nodemon

# 启动应用，并默认监控当前工作目录下的文件改变（递归地）
nodemon ./server.js

# 启动应用，并监控 server 文件夹下的文件改变
nodemon server/index.js --watch server
```

## cross-env

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

## chokidar

[chokidar](https://github.com/paulmillr/chokidar)，基于 Nodej.js 的`fs.watch`/`fs.watchFile`/`fsevents`封装的`watch`工具。

## require-all

[`require-all`](https://github.com/felixge/node-require-all)，`require`整个目录里的所有文件。

```js
// 方式一：该方式可直接看官网示例，有详细说明
var controllers = require('require-all')({
  dirname     :  __dirname + '/controllers',
  filter      :  /(.+Controller)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});
```

```js
// 方式二：该方式官网里直接说明结果的结构，因此如下阐述
var libs = require('require-all')(__dirname + '/lib');
```

假设`lib`目录下的文件夹结构为：

- lib
  - folder1
    - file1-1.js
    - file1-2.js
  - folder2
    - file2-1.js

则通过方式二得到的`libs`为：

```js
{
  folder1: {
    file1-1: [Function: exports],
    file1-2: [Function: exports]
  },
  folder2: {
    file2-1: [Function: exports]
  }
}
```

各个文件的结构为`module.exports = function() {}`，以`[Function: exports]`表示。
