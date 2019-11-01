# Babel 7

官方中文文档: [https://www.babeljs.cn/](https://www.babeljs.cn/)

## preset

## plugins

## preset 和 plugins 使用顺序

- 插件在 Presets 前运行。
- 插件顺序从前往后排列。
- Presets 顺序是颠倒的（从后往前）。

## 常用插件

- [@babel/plugin-transform-runtime](./@babel/plugin-transform-runtime.md)

## 常用 preset

### @vue/babel-preset-app

默认会包含以下`polyfill`：

- `es6.array.iterator`
- `es6.promise`
- `es6.object.assign`
- `es7.promise.finally`

详见[vue-cli 之 @vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app)
