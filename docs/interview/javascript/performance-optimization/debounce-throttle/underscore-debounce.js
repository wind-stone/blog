// v1.13.1
import restArguments from './restArguments.js';
import now from './now.js';

// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
export default function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
        var passed = now() - previous;

        // 判断此时距离最后一次调用 debounced 函数是否超过了 wait 时间
        // - 若没超过，则继续倒计时剩余的时间
        // - 否则，调用回调
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            // This check is needed because `func` can recursively invoke `debounced`.
            if (!timeout) args = context = null;
        }
    };

    var debounced = restArguments(function(_args) {
        context = this;
        args = _args;
        previous = now(); // 持续调用 debounced 函数时，previous 会一直更新为最新值
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);
        }
        return result;
    });

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = args = context = null;
    };

    return debounced;
}
