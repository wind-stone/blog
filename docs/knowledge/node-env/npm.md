---
sidebarDepth: 0
---

# NPM

NPM 是 CommonJS 包规范的一种实现。

[[toc]]

## CommonJS 包规范的目录

- `package.json`：包描述文件
- `bin`：用于存放可执行二进制文件的目录
- `lib`：用于存放 JavaScript 代码的目录
- `doc`：用于存放文档的目录
- `test`：用于存放单元测试用例的代码

## package.json

`package.json`文件是 NPM 包的描述文件，NPM 包的所有行为与包描述文件的字段息息相关。

与 CommonJS 包规范相比，NPM 的实现里的包描述文件多了`author`、`bin`、`main`、`devDependencies`四个字段。

### bin

一些包作者希望包可以作为命令行工具使用。配置好`bin`字段后，通过`npm install package_name -g`命令可以将脚本添加到执行路径中，之后可以在命令行中直接执行。

```json
{
  "name": "express",
  "bin": {
    "express": "./bin/express"
  }
}
```

## 安装依赖包

### 全局安装

`npm install express -g`命令是对`express`进行全局安装，`-g`是将一个包安装为全局可用的可执行命令。它根据包描述文件中`bin`字段配置，将实际脚本链接到与 Node 可执行文件相同的路径下：

```json
{
  "bin": {
    "express": "./bin/express"
  }
}
```

