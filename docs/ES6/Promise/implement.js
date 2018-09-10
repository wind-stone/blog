// 用于异步执行通过 promise.then() 方法添加的回调函数
const asyncFn = function () {
    if (typeof process === 'object' && process !== null && typeof(process.nextTick) === 'function') {
        // microtask
        return process.nextTick;
    } else if (typeof(setImmediate) === 'function') {
        // macrotask
        return setImmediate;
    }
    // macrotask
    return setTimeout;
}();

function Handler(onResolved, onRejected, promise) {
    this.onResolved = typeof onResolved === 'function' ? onResolved : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
}

function Promise(fn) {
    // 省略非 new 实例化方式处理
    // 省略 fn 非函数异常处理

    // promise 状态变量
    // 0 - pending
    // 1 - resolved
    // 2 - rejected
    this._state = 0;

    // promise 执行结果
    this._value = null;

    // then(..) 注册回调处理数组
    this._deferreds = [];

    // 立即执行 fn 函数
    try {
        fn(value => {
            resolve(this, value);
        }, reason => {
            reject(this, reason);
        });
    } catch (err) {
        reject(this, err);
    }
}

Promise.prototype.then = function (onResolved, onRejected) {
    const res = new Promise(function () {});

    // 使用 onResolved，onRejected 实例化处理对象 Handler
    const deferred = new Handler(onResolved, onRejected, res);

    if (this._state === 0) {
        // 当前状态为 pendding，存储延迟处理对象
        this._deferreds.push(deferred);
    } else {
        // 当前 promise 状态不为 pending，调用 handleResolved 执行 onResolved 或 onRejected 回调
        handleResolved(this, deferred);
    }

    // 返回新 promise 对象，维持链式调用
    return res;
}

function resolve(promise, value) {
    // 非 pending 状态不可变
    if (promise._state !== 0) {
        return;
    }

    // Promise A+ 规范 2.3.1
    // value 和 promise 指向同一对象
    if (value === promise) {
        return reject(promise, new TypeError('A promise cannot be resolved with itself.'));
    }

    // Promise A+ 规范 2.3.2
    // value 和 promise 为 相同实现的 Promise，则使 promise 接受 value 的状态
    if (value && value instanceof Promise && value.then === promise.then) {
        const oldDeferreds = promise._deferreds;

        if (value._state === 0) {
            // Promise A+ 规范 2.3.2.1
            // value 为 pending 状态
            // 将 promise._deferreds 传递 value._deferreds
            // 偷个懒，使用 ES6 展开运算符
            value._deferreds.push(...oldDeferreds);
        } else if (oldDeferreds.length) {
            // Promise A+ 规范 2.3.2.2、2.3.2.3
            // value 为 非 pending 状态
            // 使用 value 作为当前 promise，执行 then 注册回调处理
            oldDeferreds.forEach(deferred => {
                handleResolved(value, deferred);
            });

            // 清空 then 注册回调处理数组
            value._deferreds = [];
        }
        return;
    }

    // Promise A+ 规范 2.3.3
    // value 是对象或函数
    if (value && (typeof value === 'object' || typeof value === 'function')) {
        let then;
        try {
            // Promise A+ 规范 2.3.3.1
            then = value.then;
        } catch (err) {
            // Promise A+ 规范 2.3.3.2
            reject(err);
        }

        // Promise A+ 规范 2.3.3.3
        // 如果 then 是函数，将 value 作为函数的作用域 this 调用之
        if (typeof then === 'function') {
            try {
                // 执行 then 函数
                then.call(value, function (value) {
                    resolve(promise, value);
                }, function (reason) {
                    reject(promise, reason);
                });
            } catch (err) {
                reject(promise, err);
            }
            return;
        }
    }

    // Promise A+ 规范 2.3.3.4、2.3.4
    // 改变 promise 内部状态为 `resolved`
    promise._state = 1;
    promise._value = value;

    // promise 存在 then 注册回调函数
    promise._deferreds.forEach(function (deferred) {
        handleResolved(promise, deferred);
    });
    promise._deferreds = [];
}

function reject(promise, reason) {
    // 非 pending 状态不可变
    if (promise._state !== 0) {
        return;
    }

    // 改变 promise 内部状态为 `rejected`
    promise._state = 2;
    promise._value = reason;

    promise._deferreds.forEach(deferred => {
        handleResolved(promise, deferred);
    });
    promise._deferreds = [];
}

function handleResolved(promise, deferred) {
    // 异步执行注册回调
    asyncFn(function () {
        const cb = promise._state === 1 ? deferred.onResolved : deferred.onRejected;

        // 传递注册回调函数为空情况
        if (cb === null) {
            if (promise._state === 1) {
                resolve(deferred.promise, promise._value);
            } else {
                reject(deferred.promise, promise._value);
            }
            return;
        }

        // 执行注册回调操作
        let res
        try {
            res = cb(promise._value);
        } catch (err) {
            reject(deferred.promise, err);
        }

        // 处理链式 then(..) 注册处理函数调用
        resolve(deferred.promise, res);
    })
}
