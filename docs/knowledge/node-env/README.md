---
sidebarDepth: 0
---

# 总览

[[toc]]

## process.cwd 与 __dirname 的区别

- `process.cwd()`：是当前执行 node 命令时候的文件夹地址
- `__dirname`：是被执行的 js 文件的地址

## require() 处理顺序

当 Node 遇到 require(X) 时，按下面的顺序处理。

1. 如果 X 是内置模块（比如 require('http'）)
    - 返回该模块。
    - 不再继续执行。
2. 如果 X 以 "./" 或者 "/" 或者 "../" 开头
    - 根据 X 所在的父模块，确定 X 的绝对路径。
    - 将 X 当成文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。

      ```js
      X
      X.js
      X.json
      X.node
      ```

    - 将 X 当成目录，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。

      ```js
      X/package.json（main字段）
      X/index.js
      X/index.json
      X/index.node
      ```

3. 如果 X 不带路径
    - 根据 X 所在的父模块，确定 X 可能的安装目录。
    - 依次在每个目录中，将 X 当成文件名或目录名加载。
4. 抛出 "not found"

### require.resolve

获取模块的绝对路径

```js
require.resolve('a.js')
// 结果
// /home/ruanyf/tmp/a.js
```

Reference: [require() 源码解读](http://www.ruanyifeng.com/blog/2015/05/require.html)

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
