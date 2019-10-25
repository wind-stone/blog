# package.json

`package.json`文件是 NPM 包的描述文件，NPM 包的所有行为与包描述文件的字段息息相关。

与 CommonJS 包规范相比，NPM 的实现里的包描述文件多了`author`、`bin`、`main`、`devDependencies`四个字段。

## version

包的`version`需要遵循`Semantic Versioning`（语义化版本）。

### 语义化版本

Reference:

- [官方文档 - 语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
- [Semver(语义化版本号)扫盲](https://juejin.im/post/5ad413ba6fb9a028b5485866)

#### 版本格式

版本格式：主版本号.次版本号.修订号，版本号递增规则如下：

- 主版本号：当你做了不兼容的 API 修改，
- 次版本号：当你做了向下兼容的功能性新增，
- 修订号：当你做了向下兼容的问题修正。

先行版本号及版本编译元数据可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

#### 先行版本

当要发布大版本或者核心的 Feature 时，但是又不能保证这个版本的功能 100% 正常。这个时候就需要通过发布先行版本。

比较常见的先行版本包括：内测版、灰度版本了和 RC 版本。Semver 规范中使用`alpha`、`beta`、`rc`（以前叫做`gama`）来修饰即将要发布的版本。它们的含义是：

- `alpha`: 内部版本
- `beta`: 公测版本
- `rc`: 即`Release candiate`，正式版本的候选版本

比如：`1.0.0-alpha.0`, `1.0.0-alpha.1`, `1.0.0-beta.0`, `1.0.0-rc.0`, `1.0.p-rc.1`等版本。
`alpha`, `beta`, `rc`后需要带上次数信息。

### npm 包发布时修改版本号

通常我们发布一个包到 npm 仓库时，我们的做法是先修改`package.json`为某个版本，然后执行`npm publish`命令。
手动修改版本号的做法建立在你对 Semver 规范特别熟悉的基础之上，否则可能会造成版本混乱。
npm 考虑到了这点，它提供了相关的命令来让我们更好的遵从 Semver 规范：

- 升级补丁版本号：`npm version patch`
- 升级小版本号：`npm version minor`
- 升级大版本号：`npm version major`

当执行`npm publish`时，会首先将当前版本发布到`npm registry`，然后更新`dist-tags.latest`的值为新版本。
当执行`npm publish --tag=next`时，会首先将当前版本发布到`npm registry`，并且更新`dist-tags.next`的值为新版本。
这里的`next`可以是任意有意义的命名（比如：v1.x、v2.x 等等）

## scripts

### scripts 里的参数传递

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

## bin

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
在`npm-bin.js`文件的最顶部，一定要添加`#!/usr/bin/env node`，这一行告诉系统，执行是需要哪个解释器。
详情请见：[Stack Overflow - What exactly does “/usr/bin/env node” do at the beginning of node files?](https://stackoverflow.com/questions/33509816/what-exactly-does-usr-bin-env-node-do-at-the-beginning-of-node-files)
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

### 全局安装的 bin

可以看到，执行`npm i -g`之后，建立起了从`/Users/wind-stone/.nvm/versions/node/v11.10.0/bin/npm-bin`到`/Users/wind-stone/.nvm/versions/node/v11.10.0/lib/node_modules/npm-bin/bin/npm-bin.js`的符号链接。

PS: 系统安装了`nvm`。

### 局部安装的 bin

在常规项目的`node_modules/.bin`路径下执行`ls -l`命令，可以看到局部安装的`vuepress`和`webpack`等包的符号链接：

```sh
lrwxr-xr-x  1 wind-stone  staff  27 10 30 11:54 vuepress -> ../vuepress/bin/vuepress.js
lrwxr-xr-x  1 wind-stone  staff  25 10 22 20:15 webpack -> ../webpack/bin/webpack.js
```

::: warning 警告
局部安装的包，其命令只能在项目脚本和`package.json`的`scripts`字段里面使用， 如果想在命令行下调用，必须像下面这样。

```sh
# 项目的根目录下执行
node_modules/.bin/vuepress dev
```

:::
