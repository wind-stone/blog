---
sidebarDepth: 0
---

# 事件循环

[[toc]]

## setTimeout、setInterval

### 延时时间参数 delayTime

```js
setTimeout/setInterval(function () {

}, delayTime)
```

注意，`delayTime`的时间，是指在`delayTime`时间后将函数放入事件队列中，而不是立即放入事件队列中等待`delay`时间后执行

### 示例

```js
for (var i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}
```

这段代码的意图是什么？有什么问题？

- 解决方法一：IIFE（立即执行函数表达式）

```js
for (var i = 0; i < 10; i++) {
    (function(i) {
        setTimeout(function() { console.log(i); }, 100 * i);
    })(i);
}
```

- 解决方法二：IIFE + 返回函数

```js
for (var i = 0; i < 10; i++) {
    setTimeout(function (i) {
        return function () {
            console.log(i);
        };
    }(i), 100*i);
}
```

- 解决方法三：`let`（`let`不仅是在循环里引入了一个新的变量环境，而是针对每次迭代都会创建这样一个新作用域）

```js
for (let i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}
```

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

## 浏览器的独有的 Event Loop

### requestAnimationFrame

`requestAnimationFrame`函数的回调函数会加入到渲染这一边的队列中，它在渲染的三个步骤（S：？, L：layout，P：paint）之前被执行。通常用来处理渲染相关的工作。

`requestAnimationFrame`只在渲染过程之前运行，因此严格遵守“执行一次渲染一次”。

和渲染动画相关的，多用`requestAnimationFrame`，不会有掉帧的问题（即某一帧没有渲染，下一帧把两次的结果一起渲染了）

#### 示例一

```js
box.style.transform = 'translateX(1000px)'
requestAnimationFrame(() => {
    box.style.tranition = 'transform 1s ease'
    box.style.transform = 'translateX(500px)'
})
```

上面这段代码的本意从让`box`元素的位置先从`0`瞬间移动到右边`1000px`处，然后再以动画形式缓慢移动到右边`500px`处。

但是因为`requestAnimationFrame`是在渲染过程之前进行的，导致`box.style.transform = 'translateX(1000px)'`与`box.style.transform = 'translateX(500px)'`都在下一帧出现之前执行，也就是这两行代码合并了（或者说后者覆盖了前者），最终展现的结果是，`box`元素的位置从`0`以动画的形式缓慢移动到右边`500px`处。

那如何实现原先代码的本意呢？

- `requestAnimationFrame`回调里再调用一次`requestAnimationFrame`

```js
// 该行的代码是在下一帧渲染之前调用（主进程代码）
box.style.transform = 'translateX(1000px)'
requestAnimationFrame(() => {
    // 该行的代码是在下一帧渲染之前调用（第一个 requestAnimationFrame 回调里）
    requestAnimationFrame(() => {
        // 该行的代码是在下一帧渲染之后，下下一帧渲染之前调用（第二个 requestAnimationFrame 回调里）
        box.style.tranition = 'transform 1s ease'
        box.style.transform = 'translateX(500px)'
    })
})
```

- 两次`transform`赋值之间获取一下当前的计算样式

```js
box.style.transform = 'translateX(1000px)'
getComputedStyle(box) // 伪代码，只要获取一下当前的计算样式即可
box.style.tranition = 'transform 1s ease'
box.style.transform = 'translateX(500px)'
```

### 用户点击与代码触发点击

```js
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('microtask 1'))
  console.log('listener 1')
})
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('microtask 2'))
  console.log('listener 2')
})
```

在浏览器上运行后，用户点击按钮，会按顺序打印：

```js
listener 1
microtask 1
listener 2
microtask 2
```

但如果在上面代码的最后加上`button.click()`，打印顺序会有所区别：

```js
listener 1
listener 2
microtask 1
microtask 2
```

用户点击按钮的打印结果很容易解释：`click`回调是一`macrotask`，`promise.then()`添加的回调是一`microtask`，每个`macrotask`执行完后都要先将所有的`microtask`都执行完才能继续执行下一个`macrotask`。

但是对于在代码里主动调动`button.click()`，就稍微怪异一些，而这怪异的行为是由浏览器的内部实现造成的：使用`button.click()`时，浏览器的内部实现是把 2 个 listener 都同步执行。因此`listener 1`之后，执行队列还没空，还要继续执行`listener 2`之后才行。所以`listener 2`会早于`microtask 1`。重点在于浏览器的内部实现，`click`方法会先采集有哪些 listener，再依次触发。

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
