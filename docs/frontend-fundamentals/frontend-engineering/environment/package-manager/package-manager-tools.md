# 其他环境管理工具

## nvm

管理 Node.js 版本

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

# 设置默认的 Node 版本
nvm alias default vxx.yy.zz
```

## nrm

管理 npm registry

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

## npx

调用局部安装的模块

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

## cross-env 跨平台设置环境变量

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
