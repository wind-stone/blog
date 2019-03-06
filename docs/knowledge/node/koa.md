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