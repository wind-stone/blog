# 最大并行函数执行控制

已知如下代码，请实现 `Queue` 类，以实现同一时间内最多执行两个异步函数。

```js
const queue = new Queue(2);

const sleep = time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

queue.add(async () => {
    console.log('任务一开始执行');
    await sleep(5000);
    console.log('5s 后，任务一执行结束');
});

queue.add(async () => {
    console.log('任务二开始执行');
    await sleep(10000);
    console.log('10s 后，任务二执行结束');
});

queue.add(async () => {
    console.log('任务三开始执行');
    await sleep(1000);
    console.log('1s 后，任务三执行结束');
});
```

## 参考答案

```js
class Queue {
    pool = 0;
    running = 0;
    queue = [];

    constructor(pool) {
        this.pool = pool;
    }

    add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                fn,
                resolve,
                reject,
            });
            this._run();
        });
    }

    _run() {
        // 当正在执行的任务数达到上限或队列为空时，停止
        if (this.running >= this.pool || !this.queue.length) {
            return;
        }

        // 从队列头部取出一个任务
        const { fn, resolve, reject } = this.queue.shift();

        // 增加正在执行的任务数
        this.running++;

        Promise.resolve(fn())
            .then(resolve)
            .catch(reject)
            .finally(() => {
                // 任务执行完毕，减少正在执行的任务数
                this.running--;

                // 尝试执行下一个任务
                this._run();
            });
    }
}
```
