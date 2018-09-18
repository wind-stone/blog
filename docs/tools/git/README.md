---
sidebarDepth: 0
---

# git

[[toc]]

## git 文件夹名称/文件名称 不区分大小写

git 默认对文件夹名称/文件名称的大小写是不敏感的，如果仅是修改了文件夹名称/文件名称的大小写，通过`git status`无法发现代码有任何变化。

配置配置

```sh
core.ignorecase=true
```

修改默认配置，使 git 区分大小写

```sh
git config core.ignorecase false
```
