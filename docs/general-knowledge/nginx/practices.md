# Nginx 实践

## Vue MPA 项目配置 Nginx

针对于 Vue MPA 工程，工程里会存在多个业务，每个业务都是一个 SPA。假设上线后，前端模板代码都位于`/data/project/wind-stone-blog/latest/`目录下，该目录结构如下：

```txt
├── front-end
|   └── index.html
├── back-end
|   ├── index.html
|   └── main.html
├── es6
|   └── index.html
├── vue
|   └── index.html
├── test
|   └── index-test.html
```

其中，`front-end`、`back-end`、`es6`、`vue`分别代表不同的业务，每个业务都是 SPA。

Nginx 的`blog.windstone.cc.conf`配置文件如下：

```conf
server {
    listen      8080;

    # 可以传递多个域名，还有通过通配符 * 配置所有子域名，比如
    # server_name blog.windstone.cc m.windstone.cc *.m.windstone.cc;
    server_name blog.windstone.cc;

    # 访问日志
    access_log  /data/logs/nginx/blog.windstone.cc.access.log  main;
    error_log  /data/logs/nginx/blog.windstone.cc.error.log;

    keepalive_requests 30;

    # 根目录，在如下描述中用 $root 占位
    root /data/project/wind-stone-blog/latest/;

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    error_page   403  /403.html;
    location = /403.html {
        root   html;
    }

    error_page  404  /404.html;
    location = /404.html {
        root   html;
    }

    location /front-end/ {
        try_files $uri $uri/ /front-end/index.html;
        index index.html;
    }

    location /back-end/ {
        try_files $uri $uri/ /back-end/index.html;
        index index.html;
    }

    location /es6/ {
        try_files $uri $uri/ /es6/index.html;
        index index.html;
    }

    location /test/hello {
        try_files $uri $uri/ /es6/index.html;
        # index 可以有多个默认的文件
        # index world.html world2.html
        index world.html;
    }

    # ...
}
```

### try_files

当访问`http://blog.windstone.cc/es6/array`时，会经过 Nginx 的如下规则处理。

```conf
    location /es6/ {
        try_files $uri $uri/ /es6/index.html;
        index /es6/index.html;
    }
```

根据`try_files`的写法，

1. 首先，查找`$uri`即`/es6/array`，也就是`$root/es6`文件夹下的`array`文件，找到则返回文件，否则进入下一步；
2. 其次，查找`$uri/`即`/es6/array/`，也就是`$root/es6/array`文件夹，查看该文件夹下是否有`index.html`文件，有则返回文件，否则进入下一步；
3. 最后，查找`/es6/index.html`，即`$root/es6/index.html`文件，有则返回。

### index

当访问`http://localhost:9527/test/hello`时，会经过 Nginx 的如下规则处理。

```conf
    location /test/hello {
        try_files $uri $uri/ /es6/index.html;
        index world.html;
    }
```

先按照`try_files`进行处理，当处理第二步的`$uri/`时，会结合`index world.html`，此时会查找`/test/hello/world.html`是否存在，不存在则进入下一步。

因此`location`里的`index`的作用时，在查找文件夹时，指定该文件夹下默认匹配的文件。因此当访问`http://localhost:9527/test/hello`时，会返回``

详情请见[Nginx: When the `index` and `try_files` in the same block, why the `try_files` will be processed, not the `index` directive?](https://stackoverflow.com/questions/36175676/nginx-when-the-index-and-try-files-in-the-same-block-why-the-try-files-w)
