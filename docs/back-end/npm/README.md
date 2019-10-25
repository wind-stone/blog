# npm

## 问题汇总

### 修改 registry 后 package-lock.json 里的 resolved 没更新

若是在项目里修改`registry`，在`npm i`之后，`package-lock.json`文件里的`resolved`仍为原来的`registry`，可通过如下步骤修复这个问题:

1. Delete .npmrc
2. Delete node_modules
3. Delete package-lock.json
4. Run npm cache clean -f
5. Run npm i

更多详情可以参见[package-lock.json not updating "resolved" field after moving registry #19578](https://github.com/npm/npm/issues/19578#issuecomment-386428859)。
