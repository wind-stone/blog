# ngx_http_proxy_module 模块

[[toc]]

## 指令

### proxy_pass

::: tip proxy_pass
Syntax: `proxy_pass URL;`

Default: —

Context: `location`, if in location, limit_except
:::

设置被代理的服务器的协议和地址，以及一个可选的以让`location`映射到的 URI。协议可以指定为`http`或`https`。地址可以指定为域名或 IP 地址，以及一个可选的端口:

```nginx
proxy_pass http://localhost:8000/uri/;
```

或一个 UNIX 域的套接字路径，通过在`unix:`之后指定:

```nginx
proxy_pass http://unix:/tmp/backend.socket:/uri/;
```

若是域名解析到多个地址，这些地址将循环使用。此外，地址还可通过[服务器组（server group）](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)指定。

参数值可以包含变量。这种情况下，若是指定地址为域名，则会在上述提及的服务器组里搜索，若是找不到，则使用[resolver](http://nginx.org/en/docs/http/ngx_http_core_module.html#resolver)确定。

请求 URI 将按如下所述传递给服务器:

- 若是`proxy_pass`指定了 URI，则当请求传递给服务器时，匹配了`location`的标准化请求的 URI 部分将被指令里指定的 URI 替代:

```nginx
location /example/ {
  proxy_pass http://127.0.0.1/remote/;
}
```

::: tip 译者注
比如，请求`/example/main.html`将分发到`http://127.0.0.1/remote/main.html`
:::

- 若是`proxy_pass`没有指定 URI，则当原始请求被处理时，请求的 URI 将以与客户端发送的一样的形式传递给服务器，或当处理改变后的 URI 时，整个标准化的请求 URI 将传递给服务器:

```nginx
location /example/ {
    proxy_pass http://127.0.0.1;
}
```

::: tip 译者注
比如，请求`/example/main.html`将分发到`http://127.0.0.1/example/main.html`
:::

::: warning 译者注
这种情况下，`http://127.0.0.1`不能添加尾斜杠，加了尾斜杠的话，就代表了存在`/`的 URI。
:::

::: warning 提示
在 1.1.12 版本之前，若是`proxy_pass`没指定 URI，在某些情况下，原始请求 URI 将代替改变后的 URI 传递给服务器。
:::

在某些情况下，不能确定被代替的请求 URI 部分。

- 当使用正则表达式指定`location`，且在命名的`location`之内。在这些情况下，`proxy_pass`不能带有 URI。
- 当 URI 在被代理的`location`之内使用`rewrite`指令改变了，并且这个配置还被用于处理请求（`break`）。这种情况下，指令里指定的 URI 将被忽略，且整个改变了的请求 URI 将被传递给服务器。

```nginx
location /name/ {
    rewrite    /name/([^/]+) /users?name=$1 break;
    proxy_pass http://127.0.0.1;
}
```

- 当`proxy_pass`里使用了变量。这种情况下，如果指令里指定了 URI，则该 URI 将代替原始的请求 URI 传递给服务器。

```nginx
location /name/ {
    proxy_pass http://127.0.0.1$request_uri;
}
```

`WebSocket`代理需要特殊的配置，且只在 1.3.13 版本之后支持。

### proxy_set_header

::: tip proxy_set_header
Syntax: `proxy_set_header field value;`

Default:

```nginx
proxy_set_header Host $proxy_host;
proxy_set_header Connection close;
```

Context: http, server, location
:::

允许重定义或追加请求头部里的项，并传递给服务器。请求头部里项的值可以是文本、变量，或它们的组合。当且仅当当前层级里没有定义`proxy_set_header`指令时，这些指令将从先前的层级里继承。默认地，只有两项会重新定义:

```nginx
proxy_set_header Host       $proxy_host;
proxy_set_header Connection close;
```

若是启用了缓存，原始请求头部里的`If-Modified-Since`、`If-Unmodified-Since`、`If-None-Match`、`If-Match`、`Range`、`If-Range`，将不会传递给被代理的服务器。

可以通过如下方式，传递一个不改变的`Host`请求头部:

```nginx
proxy_set_header Host       $http_host;
```

但若是客户端请求头部里没有`Host`项，该项就不会传递给服务器。这种情况下，最好使用`$host`变量: 当请求头部里有`Host`时，则传递给服务器的就是该`Host`的值；当请求头部里没有`Host`时，则传递的就是服务器的主域名。

此外，服务器主域名可以与服务器的端口一起传递:

```nginx
proxy_set_header Host       $host:$proxy_port;
```

若是请求头部的某一项是空字符串，则这一项就不会传递给被代理的服务器:

```nginx
proxy_set_header Accept-Encoding "";
```

::: tip 译者注
`$http_host`将取客户端请求时的`Host`，一般是域名；`$proxy_host`是被转发的服务器的 IP 地址。
:::

## 内嵌变量

`ngx_http_proxy_module`模块支持一些内嵌，可以用于在`proxy_set_header`指令里组成`headers`。

- `$proxy_host`
  - `proxy_pass`指令里指定的被代理的服务器的名称和端口
- `$proxy_port`
  - `proxy_pass`指令里指定的被代理的服务器的端口，或协议的默认端口
- `$proxy_add_x_forwarded_for`
  - 其值为: 将`$remote_addr`变量会追加在客户端请求头里的`X-Forwarded-For`项之后，并用逗号分离。
  - 若是客户端请求头里没有`X-Forwarded-For`项，则`$proxy_add_x_forwarded_for`变量的值等同于`$remote_addr`变量。
