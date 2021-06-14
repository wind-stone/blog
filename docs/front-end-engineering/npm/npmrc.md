# npmrc

[[toc]]

## 描述

`npm`会从命令行、环境变量和`.npmrc`文件里获取配置信息。

`npm config`命令用于更新和编辑用户及全局`.npmrc`文件的内容。

所有可用配置的选项，可见[npm-config](./npm-config.md)。

`.npmrc`文件，就是`npm`的配置文件所在位置。我们可以找到`.npmrc`文件，以修改各个配置项。

## 文件

这里有四个相关的文件（PS：按优先级从高到底排序）：

- 每个项目的配置文件（`/path/to/my/project/.npmrc`）
- 每个用户的配置文件（`~/.npmrc`）
- 全局的配置文件（`$PREFIX/etc/npmrc`）
- `npm`内置的配置文件（`/path/to/npm/npmrc`）

所有的配置文件都是`key = value`参数对的`ini`格式的配置列表。环境变量可以使用`${VARIABLE_NAME}`代替，比如：

```txt
prefix = ${HOME}/.npm-packages
```

这四个文件都会被加载，且配置项会以优先级顺序解析。比如，用户配置文件里的设置将覆盖全局配置文件里的设置。

可以通过在配置项名称之后添加`[]`来指定数组值。比如：

```txt
key[] = "first value"
key[] = "second value"
```

## 注释

`.npmrc`文件里以`;`或字符`#`开始的行，会被理解为注释。`.npmrc`文件会被[npm/ini](https://github.com/npm/ini)解析，也是它规定了这种注释语法。比如：

```
# last modified: 01 Jan 2016
; Set a new registry for a scoped package
@myscope:registry=https://mycustomregistry.example.org
```

## 每个项目的配置文件

当在本地项目里工作时，项目根目录下（比如与`node_modules`和`package.json`同级）的`.npmrc`文件将设置特定于这个项目的配置值。

注意这只应用于你运行`npm`时所在的项目的根目录。当你的模块已经发布了，它将不起作用。比如，你不能发布一个强制它自己安装到全局或其他位置的模块。

此外，该文件不会在全局模式被使用，比如当运行`npm install -g`时。

## 每个用户的配置文件

`$HOME/.npmrc`（或设置在环境或命令行里的`userconfig`参数配置的位置）

## 全局配置文件

`$PREFIX/etc/npmrc`（或设置在环境或命令行里的`globalconfig`参数配置的位置）：这个文件是`key=value`参数对的`ini`文件格式化的列表。可以像如上那样使用环境变量。

## 内置的配置文件

`path/to/npm/itself/npmrc`

这是一个不可更改的内置配置文件，将与`npm`的更新保持一致。将使用安装`npm`时带来的`./configure`脚本来设置配置项。这主要是为了以一种标准和一致的行为让分散的维护者去覆盖默认配置。
