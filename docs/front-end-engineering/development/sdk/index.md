# SDK 开发

## SDK 使用统计

有些 SDK 在提供给业务方使用时，作为 SDK 的开发者，希望可以统计线上 SDK 的版本分布，以及有哪些业务方正在使用。

### name 和 version

SDK 打包时，`packge.json`里的`name`和`version`变量是可以在 npm 脚本里获取的。

```json
{
  "name": "foo",
  "version": "1.2.5",
  "scripts": {
    "build1": "node build.js",
    "build2": "echo $npm_package_name; echo $npm_package_version"
  }
}
```

针对 npm 脚本里执行 JS 脚本，比如`build1`脚本，在`build1.js`文件里如下获取`name`和`version`:

```js
// build1.js
console.log(process.env.npm_package_name); // blog
console.log(process.env.npm_package_version); // 1.0.0
```

针对 npm 脚本里执行 Shell 命令，比如`build2`脚本，可以通过`$npm_package_name`和`$npm_package_version`获取。
