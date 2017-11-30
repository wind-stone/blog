# Event Loop

## 什么是 Event Loop？




## Macrotask/Microtask Quque

Event Loop 里存在两类队列，分别为 Macrotask 和 Microtask

- macrotasks
  - script(整体代码)
  - setTimeout
  - setInterval
  - setImmediate
  - I/O
  - UI rendering
- microtasks
  - process.nextTick
  - Promises
  - Object.observe
  - MutationObserver

执行过程如下：
- JavaScript 引擎首先从 macrotask queue 中取出第一个任务
- 执行完毕后，将 microtask queue 中的所有任务取出，按顺序全部执行（注意：当这些 microtask 执行过程中还能继续添加 microtask 到 microtask queue 里，直到 microtask queue 为空）
- 然后再从 macrotask queue 中取下一个
- 执行完毕后，再次将 microtask queue 中的全部取出
- 循环往复，直到两个 queue 中的任务都取完




## macrotask、microtask 与 render 的关系

macrotask 按序执行，浏览器将在每个 macrotask 执行后进行 render。即

1. 执行一个 macrotask 任务
2. 执行所有的 microtask 任务
3. 最后（如有必要）浏览器进行 render

浏览器循环进行以上步骤。




## Node.js 的 Event Loop

### process.nextTick

`process.nextTick`方法可以在当前"执行栈"的尾部----下一次 Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。

```js
process.nextTick(function A() {
  console.log(1);
  process.nextTick(function B(){console.log(2);});
});

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0)

console.log('0')

// 运行结果：
// 0
// 1
// 2
// TIMEOUT FIRED
```

上面代码中，由于`process.nextTick`方法指定的回调函数，总是在当前"执行栈"的尾部触发，所以不仅函数 A 比 setTimeout 指定的回调函数 timeout 先执行，而且函数 B 也比 timeout 先执行。这说明，如果有多个`process.nextTick`语句（不管它们是否嵌套），将全部在当前"执行栈"执行。


### setImmediate

`setImmediate`方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次 Event Loop 时执行，这与`setTimeout(fn, 0)`很像。

`setImmediate`方法与`setTimeout`方法的区别，可参考[阮一峰-JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)




## 注意事项

### 定时器时间的确定

我们调用`setTimeout(fn, delay)`函数后，`fn` 会交由定时器线程，定时器线程在到达`delay`时间后，将`fn`加入到事件队列中。


### 用户触发事件/代码触发事件 区别

文章 [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) 里提到，由用户交互触发的事件回调和代码里触发的事件回调，执行时间是不一样的。

简单说，如果是由用户交互触发的事件，事件回调函数会加入到任务队列中，等待下一次 Event Loop；如果是由代码触发的事件，回调会立即同步执行。

此外，同一事件的冒泡行为，是在同一 Event Loop 里执行的，类似于 microtask。




## Reference

- [阮一峰-JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
- [阮一峰-进程与线程的一个简单解释](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)
- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
