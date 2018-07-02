# git push 的三种方式

- git push

常规的方式，先将远程分支和本地分支合并后的推送方式（包括`fast-forward`）

- git push --force

强制推送，会覆盖远程分支的提交

- git push --rebase

基于远程分支，把本地分支新的提交`rebase`到远程分支之后，再提交