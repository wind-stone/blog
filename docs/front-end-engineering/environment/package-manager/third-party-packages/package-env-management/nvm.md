# nvm 管理 Node.js 版本

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
