# 日常阅读文章

- [一文搞懂CDN加速原理](https://mp.weixin.qq.com/s/e-UzhyS_5zs4KYdyu7vSyg)
- [提升低端设备的 Web 性能](https://mp.weixin.qq.com/s/qNA1AIMvcmeQ0RsPd0wmBA)

## 代码风格

- [如何制定企业级代码规范与检查](https://mp.weixin.qq.com/s/qpUlllsMvMH0Gc88QJ66Fg)

## TypeScript

- [细数 TS 中那些奇怪的符号](https://segmentfault.com/a/1190000023943952)
- [TypeScript 中的 Decorator & 元数据反射：从小白到专家（部分 I）](https://zhuanlan.zhihu.com/p/20297283)

## Vue

- [深入理解 Vue3 Reactivity API](https://zhuanlan.zhihu.com/p/146097763)

## JavaScript

### 事件循环

- [精读《Tasks, microtasks, queues and schedules》](https://github.com/dt-fe/weekly/issues/264)
  - 文章里描述了 Tasks/Microtasks 与事件冒泡的关系，以及浏览器对此实现的不一致性
- [浏览器的 Event Loop 宏任务，微任务，事件冒泡](https://juejin.im/post/6844904152779210766)
  - 文章里的“五.当 Event Loop 遇上事件冒泡”说明了事件冒泡也是个宏任务
  - 事件冒泡的宏任务是立即加入到任务队列的，而`setTimeout`是在`delay`时间（有最小延迟时间）加入任务队列的，因此事件冒泡优先于`setTimeout`

### 动画

- [剖析 lottie-web 动画实现原理](https://juejin.cn/post/6914835547588395022)
