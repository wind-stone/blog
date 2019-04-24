---
sidebarDepth: 0
---

# Google Cloud

[[toc]]

## Linux 上安装 Node.js

Node 官网已经把 Linux 下载版本更改为已编译好的版本了，我们可以直接下载解压后使用：

```shell
# wget https://nodejs.org/dist/v10.9.0/node-v11.11.0-linux-x64.tar.xz    // 下载
# tar xf  node-v11.11.0-linux-x64.tar.xz       // 解压
# cd node-v11.11.0-linux-x64/                  // 进入解压目录
# ./bin/node -v                               // 执行node命令 查看版本
v10.9.0
```

解压文件的`bin`目录底下包含了`node`、`npm`等命令，我们可以使用`ln`命令来设置软连接：

### 配置环境变量

修改`/etc/profile`文件，添加下面的配置：

```shell
export NODE_HOME=/home/cxl_windstone/node-v11.11.0-linux-x64/bin
export PATH=$NODE_HOME:$PATH
```

::: tip 提示
`PATH`环境变量，会罗列出供系统搜索的目录，当在`shell`上执行用户输入的命令时，系统会搜索这些目录，以寻找这些命令程序。
:::

### 添加软链

::: warning 警告
注意，若是配置了`PATH`环境变量，就不需要这一步了。
:::

```shell
ln -s /home/cxl_windstone/node-v11.11.0-linux-x64/bin/npm /bin/
ln -s /home/cxl_windstone/node-v11.11.0-linux-x64/bin/npm /bin/

# 若是没权限，则需使用系统管理员身份执行命令
sudo ln -s /home/cxl_windstone/node-v11.11.0-linux-x64/bin/npm /bin/
sudo ln -s /home/cxl_windstone/node-v11.11.0-linux-x64/bin/npm /bin/
```

- `/home/cxl_windstone/node-v11.11.0-linux-x64/bin/npm`: 下载并解压的路径
- `/bin/`: 系统的`bin`文件夹路径

注意：以上两种路径要根据实际做调整

## 本地控制台连接到 VM 实例

前提条件：本地安装了`gcloud`命令行工具。

### 创建新的 SSH 密钥

在本地控制台输入以下命令，来[创建新的 SSH 密钥](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys#createsshkeys)

```shell
# 格式
ssh-keygen -t rsa -f ~/.ssh/[KEY_FILENAME] -C [USERNAME]

# 实际输入为
ssh-keygen -t rsa -f ~/.ssh/google_compute_engine -C cxl_windstone
```

经过这一步，在`~/.ssh`目录下就生成了两个文件: `google_compute_engine`和`google_compute_engine.pub`，其中为`google_compute_engine`为私钥，`google_compute_engine.pub`为公钥。

::: warning 警告
生成秘钥时，不要输入密码，否则后面的操作经常要输入密码。
:::

### 添加项目范围的 SSH 公钥

在 计算引擎 --> 元数据 --> SSH 公钥，[添加项目范围的 SSH 公钥](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys#project-wide)

### 使用第三方工具进行连接

在本地控制台执行如下命令，来[使用第三方工具进行连接](https://cloud.google.com/compute/docs/instances/connecting-advanced#thirdpartytools)

```shell
# 格式
ssh -i [PATH_TO_PRIVATE_KEY] [USERNAME]@[EXTERNAL_IP_ADDRESS]

# 实际输入为
ssh -i ~/.ssh/google_compute_engine cxl_windstone@35.220.249.163
```

至此，即可通过本地控制台连接到 VM 实例。

## 将文件传输到 Linux 实例

### 预先设置 project

VM 实例所在的[project](https://cloud.google.com/sdk/gcloud/reference/?hl=zh-cn#--project)，即项目 ID。若省略，将使用当前`project`。

```shell
# 列出当前 project
gcloud config list --format='text(core.project)'

# 设置 project
gcloud config set project PROJECTID
```

PS: 可直接在

### 预先设置 zone

VM 实例所在的区域。执行`scp`命令时，若未指定`--zone`选项，并未预先设置`compute/zone`属性，将会被提示选择一个区域。

你可以如下预先设置`compute/zone`属性，以避免`--zone`选项省略时被提示。

```shell
# 格式
gcloud config set compute/zone ZONE

# 实际输入为
# gcloud config set compute/zone asia-east2-a
```

### 文件传输

```shell
# 格式，
gcloud compute scp --recurse [INSTANCE_NAME]:[REMOTE_DIR] [LOCAL_DIR]
gcloud compute scp --recurse [LOCAL_DIR] [INSTANCE_NAME]:[REMOTE_DIR]

# 实际输入为:
gcloud compute scp --recurse ../koa-nuxt cxl_windstone@nodejs-server-instance:~/node-projects
```

::: warning 警告
`gcloud compute scp`命令还有以下属性需要注意：

- `project`和`zone`可以不预先设置，而在`scp`命令里以参数形式指定: `--project=PROJECTID --zone=ZONE`
- `--port`: 连接 VM 实例的哪个端口，默认是`22`，不需要设置
- `--ssh-key-file`: SSH 私钥文件的位置，默认是`~/.ssh/google_compute_engine`。若是在`创建新的 SSH 密钥`一节里生成的秘钥文件不是这个，则要添加该选项
:::

## 服务器上安装 git

```shell
sudo apt-get install git-core
```

## 启动应用

### 应用启动 host

应用启动的时候，`host`不能设为`127.0.0.1`，否则外部无法通过 IP 地址访问，而内部也只能通过`127.0.0.1`访问，不能通过`localhost`访问。

必须设置为`0.0.0.0`，或者不做设置。

涉及到知识点：

- `0.0.0.0`: 通过本机的任一 IP 地址，都可访问
- `127.0.0.1`: 只能在本地的各个应用之间能访问到
- `localhost`: 这是一域名，通过系统的`hosts`文件配置为指向`127.0.0.1`，也可以设置为指向其他地址

详见[127.0.0.1、localhost、0.0.0.0、本机IP地址](https://gist.github.com/zxhfighter/b9f4b4ef328cd8b433b0e9dc2f4af26d)

### 应用启动端口

若是没有系统权限，无法在`1024`以下的端口启动，可在`8888`等端口启动，但是需要配置防火墙的过滤。路径是`VPC 网络 --> 防火墙规则`，并创建一个新的规则，允许`tcp:8888`的流量进入。
