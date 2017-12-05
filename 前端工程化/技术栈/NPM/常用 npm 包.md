## semver

获取 语义化的 版本号

### 常用方法

#### semver.clean
获取版本号
```js
semver.clean('v6.10.0')  // 6.10.0
```

#### semver.satisfies(version, range)
Return true if the version satisfies the range.
```js
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
```

Reference
- [github: node-semver](https://github.com/npm/node-semver)
- [版本及版本范围介绍](https://docs.npmjs.com/misc/semver)




## shelljs

JavaScript 的 shell 实现

Reference
- [github shelljs](https://github.com/shelljs/shelljs)




## chalk

使命令行输出可以有 五颜六色的 字体颜色/文字背景

### Reference
- [npmjs chalk](https://www.npmjs.com/package/chalk)
