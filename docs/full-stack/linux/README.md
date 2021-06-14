# CLI

[[toc]]

CLI（command-line interface，命令行界面）

## 知识点

### 命令行 -- 与 - 的区别

在 Linux 的`shell`中，我们把`-`和`--`加上一个字符（字符串）叫做命令行参数，主流的有下面几种风格：

- Unix 风格参数，参数前加单破折线`-`
- GNU 风格参数，参数前加双破折线`--`
- BSD 风格参数，参数前不加破折线

#### Unix 风格参数

单个`-`后面加单个字母，代表一个参数。Unix风格的参数是从贝尔实验室开发的 AT&T Unix 系统上原有的命令继承下来的。比如

```sh
ls -l
rm -fr /
git commit -am "xxx"
```

而对于单个`-`后面加多个字母的情况，实际上是多个参数，只是合并起来而已。比如`git --am`实际上是`git -a -m`，可以分开写，也可以合并在一起写。

#### GNU 风格参数

两个`--`后面加单词或短语，代表一个参数。

```sh
npm install lodash --save
npm install express --save-dev
```

若`--`后面加短语，短语的每个单词之间也会使用`-`连接，比如上面的`--save-dev`代表单个参数。

通常情况，`-`的参数是`--`参数的简写，比如`-h`和`--help`、`ls`命令里的`-a`和`--all`。当然，也会有一些例外情况。

#### 单独的 --

目前这种情况仅在 PM2 里见过。

PM2 是进程管理工具，执行 PM2 的`start`命令会间接执行`node`命令，若是想在执行命令时给`node`命令传递参数，可以如下使用`--`：

```sh
pm2 start app.js -- helle world
```

```js
// app.js
for (let i = 0; i <= process.argv.length; i++) {
  console.log(i, process.argv[i])
}

// 输出：

// 0 '/Users/wind-stone/.nvm/versions/node/v11.10.0/bin/node'
// 1 '/Users/wind-stone/.nvm/versions/node/v11.10.0/lib/node_modules/pm2/lib/ProcessContainerFork.js'
// 2 'hello'
// 3 'world'
// 4 undefined
```

即单独的`--`代表将之后的所有参数传递给`node`命令。

### 用户默认目录

Linux/Unix 系统下

```sh
# wind-stone 代表用户，server-host 代表服务器
# 进入服务器，会默认进行 home/wind-stone 目录下
wind-stone@server-host

# 以下目录，实际上是 home/wind-stone/files/some-directory/
wind-stone@server-host::files/some-directory/
```

## 常用命令行工具

### unrar

解压`rar`文件

1. 使用`Homebrew`安装`unrar`：`$ brew install unrar`
2. 切换到`rar`文件所在目录，输入命令进行解压：`unrar x test.rar`

### rsync

`rsync`命令是一个远程数据同步工具，可通过 LAN/WAN 快速同步多台主机间的文件。`rsync`使用所谓的“rsync算法”来使本地和远程两个主机之间的文件达到同步，这个算法只传送两个文件的不同部分，而不是每次都整份传送，因此速度相当快。

```sh
# rsync [OPTION]... SRC [USER@]HOST::DEST
# 从本地机器拷贝文件到远程rsync服务器中。当 DST 路径信息包含“::”分隔符时启动该模式
rsync -av /databack root@192.168.78.192::www
```

[rsync 命令大全](http://man.linuxde.net/rsync)
