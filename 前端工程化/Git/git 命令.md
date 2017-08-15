# git 命令

## 分支

### 创建分支
```
git branch dev-branch
```
（在当前 HEAD 指向的提交对象上）创建新的分支 dev-branch


### 检出（切换）分支
```
git checkout dev-branch
```
切换到（已存在的）dev-branch 分支上

这条命令做了两件事。 一是使 HEAD 指回 dev-branch 分支，二是将工作目录恢复成 dev-branch 分支所指向的快照内容。


### 创建分支并检出（切换）
```
git checkout -b dev-branch

等同于
$ git branch dev-branch
$ git checkout dev-branch
```
（在当前 HEAD 指向的提交对象上）创建新的分支 dev-branch，并切换到 dev-branch。


### 合并分支
```
git merge dev-branch
```
将 dev-branch 合并到当前所在分支


### 删除分支
```
git branch -d dev-branch
```
删除 dev-branch 分支


### 查看分支
```
git branch
  iss53
* master
  testing
```
注意 master 分支前的 * 字符：它代表现在检出的那一个分支（也就是说，当前 HEAD 指针所指向的分支）

```
git branch -v
  iss53   93b412c fix javascript issue
* master  7a98805 Merge branch 'iss53'
  testing 782fd34 add scott to the author list in the readmes
```
查看每一个分支及其最后一次提交

```
git branch --merged
```
查看哪些分支已经合并到当前分支

```
git branch --no-merged
```
查看所有包含未合并工作的分支




## 远程仓库

### 查看
```
git remote
```
列出指定的每一个远程服务器的简写

```
git remote -v
```
指定选项 -v，会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL

```
git remote show origin
```
查看远程仓库 origin 的详细信息


### 添加
```
git remote add pb https://github.com/paulboone/ticgit
```
添加新的远程仓库，地址为 https://github.com/paulboone/ticgit，并指定其引用的简写为 pb


### 重命名
```
git remote rename origin github-origin
```
将远程仓库 origin 重命名为 github-origin


### 移除
```
git remote rm origin
```
移除远程仓库 origin


### 抓取远程仓库数据
```
git fetch origin
```
抓取远程仓库 origin 的数据到本地（但不会在本地生成可编辑的副本，也不会合并数据到本地分支）

```
git fetch --all
```
抓取所有的远程仓库的数据到本地


### 合并远程分支
```
git merge origin/dev-branch
```
合并远程仓库 origin 的 dev-branch 分支到当前所在分支


### 创建并检出远程分支的本地分支
```
git checkout -b dev-branch origin/dev-branch
```
创建远程仓库 origin 的 dev-branch 分支的本地副本分支，并检出（切换）到该分支

（注意：此时本地没有 dev-branch 分支，且本地分支创建后，会自动追踪远程分支）


### 推送分支
```
git push origin dev-branch
```
推送本地的 dev-branch 分支，将其作为远程仓库的 dev-branch 分支

```
git push origin local-branch:server-branch
```
推送本地的 local-branch 分支，将其作为远程仓库的 server-branch 分支


### 追踪分支
从一个远程跟踪分支检出一个本地分支会自动创建一个叫做 “跟踪分支”（有时候也叫做 “上游分支”）。 
跟踪分支是与远程分支有直接关系的本地分支。

```
git checkout -b dev-branch origin/dev-branch

// 快捷方式
git checkout --track origin/dev-branch
```
检出远程分支并追踪

```
git checkout -b local-branch origin/server-branch
```
检出远程分支并追踪，如果想将本地分支设置为不同于远程分支的名称

```
git branch -u origin/dev-branch
```
设置已有的本地分支跟踪一个刚刚拉取下来的远程分支，或者想要修改正在跟踪的上游分支，你可以在任意时间使用 -u 或 --set-upstream-to 选项运行 git branch 来显式地设置

```
git branch -vv
  iss53     7e424c3 [origin/iss53: ahead 2] forgot the brackets
  master    1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
  testing   5ea463a trying something new
```
查看设置的所有跟踪分支，需要重点注意的一点是这些数字的值来自于你从每个服务器上最后一次抓取的数据


### 拉取远程分支
```
git pull
```
当 git fetch 命令从服务器上抓取本地没有的数据时，它并不会修改工作目录中的内容。 它只会获取数据然后让你自己合并。 然而，有一个命令叫作 git pull 在大多数情况下它的含义是一个 git fetch 紧接着一个 git merge 命令。 如果有一个像之前章节中演示的设置好的跟踪分支，不管它是显式地设置还是通过 clone 或 checkout 命令为你创建的，git pull 都会查找当前分支所跟踪的服务器与分支，从服务器上抓取数据然后尝试合并入那个远程分支。

由于 git pull 的魔法经常令人困惑所以通常单独显式地使用 fetch 与 merge 命令会更好一些。


### 删除远程分支
```
$ git push origin --delete dev-branch
```
删除远程仓库 origin 上的 dev-branch 分支




## 变基

```
git checkout dev-branch
git rebase master
```
将当前分支 dev-branch 变基到 master 分支

```
git rebase master dev-branch
```
也可以省去 git checkout dev-branch 操作，直接如上进行变基

通俗些理解，变基的意思就是：

假设 dev-branch 和 master 共同的祖先提交对象是 Cc，将 dev-branch 基于 Cc 进行的修改提取出来并应用到 master 的当前提交对象 Cm 上，使其在历史提交记录上看起来，这些修改是基于 Cm 进行的而不是基于 Cc 进行的。

一般我们这样做的目的是为了确保在向远程分支推送时能保持提交历史的整洁——例如向某个其他人维护的项目贡献代码时。 在这种情况下，你首先在自己的分支里进行开发，当开发完成时你需要先将你的代码变基到 origin/master 上，然后再向主项目提交修改。 这样的话，该项目的维护者就不再需要进行整合工作，只需要快进合并便可。


### 风险

变基也并非完美无缺，要用它得遵守一条准则：

不要对在你的仓库外有副本的分支执行变基。




## 储藏

### 储藏文件


```
git stash
git stash save
```
上面两条命令是等价的，储藏工作目录里的以下文件

- 处于已修改状态的已跟踪文件
- 已经暂存的文件


### 查看储藏
```
git stash list
```


### 应用储藏

注意：可以在一个分支上保存一个储藏，切换到另一个分支，然后尝试重新应用这些修改

```
git stash apply
```
应用最近的储藏，储藏还在堆栈上，不会自动移除

```
git stash apply stash@{2}
```
应用指定的储藏

```
git stash apply --index
```
应用储藏后，之前暂存的文件没有重新暂存，如果想要重新暂存，带上 --index

```
git stash pop
```
应用最近的储藏，并将储藏从堆栈上移除

```
git stash drop stash@{2}
```
应用指定的储藏，并将储藏从堆栈上移除

```
git stash --keep-index
```
添加 --keep-index 选项，它告诉 Git 不要储藏任何你通过 git add 命令已暂存的东西

```
git stash -u
```
指定 --include-untracked 或 -u 标记，Git 也会储藏任何创建的未跟踪文件

```
git stash --patch
```
如果指定了 --patch 标记，Git 不会储藏所有修改过的任何东西，但是会交互式地提示哪些改动想要储藏、哪些改动需要保存在工作目录中

```
git stash branch testchanges
```
创建新的分支 testchanges，并应用储藏




## 清理工作目录

```
git clean
```
从工作目录中移除未被追踪的文件

```
git stash --all
```
移除每一样东西并存放在栈中

```
git clean -f -d
```
移除工作目录中所有未追踪的文件以及空的子目录。 -f 意味着 强制 或 “确定移除”

```
git clean -d -n
  Would remove test.o
  Would remove tmp/
```
如果只是想要看看它会做什么，可以使用 -n 选项来运行命令，这意味着 “做一次演习然后告诉你 将要 移除什么”

```
git clean -n -d
  Would remove build.TMP
  Would remove tmp/

git clean -n -d -x
  Would remove build.TMP
  Would remove test.o
  Would remove tmp/
```
默认情况下，git clean 命令只会移除没有忽略的未跟踪文件。 任何与 .gitiignore 或其他忽略文件中的模式匹配的文件都不会被移除。 如果你也想要移除那些文件，例如为了做一次完全干净的构建而移除所有由构建生成的 .o 文件，可以给 clean 命令增加一个 -x 选项。

如果不知道 git clean 命令将会做什么，在将 -n 改为 -f 来真正做之前总是先用 -n 来运行它做双重检查。