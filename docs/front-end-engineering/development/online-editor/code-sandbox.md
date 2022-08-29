# CodeSandbox

## 入门文章

- [CodeSandbox 如何工作? 上篇](https://bobi.ink/2019/06/20/codesandbox/)，强烈推荐
- [CodeSandbox - 从入门到实现原理解析](https://www.yuque.com/wangxiangzhong/aob8up)
- [CodeSandbox是如何让npm上的模块直接在浏览器端运行的](https://www.yuque.com/wangxiangzhong/aob8up/uf99c5)

### 背景知识

- [使用 Webpack 的 DllPlugin 提升项目构建速度](https://juejin.cn/post/6844903777296728072)

## 依赖加载

依赖加载主要有两种方式：

1. 浏览器上直接请求`unpkg.com`上的单个文件
2. 浏览器请求服务端的打包器，打包器通过`yarn`下载依赖并返回（这种方式可以在浏览器做依赖的缓存，如果是依赖的已缓存的相同依赖，则后续可以离线运行）
