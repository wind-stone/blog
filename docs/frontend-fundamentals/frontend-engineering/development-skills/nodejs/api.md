# Node API

[[toc]]

## http.createServer 和 http.Server 的区别

`http.createServer`是基于`http.Server`的封装，详见[Stack Overflow - Node.js' http.Server and http.createServer, what's the difference?](https://stackoverflow.com/questions/13857747/node-js-http-server-and-http-createserver-whats-the-difference)

## process.cwd 与 __dirname 的区别

假设项目目录如下所示：

```js
test-project
  - src
    - path.js
```

### 在 test-project 目录下执行

```sh
➜  test-project node src/path.js
__dirname:  /Users/wind-stone/github/test-project/src
__filename:  /Users/wind-stone/github/test-project/src/path.js
process.cwd():  /Users/wind-stone/github/test-project
path.resolve("./") /Users/wind-stone/github/test-project
```

### 在 src 目录下执行

```sh
➜  test-project cd src
➜  src node path.js
__dirname:  /Users/wind-stone/github/test-project/src
__filename:  /Users/wind-stone/github/test-project/src/path.js
process.cwd():  /Users/wind-stone/github/test-project/src
path.resolve("./") /Users/wind-stone/github/test-project/src
```

### 结论

- `__dirname`: 当前执行的 JS 文件所在的文件夹的绝对路径
- `__filename`: 当前执行的 JS 文件的绝对路径
- `process.cwd()`: 运行`node xxx.js`时所在的文件夹的绝对路径
- `path.resolve('./')`: 运行`node xxx.js`时所在的文件夹的绝对路径

#### path.resolve

- `path.resolve([...paths])`
  - `...paths`: `<string>`，路径或路径片段的序列。
  - 返回: `<string>`

`path.resolve()`方法将路径或路径片段的序列解析为绝对路径。

给定的路径序列从右到左进行处理，每个后续的`path`前置，直到构造出一个绝对路径。 例如，给定的路径片段序列：`/foo`、`/bar`、`baz`，调用 `path.resolve('/foo', '/bar', 'baz')`将返回`/bar/baz`。

如果在处理完所有给定的`path`片段之后还未生成绝对路径，则再加上当前工作目录。

生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。

零长度的`path`片段会被忽略。

如果没有传入`path`片段，则`path.resolve()`将返回当前工作目录的绝对路径。
