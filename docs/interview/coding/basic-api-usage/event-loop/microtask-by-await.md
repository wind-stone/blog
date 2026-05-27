# 【中级】事件循环输出题

给出如下代码的打印结果

```js
async function test1() {
    console.log('test1 start');
    await test2();
    console.log('test1 end');
}

async function test2() {
    console.log('test2 start');

    await Promise.resolve(2);

    console.log('test2 end');
}

console.log('start');

test1();

const promise = new Promise(resolve => {
    console.log('promise start');
    resolve('promise');
});

promise.then(() => {
    console.log('promise end');
});

console.log('end');
```

## 结果与分析

打印结果如下。

```js
// start
// test1 start
// test2 start
// promise start
// end
// test2 end
// promise end
// test1 end
```

前 6 个输出顺序应该没什么问题，只是最后两个`promise end`和`test1 end`的顺序可能搞错。

这里的关键点如下。

主线程里的微任务产生过程：

- 由`test2`函数里的`Promise.resolve(2)`同步产生了`promise1`实例，`await`需要等这个`promise1`实例状态确定，此时需要让出主线程，暂停`test2`函数内部后续代码的执行，并将这个`promise1`微任务加入任务队列，成为队列里的第一个微任务。
- 回到`test1`函数，因为`test2`函数被`await`暂停了，`test1`也会跟着暂停，尽管`test2`函数会先返回一个`promise2`实例，但是这个`promise2`实例的状态还没确定，因此无法产生一个新的微任务，而是要等`test2`函数执行完毕并返回才能确定`promise2`的状态为`fullfilled`。
- `test1`函数暂停后，继续执行全局代码 `new Promise(...)`，Promise 构造函数时同步执行的，直接打印`promise start`并调用了`resolve`生成了一个状态确定的`promise`示例，通过`promise.then(...)`添加了回调函数，生成一个新的微任务，这个微任务被推到任务队列，成为任务队列中的第二个微任务。
- 继续执行完`console.log('end')`后，主线程执行完毕，JS 引擎开始检查并执行微任务队列

微任务执行过程：

- 任务队列里的第一个微任务即`test2`里产生的微任务先执行，然后打印`test2 end`，此时`test2`函数执行完毕回到`test1`，里面的`await`后的`promise2`状态确定，经过`await`后产生一个新的微任务，加入到任务队列里，成为第三个加入任务队列的微任务。
- 任务队列里的第二个微任务即`promise.then(...)`产生的微任务接着执行，打印`promise end`
- 任务队列里的第三个微任务即`test1`里`await`产生的微任务接着执行，打印`test1 end`
