# nginx.conf

## 配置示例

```conf
# 全局块
# ...

# events 块
events {
    # ...
}

# http 块
http {
  # http 全局块
  # ...

  # 虚拟主机 server 块
  server {
    # server 全局块
    # ...

    # location块
    location [PATTERN] {
      # ...
    }
    location [PATTERN] {
      # ...
    }
  }

  server {
    # ...
  }
}
```

### 全局块

全局块，配置影响`nginx`全局的指令。

```conf
# 全局块

# 配置用户或者组，默认为 nobody nobody
user administrator administrators;

# 允许生成的进程数，默认为 1
worker_processes 2;

# 指定 nginx 进程运行文件存放地址
pid /nginx/pid/nginx.pid;

# 制定日志路径，级别。这个设置可以放入全局块，http 块，server 块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
error_log log/error.log debug;
```

### events 块

```conf
# events 块
events {
  # 设置网路连接序列化，防止惊群现象发生，默认为 on
  accept_mutex on;

  # 设置一个进程是否同时接受多个网络连接，默认为 off
  multi_accept on;

  # 事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
  use epoll;

  # 最大连接数，默认为 512
  worker_connections  1024;
}
```

### http 块

#### http 全局块

```conf
http {
  # http 全局块
  # ...
}
```

#### server 全局块

```conf
http {
  server {
    # server 全局块

    # 服务域名
    server_name www.windstone.com windstone.com; # 支持多域名配置
    server_name *.windstone.com;                 # 支持泛域名解析
    server_name ~^\.windstone\.com$;             # 支持对于域名的正则匹配
  }
}
```

## 模块

### Core functionality

### ngx_http_core_module

#### location

Syntax: `location [ = | ~ | ~* | ^~ ] uri { ... }`
location @name { ... }
Default: —
Context: `server`, `location`

根据请求的 URI 设置配置。

通过以下处理后，生成标准化的 URI，并执行匹配。

- 解码`%xx`形式的加密文本
- 解析相对路径的`.`和`..`部分的引用
- 压缩两个或多个毗邻的斜杠为单个斜杠

`location`的定义，要么为前缀字符串，要么为正则表达式。正则表达式的前面可以指定`~*`修饰符（忽略大小写的匹配）或`~`修饰符（区分大小写的匹配）。为了查找到能匹配给定请求的`location`，`nginx`首先检查以前缀字符串定义的`location`（即前缀`location`）。在这些`location`中，将选择并记录具有最长匹配前缀的`location`。之后，按照正则表达式出现在配置文件里的顺序，再检查正则表达式。正则表达式的搜索将在发现第一个匹配之后终止，且会使用对应的配置。若是不存在匹配的正则表达式，则会使用之前记录的前缀字符串对应的配置。

`location`块可以嵌套，除了下面提及的一些例外。

对于忽略大小写的操作系统，比如 macOS 和 Cygwin，匹配前缀字符串时将忽略大小写（0.7.7）。但是，对比仅限制在单字节的区域。

正则表达式可以包含捕获（0.7.40），可以之后在其他指令里使用。

若是最长匹配的前缀字符串带有`^~`修饰符，则不再检查正则表达式。

此外，使用`=`修饰符，会定义一个 URI 和`location`的精确匹配。如果查找到了一个精确匹配，搜索将终止。比如，若是频繁发生`/`请求，定义`location = /`将加速这些请求的处理，因为搜索在第一个比较之后就终止了。这样的`location`显然不能包含嵌套的`location`。

::: tip 提示
在 0.7.1 到 0.8.41 版本，若请求匹配了的前缀`location`没有`=`和`^~`修饰符，搜索也会终止，且不会检查正则表达式。
:::

::: warning 译者注
注意，前缀字符串的匹配，都是从请求 URI 的最开始部分进行。
:::

让我们通过一个例子，说明上述的规则。

```conf
location = / {
    [ configuration A ]
}

location / {
    [ configuration B ]
}

location /documents/ {
    [ configuration C ]
}

# 若 ^~ 之后的字符串匹配了，则不会检查正则表达式
location ^~ /images/ {
    [ configuration D ]
}

# 忽略大小写的正则匹配
location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}
```

`/`请求将匹配`configuration A`，`/index.html`请求将匹配`configuration B`，`/documents/document.html`请求将匹配`configuration C`，`/images/1.gif`请求将匹配`configuration D`，`/documents/1.jpg`请求将匹配`configuration E`。

`@`前缀定义了一个命名的`location`。这样的`location`不是用于常规的请求处理，而是用于请求重定向。它们不能被嵌套，也不能包含嵌套的`location`。

若是前缀字符串定义的`location`以斜杠字符结尾，且请求被`proxy_pass`/`fastcgi_pass`/`uwsgi_pass`/`scgi_pass`/`memcached_pass`/`grpc_pass`之一处理，则特殊的处理逻辑将被执行: 针对有相同 URI 但没有尾斜杠的请求，将返回一个响应码为 301 的持久化的重定向到带有尾斜杠的相同 URI 的响应。若是不想要这样的效果，可以像如下这样定义一个 URI 与`location`的精确匹配。

```conf
location /user/ {
    proxy_pass http://user.example.com;
}

location = /user {
    proxy_pass http://login.example.com;
}
```

### upstream 模块

该模块提供一个简单方法来实现在轮询和客户端 IP 之间的后端服务器负荷平衡。

```conf
upstream backend {
  ip_hash;
  server   backend1.example.com;
  server   backend2.example.com;
  server   backend3.example.com  down;
  server   backend4.example.com;
}

http {
  server {
    location / {
        proxy_pass  http://backend;
    }
  }
}
```

- `ip_hash`: 配置该指令，会将请求按客户端的 IP 地址分发到各个服务器上。`hash`的`key`是客户端的 C 类网络地址。这种方式保证客户端请求总是转发到相同的服务器上。但是，如果被转发到的服务器不可用，则请求将转发到其他的服务器上。这为客户端总是连接到相同的服务器提供了较高的可能性。（译者注：但不能完全保证同一客户端总是连接到同一服务器上，因此不能在服务器上存放`session`等信息）

### ngx_http_index_module

`ngx_http_index_module`模块处理以斜杠字符`/`结尾的请求。这些请求可以被`ngx_http_autoindex_module`和`ngx_http_random_index_module`模块处理。

```conf
# 配置示例
location / {
    index index.$geo.html index.html;
}
```

Syntax: `index file ...;`
Default: `index index.html;`
Context: `http`, `server`, `location`

该指令用来指定用来做默认文档的文件名。`file`文件名里可以包含变量。这些文件会以指定的顺序逐个查找。文件列表的最后一个元素可以是一个绝对路径的文件，比如:

```conf
index index.$geo.html index.0.html /index.html;
```

需要注意，使用`index`文件会因此一个内部重定向，且请求可以在另一个不同的`location`里处理，比如如下的配置:

```conf
# 精确匹配 /
location = / {
    index index.html;
}

location / {
    ...
}
```

一个`/`的请求来了之后，会先匹配第一个`location`，得到结果`/index.html`，紧接着会作为`/index.html`继续在第二个`location`
里处理。

## Reference

- [8分钟带你深入浅出搞懂Nginx](https://zhuanlan.zhihu.com/p/34943332)
- [Nginx 基本配置详解](https://juejin.im/post/5aa7704c6fb9a028bb18a993)
