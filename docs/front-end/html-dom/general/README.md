---
sidebarDepth: 0
---

# 未分类

[[toc]]

## preload、prefetch

- `preload`
  - 高优先级
  - 浏览器预先请求当前页必须需要的资源，以避免在用到的时候实时去请求
  - 应用场景：假设主 JS 文件里会动态创建`image`标签，并插入到 DOM 里
    - 不采用`preload`，则时间线是这样的：请求主 JS 文件 --> 执行主 JS 文件 --> 创建`image`标签并插入 DOM --> 请求`image`文件 --> 渲染到页面
    - 采用`preload`预加载`image`，则时间线是这样的：请求主 JS 文件、`image`文件 --> 创建`image`标签并插入 DOM（此时`image`文件已经加载好） --> 渲染到页面
  - 不会阻塞渲染，不会阻塞`window`的`onload`事件
- `prefetch`
  - 低优先级
  - 浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中
