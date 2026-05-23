# 语义化版本

[[toc]]

## 基本原则

- 第一个稳定版本号为`1.0.0`
- `beta`版本号从`0`开始，比如：`1.0.0-beta.0`
- 使用`npm version`命令进行版本升级
- `latest` tag 永远指向最新的稳定版本
- `beta`发版， 必须加`--tag beta`
- git 仓库和 tag 保持一致

## 语义化版本

### 包的初始化版本

主版本号为零（`0.y.z`）的软件处于开发初始阶段，一切都可能随时被改变。这样的公共 API 不应该被视为稳定版。

`1.0.0`的版本号用于界定公共 API 的形成。这一版本之后所有的版本号更新都基于公共 API 及其修改内容。

因此，前期内部还未共享的包，版本可以是`0.y.z`；但正式对外共享的包，版本需要从`1.0.0`开始。

### pre release 版本

- `alpha`
    代表内测版本，会有很多 bug，是比`beta`更早的版本，一般不建议对外发布
- `beta`
    代表公测版本，相对`alpha`版本已有了很大的改进，但还是存在一些缺陷，需要经过多次测试来进一步消除
- `rc`
    Release Candidate，顾名思义就是正式发布的候选版本。和`beta`版最大的差别在于`beta`阶段会一直加入新的功能，但是到了`rc`版本，几乎就不会加入新的功能了，而主要着重于除错! `rc`版本是最终发放给用户的最接近正式版的版本，发行后改正 bug 就是正式版了，就是正式版之前的最后一个测试版

因此，我们提供给外部还未正式发布的版本时，至少应该是`beta`版本，不应该是`alpha`版本。

此外，当提供给业务方`beta`版本后，请在业务上线一周后升级为正式版。

### 已发布包如何增加版本号

| Code status                               | Stage         | Rule                                                               | Example version |
| ----------------------------------------- | ------------- | ------------------------------------------------------------------ | --------------- |
| First release                             | New product   | Start with 1.0.0                                                   | 1.0.0           |
| Backward compatible bug fixes             | Patch release | Increment the third digit                                          | 1.0.1           |
| Backward compatible new features          | Minor release | Increment the middle digit and reset last digit to zero            | 1.1.0           |
| Changes that break backward compatibility | Major release | Increment the first digit and reset middle and last digits to zero | 2.0.0           |

注意，当版本为`alpha`（或`beta`）版本时，版本的格式为:`x.y.z-alpha.w`，其中`w`是从`0`开始的整数。

### package.json 里如何指定版本更新类型

`package.json`里可以指定依赖的更新类型。比如：

- Patch releases: `1.0`or`1.0.x`or`~1.0.4`，只更新小版本
- Minor releases: `1`or`1.x`or`^1.0.4`，更新中版本和小版本
- Major releases: `*`or`x`，更新大、中、小版本

注意，当大版本号为`0`时，`^`与`~`的效果一样。

### 参考

- [NPM - About semantic versioning](https://docs.npmjs.com/about-semantic-versioning)
- [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
- [NPM 语音化版本计算](https://semver.npmjs.com/)

## 发版规范

### npm version 命令

假设我的`package.json`的当前`version`为`6.0.0`，依次输入下面的命令，`package.json`里的`version`会变更为提升后的版本号：

```sh
npm version preminor
# v6.1.0-0

npm version minor
# v6.1.0

npm version prepatch
# v6.1.1-0

npm version patch
# v6.1.1

npm version prerelease
# v6.1.2-0

npm version premajor
# v7.0.0-0

npm version major
# v7.0.0

npm version prerelease --preid=alpha
# v7.0.1-alpha.0
```

如果你的项目中包含 git，它还会自动给你提交更新到 git，等同于执行`git commit -m "X.Y.Z"`。
所以还可以在`npm version NEWVERSION`后面加上`-m`参数来指定自定义的 commit message。比如：

```sh
# message 中的 s% 将会被替换为版本号
npm version patch -m "Upgrade to %s for reasons"
```
