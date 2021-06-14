# ngx_http_upstream_module 模块

[[toc]]

`ngx_http_upstream_module`模块用于定义一组服务器，可以被`proxy_pass`、`fastcgi_pass`、`uwsgi_pass`、`scgi_pass`、`memcached_pas`、`grpc_pass`指定引用。

## 配置示例

```conf
upstream backend {
    server backend1.example.com       weight=5;
    server backend2.example.com:8080;
    server unix:/tmp/backend3;

    server backup1.example.com:8080   backup;
    server backup2.example.com:8080   backup;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

作为商业付费功能的一部分，带有周期性健康检查的动态配置组也是可用的:

```conf
resolver 10.0.0.1;

upstream dynamic {
    zone upstream_dynamic 64k;

    server backend1.example.com      weight=5;
    server backend2.example.com:8080 fail_timeout=5s slow_start=30s;
    server 192.0.2.1                 max_fails=3;
    server backend3.example.com      resolve;
    server backend4.example.com      service=http resolve;

    server backup1.example.com:8080  backup;
    server backup2.example.com:8080  backup;
}

server {
    location / {
        proxy_pass http://dynamic;
        health_check;
    }
}
```

## 指令

### upstream

::: tip 使用说明
Syntax: `upstream name { ... }`

Default: —

Context: `http`
:::

定义一组服务器。这些服务器可以监听不同的端口。此外，还可以混合定义监听 TCP 和 UNIX 域套接字的服务器。

```conf
upstream backend {
    server backend1.example.com weight=5;
    server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
    server unix:/tmp/backend3;

    server backup1.example.com backup;
}
```

默认地，请求通过使用带权重的循环平衡方法分发到这些服务器上。在上面的示例里，每 7 个请求会如下分发: 5 个请求分发到`backend1.example.com`，1 个请求分发到`127.0.0.1:8080`，1 个请求分发到`backup1.example.com`。若是与一个服务器通信的过程中发生错误，请求将传递到下一个服务器上，直到所有可用的服务器都尝试过。若是没法从任意一个服务器上获得一个成功的相应，客户端将收到与最后一个服务器通信的结果。

### server

::: tip 使用说明
Syntax: `server address [parameters];`

Default: —

Context: `upstream`
:::

定义一个服务器的地址和其他的参数。地址可指定为域名或 IP 地址，并携带一个可选的端口；或指定为一个 UNIX 域套接字路径，路径前有`unix:`前缀。若是端口没指定，默认使用`80`端口。解析到多个 IP 地址的域名，一次定义了多个服务器。

可以定义的参数如下:

- `weight=number`
  - 设置服务器的权重，默认是`1`。
- `max_conns=number`
  - 限制同时连接到被代理服务器的最大活跃连接数（1.11.5）。默认值是`0`，意味着没有限制。若是服务器组没有驻留在共享内存里，则这个限制对每一个工作进程有效。

::: tip 提示
若是`idle keepalive`连接，多个`workers`，且共享内存启用了，则到被代理服务器的活跃及闲置的链接数可能超过`max_conns`。

在 1.5.9 版本到 1.11.5 版本，这个参数是商业付费功能的一部分。
:::

- `max_fails=number`
  - 设置在`fail_timeout`期间内与服务器通信失败的次数，达到这个次数后，就认为服务器在之后的`fail_timeout`期间内不可用。默认的失败次数为`1`。若设置为`0`，则禁用计数。失败的含义，由`proxy_next_upstream`、`fastcgi_next_upstream`、`uwsgi_next_upstrea`、`scgi_next_upstream`、`memcached_next_upstream`、`grpc_next_upstream`等指令定义。
- `fail_timeout=time`
  - 这个参数设置了:
    - 在该时间范围内，与服务器通信失败指定次数后，则认为服务器不可用。
    - 服务器被设置为不可用后持续的时间
  - 默认是`10s`
- `backup`
  - 标记服务器作为备用服务器。当主服务器不可用时，请求将传递到该服务器上。
- `down`
  - 标记服务器永久不可用。

此外，以下参数将作为商业付费功能的一部分:

- `resolve`
- `route=string`
- `service=name`
- `slow_start=time`
- `drain`

### hash

::: tip 使用说明
Syntax: `hash key [consistent];`

Default: —

Context: `upstream`

该指令出现在 1.7.2 版本
:::

为服务器组指定一个负载均衡的方法，客户端-服务器的转发映射将基于散列的`key`值。`key`可以包含文本、变量和它们的组合。注意，从服务器组里添加或移除一台服务器，可能会引起绝大多数的请求映射到不同的服务器上。这个方法兼容[Cache::Memcached](https://metacpan.org/pod/Cache::Memcached) Perl 库。

若是指定了`consistent`参数，将使用[ketama](https://www.metabrew.com/article/libketama-consistent-hashing-algo-memcached-clients)一致性散列方法代替。这个方法确保当从服务器组里添加或移除服务器时，仅有少量的请求会被重新映射到不同的服务器上。这将帮助提高缓存服务器的缓存命中率。将该`ketama_points`参数设置到`160`时，该方法兼容[Cache::Memcached](https://metacpan.org/pod/Cache::Memcached) Perl 库。

### ip_hash

::: tip 使用说明
Syntax: `ip_hash;`

Default: —

Context: `upstream`
:::

指定这组服务器应该基于客户端 IP 地址来将请求分发到各个服务器上以起到负载均衡的效果。IPv4 地址的前三个字节，或整个 IPv6 地址，将作为散列键（`hashing key`）。这个方法保证了来自同一客户端的请求总是分发到同一台服务器上，除非服务器不可用。在服务器不可用时，请求将分发到另一台服务器上。绝大多数情况下，都是分发到同一台服务器。

::: tip 提示
IPv6 地址从 1.3.2 和 1.2.2 版本开始支持。
:::

若是某一台服务器需要被暂时移除，则它应该使用`down`参数标记，以保留当前客户端 IP 地址的散列。

```conf
upstream backend {
    ip_hash;

    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com down;
    server backend4.example.com;
}
```

::: tip 提示
1.3.1 和 1.2.2 版本之前，使用`ip_hash`负载均衡方法时，还不能为服务器指定权重。
:::
