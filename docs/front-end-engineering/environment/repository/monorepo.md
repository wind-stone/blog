# Monorepo

[[toc]]

**为什么要用 Monorepo？**

- 组件 components 和工具函数 util/lib 的积累和复用
- 工程脚手架的统一配置

- [现代前端工程为什么越来越离不开 Monorepo?](https://juejin.cn/post/6944877410827370504)

## Lerna

Lerna 是基于对包管理器`npm`/`yarn`的封装是来实现的，它无法有效地控制`node_modules`的内容：

- Lerna 会为每一个`package`都调用`yarn install`，这导致了额外的开销，因为每一个`package.json`是独立的且它们之间无法共享依赖。这也导致了在这些`node_modules`文件夹里产生了大量的重复依赖，因为这些`package`经常会使用相同的第三方包。
- 安装完成之后，Lerna 会手动地在相互引用的`package`之间创建链接`link`。这将在这些`node_module`内部引入连包管理器都无法感知到的不一致性，因此在一个包内部运行`yarn install`，可能会破坏 Lerna 管理的元结构（`meta structure`）。

## Yarn Workspaces

参考文档：

- [Yarn 官方博客 - Workspaces in Yarn](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)，博客里还说明了 Workspaces 与 Lerna 的区别和集成，强烈推荐该博客
- [Yarn 官方文档 - Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)

Yarn 的原生 Workspaces 功能，通过消除跨 Workspaces 的依赖包重复问题，能够让安装依赖变得更快更轻量。Yarn 可以在相互依赖的 Workspace 创建符号链接`symlinks`，确保所有目录的一致性和正确性。

### Workspaces 的依赖安装

- 每个 Workspace 里安装的依赖，都会被提升到 Monorepo 根目录下的`node_modules`目录里
- 若某个 Workspace 里依赖的包 PackageA 与根目录里依赖的包 PackageA 的版本不兼容，则会在根目录下和该 Workspace 下分别安装不同版本的 PackageA
- 根目录下的`node_modules`目录里涉及到 Workspace 的依赖，都会以符号链接`symlink`的方式链接到该 Monorepo 下对应的 Workspace 文件夹
- 每个 Workspace 没有它自己的`yarn.lock`文件，只有根目录存在`yarn.lock`文件，包含了整个 Monorepo 下所有的 Workspace 的依赖
- 当在某个 Workspace 下执行安装依赖命令时，该 Workspace 下的`package.json`会增加一条依赖记录，且 Monorepo 根目录下的`yarn.lock`会增加一条依赖记录

### Workspaces 的发布问题

通常，Monorepo 的根目录包含了胶水代码和业务特定代码，这些代码分享给其他项目也是没有用处的，因此根目录一般不作为一个`package`发布到 NPM 上，所以我们可以在根目录的`package.json`里将其标记为`private`。

而在 Monorepo 项目的根目录`package.json`里也会通过`workspaces`定义一些 Workspace，每个 Workspace 通过会作为一个`package`发布到 NPM 上。

## wsrun

[wsrun](https://github.com/hfour/wsrun)，用于在 Yarn Workspaces 里运行 NPM 脚本或自定义命令。
