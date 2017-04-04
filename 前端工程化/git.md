## Git 特点
- 代码仓库的完整镜像
- 直接记录快照，而不是差异比较


## Git 概念名词

### 远程仓库

#### 本地仓库和远程仓库的关系
- 本地仓库相当于远程仓库的完整拷贝
- 本地仓库可以关联一个主远程仓库和多个副远程仓库（副远程仓库最开始也是主远程仓库的完整拷贝）
- 主远程仓库默认命名为 origin

#### 查看所有远程仓库
- git remote 
    - 列出每一个远程仓库的简写
    ```
    $ git remote
    origin
    ```
- git remote -v
    - 显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL
    ```
    $ git remote -v
    origin	https://github.com/schacon/ticgit (fetch)
    origin	https://github.com/schacon/ticgit (push)
    ```

#### 查看特定远程仓库详细信息
- git remote show [remote-name]
```
$ git remote show origin
* remote origin
  URL: https://github.com/my-org/complex-project
  Fetch URL: https://github.com/my-org/complex-project
  Push  URL: https://github.com/my-org/complex-project
  HEAD branch: master          // 正处于哪个分支
  Remote branches:             // 列出跟踪分支的信息
    master                           tracked
    dev-branch                       tracked
    markdown-strip                   tracked
    issue-43                         new (next fetch will store in remotes/origin)
    issue-45                         new (next fetch will store in remotes/origin)
    refs/remotes/origin/issue-11     stale (use 'git remote prune' to remove)
  Local branches configured for 'git pull':         // 执行 git pull 时哪些分支会自动合并。
    dev-branch merges with remote dev-branch
    master     merges with remote master
  Local refs configured for 'git push':             // 列出了当你在特定的分支上执行 git push 会自动地推送到哪一个远程分支
    dev-branch                     pushes to dev-branch                     (up to date)
    markdown-strip                 pushes to markdown-strip                 (up to date)
    master                         pushes to master                         (up to date)
```


#### 添加远程仓库
- git remote add <shortname> <url>
    - url 是远程仓库的地址
    - shortname 是对远程仓库的简写，方便引用
    - 可以添加多个远程仓库

#### 从远程仓库中抓取和拉取
- git fetch [remote-name]
    - remote-name 远程仓库简写名
    - 拉取所有本地还没有的数据到本地仓库，本地仓库拥有远程仓库中所有分支的引用
    - 只拉取数据，不会自动合并和修改
- git pull 
    - 自动拉取远程仓库并合并远程分支到当前分支
    - 注意：如果本地有未提交的文件，则不能合并，这里可以使用 git stash 
    - （这里是指所有设置跟踪的分支？）
- git clone [url]
    - 将远程仓库的完整拷贝到本地仓库，包含所有分支、提交信息、文件（只读）
    - 自动将其添加为远程仓库，默认以 origin 为简写
    - 本地仓库新建 master 分支并设置自动跟踪远程仓库 origin 的 master 分支
    - 远程仓库可能有多个分支，但是 git clone 之后，本地仓库只有一个（新建且跟踪的）master 分支

#### 推送到远程仓库
- git push [remote-name:origin] [brance-name:master]
    - 需要写入权限
    - 如果有人之前推送过，需要将其拉取下来并合并进自己的工作后才能推送

#### 远程仓库的移除与重命名
- git remote rename [old-remote-name] [new-remote-name]
    - 远程仓库重命名
- git remote rm [remote-name]
    - 删除远程仓库

### 分支
### Git 分支 与 svn 分支的对比


对比项 | Git | svn 
---|---|--- 
分支内容 | 提交对象的校验和文件 | 所有文件的拷贝
新分支文件所在位置 | 当前工作目录 | 新分支工作目录
分支切换 | 在当前工作目录切换，目录里的文件(夹)动态改变 | 切换到另一分支工作目录
删除分支 | 删除分支的引用 | ？？？


### git 分支合并
- 


### 查看远程仓库有哪些分支


### 移除文件

- 已提交（committed）/ 已修改状态（modified）/ 已暂存状态（staged）
    - git rm xxx 提交删除到暂存区域
- 已暂存状态（staged），但没有历史快照
    - git rm -f xxx
- 保留工作目录里的文件，从 Git 仓库删除亦即从暂存区域删除
    - git rm --cached xxx
