---
sidebarDepth: 0
---

# 工具

[[toc]]

## NPM registry 管理工具

[nrm](https://www.npmjs.com/package/nrm)

## CLI

[[toc]]

CLI（command-line interface，命令行界面）

### 命令行参数前 -- 与 - 的区别

- 参数用一横的说明后面的参数是字符形式，如 npm -h
- 参数用两横的说明后面的参数是单词形式，如 npm --help

Reference: [由linux命令行下命令参数前的一横（-）和两横（--）的区别而得知的](http://blog.csdn.net/songjinshi/article/details/6816776)

## rsync

[[toc]]

`rsync`命令是一个远程数据同步工具，可通过 LAN/WAN 快速同步多台主机间的文件。`rsync`使用所谓的“rsync算法”来使本地和远程两个主机之间的文件达到同步，这个算法只传送两个文件的不同部分，而不是每次都整份传送，因此速度相当快。

### 常用命令

```sh
# rsync [OPTION]... SRC [USER@]HOST::DEST
# 从本地机器拷贝文件到远程rsync服务器中。当 DST 路径信息包含“::”分隔符时启动该模式
rsync -av /databack root@192.168.78.192::www
```

[rsync 命令大全](http://man.linuxde.net/rsync)
