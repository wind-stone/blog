# package.json

`package.json`文件是 NPM 包的描述文件，NPM 包的所有行为与包描述文件的字段息息相关。

与 CommonJS 包规范相比，NPM 的实现里的包描述文件多了`author`、`bin`、`main`、`devDependencies`四个字段。

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
在`npm-bin.js`文件的最顶部，一定要添加`#!/usr/bin/env node`，这一行告诉系统，执行是需要哪个解释器。详情请见：[Stack Overflow - What exactly does “/usr/bin/env node” do at the beginning of node files?](https://stackoverflow.com/questions/33509816/what-exactly-does-usr-bin-env-node-do-at-the-beginning-of-node-files)
:::

在该项目根目录下执行`npm i -g`，全局安装该包。继续执行`npm-bin`命令，则`npm-bin.js`就会执行。

```shell
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

```shell
lrwxr-xr-x  1 wind-stone  staff  27 10 30 11:54 vuepress -> ../vuepress/bin/vuepress.js
lrwxr-xr-x  1 wind-stone  staff  25 10 22 20:15 webpack -> ../webpack/bin/webpack.js
```

::: warning 警告
局部安装的包，其命令只能在项目脚本和`package.json`的`scripts`字段里面使用， 如果想在命令行下调用，必须像下面这样。

```shell
# 项目的根目录下执行
$ node_modules/.bin/vuepress dev
```

:::