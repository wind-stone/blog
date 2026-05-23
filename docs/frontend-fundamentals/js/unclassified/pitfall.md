# 踩过的坑

## video.js 7.6.2 里的 WeakMap 未经编译

`video.js`自`7.6.2`版本源码里使用`WeakMap`数据结构来处理 DOM 数据相关的功能，但是最终发布时，其使用的打包工具`Rollup`并没有对`WeakMap`进行编译处理，导致最终在项目里引入的`video.js`的代码里仍然存在`WeakMap`，最终导致 Android 4.x 的机器都无法正常使用`video.js`相关的功能。
