# Koa

[[toc]]

## 简单实现

### 1.x 中间件简单实现

该实现是未深入了解 Koa、仅通过了解 Koa 的`use`方法后，脑补的简单实现方式。（可能与实际实现相差巨大）

主要实现了 Koa 中间件的功能，包括

- 中间件 Generator 函数里`yield next`的实现
- 中间件 Generator 函数里`yield`另一个中间件的实现

<<< @/docs/front-end-engineering/node/koa/1.x-simple-implement.js

### 2.x 中间件简单实现

待学习
