# Nginx

[[toc]]

## 基本操作

### MAC 下安装 nginx

```sh
# 请先确保安装了 homebrew

# 检查 nginx 是否已经安装
brew search nginx

# 安装 nginx
brew install nginx
```

`nginx`的安装目录为`/usr/local/etc/nginx/`，`nginx.conf`文件就在该目录下。

`nginx`主页的文件在`/usr/local/var/www`目录下。

### 查找 nginx 配置文件路径

若不知道 nginx 的安装目录和配置文件路径，则可以通过以下方式查找（可直接通过方式二查找）。

#### 方式一

```sh
locate nginx.conf
/usr/local/etc/nginx/nginx.conf
/usr/local/etc/nginx/nginx.conf.default
```

若服务器中存在多个`nginx.conf`文件，我们并不知道实际上调用的是哪个配置文件，因此我们必须找到实际调用的配置文件才能进行修改。

#### 方式二

先查看`nginx`进程状态，获取`nginx`主进程的可执行文件位置，这里是`/usr/sbin/nginx`。

```sh
ps aux|grep nginx
root          62  0.0  0.1 120896  2196 ?        Ss   Sep16   0:00 nginx: master process /usr/sbin/nginx
nginx         63  0.0  0.3 121428  6752 ?        S    Sep16   0:00 nginx: worker process
root       63707  0.0  0.0  10676  1668 pts/2    S+   20:09   0:00 grep --color nginx
```

其中`ps`命令是 Process Status 的缩写，`aux`是命令参数，表示列出所有（包括其他用户的）有关`nginx`的进程。

之后，通过命令`/usr/sbin/nginx -t`进行配置检查，即可知道实际调用的配置文件路径及是否调用有效。

```sh
/usr/sbin/nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

疑问：方式二是不是直接执行`nginx -t`就可以了？！！

### 查看 nginx 监听的端口

先执行`ps aux|grep nginx`命令获取到`nginx master`进程的 PID，再执行`netstat -anp | grep PID`查看`nginx`监听的端口。

```sh
ps aux|grep nginx
root          62  0.0  0.1 120896  2196 ?        Ss   Sep16   0:00 nginx: master process /usr/sbin/nginx
nginx         63  0.0  0.3 121428  6752 ?        S    Sep16   0:00 nginx: worker process
root       63707  0.0  0.0  10676  1668 pts/2    S+   20:09   0:00 grep --color nginx

netstat -anp|grep 62
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      62/nginx: master pr
tcp        0      0 0.0.0.0:8888            0.0.0.0:*               LISTEN      62/nginx: master pr
tcp6       0      0 :::80                   :::*                    LISTEN      62/nginx: master pr
tcp6       0      0 :::8888                 :::*                    LISTEN      62/nginx: master pr
unix  3      [ ]         STREAM     CONNECTED     538840891 62/nginx: master pr
unix  3      [ ]         STREAM     CONNECTED     538840892 62/nginx: master pr
```

其中`netstat`命令用于显示与 IP、TCP、UDP 和 ICMP 协议相关的统计数据，一般用于检验本机各端口的网络连接情况。

命令参数里，

- `-a`: 显示所有连线中的 Socket。
- `-n`: 直接使用 IP 地址，而不通过域名服务器。
- `-p`: 显示正在使用 Socket 的程序识别码和程序名称。

上述示例里，`nginx`监听在`80`和`8888`端口。

### nginx 基本命令

```sh
➜ nginx -h
nginx version: nginx/1.15.2
Usage: nginx [-?hvVtTq] [-s signal] [-c filename] [-p prefix] [-g directives]

Options:
  -?,-h         : this help
  -v            : show version and exit
  -V            : show version and configure options then exit
  -t            : test configuration and exit
  -T            : test configuration, dump it and exit
  -q            : suppress non-error messages during configuration testing
  -s signal     : send signal to a master process: stop, quit, reopen, reload
  -p prefix     : set prefix path (default: /usr/local/Cellar/nginx/1.15.2/)
  -c filename   : set configuration file (default: /usr/local/etc/nginx/nginx.conf)
  -g directives : set global directives out of configuration file
```

常用的命令有:

```sh
# 启动 nginx
nginx

# 停止 nginx
nginx -s stop

# 检查 NGINX 配置是否正确
nginx -t

# 重启 nginx
nginx -s reload

# 重新打开 nginx
nginx -s reopen

# 设置配置文件，默认为 /usr/local/etc/nginx/nginx.conf
nginx -c filename
```

## 模块

### core functionality

#### include

::: tip include 使用
Syntax: `include file | mask;`

Default: —

Context: any
:::

将另一个文件或匹配特定`mask`的文件包含到配置里。被包含的文件应该由语法正确的指令和块组成。示例:

```conf
include mime.types;
include vhosts/*.conf;
```

## 健康检查

Nginx 主要有两种主流的健康检查模式：被动检查模式、主动检查模式。

### 被动检查模式

Reference: [Nginx 官网 - 健康检查](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)

Nginx 在代理请求过程中会自动地监测每个后端服务器对请求的响应状态，若某个后端服务器在`fail_timeout`时间内累计发送请求失败或未接收到响应达到`max_fails`次时，Nginx 将会标记该服务器不可用，并在之后的`fail_timeout`时间内不往该服务器上发送请求。`fail_timeout`时间之后，Nginx 还是会转发少量的请求到该后端服务器来探测它的返回状态，以便识别该服务器是否恢复。

被动检查模式是 Nginx 内置的功能，可以直接通过参数设置来开启。

```conf
upstream backend {
    server backend1.example.com;
    server backend2.example.com max_fails=3 fail_timeout=30s;
}
```

- `fail_timeout`: 该参数有两个含义，默认为`10s`
  - 在该时间内，若 Nginx 请求失败或未接收到请求达到`max_fails`次，Nginx 将标记该服务器不可用
  - 表示服务器被标记为不可用的持续时间。该时间后，Nginx 将再次发送请求来检查服务器状态
- `max_fails`: 设置 Nginx 请求失败或未接收到请求的最大次数，达到该次数，服务器将被标记为不可用。默认是 1 次

### 主动检查模式

Nginx 服务端会按照设定的时间间隔`interval`主动向后端服务器发出检查请求，来验证后端服务器的可用状态。若某个服务器返回失败超过设定的次数，Nginx 就会将该服务器标记为异常，在此次`interval`期间将不再分发流量到该服务器，而是分发到其他服务器上。经过`interval`间隔之后，Nginx 会再次发出检查请求，若此时服务器可用，Nginx 将会标记该服务器为正常，进而继续向该服务器分发流量。

使用这种方式，一般需要后端服务器为 Nginx 提供一个低消耗的接口，用于检查该服务器状态。
