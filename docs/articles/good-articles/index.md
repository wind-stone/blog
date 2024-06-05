# 优秀文章集锦

[[toc]]

## 术语解释

- aPass，[知乎 - 一文讲透aPaaS平台是什么](https://zhuanlan.zhihu.com/p/69168598)

## 技术类

### 代码风格

- [如何制定企业级代码规范与检查](https://mp.weixin.qq.com/s/qpUlllsMvMH0Gc88QJ66Fg)

## 技术尝鲜

### WebRTC

- [Google WebRTC 指南](https://webrtc.org/getting-started/overview?hl=zh-cn)
- [WebRTC入门指南 —— 实现一个完整的点对点视频通话（信令服务器+客户端）](https://juejin.cn/post/7071994793710075911)

## 工程类

- [如何科学修改 node_modules 里的文件](https://mp.weixin.qq.com/s/Cb8iBibs6GjiOY-qWFz6mw)
- [一文搞懂CDN加速原理](https://mp.weixin.qq.com/s/e-UzhyS_5zs4KYdyu7vSyg)
- [提升低端设备的 Web 性能](https://mp.weixin.qq.com/s/qNA1AIMvcmeQ0RsPd0wmBA)

### 微前端

#### qiankun（乾坤）

- [基于 qiankun 的微前端最佳实践（万字长文） - 从 0 到 1 篇](https://juejin.cn/post/6844904158085021704)
- [基于 qiankun 的微前端最佳实践（图文并茂） - 应用间通信篇](https://juejin.cn/post/6844904151231496200)
- [万字长文+图文并茂+全面解析微前端框架 qiankun 源码 - qiankun 篇](https://juejin.cn/post/6844904115999342600)

#### 授权服务

##### Oauth 2.0

- [阮一峰 - OAuth 2.0 的一个简单解释](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
- [阮一峰 - OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
  - 授权码方式
    - 用于第三方应用从资源服务器获取用户授权的信息。
    - 这种方式在请求时可以指定授权范围，用户仅针对该范围授权，后续第三方应用也只能获取到该范围的授权
    - 授权码的有效期比较短，且只能用一次
    - 示例：快手 APP 获取用户的微信数据（进行登录）。
  - 凭证式
    - 用于第三方应用向资源服务器证明自身身份并获取到令牌，后续与资源服务器的通信均可认为是该第三方应用所为。
    - 不涉及到用户，或者所有用户共用一个令牌。
    - 示例：微信小程序应用可向微信获取一个令牌，后续携带该令牌获取小程序的用户反馈内容。
  - 隐藏式和密码式风险很大，我目前没遇到过使用场景。

### 服务端

#### 数据库

- [深入浅出数据库索引原理](https://zhuanlan.zhihu.com/p/23624390)
