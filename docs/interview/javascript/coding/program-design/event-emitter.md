# 【高级】EventEmitter

## 实现 EventEmitter 类，需要实现on, off, once, emit几个方法

参考答案：[https://blog.windstone.cc/code-snippet/js/utils/event-emitter.html](https://blog.windstone.cc/code-snippet/js/utils/event-emitter.html)

```js
const eventEmitter = new EventEmitter();
const eventName = 'whatever';

// case 0: on 订阅事件
eventEmitter.on(eventName, fn);

// case 1: off 取消订阅
eventEmitter.off(eventName, fn) // 传回调，清理 fn
eventEmitter.off(eventName)     // 不传回调，清理该事件的所有回调

// case 2: once 只订阅一次
eventEmitter.once(eventName, fn)

// case 3: emit 发布事件
eventEmitter.emit(eventName, arg1, arg2, ...)

// case 4: once 注册事件后，立马 off
eventEmitter.once(eventName, fn)
eventEmitter.off(eventName, fn)

```

考察点：主要考察考虑问题的全面性，api设计是否优雅 及 代码习惯

注意：`once`的实现

  有些候选人会使用在 fn 上加上 fn.isOnce 来实现 once，在 emit 后判断 fn.isOnce 进而确定是否要 off 掉 fn。但是这种实现会改变 fn，存在的问题是，若 on(otherEventName, fn)，会导致在 otherEventName 事件上 fn 会被认为是通过 once 注册的

  正确地实现是，将 fn 用另一个函数 wrappedFn封装一下，同时 wrappedFn.originFn = fn，这样在`off(eventName, fn)`时，不仅要判断 `fn === wrappedFn`还要判断`fn === wrappedFn.originFn`
