/**
 * 说明文档：https://lodash.com/docs/4.17.15#debounce
 */
function debounce(func, wait, options) {
    var lastArgs,               // 最后一次调用 debounced 函数的参数
        lastThis,               // 最后一次调用 debounced 函数的 this
        maxWait,                // 最大等待时间，超过该时间后要执行一次
        result,                 // 最终执行结果，只有设置了 leading: true 才能同步返回 func 调用的结果
        timerId,                // 定时器
        lastCallTime,           // 最后一次调用 debounced 函数的时间，此时该次对应的 func 还没执行
        lastInvokeTime = 0,     // 最后一次调用 func 函数的时间
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0; // 延迟执行的时间

    if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait; // maxWait 不能小于 wait
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    /**
     * 调用 func 函数。执行完会清理 lastArgs、lastThis，设置 lastInvokeTime
     */
    function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    /**
     * 检查 leading 调用。
     *
     * 开启了 leading，则立即执行 func 函数。
     * 注意: 无论是否设置了 leading: true，都会设置个定时器，到期后再检查 trailing 调用
     */
    function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }

    /**
     * 获取距离下一次能调用 func 的剩余时间
     */
    function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
            ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }

    /**
     * 判断是否应该调用 func 函数（基于 wait 和 maxWait 进行判断）
     */
    function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (
            lastCallTime === undefined                       // 满足条件一：从未调用过 debounced 函数
            || (timeSinceLastCall >= wait)                   // 满足条件二：距离上一次调用 debounced 函数的时间超过了 wait
            || (timeSinceLastCall < 0)                       // 满足条件三：TODO: 这是什么场景？
            || (maxing && timeSinceLastInvoke >= maxWait)    // 满足条件四：距离上一次调用 func 函数已超过了 maxWait 时间
        );
    }

    /**
     * 定时 wait 时间后，检查能否执行 func 函数。
     *
     * - 若能，则调用 trailingEdge 执行
     * - 否则，则在 remainingTime （经过计算出的距离下次能调用 func 函数的最短时间）后再次检查
     */
    function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
    }

    /**
     * 检查 trailing 调用。
     */
    function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) { // 若 lastArgs 不存在，则说明还没等到 trailing 调用，func 就已经调用了（比如超过了 maxWait 了）
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
            clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    /**
     * 若存在定时器，则立即执行 func 函数
     */
    function flush() {
        return timerId === undefined ? result : trailingEdge(now());
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
    function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments; // 即使调用 debounced 函数时不传入参数，arguments 也是个长度为 0 的伪数组
        lastThis = this;
        lastCallTime = time;

        // 满足执行回调的条件
        if (isInvoking) {
            // 若不存在定时器，则先进行 leading 检查（若 leading: true，则立即执行 func；否则进行 trailing 检查）
            // BTW: 什么场景下 isInvoking 为 true 但存在定时器 timerId？
            // - 满足条件一时：是首次调用 debounced 函数，不可能存在 timerId
            // - 满足条件二时：距离上一次调用 debounced 函数超过 wait 时间的话，无论上一次调用是哪种情况，超过 wait 时间后都不会存在 timerId
            // - 满足条件四的话，说明条件二不满足，即距离上一次调用 debounced 函数小于 wait 时间，肯定存在 timerId
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }


            // isInvoking && 存在定时器 && 设置了最大超时 maxWait
            // 这种情况是满足条件四，说明距离上一次调用 func 函数已经超过了 maxWait，则立即执行，且重新设置定时器
            if (maxing) {
                // Handle invocations in a tight loop.
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }

        // 不满足执行回调的条件 && 不存在定时器，则设置个定时器延迟执行回调
        if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
        }

        // 若不满足执行回调的条件 && 存在定时器，则不做任务操作

        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
