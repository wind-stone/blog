# babel 之 webpack

## 与 webpack 有关的 Babel 配置详解
```js
// .babelrc
{
  "presets": [
    [
      "env",
      {
        "modules": false,
        "useBuiltIns": true,
        "targets": {
          "browsers": [
            "> 0.01%",
            "last 2 versions",
            "not ie <= 8"
          ]
        }
      }
    ],
    "stage-2"
  ]
}
```

### `"modules": false`：

webpack 2 开始引入`tree-shaking`技术，通过静态分析 ES6 语法，可以删除没有被使用的模块，但是这只对 ES6 的模块有效，所以一旦 Babel 将 ES6 的模块转换成 CommonJS 的模块，webpack 2 将无法使用这项优化。所以要使用这项技术，我们只能使用 webpack 的模块处理，加上 Babel 的 ES6 转换能力（即需要关闭模块转换`"modules": false`）


## 有些 UI 组件库比如 element-ui 和 cube-ui 可以用`import`或`require`按需引入单个模块，是如何做到的？
    1. 组件库发布时，webpack 等打包工具会将单个模块（如`button.js`）模块导出成 CommonJS 模块，放在 lib 目录下（如`lib/button.js`）
    2. Babel 里使用`babel-plugin-component`插件或类似插件，并做一些配置
    3. 用户在使用`import { Button } from 'element-ui'`引入组件时，Babel 会自引入`lib/button.js`的结果并复制给`Button`
    4. 如果没有第`2`步的配置，引入的则是整个组件库


## Reference

- [import、require、export、module.exports 混合使用详解](https://github.com/ShowJoy-com/showjoy-blog/issues/39)