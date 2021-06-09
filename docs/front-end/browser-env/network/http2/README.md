---
sidebarDepth: 0
---

# HTTP2

[[toc]]

## 为什么是 HTTP2 而不是 HTTP/1.2

为了实现 HTTP 工作组设定的性能目标，HTTP/2 引入了一个新的二进制分帧层，该层无法与之前的 HTTP/1.x 服务器和客户端向后兼容，因此协议的主版本提升到 HTTP/2。

## HTTP/0.9-1.x 的缺点

早期版本的 HTTP 协议的设计初衷主要是实现要简单。然而，实现简单是以牺牲应用性能为代价的:

- HTTP/1.x 客户端需要使用多个连接才能实现并发和缩短延迟（比如一般浏览器针对同一域名只能同时允许建立 6 个 TCP 连接，超过 6 个需要等待之前的连接完成，再复用已有的连接进行新的请求）
- HTTP/1.x 不会压缩请求和响应标头，从而导致不必要的网络流量
- HTTP/1.x 不支持有效的资源优先级，致使底层 TCP 连接的利用率低下

## HTTP2

HTTP/2 仍是对之前 HTTP 标准的扩展，而非替代。HTTP 的应用语义不变，提供的功能不变，HTTP 方法、状态代码、URI 和标头字段等这些核心概念也不变。 这些方面的变化都不在 HTTP/2 考虑之列。

虽然高级 API 保持不变，仍有必要了解低级变更如何解决了之前协议的性能限制。

### 二进制分帧层

[HTTP/2 简介 - 二进制分帧层](https://developers.google.com/web/fundamentals/performance/http2?hl=zh-cn#%E4%BA%8C%E8%BF%9B%E5%88%B6%E5%88%86%E5%B8%A7%E5%B1%82)

### 数据流、消息、帧

新的二进制分帧机制改变了客户端与服务器之间交换数据的方式。为了说明这个过程，我们需要了解 HTTP/2 的三个概念:

- 数据流: 已建立的连接内的双向字节流，可以承载一条或多条消息。（wind-stone: 每个资源即一个数据流，比如一个 HTML 文档是个数据流，一个 JS 文件也是一个数据流）
- 消息: 与逻辑请求或响应消息对应的完整的一系列帧。（wind-stone: 每个数据流可能包含 1 到多个消息，比如请求消息，响应消息）
- 帧: HTTP/2 通信的最小单位，每个帧都包含帧头，至少也会标识出当前帧所属的数据流。（wind-stone: 每个消息可以包含 1 到多个帧，比如 header 帧，数据帧）

这些概念的关系总结如下:

- 所有通信都在一个 TCP 连接上完成，此连接可以承载任意数量的双向数据流。
- 每个数据流都有一个唯一的标识符和可选的优先级信息，用于承载双向消息。
- 每条消息都是一条逻辑 HTTP 消息（例如请求或响应），包含一个或多个帧。
- 帧是最小的通信单位，承载着特定类型的数据，例如 HTTP 标头、消息负载等等。 来自不同数据流的帧可以交错发送，然后再根据每个帧头的数据流标识符重新组装。

![数据流、消息、帧](./images/streams-messages-frames.svg)

简言之，HTTP/2 将 HTTP 协议通信分解为二进制编码帧的交换，这些帧对应着特定数据流中的消息。所有这些都在一个 TCP 连接内复用。 这是 HTTP/2 协议所有其他功能和性能优化的基础。

### 请求与响应复用

[HTTP/2 简介 - 请求与响应复用](https://developers.google.com/web/fundamentals/performance/http2?hl=zh-cn#%E8%AF%B7%E6%B1%82%E4%B8%8E%E5%93%8D%E5%BA%94%E5%A4%8D%E7%94%A8)

### 数据流优先级

[HTTP/2 简介 - 数据流优先级](https://developers.google.com/web/fundamentals/performance/http2?hl=zh-cn#%E6%95%B0%E6%8D%AE%E6%B5%81%E4%BC%98%E5%85%88%E7%BA%A7)

### 每个来源一个连接

[HTTP/2 简介 - 每个来源一个连接](https://developers.google.com/web/fundamentals/performance/http2#%E6%AF%8F%E4%B8%AA%E6%9D%A5%E6%BA%90%E4%B8%80%E4%B8%AA%E8%BF%9E%E6%8E%A5)

### 流控制

[HTTP/2 简介 - 流控制](https://developers.google.com/web/fundamentals/performance/http2#%E6%B5%81%E6%8E%A7%E5%88%B6)

### 服务器推送

[HTTP/2 简介 - 服务器推送](https://developers.google.com/web/fundamentals/performance/http2#%E6%AF%8F%E4%B8%AA%E6%9D%A5%E6%BA%90%E4%B8%80%E4%B8%AA%E8%BF%9E%E6%8E%A5)

为什么在浏览器中需要一种服务器推送机制呢？

一个典型的网络应用包含多种资源，客户端需要检查服务器提供的文档才能逐个找到它们。那为什么不让服务器提前推送这些资源，从而减少额外的延迟时间呢？服务器已经知道客户端下一步要请求什么资源，这时候服务器推送即可派上用场。

wind-stone: 举个例子，当使用 HTTP/1.x 请求一个 HTML 文档时，客户端需要获取到 HTML 文档后才能知道需要哪些外链 CSS 文件和 JS 文件并再次请求这些文件；但是当 HTTP2 时，在客户端请求 HTML 文档时，服务器端在发送 HTML 响应的同时，也可以将外链 CSS 文件和 JS 文件推送到客户端，省去了大约一个 HTTP 请求来回的时间。

推送的资源可以进行以下处理:

- 由客户端缓存
- 在不同页面之间重用
- 与其他资源一起复用
- 由服务器设定优先级
- 被客户端拒绝

### 标头压缩

[HTTP/2 简介 - 标头压缩](https://developers.google.com/web/fundamentals/performance/http2#%E6%A0%87%E5%A4%B4%E5%8E%8B%E7%BC%A9)
