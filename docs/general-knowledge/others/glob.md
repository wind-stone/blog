---
sidebarDepth: 0
---

# glob 匹配模式

[[toc]]

在计算机编程领域，`glob`模式使用字符通配符制定了文件名的集合。比如，Unix Bash shell 命令`mv *.txt textfiles/`会将当前目录下所有以`.txt`结尾的文件移动到`textfiles`目录下。在这里，`*`就是通配符，代表“任何字符组成的字符串”，而`*.txt`就是`glob`模式。其他常用的通配符有问号`?`，代表单个字符。

`glob`命令，是`global`的缩写，起源于贝尔实验室的 Unix 最早期的版本。后来，这项功能以库函数`glob()`的形式提供，被用于`shell`等程序。

## 语法

最常用的通配符是`*`、`?`、`[...]`。

通配符 | 描述 | 示例 | 匹配 | 不匹配
--- | --- | --- | --- | ---
`*` | 匹配任意数量的字符，包括空字符串 | `Law*`<br>`*Law*` | `Law`，`Laws`，或`Lawyer`<br>`Law`，`GrokLaw`，或`Lawyer` | `GrokLaw`，`La`，`aw`<br>`La`，或`aw`
`?` | 匹配任何单个字符 | `?at` | `Cat`，`cat`，`Bat`或`bat` | `at`
`[abc]` | 匹配中括号里的任意单个字符 | `[CB]at` | `Cat`或`Bat` | `cat`或`bat`
`[a-z]` | 匹配中括号里的字符范围里的单个字符 | `Letter[0-9]` | `Letter0`，`Letter1`，`Letter2`，...，`Letter9` | `Letters`，`Letter`或`Letter10`

上述所有情况里，路径分隔符（Unix 里是`/`，Windows 里是`/`）被不会被匹配。

## Unix

在 Linux 和 POSIX 系统里，`*`、`?`与上述定义一样，但`[...]`有两个额外的含义：

通配符 | 描述 | 示例 | 匹配 | 不匹配
--- | --- | --- | --- | ---
`[!abc]` | 匹配不在中括号里的任意单个字符 | `[!C]at` | `bat`、`Bat`或`cat` | `Cat`
`[!a-z]` | 匹配不在中括号字符范围里的单个字符 | `Letter[!3-5]` | `Letter1`，`Letter2`，`Letter6`，...，`Letter9`，`Letterx`等 | `Letter3`，`Letter4`或`Letterxx`

一些`shell`比如`C shell`和`Bash`支持额外的语法，比如[Brace expansion](https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion)。

`Bash shell`还支持`Extended Globbing`，允许其他模式匹配操作符被用于匹配多个被圆括号（`(`和`)`）包裹的模式，这可以通过设置`extglob`的选项来启用。