# 性能优化

## 优化前 - 性能分析

## 优化方式汇总

### JS 文件

借助 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 分析打包文件后，可以对 JS 文件做出如下优化：

- Code Splitting，将低频的功能抽成独立 chunk，按需加载
- Webpack CommonsChunkPlugin，比如将 Vue 生态的包（Vue、vue-router、vuex/piana）抽成一个独立的 chunk
- JS 外链引用，比如 VConsole，改成外链引用，且线上在 url 上有特殊参数时才加载

### 图片

- 懒加载
- 转 Webp
- CDN 裁剪

### 视频

- 视频格式，由 MP4 转为 HLS

### CDN

- 开启 HTTP2
- 开启 gzip（也可以使用 CompressionWebpackPlugin 来做 gzip，但是 CDN 上开启 gzip 更方便）
- CDN 容灾

### 第三方包替换

- 用  day.js 代替 moment.js，在 Antd 项目里可以使用 [antd-dayjs-webpack-plugin](https://github.com/ant-design/antd-dayjs-webpack-plugin) 来一步替换

### Webpack 插件

- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)，分析构建产物
- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)，测量 webpack 的构建速度，给出各个插件和 loader 花费的时间
- [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)，缓存中间模块构建产物，提升本地构建速度
- [progress-bar-webpack-plugin](https://github.com/clessg/progress-bar-webpack-plugin)，以进度条的形式，展示 Webpack 构建速度

### 接口

- 推动优化大而慢的接口
- 接口开启 keep-alive
- 域名（包括 HTML 和接口）支持 HTTP2
- HTML 里预请求首屏接口
