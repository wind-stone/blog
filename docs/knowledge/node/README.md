---
sidebarDepth: 0
---

# 未分类知识点

[[toc]]

## process.cwd 与 __dirname 的区别

- `process.cwd()`：是当前执行 node 命令时候的文件夹地址
- `__dirname`：是被执行的 js 文件的地址

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
