# npx 调用局部安装的模块

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
