# Linux 命令

[[toc]]

PS: 以下会列出一些常用的命令及常用的用法，每个命令更加详细的用法可以参考后面的链接。

## 查看端口的使用情况

### 查看特定端口是否被占用

```sh
# lsof 列出当前系统打开文件的工具
# -i 列出符合条件的进程。（4、6、协议、:端口、 @ip ）

# 列出谁在使用某个端口
lsof -i :3000

# 列出所有 TCP/UDP 网络连接信息
lsof -i tcp
lsof -i udp

# 列出谁在使用某个特定的 TCP/UDP 端口
lsof -i tcp:80
lsof -i udp:55
```

在 Linux 环境下，任何事物都以文件的形式存在，通过文件不仅仅可以访问常规数据，还可以访问网络连接和硬件。所以如传输控制协议 (TCP) 和用户数据报协议 (UDP) 套接字等，系统在后台都为该应用程序分配了一个文件描述符，无论这个文件的本质如何，该文件描述符为应用程序与基础操作系统之间的交互提供了通用接口。因为应用程序打开文件的描述符列表提供了大量关于这个应用程序本身的信息，因此通过lsof工具能够查看这个列表对系统监测以及排错将是很有帮助的。

`lsof`更多的使用方式可参考[每天一个linux命令（51）：lsof命令](https://www.cnblogs.com/peida/archive/2013/02/26/2932972.html)。

### 查看端口使用情况

```sh
# netstat 查看 TCP、UDP 的端口和进程等相关情况
# -a (--all) 显示所有连接中的 Socket
# -t (--tcp) 显示 TCP 的连接状况。
# -u (--udp) 显示 UDP 的连接状况。
# -n 拒绝显示别名，能显示数字的全部转化为数字
# -l 仅列出在Listen(监听)的服务状态
# -p 显示建立相关链接的程序名

# 查看所有监听中的 TCP、UDP 端口使用情况
netstat -tunlp

# 结果显示
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      41/sshd
tcp        0      0 0.0.0.0:8888            0.0.0.0:*               LISTEN      1959/nginx: master
tcp        0      0 0.0.0.0:8899            0.0.0.0:*               LISTEN      1959/nginx: master
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1959/nginx: master
tcp6       0      0 :::22                   :::*                    LISTEN      41/sshd
tcp6       0      0 :::8888                 :::*                    LISTEN      1959/nginx: master
tcp6       0      0 :::5200                 :::*                    LISTEN      486/PM2 v4.4.1: God
tcp6       0      0 :::80                   :::*                    LISTEN      1959/nginx: master
tcp6       0      0 :::5201                 :::*                    LISTEN      486/PM2 v4.4.1: God
udp        0      0 172.29.69.56:123        0.0.0.0:*                           38/ntpd
udp        0      0 10.192.3.167:123        0.0.0.0:*                           38/ntpd
udp        0      0 127.0.0.1:123           0.0.0.0:*                           38/ntpd
udp        0      0 0.0.0.0:123             0.0.0.0:*                           38/ntpd
udp6       0      0 :::123                  :::*                                38/ntpd


# 查看 5550 端口使用情况
netstat -tunlp | grep 5550

# 结果显示
(Not all processes could be identified, non-owned process info will not be shown, you would have to be root to see it all.)
tcp6       0      0 :::5550                 :::*                    LISTEN      4551/PM2 v2.8.0: Go
```

`netstat`更多的使用方式可参考[每天一个linux命令（56）：netstat命令](https://www.cnblogs.com/peida/archive/2013/03/08/2949194.html)。

## pwd 显示工作目录

Print Working Directory，显示工作目录的路径名称。

## mkdir：创建目录

```sh
mkdir directory-name
```

详细请参考：[每天一个linux命令（4）：mkdir命令](http://www.cnblogs.com/peida/archive/2012/10/25/2738271.html)

## rm：删除文件、目录

```sh
rm -rf director-or-file-name
```

命令参数：

- `-f`/`--force`：忽略不存在的文件，从不给出提示。
- `-i`/`--interactive`：进行交互式删除
- `-r`/`-R`/`--recursive`：指示rm将参数中列出的全部目录和子目录均递归地删除。
- `-v`/`--verbose`：详细显示进行的步骤
- `--help`：显示此帮助信息并退出
- `--version`：输出版本信息并退出

注意：

- 若没有`-r`选项，则`rm`命令不会删除目录
- 若仅使用`rm`来删除文件，通常仍可以将该文件恢复原状

详细请参考：[每天一个linux命令（5）：rm 命令](http://www.cnblogs.com/peida/archive/2012/10/26/2740521.html)

## cat：查看文件

```sh
cat filename
```

## cp：复制文件

将源文件复制到目标文件，或将多个源文件复制到目标目录

```sh
cp origin destination
```

## mv 移动、重命名文件

`mv`是`move`的缩写，可以用来移动（`move`）文件或重命名（`rename`）文件。

```sh
# 将文件 test.log 重命名为 test1.txt
mv test.log test1.txt

# 将 test1.txt 文件移到目录 test3 中
mv test1.txt test3
```

详情请见: [每天一个linux命令（7）：mv命令](https://www.cnblogs.com/peida/archive/2012/10/27/2743022.html)

## vi

## 仅查看文件

```sh
<!-- 打开文件，输入 -->
vi filename

<!-- 关闭文件：先按 esc，然后输入 -->
:q!
```

## 修改文件

```sh
<!-- 打开文件，输入 -->
vi filename

<!-- 输入 i 进行编辑模式，之后进行各种输入，以修改文件内容 -->
i

<!-- 上一步输入完毕后，输入 esc 退出编辑模式 -->
esc


<!-- 按住 shift + 输入两个Z，保存修改 -->
shift 键 + Z*2
```

## rm 删除文件

```sh
rm filename

# 强制删除文件（无法找回）
rm -rf filename
```

Reference: [每天一个linux命令目录](https://www.cnblogs.com/peida/archive/2012/12/05/2803591.html)

## 命令别名

### 设置命令的别名

```sh
# alias [别名]=[指令名称]
alias vi='vim'
alias post-review='xxx'
```

### 清除别名

```sh
# unalias [别名]
alias vi
# 清除所有别名
unalias -a
```

## type 命令

判断给定的名字是否是`alias`、`keyword`、`function`、`builtin`、`file`，或者都不是。

```sh
type ls        # ls is an alias for ls -G
type if        # if is a reserved word
type type      # type is a shell builtin
type ssh-add   # ssh-add is /usr/bin/ssh-add
```

## grep 搜索

常用参数：

- `-n`: `--line-number`，在显示符合样式的那一行之前，标示出该行的行号。

```sh
# 从 test.txt 文件里查输出含有 linux 的内容行
grep -n 'linux' test.txt
# 或
cat test.txt | grep -n 'linux'

# 从多个文件里查找关键词
grep 'linux' test.txt test2.txt

# 输出以 u 开头的行内容
cat test.txt | grep ^u
# 输出非 u 开头的行内容
cat test.txt | grep ^[^u]

# 输出以 hat 结尾的行内容
cat test.txt | grep hat$

# 输出包含 ed 或者 at 字符的内容行
cat test.txt | grep -E "ed|at"

# 显示当前目录下面以 .txt 结尾的文件中的所有包含每个字符串至少有7个连续小写字符的字符串的行
grep '[a-z]\{7\}' *.txt
```

更好用法和正则表达式等内容，请参考[每天一个linux命令（39）：grep 命令](http://www.cnblogs.com/peida/archive/2012/12/17/2821195.html)

## netstat

`netstat`用于显示与 IP、TCP、UDP 和 ICMP 协议相关的统计数据，一般用于检验本机各端口的网络连接情况。

`netstat`是在内核中访问网络及相关信息的程序，它能提供 TCP 连接，TCP 和 UDP监听，进程内存管理的相关报告。

`netstat`查看端口占用语法格式：

```sh
# 查看当前所有端口情况
netstat -tunlp

# -t (tcp) 仅显示tcp相关选项
# -u (udp)仅显示udp相关选项
# -n 拒绝显示别名，能显示数字的全部转化为数字
# -l 仅列出在Listen(监听)的服务状态
# -p 显示建立相关链接的程序名
```

可指定特定端口查看：

```sh
netstat -tunlp | grep 8888
```
