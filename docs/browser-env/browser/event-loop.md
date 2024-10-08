# 事件循环

[[toc]]

## 参考文档

- [WHATWG - 8.1.6 Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

## 名词中英文

- `任务`: `task`
- `任务队列`: `task queue`

## 任务队列

`任务队列`，是一批任务的集合。

::: tip 提示
`任务队列`是集合[set](https://infra.spec.whatwg.org/#sets)，而不是队列[queue](https://infra.spec.whatwg.org/#queues)，因为在[事件循环处理模型的第一步](https://html.spec.whatwg.org/multipage/webappapis.html#step1)抓取的是选定的任务队列里的第一个可运行的任务，而不是以出队列方式获取的第一个任务。
:::

在 WHATWG 规范里，定义了在主线程的事件循环中，可以有多个任务队列，比如鼠标事件队列，IO 完成任务队列，渲染任务队列，并且可以给这些任务队列排优先级。但浏览器只实现了常规任务队列和延迟任务队列，这两个队列里存放的都是宏任务。

因此关于任务队列，规范和实现不太一致。

延迟任务队列主要是放一些定时执行的任务，如 JavaScript 设置定时器的回调，还有浏览器内部的一些定时回调任务，这类任务需要等到指定时间间隔之后执行。

而常规的任务队列（简称为任务队列）中的任务只会按照顺序执行，执行完上个任务接着执行下个任务，不需要关心时间间隔。

::: warning 注意
这里的延迟任务队列并不是真正的数据结构上的队列，其本质是个 HashMap，等到主线程检查延迟任务队列时，会计算 HashMap 里的每个任务是否到期，若是到期则取出执行，执行完所有到期的任务后，才会进入到下一轮循环。
:::

### 任务队列里可能有哪些宏任务

- 页面渲染事件（如解析 DOM、计算布局、绘制）
- 用户交互事件（如鼠标点击、滚动页面、放大缩小等）
- 各种 IO 完成事件
  - 网络请求完成事件
    - 异步 XMLHttpRequest 请求回调事件
  - 文件读写完成事件
- JavaScript 脚本执行事件
- 垃圾回收事件
- 等等

以上列举的只是一小部分事件，这些事件被添加到任务队列之后，事件循环系统就会按照任务队列中的顺序来执行事件。

## 定时器的实现

如下以`setTimeout`举例，`setInterval`同理。

### setTimeout 的实现

当调用定时器如`setTimeout(fn, delay)`设置回调函数时，回调函数需要在指定的`delay`时间后执行。但是，任务队列中的任务是按序执行的，因而无法保证回调函数能在指定时间后执行，因此渲染进程不能将回调任务添加到任务队列里。

Chrome 里除了常规使用的任务队列之外，还有另外一个任务队列，这个队列中维护了需要延迟执行的任务列表，包括了定时器和 Chromium 内部一些需要延迟执行的任务，我们姑且先称其为延迟任务队列。因此当通过 JavaScript 创建一个定时器时，渲染进程会将该定时器的回调任务添加到延迟任务队列中。

当通过 JavaScript 调用`setTimeout(fn, delay)`设置回调函数的时候，渲染进程将会创建一个回调任务，包含了回调函数`fn`、当前发起时间、延迟执行时间，其模拟代码如下所示：

```c++
struct DelayTask{
  int64 id；
  CallBackFunction cbf;
  int start_time;
  int delay_time;
};
DelayTask timerTask;
timerTask.cbf = fn;
timerTask.start_time = getCurrentTime(); // 获取当前时间
timerTask.delay_time = delay;            // 设置延迟执行时间
```

创建好回调任务之后，再将该任务添加到延迟任务队列里。那么，事件循环系统是如何执行延迟任务队列里的任务的呢？

```c++
void ProcessTimerTask(){
  // 从 延迟任务队列 中取出已经到期的定时器任务
  // 依次执行这些任务
}

TaskQueue task_queue；
void ProcessTask();
bool keep_running = true;
void MainTherad(){
  for(;;){
    // 执行任务队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);

    // 执行延迟任务队列中的任务
    ProcessDelayTask()

    // 如果设置了退出标志，那么直接退出线程循环
    if(!keep_running)
        break;
  }
}
```

上段代码中，处理完任务队列中的单个任务之后，就开始执行 ProcessDelayTask 函数。ProcessDelayTask 函数会根据发起时间和延迟时间计算出到期的回调任务（可能有多个），然后依次执行这些到期的任务。等到期的回调任务执行完成之后，再继续下一个循环过程。通过这样的方式，一个完整的定时器就实现了。

需要注意的是，每一次事件循环，都会先从任务队列里取出一个宏任务执行，该宏任务执行完成后，主线程会去检查延迟任务队列里的所有宏任务，将已经到期的宏任务全部取出后一一执行，等到这些宏任务执行完毕后，再进入到下一次事件循环。此外，不管是任务队列里的宏任务还是延迟任务队列里的宏任务，其执行时都会创建其专属的微任务队列，等到该宏任务执行完毕后，再将其所属的微任务队列里的微任务一一执行。

### clearTimeout 的实现

调用定时器如`clearTimeout`之后，JavaScript 引擎会返回一个定时器的 ID。通常情况下，当一个定时器的回调任务还没有被执行时，可以调用`clearTimeout`函数并传入需要定时器的 ID 来取消回调任务的执行。其实浏览器内部实现取消定时器的操作也是非常简单的，就是直接从延迟任务队列中，通过 ID 查找到对应的回调任务，然后再将其从队列中删除就可以了。

### 使用 setTimeout 的一些注意事项

- 如果当前任务执行时间过久，会影响定时器任务的执行

若是从`task_queue`取出的`task`执行时间过久，尽管定时器设置的延时时间在`task`执行完成之前就已经达到，但是必须等到`task`执行完成之后，主线程才会去检查延迟任务队列。因此，不管是`setTimeout`还是`setInterval`，其最终延迟执行的时间，都会大于等于设置的`delay`。

- 如果`setTimeout`存在嵌套调用，那么系统会设置最短时间间隔为 4 毫秒

`setTimeout`嵌套调用超过五次以上，后面每次的调用最小时间间隔是 4 毫秒。这是因为在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4 毫秒，那么浏览器会将每次调用的时间间隔设置为 4 毫秒。

- 未激活的页面`setTimeout`执行最小间隔是 1000 毫秒

如果标签页不是当前的激活标签页，或者页面被切换到后台，那么页面里的定时器最小的时间间隔是 1000 毫秒，目的是为了优化后台页面的加载损耗以及降低耗电量。

- 延时执行时间`delay`有最大值，超过最大值后会被设置为 0

Chrome、Safari、Firefox 都是以 32 位来存储延时值的，32 位最大只能存放的数字是 2147483647 毫秒（2<sup>31</sup>-1，因为有一位是符号位）。也就是说，如果`setTimeout`设置的延迟值大于 2147483647 毫秒（大约 24.8 天）时就会溢出，那么相当于延时值被设置为 0 了，这导致定时器会被立即执行。

- `setTimeout`设置的回调函数中的`this`指向全局`window`（严格模式下为`undefined`）

## 异步 XMLHttpRequest 请求回调

- 创建 XMLHttpRequest 对象`xhr`，注册回调、配置请求信息后，调用`xhr.send`发起网络请求。
- 渲染进程将请求发送给网络进程，由网络进程负责资源的下载；网络进程接收到数据之后，会通过 IPC（进程间通信）通知渲染进程。
- 渲染进程接收到信息之后，会将`xhr`的回调函数封装成任务并添加到任务队列中。
- 主线程进行事件循环执行到该任务时，会根据相关的状态来调用对应的回调函数。
  - 网络请求出错，执行`xhr.onerror`
  - 网络请求超时，执行`xhr.ontimeout`
  - 网络请求正常，执行`xhr.onreadystatechange`

## 宏任务和微任务

### 微任务

微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。

每个宏任务在执行时，会创建自己的微任务队列。

::: tip 提示
微任务是有可能会移到宏任务队列里的。

> It is possible for a `microtask` to be moved to a regular `task queue`, if, during its initial execution, it `spins the event loop`. This is the only case in which the `source`, `document`, and `script evaluation environment settings object set` of the `microtask` are consulted; they are ignored by the `perform a microtask checkpoint` algorithm.
:::

#### 产生微任务的方法

- MutationObserver
- Promise

如果在执行微任务的过程中，产生了新的微任务，同样会将该微任务添加到当前宏任务的微任务队列中，V8 引擎一直循环执行微任务队列中的任务，直到队列为空才算执行结束。也就是说，在执行微任务过程中产生的新的微任务并不会推迟到下个宏任务中执行，而是在当前的宏任务中继续执行。

#### 微任务队列的执行时机

通常情况下，在当前宏任务中的 JavaScript 快执行完成时，也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务。WHATWG 把执行微任务的时间点称为检查点。当然除了在退出全局执行上下文式这个检查点之外，还有其他的检查点，不过不是太重要。

因此，微任务的执行时长会影响到当前宏任务的时长。比如一个宏任务在执行过程中，产生了 100 个微任务，执行每个微任务的时间是 10 毫秒，那么执行这 100 个微任务的时间就是 1000 毫秒，也可以说这 100 个微任务让宏任务的执行时间延长了 1000 毫秒。

TODO: 每次执行一个宏任务，都会重新创建一遍全局执行上下文？宏任务执行完成（包括微任务队列里的任务全部执行完成）后会退出全局执行上下文？

#### 为什么需要微任务

微任务设计的目的，就是为了能够在下一个宏任务执行之前，临时插入一些任务，比如插入一些 UI 修改的任务，这样可以实现批量 UI 渲染（下一个宏任务）。

页面的渲染事件、用户交互的事件、各种 IO 的完成事件、执行 JavaScript 脚本的事件等都随时有可能被添加到任务队列中，而且添加事件是由系统来操作的，JavaScript 代码不能准确掌控任务要添加到队列中的位置，控制不了任务在任务队列中的位置，所以很难控制开始执行任务的时间。

宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，无法满足一些高实时性的需求，比如监听 DOM 变化并及时做出响应。

## 参考文档

- [WHATWG - HTML Living Standard - Event Loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
