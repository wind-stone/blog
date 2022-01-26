# dead code

[[toc]]

## 生产环境打包时，去掉 vConsole

### 背景

#### 仅在开发模式下引入 vConsole

通常情况下，我们会在项目入口文件`index.js`里通过`p rocess.env.NODE_ENV`环境变量判断是否要引入 vConsole:

```js
// 测试vconsole
if (p rocess.env.NODE_ENV === 'development') {
    const VConsole = require('vconsole');
    new VConsole();
}
```

若是在打包时将 Webpack 的`optimization.minimize`设置为`false`即不使用 TerserPlugin 压缩`bundle`，则在这段代码在生产环境打包好的`bundle`里对应的是

```js
// 测试vconsole
if (false) { var VConsole; }
```

可以看到，`p rocess.env.NODE_ENV === 'development'`被编译成了`false`，且并没有`require('vconsole')`对应的代码，因此在生产环境最终的`bundle`里是不会引入 vConsole 代码的。而且，在打包时将 Webpack 的`optimization.minimize`设置为`true`，则生产环境最终的`bundle`里连`if (false) { var VConsole; }`和注释都会删除掉。

#### 在开发和测试模式下引入 vConsole

但是，我们一般在测试时，为了方便调试和追踪 bug，也会选择将 vConsole 打开，因此`index.js`可能会这么写：

```js
// 测试vconsole
if (p rocess.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'test') {
    const VConsole = require('vconsole');
    new VConsole();
}
```

我们通过添加一个`VUE_APP_ENV`环境变量来区分是测试环境还是生产环境。当在测试环境构建时，会指定`VUE_APP_ENV`环境变量的值为`test`，这样就能打开 vConsole；当在生产环境构建时，不指定`VUE_APP_ENV`环境变量，这样就不会引入 vConsole 了。

::: tip 提示

- 测试环境构建时，`p rocess.env.NODE_ENV`都会设置为`production`，以保证测试环境和生产环境使用的 Webpack 配置尽可能一致。
- 以`VUE_APP_`开头的环境变量在构建时会被`webpack.DefinePlugin`静态嵌入到客户端侧的包中，因此可以在应用代码里`console.log(process.env.VUE_APP_ENV)`这样访问它们。
:::

理想很丰满，现实很骨感。

我们先将 Webpack 的`optimization.minimize`设置为`false`，看一下生产环境下打出的`bundle`里对应的代码：

```js
// 测试vconsole
if ( false || Object({"NODE_ENV":"production","BASE_URL":"//blog.windstone.com/"}).VUE_APP_ENV === 'test') {
  var VConsole = __webpack_require__("3a34");
  new VConsole();
}
```

`p rocess.env.NODE_ENV === 'development'`依然被编译成`false`，但是`process.env.VUE_APP_ENV === 'test'`被编译成`Object({"NODE_ENV":"production","BASE_URL":"//blog.windstone.com/"}).VUE_APP_ENV === 'test'`。

更为严重的是，`require('vconsole')`编译成了`__webpack_require__("3a34")`，这意味着，在生产环境的`bundle`里最终包含了 vConsole 的 NPM 包代码，而这根本不是我们想要的。

详见压缩工具的`dead_code`选项，比如[terser - Compress options - dead_code](https://github.com/terser/terser#compress-options)。

### 解决方案

#### 方案一: JS 里注入 vConsole

为了解决在生产环境的`bundle`里引入了 vConsole 代码的问题，我们选择在 Webpack 打包阶段就开始判断是本地环境/测试环境/生产环境的构建。若非本地环境和测试环境，我们将`const VConsole = require('vconsole');new VConsole();`代码片段动态注入到应用代码里，再进行编译打包；若是生产环境构建，则不注入这段代码片段。

```sh
# 安装 loader
npm install --save-dev string-replace-loader
```

应用入口`index.js`文件加入注释:

```js
import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App';

/* <vconsole-placeholder> */

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
```

`vue.config.js`添加如下代码：

```js
const isDevOrTest = p rocess.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'test';

module.exports = {
    // ...
    chainWebpack: config => {
        // ...
        config.module
            .rule('development tools')
            .test(/\.(js|ts|vue)$/)
            .use('string-replace')
            .loader('string-replace-loader')
            .options({
                multiple: [{
                    search: '/* <vconsole-placeholder> */',
                    replace: isDevOrTest
                        ? `const VConsole = require('vconsole');
                            new VConsole();`
                        : '',
                }],
            });
        // ...
    }
    // ...
}
```

Webpack 编译打包时，`string-replace-loader`判断是本地环境或测试环境，会将所有`js/ts/vue`文件里的`/* <vconsole-placeholder> */`字符串替换为`const VConsole = require('vconsole');new VConsole();`；若是生产环境，则将其替换为空字符`''`。如此，在生产环境的`bundle`里就不会包含 vConsole 的代码了。

#### 方案二: HTML 里注入 vConsole

Vue CLI 生成的项目里，`public/index.html`文件是一个会被`html-webpack-plugin`处理的模板，因此可以使用`lodash template`语法插入内容。

而以`VUE_APP_`开头的变量会被 `webpack.DefinePlugin`静态嵌入到客户端侧的包中，而这些环境变量和`NODE_ENV`、`BASE_URL`都可以在`public/index.html`中以 HTML 插值的方式使用。

- [环境变量和模式](https://cli.vuejs.org/zh/guide/mode-and-env.html)
- [Vue CLI - HTML 和静态资源#HTML](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#html)。

因此，可结合环境变量，在 HTML 模板里注入 vConsole:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <title><%= htmlWebpackPlugin.options.title %></title>
        <% if (p rocess.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'test') { %>
            <script src="https://unpkg.com/vconsole@3.3.4/dist/vconsole.min.js"></script>
            <script>
                var vConsole = new VConsole();
            </script>
        <% } %>
        <body>
            <div id="app"></div>
        </body>
    </head>
</html>
```
