# Node

[[toc]]

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

## 事件循环

### 观察者

- I/O 观察者
  - 文件 I/O 观察者
  - 网络 I/O 观察者
- 定时器观察者
  - `setTimeout`
  - `setInterval`
- idle 观察者
  - `process.nextTick`
- check 观察者
  - `setImmediate`

事件循环里对观察者的检查顺序为：

idle 观察者 > I/O 观察者 > check 观察者

## Node 定时器

- 同步任务
- 异步任务
  - 本轮循环
    - process.nextTick
    - Promise
  - 次轮循环
    - setTimeout、setInterval
    - setImmediate

Reference: [Node 定时器详解](http://www.ruanyifeng.com/blog/2018/02/node-event-loop.html)

## 服务稳定性指标

- 资源稳定性
  - CPU
    - CPU Load，即 CPU 负载，表示在一段时间内 CPU 正在处理以及等待 CPU 处理的进程数之和的统计信息。
    - CPU Usage，即 CPU 利用率，代表了程序对 CPU 时间片的占用情况。
  - 内存
    - 内存 RSS，常驻内存集（Resident Set Size）用于表示系统有多少内存分配给当前进程，它能包括所有堆栈和堆内存，是 OOM 主要参考的指标。
    - 内存 V8 Heap，表示 JavaScript 代码执行占用的内存。
    - 内存 max-old-space-size，V8 允许的最大的老生代内存大小，可以简单认为是一个 Node.js 进程长期可维持的最大内存大小。
    - 内存 External，Node.js 中的 Buffer 是基于 V8 Uint8Array 的封装，因此在 Node.js 中使用 Buffer 时，其内存占用量会被记录到 External 中。
  - Libuv，是跨平台的、封装操作系统 IO 操作的库。Node.js 使用 Libuv 作为自己的 event loop，并由 uv 负责 IO 操作
    - Libuv handles，指示了 Node.js 进程中各种 IO 对象（tcp, udp, fs, timer 等对象）的数量。
    - Libuv Latency，通过 setTimeout() 来设置 timer ，并记录回调函数被调用时所消耗的时间和预计消耗的时间之间的差值作为 latency
- 服务运行稳定性
  - 状态码
  - 错误日志
  - pm2 日志
  - 延时
  - QPS

参考自：[提升 Node.js 服务稳定性，需要关注哪些指标？](https://mp.weixin.qq.com/s/2k-52mxPbMUofvT1tjBXUA)
