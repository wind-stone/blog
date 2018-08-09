# rsync

rsync命令是一个远程数据同步工具，可通过LAN/WAN快速同步多台主机间的文件。rsync使用所谓的“rsync算法”来使本地和远程两个主机之间的文件达到同步，这个算法只传送两个文件的不同部分，而不是每次都整份传送，因此速度相当快。

## 命令大全

[rsync 命令](http://man.linuxde.net/rsync)

## 常用命令

```sh
# rsync [OPTION]... SRC [USER@]HOST::DEST
# 从本地机器拷贝文件到远程rsync服务器中。当 DST 路径信息包含“::”分隔符时启动该模式
rsync -av /databack root@192.168.78.192::www
```
