# 注意事项

[[toc]]

## 实现阶段

- [CSS 样式，注意事项、功能实现](./style.md)
- [JS 格式化](./format.md)
- [元素埋点](/js/error-handling/log.md#元素日志)

### 金额

#### 金额单位

- 涉及到金额的地方，尤其是需要前端进行计算的场景，金额一定要**使用分为单位**，而不能使用元。

### 控制按钮点击频率/事件回调调用频率

- 防爆击，使用`lodash.throttle`进行节流处理

```js
import throttle from 'lodash.throttle';
// 300ms 内只触发一次回调，且第一次点击有效
ele.addEventListener('click', throttle(() => {
    // click ..
}, 300, {
    leading: true,
    trailing: false
}));
```

- 防止频繁触发事件回调，使用`lodash.debounce`进行防抖动处理

```js
import debounce from 'lodash.debounce';
// 若 300ms 内连续触发多次 scroll 事件，则以最后一次触发事件的时间作为延迟 300ms 触发的开始时间
// 若 300ms 内只触发一次 scroll 事件，则在触发 scroll 事件后 300ms 后执行回调
window.addEventListener('scroll', debounce(() => {
    // scroll ..
}, 300);
```

## 活动类项目注意事项

### 活动阶段变更

若活动存在`未开始`、`进行中`、`已结束`等不同的阶段：

- 同一个页面上展示了不同阶段的数据，需要注意，在阶段切换的时间节点上，阶段可能会发生变化，比如由`未开始`变成`进行中`。

## 业务监控

- 针对业务里的关键路径，需要埋点监控
  - 监控接口的异常返回，并上报异常数据
  - 监控 JS Bridge 方法的异常返回，并上报异常信息
  - 监控已捕获的异常，并上报异常信息
- 调用第三方服务时，需要第三方服务提供对应接口请求曲线，如有必要，在业务里针对第三方服务的结果进行埋点统计异常
- 若活动入口在另一个活动里且流量主要依赖该入口，需要提前要取另一个活动的实时 PV 数据
- iOS UIWebView 在页面滑动时会导致计时器暂停
  - 简单解决方法：计时器开始时记录一个本地时间

## 纯前端实现最佳实践

- 尽量使用`await/async`，少使用 Promise
- 尽可能使用解构赋值
- Vue
  - 使用 composition API，让原先以 UI 组件为单位的组件，改进为用功能为单位的组件

## 性能优化

- 使用`will-change`提前告诉渲染引擎元素将要做特效变换，比如`transform`

## 坑

- 使用`url-polyfill`获取`url`上的参数时，在某些机型上（比如 iOS 10.3.3）会将`%2B`（对应`+`字符）解码成`20%`（对应空格字符）
