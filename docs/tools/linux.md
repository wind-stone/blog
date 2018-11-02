---
sidebarDepth: 0
---

# Unix / Linux

[[toc]]

## 用户默认目录

```sh
# wind-stone 代表用户，server-host 代表服务器
# 进入服务器，会默认进行 home/wind-stone 目录下
wind-stone@server-host

# 以下目录，实际上是 home/wind-stone/files/some-directory/
wind-stone@server-host::files/some-directory/
```

## 命令

### pwd 显示工作目录

Print Working Directory，显示工作目录的路径名称。

### cat 查看文件

```sh
cat filename
```

### cp 复制文件

将源文件复制到目标文件，或将多个源文件复制到目标目录

```sh
cp origin destination
```

### mv 移动文件

### vi

#### 仅查看文件

```sh
<!-- 打开文件，输入 -->
vi filename

<!-- 关闭文件：先按 esc，然后输入 -->
:q!
```

#### 修改文件

```sh
<!-- 打开文件，输入 -->
vi filename

<!-- 输入 i 进行编辑模式，之后进行各种输入，以修改文件内容 -->
i

<!-- 上一步输入完毕后，输入 esc 退出编辑模式 -->
esc


<!-- 按住 shift + 输入两个Z，保存修改 -->
shift 键 + Z*2
```

### rm 删除文件

```sh
rm filename

<!-- 强制删除文件（无法找回） -->
rm -rf filename
```

Reference: [每天一个linux命令目录](https://www.cnblogs.com/peida/archive/2012/12/05/2803591.html)