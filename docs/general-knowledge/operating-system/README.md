# 操作系统

## 环境变量

环境变量是在操作系统中一个具有特定名字的对象，它包含了一个或者多个应用程序所将使用到的信息。

可在命令命令行里通过`env`命令来查看所有的环境变量，PATH、HOME、USER 等都是环境变量。

```sh
env

# 输出（仅摘选了一小部分列出）
# LANG=zh_CN.UTF-8
# PWD=/etc
# SHELL=/bin/zsh
# PATH=/Users/wind-stone/.nvm/versions/node/v10.15.3/bin:/Users/wind-stone/Documents/google-cloud-sdk/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin
# HOME=/Users/wind-stone
# USER=wind-stone
# ZSH=/Users/wind-stone/.oh-my-zsh
```

也可以查看单个环境变量，比如

```sh
echo $PATH

# 输出
# /Users/wind-stone/.nvm/versions/node/v10.15.3/bin:/Users/wind-stone/Documents/google-cloud-sdk/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin
```

注意，使用环境变量时，要在变量名称前添加前缀`$`，比如`$PATH`，否则会被当做普通的字符串而非变量进行处理。

### PATH 变量

PATH 变量是操作系统用的，用来指定操作系统需要使用到的可执行程序的位置。

```sh
echo $PATH

# 输出，: 表示并列，或者分隔
# /Users/wind-stone/.nvm/versions/node/v10.15.3/bin:/Users/wind-stone/Documents/google-cloud-sdk/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin
```

当在任意目录下使用可执行程序时，比如`pwd`，操作系统会在以上 PATH 变量列出的名录里查找`pwd`可执行程序，并最终会在`/bin`里找到。

### 设置环境变量

针对单个用户设置环境变量：

1、打开`.bash_profile`文件

```sh
vi ~/.bash_profile
```

2、进行编辑，在文件底部增加下面以这一行。

```sh
# 语法：
# 中间用冒号隔开
# export PATH=$PATH:<PATH 1>:<PATH 2>:<PATH 3>:------:<PATH N>

export PATH=$PATH:/usr/local/mongodb/bin
```

3、执行命令，让环境配置生效

```sh
source ~/.bash_profile
```
