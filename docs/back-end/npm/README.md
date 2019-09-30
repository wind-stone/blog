# npm

## npm 配置

`.npmrc`文件，就是`npm`的配置文件所在位置。我们可以找到`.npmrc`文件，以修改各个配置项。

### npm config 命令

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

#### npm config set

```sh
# 设置某项配置项
# npm config set <key> <value>
npm config set registry https://npm.corp.kuaishou.com/
# 或
npm config set registry=https://npm.corp.kuaishou.com/
```

#### npm config get

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

#### npm config delete

```sh
# 删除某配置项
# npm config delete <key>
npm config get registry
```

#### npm config list

```sh
# 查看 npm 的所有配置，包括默认配置
npm config ls -l
```

#### npm config edit

`npm`提供了方便快捷的修改方式，在不知道`.npmrc`这个文件的位置的情况下，也可以修改该文件。

```sh
npm config edit
```

#### npm set/get

`npm set`和`npm get`可能是`npm config set`和`npm config get`的简写方式，官网未说明，待验证。
