---
sidebarDepth: 0
---

# CommonJS 规范及实现

[[toc]]

## 包规范的实现 - NPM

NPM 是 CommonJS 包规范的一种实现。

### CommonJS 包规范的目录

- `package.json`：包描述文件
- `bin`：用于存放可执行二进制文件的目录
- `lib`：用于存放 JavaScript 代码的目录
- `doc`：用于存放文档的目录
- `test`：用于存放单元测试用例的代码

### package.json

`package.json`文件是 NPM 包的描述文件，NPM 包的所有行为与包描述文件的字段息息相关。

与 CommonJS 包规范相比，NPM 的实现里的包描述文件多了`author`、`bin`、`main`、`devDependencies`四个字段。

#### scripts 里的参数传递

假设`package.json`文件里如下配置了`scripts`属性：

```json
{
  "name": "script-tests",
  "version": "1.0.0",
  "description": "Foo Bar",
  "scripts": {
    "pm2": "node ./server/pm2.js"
  }
}
```

当在控制台执行`npm run pm2 hello world`后，实际上是执行了`node ./server/pm2.js "hello" "world"`命令，在`./server/pm2.js`文件里的输出如下：

```js
// ./server/pm2.js
console.log('0', process.argv[0]) // 0 /Users/wind-stone/.nvm/versions/node/v11.10.0/bin/node
console.log('1', process.argv[1]) // 1 /Users/wind-stone/kuaishou/ug-node-h5/server/pm2.js
console.log('2', process.argv[2]) // 2 hello
console.log('3', process.argv[3]) // 3 world
```

#### bin

若是在`package.json`文件下定义了如下示例里的`bin`属性，该包安装时将建立符号链接，全局安装时将链接到`prefix/bin`，局部安装时将链接到`./node_modules/.bin/`。

`package.json`文件：

```json
{
  "name": "npm-bin",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "npm-bin": "./bin/npm-bin.js"
  },
  // 若只有一个可执行文件，可直接使用包名作为命令名称
  // "bin": "./bin/npm-bin.js",
  "author": "",
  "license": "ISC"
}
```

`./bin/npm-bin.js`文件：

```js
#!/usr/bin/env node
console.log('输入参数为：')
for (let i = 0; i < 3; i++) {
  console.log(`process.argv[${i}]: ${process.argv[i]}`)
}
```

::: tip 提示
在`npm-bin.js`文件的最顶部，一定要添加`#!/usr/bin/env node`，这一行告诉系统，执行是需要哪个解释器。详情请见：[Stack Overflow - What exactly does “/usr/bin/env node” do at the beginning of node files?](https://stackoverflow.com/questions/33509816/what-exactly-does-usr-bin-env-node-do-at-the-beginning-of-node-files)
:::

在该项目根目录下执行`npm i -g`，全局安装该包。继续执行`npm-bin`命令，则`npm-bin.js`就会执行。

```sh
➜  npm-bin npm i -g
/Users/wind-stone/.nvm/versions/node/v11.10.0/bin/npm-bin -> /Users/wind-stone/.nvm/versions/node/v11.10.0/lib/node_modules/npm-bin/bin/npm-bin.js
+ npm-bin@1.0.0
added 1 package in 0.087s

➜  npm-bin npm-bin
输入参数为：
process.argv[0]: /Users/wind-stone/.nvm/versions/node/v11.10.0/bin/node
process.argv[1]: /Users/wind-stone/.nvm/versions/node/v11.10.0/bin/npm-bin
process.argv[2]: undefined
```

##### 全局安装的 bin

可以看到，执行`npm i -g`之后，建立起了从`/Users/wind-stone/.nvm/versions/node/v11.10.0/bin/npm-bin`到`/Users/wind-stone/.nvm/versions/node/v11.10.0/lib/node_modules/npm-bin/bin/npm-bin.js`的符号链接。

PS: 系统安装了`nvm`。

##### 局部安装的 bin

在常规项目的`node_modules/.bin`路径下执行`ls -l`命令，可以看到局部安装的`vuepress`和`webpack`等包的符号链接：

```sh
lrwxr-xr-x  1 wind-stone  staff  27 10 30 11:54 vuepress -> ../vuepress/bin/vuepress.js
lrwxr-xr-x  1 wind-stone  staff  25 10 22 20:15 webpack -> ../webpack/bin/webpack.js
```

::: warning 警告
局部安装的包，其命令只能在项目脚本和`package.json`的`scripts`字段里面使用， 如果想在命令行下调用，必须像下面这样。

```sh
# 项目的根目录下执行
$ node_modules/.bin/vuepress dev
```

:::

### 安装依赖包

#### 全局安装

`npm install express -g`命令是对`express`进行全局安装，`-g`是将一个包安装为全局可用的可执行命令。它根据包描述文件中`bin`字段配置，将实际脚本链接到与 Node 可执行文件相同的路径下：

```json
{
  "bin": {
    "express": "./bin/express"
  }
}
```

## 模块规范的实现

Node 作为 CommonJS 规范的实现，并没有完全按照规范实现，而是对模块规范进行了一定的取舍，同时也添加了少许自身需要的特性。

Node 中引入模块，需要经历如下3个步骤：

1. 路径分析
2. 文件定位
3. 编译执行

### 自定义模块的路径分析及文件定位

现在针对自定义模块，简单说明其路径分析和文件定位是如何进行的。

#### 第一步：路径分析

在`/home/wind-stone/project/`目录下，创建`app.js`文件，其内容为`console.log(module.paths)`，在当前目录下执行`node app.js`，Linux 下，得到的输出为一数组，数组内的每一项称为模块路径，该数组的结构为：

```js
[
    '/home/wind-stone/project/node_modulse',  // 当前文件目录下的 node_modules 目录
    '/home/wind-stone/node_modulse',          // 父目录下的 node_modules 目录
    '/home/node_modulse',                     // 父目录的父目录下的 node_modules 目录
    '/node_modulse',                          // 沿路径向上逐级递归，直到根目录下的 node_modules 目录
]
```

以上即为查找自定义模块时的各级模块路径，Node 会先在当面目录的`node_modules`查找模块即定位文件，若是没找到，会沿路径向上逐级递归，直到根目录下的`node_modules`目录定位文件。

#### 第二步：文件定位

上述每查找到一`node_modules`目录时，就要进行文件定位。其过程为：

1. 文件扩展名分析：若`require()`所引用的模块标识符不包含扩展名，则 Node 会按`.js`、`.json`、`.node`的次序补足扩展名，依次尝试。
2. 目录分析和包：若是上一步没找到文件，但是得到同名的目录，此时 Node 会将目录当成一个包来处理
    - 首先，Node 会在当前目录下查找`package.json`文件，通过`JSON.parse()`解析出包描述对象里的`main`属性指定的文件名进行定位，若是文件名缺少扩展名，将会进入扩展名分析的步骤
    - 若是`package.json`文件不存在，或者`main`属性制定的文件名错误，Node 会将`index`当做默认文件名，然后做扩展名分析，即依次查找`index.js`、`index.json`、`index.node`。

若是在文件定位的过程中没有成功定位到任何文件，则自定义模块进入下一模块路径进行查找。

若是模块路径数组都被遍历完毕，依然没有查找到目标文件，则会抛出查找失败的异常。

Reference: [深入浅出 NodeJS]

### require.resolve

获取模块的绝对路径

```js
require.resolve('a.js')
// 结果
// /home/ruanyf/tmp/a.js
```

Reference: [require() 源码解读](http://www.ruanyifeng.com/blog/2015/05/require.html)