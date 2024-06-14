# JavaScript 语言相关文章

[[toc]]

## JavaScript Core

[深入理解JSCore](https://tech.meituan.com/2018/08/23/deep-understanding-of-jscore.html)

- Webkit 包含 WebCore、JavaScript Core 等模块
  - WebCore 是渲染引擎，包含 HTML Parser、CSS Parser 等
  - JavaScript Core 是 JS 引擎，负责解释执行 JS，包含 Lexer（词法分析）、Parser（语法分析）、LLInt 和 JIT（解释执行）
- iOS 中可以使用 JSCore 的地方有多处，比如封装在 UIWebView 中的 JSCore，封装在 WKWebView 中的 JSCore，以及系统提供的 JSCore。iOS 官方文档对JSCore 的介绍很简单，其实主要就是给 APP 提供了调用 JS 脚本的能力。
- JSVirtualMachine、JSContext、JSValue
  - 一个 JSVirtualMachine（以下简称 JSVM）实例代表了一个自包含的 JS 运行环境，或者是一系列 JS 运行所需的资源。该类有两个主要的使用用途：一是支持并发的 JS 调用（包含把 JS 源代码编译成字节码），二是管理 JS 和 Native 之间桥对象的内存。
    - 在 APP 中，我们可以运行多个 JSVM 来执行不同的任务。而且每一个 JSContext 都从属于一个 JSVM。但是需要注意的是每个 JSVM 都有自己独立的堆空间，GC 也只能处理 JSVM 内部的对象。所以说，不同的 JSVM 之间是无法传递值的。
    - 在一个 JSVM 中，只有一条线程可以跑 JS 代码，所以我们无法使用 JSVM 进行多线程处理 JS 任务。如果我们需要多线程处理 JS 任务的场景，就需要同时生成多个 JSVM，从而达到多线程处理的目的。
  - 一个 JSContext 表示了一次 JS 的执行环境。我们可以通过创建一个 JSContext 去调用 JS 脚本，访问一些 JS 定义的值和函数，同时也提供了让 JS 访问 Native 对象，方法的接口。
    - 每个 JSContext 都从属于一个 JSVM。我们可以通过 JSContext 的只读属性 virtualMachine 获得当前 JSContext 绑定的 JSVM。JSContext 和 JSVM 是多对一的关系，一个 JSContext 只能绑定一个JSVM，但是一个 JSVM 可以同时持有多个 JSContext。
    - globalObject 是当前执行 JSContext 的全局对象（例如在 WebKit 中，JSContext 的 globalObject 就是当前的 Window 对象），JSContext 只是 globalObject 的一层壳
    - 通过 KVC（Key-Value Coding，即键值编码）的方式，可以获取当时 WebView 的 JSContext，通过 JSContext（的 evaluateScript API）可以运行一段 JS 代码
    - 通过 KVC 的方式，可以给 JSContext 塞进去很多全局变量或者全局函数，这些全局变量和函数，实际上就是全局对象 globalObject 的属性和方法
  - JSValue 实例是一个指向 JS 值的引用指针。我们可以使用 JSValue 类，在 OC 和 JS 的基础数据类型之间相互转换。同时我们也可以使用这个类，去创建包装了 Native 自定义类的 JS 对象，或者是那些由 Native 方法或者 Block 提供实现 JS 方法的 JS 对象。
    - JSCore 用 JSValue 在底层自动做了 OC 和 JS 的类型转换
- JSExport
  - 实现 JSExport 协议可以开放 OC 类和它们的实例方法，类方法，以及属性给 JS 调用。
    - 如果想在 JS 环境中使用 OC 中的类和对象，需要它们实现 JSExport 协议，来确定暴露给 JS 环境中的属性和方法。
    - 每个通过 JSExport 暴露的属性和方法，在转换成 JSValue 时都会生成 Setter 和 Getter 方法，这两个方法内都是 Native 代码。
    - 因此，当我们在 JS 里设置或调用这些 OC 暴露的属性或方法时，实际上是间接执行了 Native 的代码。

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
