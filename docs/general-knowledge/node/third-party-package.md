# 第三方 NPM 工具

[[toc]]

## Node.js/NPM 管理

### nvm 管理 Node.js 版本

[nvm](https://github.com/creationix/nvm)，即 Node Version Manager，可以管理多个 Node.js 版本。

```sh
# 下载、编译、安装最新的 Node 的 release 版本，其中 node 是最新版本的别名
nvm install node

# 安装指定版本的 Node
nvm install 6.14.4

# 列出（远程）所有可用的版本
nvm ls-remote

# 列出本地安装的所有版本
nvm ls

# 使用特定版本
nvm use xxx
```

### nrm 管理 NPM registry

[nrm](https://github.com/Pana/nrm)，即 NPM registry manager，可以在各个 register 之间快速切换，比如`npm`，`cnpm`，`taobao`等

```sh
➜  ~ nrm ls

  npm ---- https://registry.npmjs.org/
  cnpm --- http://r.cnpmjs.org/
  taobao - https://registry.npm.taobao.org/
  nj ----- https://registry.nodejitsu.com/
  rednpm - http://registry.mirror.cqupt.edu.cn/
  npmMirror  https://skimdb.npmjs.com/registry/
  edunpm - http://registry.enpmjs.org/
* ks ----- https://npm.corp.kuaishou.com/
```

### npx 调用局部安装的模块

`npx`，主要解决调用项目局部安装的模块的问题。正常项目局部安装的模块比如`vuepress`，只能在项目脚本和`package.json`的`scripts`字段里面才能调用命令`vuepress dev`，若是想在命令行下调用，就必须像这样：

```sh
# 项目的根目录下执行
$ node-modules/.bin/vuepress dev
```

而`npx`就是方便直接调用项目内部安装的模块：

```sh
npx vuepress dev
```

`npx`的原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。

由于`npx`会检查环境变量`$PATH`，所以系统命令也可以调用。

```sh
# 等同于 ls
$ npx ls
```

Reference:

- [阮一峰 - npx 使用教程](http://www.ruanyifeng.com/blog/2019/02/npx.html)
- [github - npx](https://github.com/zkat/npx)

### cross-env 跨平台设置环境变量

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

## 监控文件变化

### chokidar 监控文件变化

[chokidar](https://github.com/paulmillr/chokidar)，基于 Nodej.js 的`fs.watch`/`fs.watchFile`/`fsevents`封装的`watch`工具。

### nodemon 监控文件变化重启应用

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

## 网络请求

### axios-curlirize 将请求显示为 CURL

[axios-curlirize](https://github.com/delirius325/axios-curlirize)，将 Node.js 里的`axios`请求以 CURL 的形式打印出来。

## 其他

### require-all

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
