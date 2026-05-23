# koa 相关包

## koa2-connect

[koa2-connect](https://github.com/cyrilluce/koa2-connect)，在 Koa v2 里使用 Express/Connect 的中间件。

## koa-send、koa-static

[koa-send](https://github.com/koajs/send)，静态文件服务中间件。其核心实现方式是以`fs.createReadStream`读取服务器本地文件返回给客户端。

[koa-static](https://github.com/koajs/static)，Koa 的静态文件服务中间，基于`koa-send`封装。

## koa-socket-2

[koa-socket-2](https://github.com/ambelovsky/koa-socket-2)，Koa 里使用`socket.io`的语法糖。

## koa-json

[koa-json](https://github.com/koajs/json)，将请求的响应结果（`ctx.body`）按 JSON 格式美化的中间件，还支持将 Node 流对象转换为二进制。

## koa-onerror

[koa-onerror](https://github.com/koajs/onerror)，Koa 的错误处理，非中间件，可以在发生错误时根据请求的类型（比如`html`/`json`/`text`）返回该类型的响应。该插件通过修改`ctx`的原型`app.context`上的`onerror`方法给所有的`ctx`实例重新设置`onerror`方法。

```js
app.context.onerror = function () {
  // ...
}
```

注意，Koa 的`app.context`上默认存在`onerror`方法，该插件覆盖了默认的`onerror`方法。

## koa-bodyparser

[koa-bodyparser](https://github.com/koajs/bodyparser)，Koa 的 body 解析中间件，解析后的数据存储在`ctx.request.body`里。

## koa-router

[koa-router](https://github.com/ZijianHe/koa-router)，

## koa-views

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

## koa-proxy

[koa-proxy](https://github.com/popomore/koa-proxy)，是`koa`的代理中间件，主要是将请求代理到其他服务器上。

## koa-logger

[koa-logger](https://github.com/koajs/logger)，`koa`开发风格的日志中间件。这个中间件应该尽可能靠前放置，以便可以记录下所有的请求和响应。
