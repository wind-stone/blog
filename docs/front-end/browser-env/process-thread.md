---
sidebarDepth: 0
---

# 浏览器多进程和 JS 单线程

[[toc]]

Reference: [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://segmentfault.com/a/1190000012925872)

## 浏览器是多进程的

- 浏览器是多进程的
- 浏览器之所以能够运行，是因为系统给它的进程分配了资源（cpu、内存）
- 简单点理解，每打开一个 Tab 页，就相当于创建了一个独立的浏览器进程

### 浏览器包含哪些进程

浏览器主要包含这些进程：

- Browser 进程：浏览器的主进程（负责协调、主控），只有一个。作用有
  - 负责各个页面的管理，创建和销毁其他进程
  - 负责浏览器界面显示，与用户交互。如前进，后退等
  - 将 Renderer 进程得到的内存中的 Bitmap，绘制到用户界面上
  - 网络资源的管理，下载等
- GPU 进程：最多一个，用于 3D 绘制等
- 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
- 浏览器渲染进程（即 Renderer 进程、浏览器内核），该进程内部是多线程的，默认每个 Tab 页面是一个渲染进程，互不影响。主要作用为
  - 页面渲染（GUI 线程）
  - 脚本执行（JS 引擎线程）
  - 事件处理（事件触发线程）
  - 定时计时（定时器线程）
  - 异步请求（异步 HTTP 请求线程）

### 浏览器多进程的优势

相比于单进程浏览器，多进程有如下优点：

- 避免单个页面 crash 影响整个浏览器
- 避免第三方插件 crash 影响整个浏览器
- 多进程充分利用多核优势
- 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

但是，内存等资源消耗也会更大。

### 浏览器渲染进程，多线程

PS: 在本文中，浏览器渲染进程 = Renderer 进程 = 浏览器内核。

浏览器渲染进程是多线程的，包括的线程主要有：

- GUI 渲染线程
  - 负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。
  - 当界面需要重绘`repaint`或由于某种操作引发回流`reflow`时，该线程就会执行
  - 注意，GUI 渲染线程与 JS 引擎线程是互斥的，当 JS 引擎执行时 GUI 线程会被挂起（相当于被冻结了），GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行。
- JS 引擎线程
  - 也称为 JS 内核，负责处理 Javascript 脚本程序，例如 V8 引擎
  - JS 引擎线程负责解析 Javascript 脚本，运行代码。
  - JS 引擎一直等待着任务队列中任务的到来，然后加以处理，一个 Tab 页（渲染进程）中无论什么时候都只有一个 JS 线程在运行 JS 程序
  - 同样注意，GUI 渲染线程与 JS 引擎线程是互斥的，所以如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。
- 事件触发线程
  - 归属于浏览器而不是 JS 引擎，用来控制事件循环（可以理解，JS 引擎自己都忙不过来，需要浏览器另开线程协助）
  - 当 JS 引擎执行代码块如`setTimeOut`时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX 异步请求等），会将对应任务添加到事件线程中
  - 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理
  - 注意，由于 JS 的单线程关系，所以这些待处理队列中的事件都得排队等待 JS 引擎处理（当 JS 引擎空闲时才会去执行）
- 定时触发器线程
  - 传说中的`setInterval`与`setTimeout`所在线程
  - 浏览器定时计数器并不是由 JavaScript 引擎计数的,（因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
  - 因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待 JS 引擎空闲后执行）
  - 注意，W3C 在 HTML 标准中规定，规定要求`setTimeout`中低于`4ms`的时间间隔算为`4ms`。
- 异步 http 请求线程
  - 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求
  - 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。

### 浏览器内核中各个线程的关系

#### GUI 渲染线程与 JS 引擎线程互斥

JavaScript 是可操纵 DOM 的，如果在修改这些元素属性的同时去渲染界面（即 JS 线程和 GUI 线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。因此为了防止渲染出现不可预期的结果，浏览器设置 GUI 渲染线程与 JS 引擎线程为互斥的关系。当 JS 引擎线程执行时，GUI 线程会被挂起。GUI 更新则会被保存在一个队列中等到 JS 引擎线程空闲时立即被执行。

#### JS阻塞页面加载

从上述的互斥关系，可以推导出，JS 如果执行时间过长就会阻塞页面。

譬如，假设 JS 引擎正在进行巨量的计算，此时就算 GUI 有更新，也会被保存到队列中，等待 JS 引擎空闲后执行。然后，由于巨量计算，所以 JS 引擎很可能很久很久后才能空闲，自然会感觉到巨卡无比。

所以，要尽量避免 JS 执行时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞的感觉。

#### Web Worker

HTML5 支持 Web Worker，创建 Web Worker 时，JS 引擎线程会想浏览器内核申请开启一个子线程，且 JS 引擎线程与 Web Worker 线程通过特定的方式通信，比如 postMessage API。

因此，若是有非常耗时的工作，需要单独开启一个 Web Worker 线程，Web Worker 线程不会影响 JS 引擎线程，等到计算出结果后，将结果通信给 JS 引擎线程。

### CSS 加载是否会阻塞 DOM 树渲染？

以下说的是`head`里引入 CSS 的情况。

首先，CSS 是由单独的下载线程异步下载的。

CSS 加载不会阻塞 DOM 树解析（异步加载时 DOM 照常构建），但会阻塞 Render 树渲染（渲染时需等 CSS 加载完毕，因为 Render 树需要 CSS 信息），这可能也是浏览器的一种优化机制。因为加载 CSS 的时候，可能会修改下面 DOM 节点的样式，如果 CSS 加载不阻塞 Render 树渲染的话，那么当 CSS 加载完之后，Render 树可能又得重新重绘或者回流了，这就造成了一些没有必要的损耗。所以干脆就先把 DOM 树的结构先解析完，把可以做的工作做完，然后等你CSS 加载完之后，再根据最终的样式来渲染 Render 树，这种做法性能方面确实会比较好一点。

### 定时器线程

当使用`setTimeout`和`setInterval`时，就需要定时器线程计时，计时完成后，就将事件推入到事件触发线程的任务队列里。

为什么不是 JS 引擎计时呢？因为 JS 引擎是单线程的，若是 JS 引擎线程处于阻塞状态，就会影响计时的准确，因此需要单独开一个定时器线程来计时。

#### setTimeout 模拟 setInterval

`setTimeout`模拟`setInterval`的效果，与直接使用`setInterval`是有区别的。

每次`setTimeout`计时到达后就会加入任务队列等待执行，执行结束后会继续添加`setTimeout`来模拟`setInterval`，因此，相邻两次`setTimeout`的时间间隔为单次`setTimeout`回调函数的执行时间 + `setTimeout`的定时时间（忽略在任务队列的等待时间）。

而`setInterval`是每次都按精确的定时，隔一段时间向任务队列加入一个事件（回调）。若是 JS 引擎一直阻塞，在一段时间内任务队列里可能存在在多个连续的`setInterval`回调，等到 JS 引擎空闲时，任务队列里的这些回调可能会连续执行。

若是 JS 引擎执行正常，不出现阻塞的情况，正常使用`setInterval`，两次`setInterval`回调的间隔时间也比两次`setTimeout`回调的间隔时间要短一些，而短的这个时间，就是`setTimeout`回调执行的时间。