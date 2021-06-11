# vue-server-renderer

Vue SSR 依赖于`vue-server-renderer`这个包，而这个包的源码也在`vue`仓库的`package/vue-server-renderer`目录下。

```js
// packages/vue-server-renderer/index.js
try {
  var vueVersion = require('vue').version
} catch (e) {}

var packageName = require('./package.json').name
var packageVersion = require('./package.json').version
if (vueVersion && vueVersion !== packageVersion) {
  throw new Error(
    '\n\nVue packages version mismatch:\n\n' +
    '- vue@' + vueVersion + '\n' +
    '- ' + packageName + '@' + packageVersion + '\n\n' +
    'This may cause things to work incorrectly. Make sure to use the same version for both.\n'
  )
}

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build.prod.js')
} else {
  module.exports = require('./build.dev.js')
}
```

`package/vue-server-renderer`目录下的文件基本上是`vue`在打包时动态产生的。

```js
// scripts/config.js
// ...
const builds = {
  // ...
  // Web server renderer (CommonJS).
  'web-server-renderer-dev': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.dev.js'),
    format: 'cjs',
    env: 'development',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-prod': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.prod.js'),
    format: 'cjs',
    env: 'production',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-basic': {
    entry: resolve('web/entry-server-basic-renderer.js'),
    dest: resolve('packages/vue-server-renderer/basic.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'renderVueComponentToString',
    plugins: [node(), cjs()]
  },
  'web-server-renderer-webpack-server-plugin': {
    entry: resolve('server/webpack-plugin/server.js'),
    dest: resolve('packages/vue-server-renderer/server-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-webpack-client-plugin': {
    entry: resolve('server/webpack-plugin/client.js'),
    dest: resolve('packages/vue-server-renderer/client-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // ...
}
// ...
```

因此，`vue-server-renderer`包的入口文件实际上是`web/entry-server-renderer.js`文件。该文件导出`createRenderer`函数和`createBundleRenderer`函数，分别用于创建[Renderer](https://ssr.vuejs.org/zh/api/#class-renderer)实例和[BundleRenderer](https://ssr.vuejs.org/zh/api/#class-bundlerenderer)实例，这两个实例上存在`renderToString`方法和`renderToStream`方法。

- `Renderer`实例的`renderToString`方法: 将 Vue 实例渲染为字符串
- `Renderer`实例的`renderToStream`方法: 将 Vue 实例渲染为一个 Node.js 可读流
- `BundleRenderer`实例的`renderToString`方法: 将`bundle`渲染为字符串
- `BundleRenderer`实例的`renderToStream`方法: 将`bundle`渲染为一个 Node.js 可读流

```js
// src/platforms/web/entry-server-renderer.js
process.env.VUE_ENV = 'server'

import { extend } from 'shared/util'
import modules from './server/modules/index'
import baseDirectives from './server/directives/index'
import { isUnaryTag, canBeLeftOpenTag } from './compiler/util'

import { createRenderer as _createRenderer } from 'server/create-renderer'
import { createBundleRendererCreator } from 'server/bundle-renderer/create-bundle-renderer'

export function createRenderer (options?: Object = {}): {
  renderToString: Function,
  renderToStream: Function
} {
  return _createRenderer(extend(extend({}, options), {
    isUnaryTag,
    canBeLeftOpenTag,
    modules,
    // user can provide server-side implementations for custom directives
    // when creating the renderer.
    directives: extend(baseDirectives, options.directives)
  }))
}

export const createBundleRenderer = createBundleRendererCreator(createRenderer)
```

## createRenderer

`createRenderer`函数是对`_createRenderer`函数的封装，传入的参数是开发者自定义的`options`对象和基本的`options`对象合并后的`options`对象。

`_createRenderer`函数的定义如下：

```js
export function createRenderer ({
  modules = [],
  directives = {},
  isUnaryTag = (() => false),
  template,
  inject,
  cache,
  shouldPreload,
  shouldPrefetch,
  clientManifest,
  serializer
}: RenderOptions = {}): Renderer {

  // 创建 render 函数，该函数会将 Vue 实例渲染成字符串
  const render = createRenderFunction(modules, directives, isUnaryTag, cache)
  const templateRenderer = new TemplateRenderer({
    template,
    inject,
    shouldPreload,
    shouldPrefetch,
    clientManifest,
    serializer
  })

  return {
    renderToString (
      // 组件实例对象
      component: Component,
      // 用于模板插值
      context: any,
      // 回调函数，可以不传，会封装成 promise 形式
      cb: any
    ): ?Promise<string> {
      // 处理不传入 context 的情况
      if (typeof context === 'function') {
        cb = context
        context = {}
      }
      if (context) {
        // 往 context 上挂载 rendererResourceHints/rendererState/rendererScripts/rendererStyles/getPreloadFiles 等方法
        templateRenderer.bindRenderFns(context)
      }

      // 处理不传入 cb 的情况
      // 没有传 cb（形如 (err, html) => { ... } 的函数），则新创建一个 cb 并返回 promise；等到调用 cb 后，会触发 promise 的 resolve/reject
      // no callback, return Promise
      let promise
      if (!cb) {
        ({ promise, cb } = createPromiseCallback())
      }

      let result = ''
      // 该方法之后会挂在 context.write 上，并可通过 context.write.caching 确定是否要进行对写入的内容进行缓存
      const write = createWriteFunction(text => {
        result += text
        return false
      // 传入 cb 主要是用于内部错误的时候使用
      }, cb)
      try {
        // 调用 render 函数，将 Vue 实例渲染成字符串
        render(component, write, context, err => {
          if (err) {
            return cb(err)
          }
          if (context && context.rendered) {
            context.rendered(context)
          }
          if (template) {
            try {
              // 若是存在模板，则将组件的渲染结果字符串和模板结合一下再返回
              const res = templateRenderer.render(result, context)
              if (typeof res !== 'string') {
                // function template returning promise
                res
                  .then(html => cb(null, html))
                  .catch(cb)
              } else {
                cb(null, res)
              }
            } catch (e) {
              cb(e)
            }
          } else {
            cb(null, result)
          }
        })
      } catch (e) {
        cb(e)
      }

      // 始终返回 promise。
      // 针对传入 cb 的情况，这个 promise 是 undefined，开发者不需要关心这个返回值
      // 针对未传入 cb 的情况，经过 createPromiseCallback() 重新赋值 promise 和 cb 后，在调用 cb 后，会触发 promise 的 resolve/reject
      return promise
    },

    renderToStream (
      component: Component,
      context?: Object
    ): stream$Readable {
      if (context) {
        templateRenderer.bindRenderFns(context)
      }
      const renderStream = new RenderStream((write, done) => {
        render(component, write, context, done)
      })
      if (!template) {
        if (context && context.rendered) {
          const rendered = context.rendered
          renderStream.once('beforeEnd', () => {
            rendered(context)
          })
        }
        return renderStream
      } else if (typeof template === 'function') {
        throw new Error(`function template is only supported in renderToString.`)
      } else {
        const templateStream = templateRenderer.createStream(context)
        renderStream.on('error', err => {
          templateStream.emit('error', err)
        })
        renderStream.pipe(templateStream)
        if (context && context.rendered) {
          const rendered = context.rendered
          renderStream.once('beforeEnd', () => {
            rendered(context)
          })
        }
        return templateStream
      }
    }
  }
}
```
