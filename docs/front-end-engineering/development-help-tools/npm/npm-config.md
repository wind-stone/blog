# npm-config

[[toc]]

## 描述

`npm`会从以下来源获取配置值，按优先级排序为：

## 命令行标记

命令行里的`--foo bar`会将`foo`配置参数的值设置为`bar`。`--`告诉`cli`解析器停止读取标记。使用`--flag`且不带任何指定的值将设置`flag`配置参数的值为`true`。

比如，`--flag1 --flag2`会将`flag1`和`flag2`配置参数的值都设置为`true`，而`--flag1 --flag2 bar`会将`flag1`设置为`true`，`flag2`设置为`bar`。最后，`--flag1 --flag2 -- bar`将设置`flag1`和`flag2`为`true`，且`bar`将作为命令参数。

## 环境变量

任何以`npm_config_`开始的环境变量都将被理解为配置参数。比如，将`npm_config_foo=bar`放入你的环境里，这将设置`foo`配置参数的值为`bar`。任何没有给定一个值的环境变量都将被设置为`true`。配置的值都是不区分大小写的，因此`NPM_CONFIG_FOO=bar`将起同样的作用。但是需要注意，在`npm-scripts`里，`npm`将设置它自己的环境变量，并且比起你设置的大写版本的，Node 更喜欢这些小写版本的，详情请见[这个 issue](https://github.com/npm/npm/issues/14528)。

注意，你需要使用下划线`_`而不是横线`-`，因此`--allow-same-version`将变成`npm_config_allow_same_version=true`。

## npmrc 文件

有四个相关的文件：

- 每个项目的配置文件（`/path/to/my/project/.npmrc`）
- 每个用户的配置文件（默认是`$HOME/.npmrc`；可通过 CLI 选项`--userconfig`或环境变量`$NPM_CONFIG_USERCONFIG`配置）
- 全局的配置文件（默认是`$PREFIX/etc/npmrc`；可通过 CLI 选项`--globalconfig`或环境变量`$NPM_CONFIG_GLOBALCONFIG`配置）
- `npm`内置的配置文件（`/path/to/npm/npmrc`）

更多详情可见[npmrc](./npmrc.md)。

## 默认配置

运行`npm config ls -l`可看到`npm`内部的配置参数集合，这些都是默认值如果没有特殊设置的话。

## 简写以及一些其他的 CLI 细节

以下这些简写会在命令行解析：

- `-v`: `--version`
- `-h`, `-?`, `--help`, `-H`: `--usage`
- `-s`, `--silent`: `--loglevel silent`
- `-q`, `--quiet`: `--loglevel warn`
- `-d`: `--loglevel info`
- `-dd`, --verbose: --loglevel verbose
- `-ddd`: `--loglevel silly`
- `-g`: `--global`
- `-C`: `--prefix`
- `-l`: `--long`
- `-m`: `--message`
- `-p`, `--porcelain`: `--parseable`
- `-reg`: `--registry`
- `-f`: `--force`
- `-desc`: `--description`
- `-S`: `--save`
- `-P`: `--save-prod`
- `-D`: `--save-dev`
- `-O`: `--save-optional`
- `-B`: `--save-bundle`
- `-E`: `--save-exact`
- `-y`: `--yes`
- `-n`: `--yes false`
- `ll` and `la` commands: `ls --long`

若是指定的配置参数可以明确地解析到一个已知的配置参数，则它将扩展为那个配置参数。比如：

```sh
npm ls --par
# same as:
npm ls --parseable
```

若是多个单字符简写连在一起，且连起来的结果组合明确不是其他的配置参数，则它将扩展为它的各个组成片段。比如：

```sh
npm ls -gpld
# same as:
npm ls --global --parseable --long --loglevel info
```

## 每个包的配置设置

当运行脚本时（详见[npm-scripts](https://www.npmjs.cn/misc/scripts/)），`package.json`文件里的`config`属性将被环境里的`<name>[@<version>]:<key>`形式的配置参数覆盖。比如，`package.json`是这样：

```json
{
    "name" : "foo",
    "config": {
        "port" : "8080"
    },
    "scripts": {
        "start" : "node server.js"
    }
}
```

且`server.js`是这样：

```js
http.createServer(...).listen(process.env.npm_package_config_port)
```

则用户可通过以下方式改变之前设置的行为：

```sh
npm config set foo:port 80
```

更多信息可见[package.json](https://www.npmjs.cn/files/package.json/)。

## 各项配置

各个配置项，详情[Config Settings](https://www.npmjs.cn/misc/config/#config-settings)
