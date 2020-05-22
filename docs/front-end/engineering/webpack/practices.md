# Webpack 实践配置

## vue-cli 3.0 Webpack 使用相关

```js
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    // ...
    chainWebpack: config => {
        // 可视化依赖分析
        config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
            {
                generateStatsFile: true
            }
        ]);

        // 关闭代码压缩，可在追查 bug 时关闭，详见 https://webpack.js.org/configuration/optimization/#optimizationminimize
        config.optimization.minimize(false);

        // 删除 ts 规则上的 cache-loader。
        // BTW，vue-cli 默认会给 .vue/.ts/.tsx 添加 cache-loader
        config.module.rule('ts').uses.delete('cache-loader');
    },

    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    // https://cli.vuejs.org/zh/config/#transpiledependencies
    transpileDependencies: [
        'vue' // 仅示例，实际上引用 vue 之前其已经编译过
    ],
}
```

## 审查项目的 webpack 配置

`vue-cli-service inspect`命令可以用于审查一个 Vue CLI 项目的 Webpack 配置。

- 可通过`--mode`参数指定不同的环境模式（比如`production`/`development`，默认是`development`）。
- 可将配置输出到文件里方便查阅

```sh
# 查看 production 模式的配置，并将结果输出到 output.js 里
vue inspect --mode production > output.js

# 或
npx vue-cli-service inspect --mode development > output.js
```

参考:

- [使用 vue-cli-service inspect 来查看一个 Vue CLI 3 项目的 webpack 配置信息（包括：development、production）](https://www.cnblogs.com/cag2050/p/10523096.html)
- [Vue CLI - vue-cli-service inspect](https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-inspect)
- [Vue CLI - 审查项目的 webpack 配置](https://cli.vuejs.org/zh/guide/webpack.html#%E5%AE%A1%E6%9F%A5%E9%A1%B9%E7%9B%AE%E7%9A%84-webpack-%E9%85%8D%E7%BD%AE)

## splitChunks

### 默认配置

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

说明:

- `splitChunks.cacheGroups`下的每个属性对象，都会继承或覆盖`splitChunks.*`，但`test`、`priority`和`reuseExistingChunk`是`splitChunks.cacheGroups`专有的属性

因此，对于`vendors`这个缓存组来说，实际上是这样的：

```js
module.exports = {
  //...
  optimization: {
    // ...
    splitChunks: {
      // ...
      cacheGroups: {
        vendors: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          automaticNameMaxLength: 30,
          name: true,
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
        // ...
      }
    }
  }
}
```

- `chunks`确定参与分离的`chunk`有哪些
- `test`确定参与分离的`chunk`里的哪些模块会位于这个缓存组
- `name`确定模块最终属于哪个`split chunk`

可以看到，splitChunks 的默认分组配置里，`vendors`和`default`分组的`priority`分别为`-10`和`-20`，这是为了方便用户自定义的分组能够有更高的优先级（自定义分组的默认`priority`是`0`）。

## 生产环境打包时，去掉 vConsole

### 背景

#### 仅在开发模式下引入 vConsole

通常情况下，我们会在项目入口文件`index.js`里通过`process.env.NODE_ENV`环境变量判断是否要引入 vConsole:

```js
// 测试vconsole
if (process.env.NODE_ENV === 'development') {
    const VConsole = require('vconsole');
    new VConsole();
}
```

若是在打包时将 Webpack 的`optimization.minimize`设置为`false`即不使用 TerserPlugin 压缩`bundle`，则在这段代码在生产环境打包好的`bundle`里对应的是

```js
// 测试vconsole
if (false) { var VConsole; }
```

可以看到，`process.env.NODE_ENV === 'development'`被编译成了`false`，且并没有`require('vconsole')`对应的代码，因此在生产环境最终的`bundle`里是不会引入 vConsole 代码的。而且，在打包时将 Webpack 的`optimization.minimize`设置为`true`，则生产环境最终的`bundle`里连`if (false) { var VConsole; }`和注释都会删除掉。

#### 在开发和测试模式下引入 vConsole

但是，我们一般在测试时，为了方便调试和追踪 bug，也会选择将 vConsole 打开，因此`index.js`可能会这么写：

```js
// 测试vconsole
if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'test') {
    const VConsole = require('vconsole');
    new VConsole();
}
```

我们通过添加一个`VUE_APP_ENV`环境变量来区分是测试环境还是生产环境。当在测试环境构建时，会指定`VUE_APP_ENV`环境变量的值为`test`，这样就能打开 vConsole；当在生产环境构建时，不指定`VUE_APP_ENV`环境变量，这样就不会引入 vConsole 了。

::: tip 提示

- 测试环境构建时，`process.env.NODE_ENV`都会设置为`production`，以保证测试环境和生产环境使用的 Webpack 配置尽可能一致。
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

`process.env.NODE_ENV === 'development'`依然被编译成`false`，但是`process.env.VUE_APP_ENV === 'test'`被编译成`Object({"NODE_ENV":"production","BASE_URL":"//blog.windstone.com/"}).VUE_APP_ENV === 'test'`。

更为严重的是，`require('vconsole')`编译成了`__webpack_require__("3a34")`，这意味着，在生产环境的`bundle`里最终包含了 vConsole 的 NPM 包代码，而这根本不是我们想要的。

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
const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'test';

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
        <% if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'test') { %>
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
