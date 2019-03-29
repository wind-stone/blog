---
sidebarDepth: 0
---

# 命令

[[toc]]

PS: 以下会列出一些常用的命令及常用的用法，每个命令更加详细的用法可以参考后面的链接。

## 查看端口是否被占用

```sh
# 查看 3000 端口是否被占用
lsof -i :3000
```

## pwd 显示工作目录

Print Working Directory，显示工作目录的路径名称。

## mkdir：创建目录

```sh
mkdir directory-name
```

详细请参考：[每天一个linux命令（4）：mkdir命令](http://www.cnblogs.com/peida/archive/2012/10/25/2738271.html)

## rm：删除文件、目录

```sh
rm -rf director-or-file-name
```

命令参数：

- `-f`/`--force`：忽略不存在的文件，从不给出提示。
- `-i`/`--interactive`：进行交互式删除
- `-r`/`-R`/`--recursive`：指示rm将参数中列出的全部目录和子目录均递归地删除。
- `-v`/`--verbose`：详细显示进行的步骤
- `--help`：显示此帮助信息并退出
- `--version`：输出版本信息并退出

注意：

- 若没有`-r`选项，则`rm`命令不会删除目录
- 若仅使用`rm`来删除文件，通常仍可以将该文件恢复原状

详细请参考：[每天一个linux命令（5）：rm 命令](http://www.cnblogs.com/peida/archive/2012/10/26/2740521.html)

## cat：查看文件

```sh
cat filename
```

## cp：复制文件

将源文件复制到目标文件，或将多个源文件复制到目标目录

```sh
cp origin destination
```

## mv 移动文件

## vi

## 仅查看文件

```sh
<!-- 打开文件，输入 -->
vi filename

<!-- 关闭文件：先按 esc，然后输入 -->
:q!
```

## 修改文件

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

## rm 删除文件

```sh
rm filename

<!-- 强制删除文件（无法找回） -->
rm -rf filename
```

Reference: [每天一个linux命令目录](https://www.cnblogs.com/peida/archive/2012/12/05/2803591.html)

## grep 搜索

常用参数：

- `-n`: `--line-number`，在显示符合样式的那一行之前，标示出该行的行号。

```sh
# 从 test.txt 文件里查输出含有 linux 的内容行
grep -n 'linux' test.txt
# 或
cat test.txt | grep -n 'linux'

# 从多个文件里查找关键词
grep 'linux' test.txt test2.txt

# 输出以 u 开头的行内容
cat test.txt | grep ^u
# 输出非 u 开头的行内容
cat test.txt | grep ^[^u]

# 输出以 hat 结尾的行内容
cat test.txt | grep hat$

# 输出包含 ed 或者 at 字符的内容行
cat test.txt | grep -E "ed|at"

# 显示当前目录下面以 .txt 结尾的文件中的所有包含每个字符串至少有7个连续小写字符的字符串的行
grep '[a-z]\{7\}' *.txt
```

更好用法和正则表达式等内容，请参考[每天一个linux命令（39）：grep 命令](http://www.cnblogs.com/peida/archive/2012/12/17/2821195.html)
