# Node

[[toc]]

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
