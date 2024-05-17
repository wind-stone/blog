# 防抖和节流

[[toc]]

## 参考文档

- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)，强烈推荐这篇文章，其：
  - 通过可交互的示例，解释了防抖和节流的区别
  - 防抖/节流的应用场景
  - `lodash`版本`debounce`/`throttle`的参数`leading`/`trailing`的含义
- [Javascript 的 Debounce 和 Throttle 的原理及实现 #7](https://github.com/lishengzxc/bblog/issues/7)

## 防抖

防抖（`debounce`）的英文释义是：

> n. 防反跳，按键防反跳
>
> 为什么要去抖动呢？机械按键在按下时，并非按下就接触的很好，尤其是有簧片的机械开关，会在接触的瞬间反复的开合多次，直到开关状态完全改变

我们希望开关只捕获到那次最后的精准的状态切换。在 Javascript 中，针对那些频繁触发的事件，我们想在某个时间点上去执行我们的回调，而不是每次事件触发我们就执行回调。再简单一点的说，我们希望多次触发的相同事件的触发合并为一次触发（其实还是触发了好多次，只是我们只关注最后一次）。

### 简单实现

```js
// 简单的防抖动函数
function debounce(func, wait) {
    // 定时器变量
    var timer;

    return function debounced() {
        // 保存函数调用时的上下文和参数，方便之后传给 func
        var context = this;
        var args = arguments;

        // 每次 debounced 函数被调用时，先清除定时器
        clearTimeout(timer);

        // 指定 wait 时间后触发 func 执行
        timer = setTimeout(function () {
            func.apply(context, args)
        }, wait);
    };
};
```

**不足**：

1. 回调函数`func`无法立即执行
2. 若以小于`wait`的间隔持续调用`debounced`函数，`func`函数可能永远不会执行
3. 无法取消定时器

### underscore.debounce

`underscore.debounce`的实现：

- 增加了第三个参数`immediate`，解决了回调函数`func`无法立即执行的问题
- 返回的`debounced`函数上增加了`cancel`方法，解决了无法取消定时器的问题

`immediate`这个参数是用来配置回调函数是在一个时间区间`wait`的最开始执行（`immediate`为`true`）还是最后执行（`immediate`为`false`）。如果`immediate`为`true`，则意味着这是一个同步的回调，可以使用`debounced`函数的返回值。

@[code js](./underscore-debounce.js)

完整源码：[github - underscore.debounce](https://github.com/jashkenas/underscore/blob/master/modules/debounce.js)

### lodash.debounce

[lodash.debounce](https://lodash.com/docs/4.17.15#debounce)方法提供了更加丰富和强大的功能。

- `lodash.debounce`里使用`leading`/`trailing`选项代替了`immediate`参数，`leading`表示在`wait`时间开始时执行回调，`trailing`表示在`wait`时间结束后执行回调，可选择其中之一，也可以全部选择。
- 增加`maxWait`选项，表示`func`可以延迟执行的最大时间，若超过了`maxWait`，则必须要执行回调函数`func`。

@[code js](./lodash-debounce.js)

以上源码里涉及到一些工具函数，完整源码地址详见: [lodash.debounce](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L10304)

需要注意的是，调用`leadingEdge`函数检查`leading`选项时，即使`leading: true`并立即调用`func`函数，也会**设置一个定时器**去延迟`wait`时间调用`timerExpired`，而在`timerExpired`里会调用`trailingEdge`，在`trailingEdge`里会检查`lastArgs`的值来判断是否需要再次调用`func`函数：

- 若在该次定时器`wait`时间内，没有再次调用`debounced`函数，则`lastArgs`为`undefined`，不再次调用`func`
- 若在该次定时器`wait`时间内，再次调用了`debounced`函数，则`lastArgs`会有新值，`trailingEdge`内会再次调用`func`（`trailing`为`true`的情况下）

简单说就是，针对如下的代码，`leading`和`trailing`都设置成`true`，如果在第`0ms`和第`500ms`分别点击一次按钮，`i`会打印两次，第一次在`0ms`附近，第二次在`2500ms`附近。

```html
<script>
import { debounce } from 'lodash'

let i = 0;
let j = 0;
let firstClickTimeStamp = 0;

const fn = debounce(() => {
    console.log(`第 ${++i} 次打印，距离第一次点击时间：${Date.now() - firstClickTimeStamp}ms`);
}, 2000, {
    leading: true,
    trailing: true
})

testFn () {

    if (!firstClickTimeStamp) {
         firstClickTimeStamp = Date.now();
    }
    console.log(`第 ${++j} 次点击，距离第一次点击时间：${Date.now() - firstClickTimeStamp}ms`);
    fn();
}


testFn(); // 模拟第一次点击

setTimeout(() => {
    testFn() // 模拟第二次点击
}, 500)

// 打印结果
// 第 1 次点击，距离第一次点击时间：0ms
// 第 1 次打印，距离第一次点击时间：7ms
// 第 2 次点击，距离第一次点击时间：508ms
// 第 2 次打印，距离第一次点击时间：2511ms
</script>

<button onclick="testFn">测试按钮</button>
```

## 节流

节流（`throttle`），只允许回调函数在`wait`时间内最多执行一次。

与防抖相比，节流最主要的不同在于，它保证在`wait`时间内至少执行一次我们希望触发的回调函数`func`。

### 简单实现

```js
function throttle(func, wait) {
    let timeout;
    let startTime = new Date();

    return function throttled() {
        const context = this;
        const args = arguments,
        const now = new Date();

        clearTimeout(timeout);
        const timeSinceLastCall = now - startTime; // 自动上次调用 func 以来的时间

        // 如果达到了规定的触发时间间隔，触发 handler
        if (timeSinceLastCall >= wait) {
            func.apply(context, args);
            startTime = now;
        } else {
            // 没达到触发间隔，重新设定定时器，等到距离上次调用 func 达到 wait 时间后再调用
            timeout = setTimeout(func, wait - timeSinceLastCall);
        }
    };
};
```

### underscore.throttle

@[code js](./underscore-throttle.js)

注意，若不显示指定`leading: false`，则`leading`默认为`true`。

`underscore.throttle`的代码比较精简，其中包含了较多的逻辑，以下分为四种情况来描述：

**情况一：不设置`options`，即默认`{ leading: true, trailing: true }`**

- 首次调用`throttled`函数时：会走到分支一，立即执行在`func`回调
- 再次调用`throttled`函数时
  - 若距离上一次调用`func`未超过`wait`时间 && 不存在定时器：会走到分支二，设置定时器，等到满足`wait`时间后再执行`func`
  - 若距离上一次调用`func`未超过`wait`时间 && 存在定时器：既不会走分支一也不会走分支二，而是会被忽略
  - 若距离上一次调用`func`超过`wait`时间：会走到分支一，立即执行在`func`回调

**情况二：设置`options`为`{ leading: false, trailing: true }`**

- 首次调用`throttled`函数时：会走到分支二，设置定时器，等到满足`wait`时间后再执行`func`
- 再次调用`throttled`函数时
  - 若距离上一次调用`func`未超过`wait`时间 && 存在定时器：会被忽略
  - 若距离上一次调用`func`超过`wait`时间：等同于首次调用`throttled`函数

**情况三：设置`options`为`{ leading: true, trailing: false }`**

- 首次调用`throttled`函数时：会走到分支一，立即执行在`func`回调
- 再次调用`throttled`函数时
  - 若距离上一次调用`func`未超过`wait`时间 && 不存在定时器：会被忽略
  - 若距离上一次调用`func`超过`wait`时间：等同于首次调用`throttled`函数

因此，在**情况三**下，只会走分支一，不会走到分支二。

**情况四：设置`options`为`{ leading: false, trailing: false }`，则永远不会触发回调。**

### lodash.throttle

`lodash.throttle`是基于`lodash.debounce`的简单封装。

@[code js](./lodash-throttle.js)

`lodash.throttle`的完整源码可见[_.throttle](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L10897)。

## requestAnimationFrame

上面介绍的抖动与节流实现的方式都是借助了定时器`setTimeout`。

若回调函数是关于绘制页面/做动画，或者任何关于重新计算元素位置，都可以优先考虑使用`requestAnimationFrame`。
