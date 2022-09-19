# pnpm

## 包管理器主要关注的问题

- 减少同包同版本的依赖被多次安装，减少磁盘空间占用，加快安装速度
- Windows 存在[最大路径长度限制](https://learn.microsoft.com/zh-cn/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd)，最长为 260 个字符（Windows 10 版本 1607 及更高版本中可修改）
- 解决“幽灵依赖”问题，未在`dependencies`里声明的包，不可以在代码里直接`import`
- 解决“依赖分身”问题

## 参考文档

- [pnpm 是凭什么对 npm 和 yarn 降维打击的](https://juejin.cn/post/7127295203177676837)
- [包管理器 pnpm 中的软链与硬链](https://juejin.cn/post/7044807973868142622)
- [NPM 中的 phatom 与 doppelgangers 问题](https://zhuanlan.zhihu.com/p/353208988)，说明什么是幽灵依赖和依赖分身

## 软链与硬链

### 区别

在执行过程中，软链的文件路径和软链实际地址是不匹配的。

```js
// <root>/index.js
console.log(process.cwd());
console.log(__filename);
```

```sh
# 创建 link 文件夹
mkdir link

# 创建 index.js 的一个软链
ln -s index.js link/index-sl.js

# 创建 index.js 的一个硬链
ln <root>/index.js <root>/link/index-hl.js
```

```sh
node index.js
# <root>
# <root>/index.js


node link/index-sl.js
# <root>
# <root>/index-hl.js

node link/index-hl.js
# <root>
# <root>/link/index-hl.js
```

分别执行`index.js`及它的软链`index-sl.js`和硬链`index-hl.js`可以发现，软链的`__filename`显示的是源文件`index.js`的文件地址。

### 在 pnpm 里的作用

软链在 pnpm 里（结合着依赖查找规则）主要是

- 解决幽灵依赖的问题，只有项目`package.json`的`dependencies`里显示声明的依赖，才会出现在`<root>/node_modules`里，且该目录下的文件夹都是软链。
- 解决依赖的 npm 包路径过长的问题。根据软链的特性，npm 包路径的长度最长也就是`.pnpm/<packagename>@<version>/node_modules/<packagename>`。

硬链在 pnpm 里主要是为了：

- 实现文件复用，保证相同的包不会被重复下载。

## pnpm 存在的问题

## 待解决

### pnpm 对 peer dependencies 为什么有不一样的处理？
