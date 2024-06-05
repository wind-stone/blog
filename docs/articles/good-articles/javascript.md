# JavaScript 语言相关文章

[[toc]]

## JavaScript Core

- [动态化技术如果不知道它，你就白学了！](https://mp.weixin.qq.com/s/FBXaxV6Hk5bUDfAWHuHShA)，详细说明了 Webkit、JavaScript Core 和 WebCore 的关系

## TypeScript

- [细数 TS 中那些奇怪的符号](https://segmentfault.com/a/1190000023943952)
- [TypeScript 中的 Decorator & 元数据反射：从小白到专家（部分 I）](https://zhuanlan.zhihu.com/p/20297283)

## 框架

### Vue

#### Vue 生态

- [深入理解 Vue3 Reactivity API](https://zhuanlan.zhihu.com/p/146097763)
- [如何看待 Web 开发构建工具 Vite？](https://www.zhihu.com/question/394062839/answer/1496127786)
  - 特性
    - 不需要打包
    - 按需编译

#### Vue 使用技巧

- [揭秘 Vue.js 九个性能优化技巧](https://mp.weixin.qq.com/s/iQwTr5T95wPflJMT87ZObg)

## 事件循环

- [精读《Tasks, microtasks, queues and schedules》](https://github.com/dt-fe/weekly/issues/264)
  - 文章里描述了 Tasks/Microtasks 与事件冒泡的关系，以及浏览器对此实现的不一致性
- [浏览器的 Event Loop 宏任务，微任务，事件冒泡](https://juejin.im/post/6844904152779210766)
  - 文章里的“五.当 Event Loop 遇上事件冒泡”说明了事件冒泡也是个宏任务
  - 事件冒泡的宏任务是立即加入到任务队列的，而`setTimeout`是在`delay`时间（有最小延迟时间）加入任务队列的，因此事件冒泡优先于`setTimeout`

## 错误处理和监控

- [完善的前端异常监控解决方案](https://cdc.tencent.com/2018/09/13/frontend-exception-monitor-research/)

## 动画

- [剖析 lottie-web 动画实现原理](https://juejin.cn/post/6914835547588395022)

## 性能

- [前端早读课 - 【第1920期】如何监控网页的卡顿？](https://mp.weixin.qq.com/s/d-v7QgmP9aGnQr2nbpfzjQ)
- [前端早读课 - 【第1915期】如何监控网页崩溃？](https://mp.weixin.qq.com/s/EscBLM3hAoCrYn9r9zFmng)

## GPU 加速

- [【官方】Chrome 硬件加速合成的原理](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome?spm=taofed.bloginfo.blog.1.68c75ac8ZPJVT1)
- [【中文翻译】Chrome 硬件加速合成的原理](https://sinaad.github.io/xfe/2016/05/10/gpu-accelerated-compositing-in-chrome/)
