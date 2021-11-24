/**
 * 说明文档：https://lodash.com/docs/4.17.15#throttle
 */
function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
    });
}
