# NPM

[[toc]]

## tag

[How to use: npm tags](https://dev.to/andywer/how-to-use-npm-tags-4lla)

- NPM 包的`tag`与`git`的`tag`不一样。
- NPM 的命令里，若是没提供`tag`，则默认使用`latest`，比如`npm install`和`npm publish`
- NPM 包的`tag`可以是任意的字符串，不过一般会有约定俗成的`tag`，比如`alpha`、`beta`、`next`等

## npm 包管理原理

- [一文弄懂 npm & yarn 包管理机制](https://jishuin.proginn.com/p/763bfbd655cc)

## 问题汇总

### 修改 registry 后 package-lock.json 里的 resolved 没更新

若是在项目里修改`registry`，在`npm i`之后，`package-lock.json`文件里的`resolved`仍为原来的`registry`，可通过如下步骤修复这个问题:

1. Delete .npmrc
2. Delete node_modules
3. Delete package-lock.json
4. Run npm cache clean -f
5. Run npm i

更多详情可以参见[package-lock.json not updating "resolved" field after moving registry #19578](https://github.com/npm/npm/issues/19578#issuecomment-386428859)。
