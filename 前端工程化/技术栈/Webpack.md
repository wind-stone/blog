### 提取 vendor 代码

```js
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    return module.context && module.context.indexOf('node_modules') !== -1
  }
}),
```


## resolve.alias

别名 | ① import "xyz" | ② import "xyz/file.js" | 说明
--- | --- | --- | ---
{} | /abs/node_modules/xyz/index.js | /abs/node_modules/xyz/file.js |
{ xyz: "/abs/path/to/file.js" } | /abs/path/to/file.js | error | 别名值为文件，②方式出错
{ xyz: "./dir/file.js" } | /abs/dir/file.js | error | 别名值为文件，②方式出错
{ xyz: "modu/some/file.js" } | /abs/node_modules/modu/some/file.js | error | 别名值为文件，②方式出错
{ xyz$: "/abs/path/to/file.js" } | /abs/path/to/file.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz$: "./dir/file.js" } | /abs/dir/file.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz$: "/some/dir" } | /some/dir/index.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz$: "modu" } | /abs/node_modules/modu/index.js | /abs/node_modules/xyz/file.js | ②精确匹配时未匹配上，采用常规处理方式
{ xyz: "/some/dir" } | /some/dir/index.js | /some/dir/file.js |
{ xyz: "./dir" } | /abs/dir/index.js | /abs/dir/file.js |
{ xyz: "modu" } | /abs/node_modules/modu/index.js | /abs/node_modules/modu/file.js |
{ xyz: "modu/dir" } | /abs/node_modules/modu/dir/index.js | /abs/node_modules/dir/file.js | ②的结果是否有问题，丢失了 modu？
{ xyz: "xyz/dir" } | /abs/node_modules/xyz/dir/index.js | /abs/node_modules/xyz/dir/file.js |
{ xyz$: "xyz/dir" } | /abs/node_modules/xyz/dir/index.js | /abs/node_modules/xyz/file.js |