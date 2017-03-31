# Hybrid

## 优缺点

### 优点
- 开发效率高
- 跨平台
- 低成本
- 无版本问题，有 bug 能及时修复

### 缺点
- 体验不如 Native

### 使用场景
对于需要快速试错、快速抢占市场的团队来说，Hybrid 是不二之选，团队生存下来后还是要做体验更好的原生 APP


## JSBridge

### 背景
在开发中，为了追求开发的效率以及移植的便利性，一些展示性强的页面我们会偏向于使用 h5 来完成，功能性强的页面我们会偏向于使用 native 来完成，而一旦使用了 h5，为了在 h5 中尽可能的得到 native 的体验，我们 native 层需要暴露一些方法给 js 调用。


### 目的
- （需求角度）方便开发者实现在 app 内展示 h5 页面并与 h5 页面 进行交互，以便 h5 页面可以获得近似 native 的流畅体验
- （技术角度）native 可以调用 web 页面的 js 代码，web 页面可以调用 native 的代码


### 实现原理
- iOS：[JSBridge——Web与Native交互之iOS篇](http://www.jianshu.com/p/9fd80b785de1)
- Android：[Android JSBridge的原理与实现](http://blog.csdn.net/sbsujjbcy/article/details/50752595)



