---
sidebarDepth: 0
---

# npm 命令

[[toc]]

## npm config 命令

`npm config`命令是一组设置`npm`配置的命令。通过`npm config -h`可以查看到所有这些命令，详见[官方文档 - npm-config](https://docs.npmjs.com/cli/config)。

```sh
➜  ~ npm config -h
npm config set <key> <value>
npm config get [<key>]
npm config delete <key>
npm config list [--json]
npm config edit
npm set <key> <value>
npm get [<key>]
```

### npm config set

```sh
# 设置某项配置项
# npm config set <key> <value>
npm config set registry https://npm.corp.kuaishou.com/
# 或
npm config set registry=https://npm.corp.kuaishou.com/
```

### npm config get

```sh
# 获取某配置项的值
# npm config get [<key>]
npm config get registry
```

```sh
# 获取通过 npm install xxx -g 安装的 xxx 文件的安装目录
# 默认情况下，
#     windows 系统的路径基础部分是：%APPDATA%/npm/
#     mac系统下路径基础部分是：/usr/local/
# 若是安装了 nvm 等控制 node 版本的工具，路径基础部门将改变
npm config get prefix
```

### npm config delete

```sh
# 删除某配置项
# npm config delete <key>
npm config get registry
```

### npm config list

```sh
# 查看 npm 的所有配置，包括默认配置
npm config ls -l
```

### npm config edit

`npm`提供了方便快捷的修改方式，在不知道`.npmrc`这个文件的位置的情况下，也可以修改该文件。

```sh
npm config edit
```

### npm set/get

`npm set`和`npm get`可能是`npm config set`和`npm config get`的简写方式，官网未说明，待验证。

## npm dist-tag

详见[npm-dist-tag](https://docs.npmjs.com/cli/dist-tag.html)

### 查看包的发布 tag

```sh
# 语法
npm dist-tag ls [<pkg>]

# 示例
npm dist-tag ls vue
# 结果
# beta: 2.6.0-beta.3
# csp: 1.0.28-csp
# latest: 2.6.10
```

### 添加包的发布 tag

```sh
# 语法
npm dist-tag add <pkg>@<version> [<tag>]
```

### 删除包的发布 tag

```sh
# 语法
npm dist-tag rm <pkg> <tag>
```

## npm view

显示包的信息，`npm view`的别名: `npm info`, `npm show`, `npm v`。详见[NPM - npm-view](https://docs.npmjs.com/cli/v7/commands/npm-view)

### npm view package@version

```sh
# 查看 vue@latest 的包信息
npm view vue

# output:

# vue@2.6.12 | MIT | deps: none | versions: 311
# Reactive, component-oriented view layer for modern web interfaces.
# https://github.com/vuejs/vue#readme

# keywords: vue

# dist
# .tarball: https://registry.npmjs.org/vue/-/vue-2.6.12.tgz
# .shasum: f5ebd4fa6bd2869403e29a896aed4904456c9123
# .integrity: sha512-uhmLFETqPPNyuLLbsKz6ioJ4q7AZHzD8ZVFNATNyICSZouqP2Sz0rotWQC8UNBF6VGSCs5abnKJoStA6JbCbfg==
# .unpackedSize: 3.0 MB

# maintainers:
# - yyx990803 <yyx990803@gmail.com>

# dist-tags:
# csp: 1.0.28-csp  latest: 2.6.12   next: 3.0.7

# published 6 months ago by yyx990803 <yyx990803@gmail.com>
```

### npm view package versions

```sh
# 查看 vue 的所有历史版本
npm view vue versions

# output

# [ '0.0.0',
#   '0.6.0',
#   '0.7.0',
#   ...
#   '3.0.4',
#   '3.0.5',
#   '3.0.6' ]
```

### npm view package repository.url

```sh
# 查看 vue 的 git 仓库地址
npm view vue repository.url

# output:
# git+https://github.com/vuejs/vue.git
```

### npm view package --json

```sh
# 以 json 格式显示 vue 的所有信息
npm view vue --json
```
