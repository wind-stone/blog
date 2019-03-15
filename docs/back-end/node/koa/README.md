---
sidebarDepth: 0
---

# KOA

[[toc]]

## 中间件

### koa-router

[koa-router](https://github.com/ZijianHe/koa-router)，

### koa-views

[koa-views](https://github.com/queckezz/koa-views)，模板渲染中间件，给定要请求的视图名称，传入数据，即可渲染出最终的模板字符串。

```js
const path = require('path');
const views = require('koa-views');
const Koa = require('koa');
const app = module.exports = new Koa();

// 必须在任何路由中间件之前使用
app.use(views(
  // 模板目录，必须是绝对路径，所有的视图都是基于此路径
  path.join(__dirname, '/views'),
  {
    // 视图的默认扩展名
    extension: 'ejs'
  }
));

const user = {
  name: {
    first: 'Tobi',
    last: 'Holowaychuk'
  },
  species: 'ferret',
  age: 3
};

app.use(async function(ctx) {
  // 渲染 user 视图，默认扩展名是 ejs，参数是 { user }
  await ctx.render('user', { user });
});

if (!module.parent) app.listen(3000);
```

```html
<!-- user.ejs -->
<p><%= user.name.first %> is a <%= user.age %> year old <%= user.species %>.</p>
```

### koa-proxy

[koa-proxy](https://github.com/popomore/koa-proxy)，是`koa`的代理中间件，主要是将请求代理到其他服务器上。

### koa-logger

[koa-logger](https://github.com/koajs/logger)，`koa`开发风格的日志中间件。这个中间件应该尽可能靠前放置，以便可以记录下所有的请求和响应。

## 简单实现

### 1.x 中间件简单实现

该实现是未深入了解 Koa、仅通过了解 Koa 的`use`方法后，脑补的简单实现方式。（可能与实际实现相差巨大）

主要实现了 Koa 中间件的功能，包括

- 中间件 Generator 函数里`yield next`的实现
- 中间件 Generator 函数里`yield`另一个中间件的实现

<<< @/docs/back-end/node/koa/1.x-simple-implement.js

### 2.x 中间件简单实现

待学习
