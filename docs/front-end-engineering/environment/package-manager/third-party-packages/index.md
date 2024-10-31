# 第三方工具

[[toc]]

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

## library 里常用的工具库

### Inquirer.js

[Inquirer.js](https://github.com/SBoudrias/Inquirer.js)，常用的交互式命令行 UI 集合，主要用于在命令行里让用户以交互式的方式选择/输入所需的数据。

### Commander.js

[Commander.js](https://github.com/tj/commander.js)，完整的 Node.js 命令行解决方案，定义命令、选项，根据用户输入的命令执行操作。使用该库，可以定义一套命令及对应的功能。

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

### etag

[etag](https://github.com/jshttp/etag)，创建简单的 ETags。

## depcheck

[depcheck](https://github.com/depcheck/depcheck)
，分析项目里的依赖，查看每个依赖是否使用到，缺少哪些依赖。
