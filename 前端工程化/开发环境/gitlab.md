# GitLab

## Git/GitHub/GitLab

- Git：版本控制工具
- GitHub：是一个网站，提供给用户空间创建 Git 仓储，保存用户的一些数据文档或者代码等
- GitLab：是基于 Git 的项目管理软件

## 使用 GitLab 为什么要生成公钥和私钥？

​首先，使用代码管理工具把本地的代码上传到服务器时需要加密处理，加密传输的算法有很多种，Git 可使用 RSA，RSA 要解决的一个核心问题是，如何使用一对密钥，使其中一个可以用来加密，而另外一个可以用来解密。这这对密钥就是 public key（公钥）和 private key（私钥）。

​其中，公钥就是那个用来加密的密钥，这也就是为什么你在本机生成了公钥之后，要上传到 GitHub 的原因。从 GitHub 发回来的，用那公钥加密过的数据，可以用你本地的私钥来还原。如果你的 key 丢失了，不管是公钥还是私钥，丢失一个都不能用了，解决方法也很简单，删除原有的 key，重新再生成一次，然后在 GitHub/GitLab 里再设置一次就行。

## 生成并设置SSH Key

### 步骤1. 检查是否已经存在 SSH Key

```sh
ls -al ~/.ssh
```

打开电脑终端，输入并执行以上命令，会出现两种情况：

- 终端未出现`id_rsa.pub`文件，表示该电脑还没有配置 SSH Key，进入步骤2
- 终端出现文件`id_rsa.pub`文件，则表示该电脑已经存在 SSH Key，进入步骤3

### 步骤2. 生成 SSH Key

```sh
ssh-keygen -t rsa -C "your_email@example.com"
```

输入并执行以上命令，此时终端会显示：

```sh
Generating public/private rsa key pair.

Enter file in which to save the key (/your_home_path/.ssh/id_rsa):
```

连续回车即可，SSH Key 会保存在默认路径下（/User/wind-stone/.ssh），密码也默认为空。

最后，会在默认路径下（/User/wind-stone/.ssh）生成`id_rsa`和`id_rsa.pub`两个文件，其中`id_rsa`是私钥，`id_rsa.pub`是公钥。

### 步骤3. 将 SSH Key 的公钥添加到 GitLab/GitHub 中

```sh
pbcopy < ~/.ssh/id_rsa.pub
```

输入并执行以上命令，则会将公钥复制到粘贴板上，打开 GitLab，

用户头像 --> Settings --> SSH Keys

将公钥添加即可。

需要注意：以上 SHELL 命令都是在 macOS 系统下执行的。
