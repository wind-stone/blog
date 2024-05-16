import isObject from './isObject.js';
import root from './.internal/root.js';

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn. The debounced function
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * debounced function. Subsequent calls to the debounced function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * invocation will be deferred until the next frame is drawn (typically about
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0]
 *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
 *  used (if available).
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', debounce(calculateLayout, 150))
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }))
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 })
 * const source = new EventSource('/stream')
 * jQuery(source).on('message', debounced)
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel)
 *
 * // Check for pending invocations.
 * const status = debounced.pending() ? "Pending..." : "Ready"
 */
function debounce(func, wait, options) {
    let lastArgs;           // 最后一次调用 debounced 函数的参数
    let lastThis;           // 最后一次调用 debounced 函数的 this
    let maxWait;            // 最大等待时间，超过该时间后要执行一次
    let result;             // 最终执行结果，只有设置了 leading: true 才能同步返回 func 调用的结果
    let timerId;            // 定时器
    let lastCallTime;       // 最后一次调用 debounced 函数的时间，此时该次对应的 func 还没执行
    let lastInvokeTime = 0; // 最后一次调用 func 函数的时间
    let leading = false;    // 是否在 开头 时调用 func
    let maxing = false;     // 是否超过 maxWait 后必须调用一次
    let trailing = true;    // 是否在 结尾 时调用 func

    // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
    const useRAF = !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function';

    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    wait = +wait || 0; // 延迟执行的时间
    if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    /**
     * 调用 func 函数
     */
    function invokeFunc(time) {
        const args = lastArgs;
        const thisArg = lastThis;

        // 执行 func 前，会清理 lastArgs、lastThis，设置 lastInvokeTime
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    function startTimer(pendingFunc, milliseconds) {
        if (useRAF) {
            root.cancelAnimationFrame(timerId);
            return root.requestAnimationFrame(pendingFunc);
        }
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        return setTimeout(pendingFunc, milliseconds);
    }

    function cancelTimer(id) {
        if (useRAF) {
            root.cancelAnimationFrame(id);
            return;
        }
        clearTimeout(id);
    }

    /**
     * 检查 leading 调用
     *
     * 开启了 leading，则立即执行 func 函数。
     * 注意: 无论是否设置了 leading: true，都会设置个定时器，到期后再检查 trailing 调用
     */
    function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = startTimer(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }

    /**
     * 获取距离下一次能调用 func 的剩余时间
     */
    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        // 这里有两种情况：
        // 情况一：timeWaiting，timeSinceLastCall 是指距离上一次调用 debounced 函数过去了的时间，因此最早可以在 wait - timeSinceLastCall 再次调用 func（但是如果在未来 wait - timeSinceLastCall 时间内再次调用 debounced 函数的话，下次能调用 func 的时间会再往后延）
        // 情况二：（如果有 maxWait 参数的话）继上次调用 func 后，func 就一直没被调用，即将超过 maxWait 时间了，所以最早在 maxWait - timeSinceLastInvoke 时间后一定会调用 func
        // 如上两种情况，取最小值
        return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }

    /**
     * 判断是否应该调用 func 函数（基于 wait 和 maxWait 进行判断）
     */
    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (
            lastCallTime === undefined ||              // 满足条件一：从未调用过 debounced 函数
            timeSinceLastCall >= wait ||               // 满足条件二：距离上一次调用 debounced 函数的时间超过了 wait，即定时器时间到了
            timeSinceLastCall < 0 ||                   // 满足条件三：TODO: 这是什么场景？
            (maxing && timeSinceLastInvoke >= maxWait) // 满足条件四：距离上一次调用 func 函数已达到了 maxWait 时间
        );
    }

    /**
     * 定时器到期，检查是否需要调用 func 函数
     * 注意，timerExpired 只有定时器到期了才会调用
     *
     * - 若能，则调用 trailingEdge 执行
     * - 否则，则在 remainingTime （经过计算出的距离下次能调用 func 函数的最短时间）后再次检查
     */
    function timerExpired() {
        const time = Date.now();

        // 检查时间上是否可以调用 func
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }

        // 如果时间上不能调用 func，则等次下次时间满足的话，再检查能否调用 func
        // Restart the timer.
        timerId = startTimer(timerExpired, remainingWait(time));
        return undefined;
    }

    /**
     * 检查在 结尾时 是否可以调用 func
     * 注意：trailingEdge 只会在如下两种情况下调用：
     * - 1、在定时器到期了且时间上满足要求
     * - 2、强制调用 flush 后
     */
    function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    /**
     * 取消 func 函数的执行
     */
    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    /**
     * 强制执行 结尾时 调用（如果定时器还没到期）
     */
    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function pending() {
        return timerId !== undefined;
    }

    /**
     * 最终返回的经过防抖动处理的函数
     *
     * 每次调用 debounced 函数，可能存在如下几种情况：
     * - 立即执行 func
     *   - 首次调用 debounced 函数
     *   - 超过了 maxWait 时间限制
     * - 不满足 wait 时间限制
     *   - 存在定时器，会被忽略
     *   - 不存在定时器，设置新定时器，延迟 wait 时间
     */
    function debounced(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time); // 时间上是否满足调用条件

        lastArgs = args; // 即使调用 debounced 函数时不传入参数，arguments 也是个长度为 0 的伪数组
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            // 若不存在定时器，则先进行 leading 检查（若 leading: true，则立即执行 func；否则进行 trailing 检查）
            // - 满足条件一时：是首次调用 debounced 函数，不可能存在 timerId
            // - 满足条件二时：距离上一次调用 debounced 函数达到 wait 时间的话（此时定时器回调会执行，并清空 timerId）
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            // BTW: 什么场景下 isInvoking 为 true 但存在定时器 timerId？
            // - 满足条件四（距离上一次调用 func 函数已达到了 maxWait 时间）的话，说明条件二不满足，即距离上一次调用 debounced 函数小于 wait 时间，肯定存在 timerId
            // 此时，需要立即调用 func，并设置定时器，等 wait 时间后看看要不要再调用一次 func
            if (maxing) {
                // Handle invocations in a tight loop.
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }

        // 不满足调用时间，且无 timerId
        // 这种情况有，比如距离上次调用 func 还不到 wait，且之前的定时器被重置了（比如调用了 cancel）
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}

export default debounce;
