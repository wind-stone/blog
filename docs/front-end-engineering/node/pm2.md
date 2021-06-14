# PM2

[[toc]]

Reference: [PM2 英文官网](https://pm2.io/doc/en/runtime/overview/)

## 实践功能

### 运行不同版本的 Node

```sh
port=56000 pm2 start ./server/app.js --name mina-admin --interpreter=/opt/nvm/versions/node/v10.15.3/bin/node
```

添加`interpreter`参数，其值为 Node 版本所在位置

### 杀掉 PM2 守护进程

```sh
# 查找到
ps aux | grep PM2

# 输出：
# web_ser+  7591  0.0  0.0 893708 33096 ?        Ssl  Mar23   0:06 PM2 v2.8.0: God Daemon (/home/web_server/.pm3)
# web_ser+ 25226  0.0  0.0 112664   972 pts/2    S+   22:02   0:00 grep --color=auto PM2
# web_ser+ 43392  0.0  0.0 1211696 46544 ?       Ssl  20:40   0:03 PM2 v2.8.0: God Daemon (/home/web_server/.pm2)

# 找到守护进程，kill 掉
kill -9 46544
```

### PM2 崩溃后重新启动所有进程

PM2 崩溃后会导致原先所有项目进程都消失了，执行`pm2 ls`也看不到任务进程。

PM2 提供了启动脚本，可以将进程列表保存，在 PM2 预期/非预期重启之后，能够恢复之前保存的进程列表。详见: [PM2 官网 - Startup Script Generator](https://pm2.keymetrics.io/docs/usage/startup/)

```sh
# 获取自动配置的启动脚本
pm2 startup

# 储存当前进程列表，存储在 ~/.pm2/dump.pm2 文件里
pm2 save

# 恢复之前（通过 pm2 save）保存的进程
pm2 resurrect
```

若是想在每次添加/删除进程后自动执行`pm2 save`，可以打开自动保存功能，详见[十个PM2中冷门但实用的功能](https://segmentfault.com/a/1190000022585703)

```sh
pm2 set pm2:autodump true
```

## 常用命令

### 安装 PM2

```sh
npm install pm2 -g
```

### 开启/重启进程

```sh
# 开启新的进程，并添加到进程列表里
pm2 start app.js

# 开启进程，监控文件改变后重启
pm2 start app.js --watch [--ignore-watch /*/]
```

```sh
# 重启进程，相当于先停止进程再开启进程，即是如下两条命令的合成：
# 1. pm2 stop app
# 2. pm2 start app
pm2 restart app

# 重启并更新环境
NODE_ENV=production pm2 restart app --update-env
```

```sh
# 启动应用，并设置应用的名称
pm2 start app.js --name="name"
# 重启应用，更新应用名称
$ pm2 restart app --name="new-name"
```

### 停止、删除进程

```sh
# 停止进程（杀掉进程，但是将其保留在进程列表里）
pm2 stop app
```

```sh
# 停止进程，并将其从进程列表里删除
pm2 delete app
```

### 显示进程列表

```sh
# 显示进程列表
pm2 list
# 简写
pm2 ls
```

### 显示进程详细信息

```sh
pm2 show app
```

### 访问实时日志

PS: 日志文件位于`~/.pm2/logs`目录

```sh
# 显示所有应用的日志
pm2 logs

# 显示 app 应用的日志
pm2 logs app
```

### 显示环境

```sh
# 显示进程的环境
pm2 env <pm_id>
```

### 从 boot 启动 PM2

```sh
pm2 startup
```

### Reset Restart Counters

```sh
pm2 reset all
```

### 监控

```sh
pm2 monitor
```

### Dump all process data

```sh
$ pm2 prettylist
# or
$ pm2 show <pm_id|app_name>
```

## 进程管理

PM2 是运行在后台的守护进程，负责管理你所有运行的进程。我们将学习到如何用 PM2 管理进程，且会发现一个核心的概念：进程列表。

### 进程列表

所有运行的应用都会注册在进程列表。可以用如下命令管理进程列表：

```sh
# start and add a process to your list
pm2 start app.js

# show your list
pm2 ls

# stop and delete a process from the list
pm2 delete app
```

当你使用`pm2 start app.js`命令时，以下操作将被执行：

- `app`应用被注册到 PM2 的进程列表里
- `app`应用在后台启动

进程列表里的默认名称是不带扩展名的脚本名称，比如通过`pm2 start app.js`注册的进程，进程名称为`app`。使用`--name`或`-n`选项来修改默认名称。

一旦注册在进程列表里之后，以后的所有操作都将使用进程名称来完成。

```sh
# kill the process but keep it in the process list
pm2 stop app

# start the process again
pm2 start app

# both stop and start
pm2 restart app

# 一次可以指定多个应用
pm2 restart app1 app2 app3

# 以正则方式一次指定多个应用
pm2 restart /app/
```

### 保存/恢复进程列表

你可以保存或恢复你的进程列表，进程列表数据保存在`$HOME/.pm2/dump.pm2`文件里

```sh
# save your list in hard disk memory
pm2 save

# resurrect your list previously saved
pm2 resurrect
```

你可以设置一个`startup`钩子，当机器重启时，自动启动你的进程列表。

### 管理任何类型的应用

PM2 适用于其他编程语言，对应如下：

```json
{
  ".sh": "bash",
  ".py": "python",
  ".rb": "ruby",
  ".coffee": "coffee",
  ".php": "php",
  ".pl": "perl",
  ".js": "node"
}
```

若是没有扩展名，应用将当做二进制文件启动。

启动`python`脚本：

```sh
pm2 start echo.py
```

若是你想要指定解释器的路径，可在生态系统文件里指定：

```js
module.exports = {
  apps: [{
    name: "script",
    script: "./script.py",
    interpreter: "/usr/bin/python",
  }]
}
```

### 本地监控

本地监控工具可以让你观察到 CPU 使用率，内存使用率，循环延迟`loop delay`，每个进程的请求信息

```sh
pm2 monit
```

可使用 PM2 Plus 在 WEB Dashboard 监控你的应用。

## 生态系统文件

当部署到多台服务器上或当需要使用多个 CLI 参数时，就需要一个更方便的方式来替换命令行来启动你的应用了。

生态系统文件的目的就是将应用所需的所有的选项和环境参数聚集在一起。

::: tip 重要提示
生态系统文件里的`apps`是个数组，数组里的每个对象，代表一个应用，因此，配置了生态系统文件，相当于配置了多个应用。
:::

### 生成默认生态系统文件

```sh
pm2 init
```

执行上面的命令，会生成一个默认的生态系统文件`ecosystem.config.js`，更多详细的配置可参考[Ecosystem File](https://pm2.io/doc/en/runtime/reference/ecosystem-file/)

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

### 启动所有应用

```sh
pm2 start
```

执行这个命令，你可以将`ecosystem.config.js`配置文件里`apps`里配置的所有应用启动并添加的进程列表里。

### 仅启动单个应用

```sh
pm2 start --only app
```

### 更新生态系统文件

（这条为实验得出的结论）

若是更改了生态系统文件，需要如下命令使得新的生态系统文件生效。

```sh
pm2 restart/reload ecosystem.config.js
```

但是这种方式只是在更改了`watch`、`log_date_format`之后可以生效（只实验了这两个选项）。

但是当修改`instances`后，无法通过这种方式生效，此时，只能通过`pm2 delete app`之后，再`pm2 start ecosystem.config.js`才能生效。

### 自定义生态系统文件

```sh
pm2 start /path/to/my.ecosystem.config.js
```

你还可以创建自定义配置文件，位于其他目录，使用其他文件名称，最后如上调用即可。

### 环境变量

配置文件里可以声明多个环境，每个环境里可以声明多个环境变量。环境名称必须是`env_<enviroment-name>`格式。

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "production",
    },
    env_development: {
      NODE_ENV: "development",
    }
  }]
}
```

例如，如上配置里，`app`进程可以以两种环境来启动，`development`环境和`production`环境。

若是想要以特定的环境来启动`app`应用，需要添加`--env`选项。

```sh
# 不添加 --env 选项，默认使用 env 环境
pm2 start ecosystem.config.js
# 使用 developent 环境
pm2 start ecosystem.config.js --env developent
```

需要注意的是，一旦将进程添加到进程列表，进程的环境就不可改变了，即使重启应用。这种行为用以确保应用重启前后的一致性。

要是想强制更新环境，就必须使用`--update-env`选项：

```sh
# 更新环境
pm2 restart ecosystem.config.js --update-env

# 切换环境
pm2 restart ecosystem.config.js --env production --update-env
```

### 指定应用的端口

PM2 的文档里没提到如何指定应用的端口，这里提供两种方式，都是在生态系统文件里配置的。

```js
module.exports = {
  apps: [
    // apps 数组里的每一项，代表一个应用
    {
      name: 'koa-nuxt',
      script: 'server/index.js',

      // 方式一: 这种方式在生态系统文件里没有这个选项，可能是以前的版本遗留的功能
      port: 8888,

      env: {
        // 方式二：利用环境变量来配置，之后在应用里通过 process.env.PORT 获取
        PORT: 8888
      }
    }
  ]
}
```

## 集群模式 & 热重载

PM2 内置的负载均衡器为网络类型的 Node.js 应用提供了基于所有可用的 CPU 之上的可伸缩功能，而无需任何代码上的修改。

若是要使用`cluster`模式开启进程，仅需传入`-i <number-instances>`选项，`<number-instances>`是需要使用的实例数。

`<number-instances>`可以是：

- 数字，为应用指定确定数量的实例
- 字符串`max`，为应用指定尽可能多的实例（根据可用 CPU 数量）

```sh
# 实例数为 4
pm2 start app.js -i 4

# 自动检测可用的 CPU 的数量，并使用尽可能多的进程
pm2 start app.js -i max
```

::: tip 提示
当`<number-instances>`传入数字时，还可以传入负数，若机器是 4 核，`pm2 start -i -1`将使用 3 个实例
:::

### 无状态应用

若以`cluster`模式使用负载均衡器，需要确保应用没有内部状态。通常，内部状态是一些存储在进程里的本地数据，比如`WebSocket`连接的数组，或本地会话内容等。可使用 Redis 或其他一些数据库来替代这些内部状态数据来共享进程间的状态。

### 无间断式重载

若是使用`restart`命令，PM2 会先删掉进程再重启进程，这会在非常短暂的时间内导致服务不可用。

而若是使用`reload`命令，PM2 会一个接一个地重启所有进程，总是保持至少一个进程是在运行的。

```sh
# 重载 app 应用
pm2 reload app

# 重载配置文件里的所有应用
pm2 reload ecosystem.config.js

# 重载配置文件里的单个应用
pm2 reload ecosystem.config.js --only app
```

若是 PM2 的重载系统没能够重载你的应用，超时后将降级为`restart`。

## watch & 重启（restart）

当前目录或子目录下的文件改变时，PM2 可以自动重启（`restart`）应用。

```sh
pm2 start app.js --watch
```

若是启用`--watch`选项，停止应用并不会停止`watch`

- `pm2 stop 0`将无法停止`watch`
- `pm2 stop 0 --watch`可以停止`watch`

PS: 上面指令的`0`是应用 ID，因为启动应用时只有没设置`-i`选项，因此该应用只有一个实例，`0`即代表该实例。

执行`restart`命令并带有`--watch`选项，将切换检测，即原先`watch`开启将变为不开启，原先`watch`不开启将变为开启。

若是想`watch`特定的路径，则需使用配置文件。`watch`字段的取值可以是路径字符串，或者是路径字符串的数组，默认为`true`。

```js
module.exports = {
  apps: [{
    script: "app.js",
    watch: ["server", "client"],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules", "client/img"],
    watch_options: {
      "followSymlinks": false
    }
  }]
}
```

`watch_options`是一对象，将替换传给`chokidar`的`options`。详情请查看[`chokidar`文档](https://github.com/paulmillr/chokidar#api)

PM2 传给`chokidar`的默认`options`是:

```js
var watch_options = {
  persistent    : true,
  ignoreInitial : true
}
```

## 重启策略

### 指数级的重启时延

PS: 仅在 PM2 >= 3.2 可用

PM2 运行时实现了新的重启模式，可以使你的应用以一种更好的方式重启。当出现异常时（比如数据库关闭了），`exponential backoff restart`会慢慢增加重启的时间间隔，以减少数据或外部服务的压力，而不是像原先那样疯狂地重启你的应用。通过以下方式使用`exponential backoff restart`：

```sh
# CLI 方式
pm2 start app.js --exp-backoff-restart-delay=100
```

```js
// 生态系统文件
module.exports = [{
  script: 'app.js',
  exp_backoff_restart_delay: 100
}]
```

若配置了`--exp-backoff-restart-delay`选项，当应用出现崩溃时，你将可以见到新的应用在等待重启。

通过执行`pm2 logs`你可以见到重启时延是慢慢增加的：

```sh
PM2      | App [throw:0] will restart in 100ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 150ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 225ms
```

如你所见，每次重启之间的时延都按指数级的增加，直到达到 15000ms 的最大时延。

当应用再度回到稳定状态时（正常运行且超过 30s 没有重启过），重启时延将自动重置为 0ms。

### 固定重启时延

PS: PM2 >= 0.9 时，可用

你还可以使用`restart_delay`选项来设置固定的重启时延：

```sh
pm2 start app.js --restart-delay=3000
```

```js
// 生态系统文件
module.exports = [{
  script: 'app.js',
  restart_delay: 3000
}]
```

### 禁用自动重启

有时候，我们想仅执行脚本一次，且不想进程管理重启我们的脚本。

Simply running these scripts from bash would terminate the script in case the ssh-session is terminated and the script should not get restarted when it completes execution.

PM2 is perfect for such cases, providing robust monitoring and logging

```sh
pm2 start app.js --no-autorestart
```

## 日志管理

日志是实时可用的，并且存储到了硬盘里。你可以定制日志的格式以及日志文件创建的方式。

### 访问日志

#### 实时日志

```sh
# 所有应用的日志
pm2 logs

# 仅 app 应用的日志
pm2 logs app
```

#### 日志文件

所有的日志默认存入`$HOME/.pm2/logs`。你可以使用`pm2 flush`清空所有应用日志。

### 日志文件配置

你可以为日志文件指定自定义的位置。

```js
module.exports = {
  apps: [{
    name: 'app',
    script: 'app.js',
    // output is only standard output (console.log)
    output: './out.log',
    // error is only error output (console.error)
    error: './error.log',
    // log combines output and error, disabled by default
    log: './combined.outerr.log',
  }]
}
```

#### 分离日志

若是你想将日志分离到多个文件而不是一个总的大的文件里，你可以使用`logrotate`。

```sh
pm2 install pm2-logrotate
```

查看[github - pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)学习如何配置。

### 合并日志

`cluster`模式下，每一个实例都有其自己的日志文件。你可以使用合并选项将所有的日志聚集在单个文件里。

```js
module.exports = {
  apps: [{
    name: 'app',
    script: 'app.js',
    output: './out.log',
    error: './error.log',
    log: './combined.outerr.log',
    merge_logs: true,
  }]
}
```

PS: 日志仍然会按类型分离到`output`/`error`/`log`

### 禁用日志

你可以将`output`/`error`设为`/dev/null`来禁止日志。

```js
module.exports = {
  apps: [{
    name: 'app',
    script: 'app.js',
    output: '/dev/null',
    error: '/dev/null',
  }]
}
```

### 日志格式

#### JSON

你可以以 JSON 格式输出日志，以输出`Hello World!`为例，最终输出到文件里的内容为：

```json
{
  "message": "Hello World!\n",
  "timestamp": "2017-02-06T14:51:38.896Z",
  "type": "out",
  "process_id": 0,
  "app_name": "app"
}
```

需要在生态系统文件里添加如下配置：`log_type: 'json'`

#### 时间戳

你还可以在输出日志时仅添加时间戳，以输出`Hello World!`为例，最终输出到文件里的内容为：

`12-02-2018: Hello World!`

需要在生态系统文件里添加如下配置：`log_date_format: 'DD-MM-YYYY'`

时间戳的格式必须遵循[moment.js](https://momentjs.com/docs/#/parsing/string-format/)的格式。

## startup 钩子

`startup`钩子的目的是保存你的进程列表，并在机器重启的时候恢复，即使这种重启不是期望的（比如说崩溃导致的重启）。

每一种操作系统都有指定的工具去处理`startup`钩子：PM2 提供了一种简单的方式来生成并配置它。

### 安装

执行以下命令，来检测你机器上可用的初始化系统，并生成一个配置文件。

```sh
pm2 startup
[PM2] Init System found: launchd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/Users/wind-stone/.nvm/versions/node/v11.10.0/bin /Users/wind-stone/.nvm/versions/node/v11.10.0/lib/node_modules/pm2/bin/pm2 startup launchd -u wind-stone --hp /Users/wind-stone
```

复制并粘贴命令行里的输出，来设置你的`startup`钩子。

::: warning 警告
若是使用 NVM，升级 Node.js 会导致`pm2`的路径改变，你需要重新执行`startup`命令。
:::

::: tip 提示
你可以通过`--service-name <name>`选项，自定义`startup`脚本的服务名称。详见[#3213](https://github.com/Unitech/pm2/pull/3213)
:::

### 保存进程列表

若是你之前保存过进程列表，`startup`钩子会自动加载进程列表。

```sh
# 保存进程列表
pm2 save
```

::: warning 警告
若是你删除了所有的进程，之后重启系统（或使用`pm2 update`），则系统将恢复你所有的进程（之前存储在`dump`文件里），这是为了防止`empty dump file`的 BUG。
:::

若是你想创建空的`dump`文件，你应该执行：

```sh
pm2 cleartdump
```

### 禁用 startup 系统

```sh
pm2 unstartup
```

### 用户授权

若是你想要`startup`钩子在其他用户下执行，使用`-u <username>`选项和`--hp <user_home>`选项：

```sh
pm2 startup ubuntu -u www --hp /home/ubuntu
```

### 更新 startup 钩子

执行以下命令来升级`startup`钩子：

```sh
pm2 unstartup
pm2 startup
```

### 兼容性

支持的初始化系统有：

`systemd`: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
`upstart`: Ubuntu <= 14
`launchd`: Darwin, MacOSx
`openrc`: Gentoo Linux, Arch Linux
`rcd`: FreeBSD
`systemv`: Centos 6, Amazon Linux

你可以指定你使用的平台：

```sh
pm2 [startup | unstartup] [platform]
```

平台可以是下面这些中的一种：

- `ubuntu`
- `ubuntu14`
- `ubuntu12`
- `centos`
- `centos6`
- `arch`
- `oracle`
- `amazon`
- `macos`
- `darwin`
- `freebsd`
- `systemd`
- `systemv`
- `upstart`
- `launchd`
- `rcd`
- `openrc`

### Under the hoodlink

- `ubuntu` use `updaterc.d` and the script `lib/scripts/pm2-init.sh`
- `centos`/`redhat` use `chkconfig` and the script `lib/scripts/pm2-init-centos.sh`
- `gentoo` use `rc-update` and the script `lib/scripts/pm2`
- `systemd` use `systemctl` and the script `lib/scripts/pm2.service`
- `darwin` use `launchd` to load a specific `plist` to resurrect processes after reboot.

## 入口点

## 内存阈值，自动重载

PM2 允许在内存到达指定的阈值后，重载`reload`应用（若不是`cluster`模式，则自动降级为重启`restart`）。

需要注意的是，PM2 内部负责检查内存的`worker`每 30s 重启一次，因此可能在应用达到内存阈值之后，还需要等一会儿才会自动重载应用。

```sh
# 通过 CLI 设置最大内存阈值
pm2 start api.js --max-memory-restart 300M
```

```js
// 生态系统文件
module.exports = {
  apps: [{
    name: 'api',
    script: 'api.js',
    max_memory_restart: '300M'
  }]
}
```

PS: 单位可以是 K(ilobyte), M(egabyte), G(igabyte).

## 升级 PM2

升级 PM2 是相当简单的操作。升级`minor`/`patch`版本（即升级`x.y.z`中的`y`或`z`版本）不需要破坏任何环境。你只需：

1. 安装最新版的 PM2，`npm install pm2@latest -g`
2. 保存当前进程列表，杀掉以前的 PM2 守护进程，恢复进程列表，这几步仅需执行`pm2 update`

## Source Map 支持

若是你使用`BabelJS`/`Typescript`，或其他 Javascript 超集语言，你可能已经发现：当发生异常时，错误堆栈追踪信息毫无用处。若是想要获得有用的信息，需要生成 Source Map 文件。

一旦 Source Map 文件生成之后，PM2 将自动发现并帮助你检查错误。若是你启动的应用（比如`app.js`）有与之对应的 Map 文件（比如`app.js.map`），PM2 将自动检查到 JS Source Map 文件。

### 检查异常

异常会被记录到应用的错误日志文件里，要想检查日志去发现异常，只需执行`pm2 logs app`。或者使用 PM2 Plus，当异常发生时获取邮件通知和异常分析。

### 禁用 Source Map

若是你不想要 PM2 去自动支持 JS Source Map，你可以使用`--disable-source-map`选项。（通过命令行或生态系统文件都可以）

## transpilers 转译器

## 以编程方式使用 PM2

PM2 可以以编程方式使用，这意味着你可以将进程管理直接内嵌在你的代码里，创建进程，即使主脚本退出了，这些进程仍然存活。

### 简单示例

如下示例将展示，如何启动`app.js`，并传入一些配置属性。传入`pm2.start`方法的参数与在生态系统文件里声明的完全一样。

```sh
npm install pm2 --save
```

```js
const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }

  pm2.start({
    script: 'app.js',
  }, (err, apps) => {
    pm2.disconnect()
    if (err) { throw err }
  })
})
```

::: warning 警告
若是你的脚本不自行退出，确保你在代码里手动调用了`pm2.disconnect()`。
:::

### 编程 API

#### pm2.connect

-`pm2.connect(errback)`或`pm2.connect(noDaemonMode, errback)`
    - `noDaemonMode`: 默认为`true`。若是第一个参数传`true`，PM2 将不以守护进程的方式运行，在相关联的脚本退出后，PM2 也会结束。若是 PM2 已经在运行，你的脚本将链接到已存在的守护进程，但是一旦你的脚本进程退出，PM2 也会结束。
    - `errback(error)`: 回调函数，完成创建 PM2 守护进程/连接到已有的 PM2 守护进程后执行

该命令要不连接到一个正在运行的 PM2 守护进程，要不创建一个新的 PM2 守护进程。一旦创建了，PM2 进程将持续运行，即使主脚本退出了。

#### pm2.disconnect()

断开与 PM2 守护进程的连接。

#### pm2.killDaemon(errback)

杀掉 PM2 守护进程（与`pm2 kill`相同）。需要注意：

- 当 PM2 守护进程被杀掉时，它所有的进程都将被杀掉
- 即使在你杀掉守护进程之后，你仍然必须明确地与守护进程断开连接

#### pm2.start

`pm2.start`的调用方式有：

- `pm2.start(options, errback)`
- `pm2.start(jsonConfigFile, errback)`
- `pm2.start(script, errback)`
- `pm2.start(script, options, errback)`
- `pm2.start(script, jsonConfigFile, errback)`

函数的参数说明如下：

- `script`: 要运行脚本的路径
- `options`: 配置选项对象（官网没给出有哪些选项，囧..）
- `jsonConfigFile`: JSON 文件的路径，文件里的配置选项与`options`参数一样
- `errback(err,proc)`: 回调函数，`script`脚本开启之后调用，`proc`参数是[PM2 进程对象](https://github.com/soyuka/pm2-notify#templating)

#### pm2.stop/restart/delete/reload

- `pm2.stop(process, errback)`
- `pm2.restart(process, errback)`
- `pm2.delete(process, errback)`
- `pm2.reload(process, errback)`

函数的参数说明如下：

- `process`: 要操作的进程，其值可以是如下几种
  - `pm2.start`的`options`里的`name`
  - 进程 ID
  - `"all"`，表示所有的进程都应该重启
- `errback(err, proc)`

#### pm2.describe(process,errback)

- `errback(err, processDescription)`
- `processDescription`: 进程信息对象，包含了属性如下:
  - `name`: 初始`start`命令里给定的名称
  - `pid`: 进程的`pid`
  - `pm_id`: PM2 守护进程的`pid`
  - `monit`: 一个对象，包含：
    - `memory`: 进程正在使用的内存数量
    - `cpu`: 此刻进程使用的 CPU 的百分比
  - `pm2_env`: 进程的环境里的路径变量列表，包含：
    - `pm_cwd`: 进程的工作目录
    - `pm_out_log_path`: `stdout`日志文件路径
    - `pm_err_log_path`: `stderr`日志文件路径
    - `exec_interpreter`: 使用的解释器
    - `pm_uptime`: 进程的正常运行时间
    - `unstable_restarts`: 进程至今重启的次数
    - `restart_time`
    - `status`: `"online"`/`"stopping"`/`"stopped"`/`"launching"`/`"errored"`/`"one-launch-status"`
    - `instances`: 运行的实例数
    - `pm_exec_path`: 进程里运行的脚本的路径

#### pm2.list(errback)

- `errback(err, processDescriptionList)`: `processDescriptionList`参数是与`pm2.describe`里的`processDescription`对象的数组

#### pm2.dump(errback)

- `errback(err, result)`

#### pm2.startup(platform, errback)

- `errback(err, result)`

#### pm2.flush(process, errback)

- `errback(err, result)`

#### pm2.reloadLogs(errback)

Rotates the log files. The new log file will have a higher number in it (默认的格式是`${process.name}-${out|err}-${number}.log`).

- `errback(err, result)`

#### pm2.launchBus(errback)

Opens a message bus.

- `errback(err, bus)`: The bus will be an [Axon Sub Emitter](https://github.com/tj/axon#pubemitter--subemitter) object used to listen to and send events.

#### pm2.sendSignalToProcessName(signal, process, errback)

- `errback(err, result)`

```js
// pm2-call.js:
pm2.connect(() => {
  pm2.sendDataToProcessId({
    type: 'process:msg',
    data: {
      some: 'data',
      hello: true
    },
    id: 0,
    topic: 'some topic'
  }, (err, res) => {
  })
})

pm2.launchBus((err, bus) => {
  bus.on('process:msg', (packet) => {
    packet.data.success.should.eql(true)
    packet.process.pm_id.should.eql(proc1.pm2_env.pm_id)
    done()
  })
})
```

```js
// pm2-app.js:
process.on('message', (packet) => {
  process.send({
    type: 'process:msg',
    data: {
     success: true
    }
 })
})
```

## 使用 SSH 部署

在许多部署的工作流里，常规的步骤包括使用 SSH 连接到多个服务器，`git pull`最新的版本，之后重载应用。

PM2 部署工具的目的就是自动完成这些任务。

你仅需设置（数组形式的）远程主机、`pre-deploy`/`post-deploy`命令行操作，就可以了。

### 安装

#### SSH 设置

确保在你的本地机器上有公钥：

```sh
# 生成 SSH 公钥/私钥 对
ssh-keygen -t rsa

# 将公钥复制到（要部署的）服务器上，该命令详细内容请见：https://www.ssh.com/ssh/copy-id
ssh-copy-id node@myserver.com
```

#### 配置生态系统文件

你首先要做的就是在生态系统文件里配置所有必须的信息：

```js
module.exports = {
  apps: [{
    name: "app",
    script: "app.js"
  }],
  deploy: {
    // production 是环境名称
    production: {
      // （本地的）SSH 公钥的路径，默认是 $HOME/.ssh
      key: '~/.ssh/google_compute_engine',
      // SSH user
      user: 'cxl_windstone',

      // 要部署到的服务器列表
      host: ['35.220.249.163'],
      // 要部署到的服务器的路径，注意：请保持该文件夹里无文件，PM2 部署时会填充文件
      path: '/home/cxl_windstone/node-projects/koa-nuxt',
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: 'StrictHostKeyChecking=no',

      // git 仓库信息
      // git 远程仓库名称/分支
      ref: 'origin/master',
      // git 远程仓库地址
      repo: 'git@github.com:wind-stone/koa-nuxt.git',

      // 命令或脚本路径，将在本地机器上执行
      'pre-setup': 'echo  pre-setup 1111111111',
      // 命令或脚本路径，将在本地机器上执行，比较将配置放在 shared 目录等
      'post-setup': 'echo post-setup 22222222222',

      // pre-deploy action
      'pre-deploy-local': 'echo pre-deploy-local 333333333',
      // post-deploy action，将在服务器上执行
      'post-deploy': 'npm install'
    }
  }
}
```

#### Setup

```sh
pm2 deploy production setup
```

执行以上命令，完成首次部署，并将文件填入远程服务器路径文件夹下。

执行此命令后，服务器上的`koa-nuxt`文件夹下会存在三个文件夹：

- `source`: 项目的源代码，从远程仓库拉取的
- `current`: 指向`source`目录，貌似目前没什么用
- `shared`
  - `pids`
  - `logs`

详情请见：

- [PM2 deploy folder structure - how to use / configure](https://stackoverflow.com/questions/49068667/pm2-deploy-folder-structure-how-to-use-configure)
- 

#### Deploy

这里是一些实用的命令：

```sh
# 1. Setup deployment at remote location
pm2 deploy production setup

# 2. 部署
pm2 deploy production

# Update remote version
pm2 deploy production update

# Revert to -1 deployment
pm2 deploy production revert 1

# execute a command on remote servers
pm2 deploy production exec "pm2 reload all"
```

### 部署选项

执行`pm2 deploy help`显示部署帮助。

```sh
pm2 deploy <configuration_file> <environment> <command>

  Commands:
    setup                run remote setup commands
    update               update deploy to the latest release
    revert [n]           revert to [n]th last deployment or 1
    curr[ent]            output current release commit
    prev[ious]           output previous release commit
    exec|run <cmd>       execute the given <cmd>
    list                 list previous deploy commits
    [ref]                deploy to [ref], the "ref" setting, or latest tag
```

### 强制部署

你可能会遇到以下信息：

```js
--> Deploying to dev environment
--> on host 192.168.1.XX

  push your changes before deploying

Deploy failed
```

这意味着你本地有一些修改没有推送到仓库里，并且由于部署脚步会通过`git pull`来获取不在你服务器上的修改内容。

若是你想要部署但不需要推送任何数据，你可以添加`--force`选项：

```sh
pm2 deploy ecosystem.json production --force
```

### 考虑事项

- 你可以通过使用`--force`选项来跳过本地修改的检测
- 确保你的远程服务器有权限克隆远程仓库
- 你可以基于你想要部署的环境，声明特定的环境变量。比如若是为`production`环境声明环境变量，添加`env_production: { hello: 'world' }`来声明变量
- 你可以将`apps`和`deploy`内嵌在`package.json`文件里（而不一定要使用生态系统文件）

### SSH 克隆错误

绝大多数情况下，这些错误是由 PM2 没有正确的`key`（公钥）去克隆远程仓库导致的。你需要确保在以下的每一步里，`key`都是可用的。

1. 若你确定你的`key`是正确的，尝试在目标服务器上执行`git clone your_repo.git`。若是成功，继续下一步；否则，请确保你的`key`存储在服务器上以及你的`git account`上（就是 github/gitlab 里的吧？）
2. `ssh-copy-id`默认会复制名为`id_rsa`的公钥文件。如果这不是正确的公钥文件，执行`ssh-copy-id -i path/to/my/key your_username@server.com`将你的公钥添加到（服务器上的）`~/.ssh/authorized_keys`文件里
3. 若是你获得了如下的错误：

```sh
--> Deploying to production environment
--> on host mysite.com
  ○ hook pre-setup
  ○ running setup
  ○ cloning git@github.com:user/repo.git
Cloning into '/var/www/app/source'...
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and that the repository exists.

**Failed to clone**

Deploy failed
```

你可能需要创建一个 SSH 配置文件。这肯定能确保正确的 SSH 公钥被用于你想要克隆的任何给定仓库。详见[示例](https://gist.github.com/Protosac/c3fb459b1a942f161f23556f61a67d66)

```sh
# ~/.ssh/config
Host alias
    HostName myserver.com
    User username
    IdentityFile ~/.ssh/mykey
# Usage: `ssh alias`
# Alternative: `ssh -i ~/.ssh/mykey username@myserver.com`

Host deployment
    HostName github.com
    User username
    IdentityFile ~/.ssh/github_rsa
# Usage:
# git@deployment:username/anyrepo.git
# This is for cloning any repo that uses that IdentityFile. This is a good way to make sure that your remote cloning commands use the appropriate key
```

## 优雅关闭

你的应用在整个生命周期里可能会多次重启，比如说部署，更严重一些的，比如应用崩溃。

但是在应用重启过程中，用户可能会遇到两种问题：

- 服务关闭期，服务器返回`503 Service Unavailable`的相应（服务器能接收到请求，但是无法处理）
- 请求失败，若请求时是在重启期间进来的（服务器无法接收到请求）

服务关闭期，可以通过 PM2 的`cluster`模式和`reload`操作来避免。

请求失败，可以通过优雅地关闭和重启来避免。

这个指南会介绍如何去实现。

### 优雅地关闭

若想做到优雅关闭，应用必须做到下面 5 步：

1. 监听 PM2 停止`stop`进程时发出的通知（以便于进一步停止应用）
2. PM2 的负载均衡器停止为该应用接收请求
3. 完成所有正在进行中的请求
4. 释放所有资源（数据库，队列）
5. `exit`退出

我们以如下`express`的应用为例（此处的应用就是`express`启动的一个服务器）：

```js
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})

// 1. 监听 PM2 的 SIGINT 信号，该信号是 PM2 停止（stop）进程时发出的
process.on('SIGINT', () => {
  console.info('SIGINT signal received.')

  // 2. 应用（HTTP 服务器）停止接收请求
  // 3. 并完成正在进行中的请求
  // PS: 调用 server.close(fn) 会让服务器停止接收新的连接，并维持已有的链接。这个方法是异步的，服务器最终在所有的连接都结束后会关闭，并且服务器会发布 close 事件，回调函数 fn 在监听到 close 事件时被调用。
  server.close(function(err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    // 4. 关闭数据库连接比如 mongoose，以成功状态码 0 退出进程
    mongoose.connection.close(function () {
      console.log('Mongoose connection disconnected')
      // 5. 退出
      process.exit(0)
    })

  })
})
```

### 超时 kill

PM2 默认会等待`1600ms`，若应用没有自行退出进程，PM2 会发出`SIGKILL`信号。（PS: `SIGKILL`是发送给一个进程来导致它立即终止的信号）

可以在生态系统文件里修改这个默认值，单位是`ms`。

```js
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    kill_timeout: 1600,
  }]
}
```

### 优雅地启动

你的应用经常需要在连接到数据库或其他资源之后，才能接收 HTTP 请求。你的应用必须经过以下 3 步来避免错误：

1. 打开数据库连接
2. 开始监听某端口
3. 通知 PM2，应用已经 Ready

首先，在生态配置文件里启用`ready`信号

```js
module.exports = {
  apps : [{
    name: "api",
    script: "./api.js",
    wait_ready: true,
    listen_timeout: 3000,
  }],
}
```

PS: PM2 默认在`3000ms`以后认为你的应用已经`ready`，可通过`listen_timeout`修改这个默认值。

```js
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
// 1. 打开数据库连接
mongoose.connect('mongodb://mongosA:27501,mongosB:27501', (err) => {
  // 2. 开始监听端口
  server.listen(port, () => {
    console.log('Express server listening on port ' + server.address().port)
    // 3. 通知 PM2，应用已经 Ready
    process.send('ready')
  })
})
```

## 多个 PM2

若是想要在一个用户下运行多个 PM2 实例，你需要覆盖环境变量`PM2_HOME`。设置`PM2_HOME`将改变 PM2 的配置文件夹，比如套接字通讯（`$HOME/.pm2/pub.sock`和`$HOME/.pm2/rpc.sock`），默认日志所在位置的路径等等。

执行 PM2 的命令时，加上`PM2_HOME`环境变量：

```sh
PM2_HOME=/tmp/.pm2 pm2 start echo.js
PM2_HOME=/tmp/.pm3 pm2 start echo.js
```

## 开发工具

PM2 带有两个开发工具，可以在开发阶段帮助到你：监测重启模式、静态文件服务器。

### 监测重启

监测重启模式，将监测当前目录下的文件更改，进而重新启动应用。

生态系统文件里作如下配置，将启动该模式：

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    watch: true,
  }]
}
```

::: warning 注意
注意，监测重启模式将硬重启，不会发送`SIGINT`信号。
:::

#### 监测选项

你可以使用高级选项来指定监测或忽略的路径。

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    watch: ".",
  }]
}
```

- `watch`: 路径字符串或路径字符串的数组，若设置成`true`，将监测当前目录
- `ignore_watch`: 路径字符串或路径字符串的数组，传给 PM2 的依赖`chokidar`作为`glob`匹配或正则表达式
- `watch_options`: 选项对象，传给 PM2 的依赖`chokidar`（PM2 使用的默认选项是，`persistent`和`ignoreInitial`设置为`true`）

当在 NFS 设备上工作时，你只需设置`usePolling: true`，详细描述在[this chokidar issue](https://github.com/paulmillr/chokidar/issues/242)

#### CLI

CLI 里，可通过`pm2 start app.js --watch`启用监测模式。

需要注意，当`--watch`启用后，你必须使用`pm2 stop --watch app`来停止进程，因为简单的停止方式`pm2 stop app`不会停止监测。

### 基于 HTTP 提供静态文件服务

PM2 可以基于 HTTP 提供静态文件服务，就像前端应用一样。

```sh
pm2 serve <path> <port>
```

默认的路径是当前目录，默认的端口是`8080`，因此你可以直接使用`pm2 serve`。

在生态系统文件里，可以配置路径和端口号。

```js
module.exports = {
  apps: [
    // 静态文件服务进程
    {
      name: "static-file",
      script: "serve",
      env: {
        PM2_SERVE_PATH: ".",
        PM2_SERVE_PORT: 8080,
      },
    }
  ]
}
```

::: warning 注意
静态文件服务启动时会另起一个进程，因此在配置时，也要`apps`新增一个配置对象，而不是在已有的其他应用的`env`里配置`PM2_SERVE_PATH`和`PM2_SERVE_PORT`。
:::

```sh
pm2 start ecosystem.config.js
```

::: tip 提示
所有其他 PM2 的选项依旧可用。
:::

## 最佳实践 - 环境变量

环境变量是可以在 Node.js 应用之外设置的特殊变量，这对使得你的应用在外部可配置这一点来说，尤其有用。比如云服务器提供商想要改变你应用的监听端口，或者你想要启用冗长的日志但不想写入代码里。

### CLI 方式

通过 CLI，环境是保守的，这意味着，当你想运行不同进程管理的操作时（比如`restart`/`reload`/`stop`/`start`），新的环境变量不会更新到你的应用里。

可通过 CLI 设置环境变量：

```sh
ENV_VAR=value pm2 start app.js
```

若更新环境变量，你必须在`restart`/`reload`命令后追加`--update-env`选项：

```sh
ENV_VAR=somethingnew pm2 restart app --update-env
```

### 生态系统文件方式

无论何时你修改生态系统文件，环境变量都会被更新。

通过生态系统文件设置默认环境变量，你只需在`env`属性下声明即可。

```js
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

之后，启动：

```sh
pm2 start ecosystem.config.js
```

可以看到，在生态系统文件里，还有`env_production`的配置。若是你想使用`env_production`环境而不是默认环境，你只需传入`--env <env_name>`选项：

```sh
pm2 start ecosystem.config.js --env production
```

::: tip 提示
生态系统文件里的`env_production`是`env_*`形式的正则表达式，使用 CLI `-- env *`调用时你可以设置任何值。
:::

If you are using Ecosystem file to manage your application environment variables under the env: attribute, the updated ones will always be updated on pm2 <restart/reload> app.

```sh
pm2 restart/reload ecosystem.config.js [--env production]
```

### 好的实践：NODE_ENV 变量

按照 Node.js 的惯例，`NODE_ENV`环境变量指定了应用运行时的环境，通常值会是`development`或`production`。

比如，按照`express`的文档，将`NODE_ENV`设为`"production"`将会开启以下 3 项功能来提升性能：

- 缓存视图模板
- 缓存 CSS 扩展创建的 CSS 文件
- 生成更少的冗长错误日志

## 集成 - 云服务器提供商

若是你使用云服务器，你可能发现你无法使用命令行来启动你的 Node.js 应用。

在这种情况下，PM2 必须作为依赖添加到你的项目里，并随着启动脚本执行。

1. 准备好你的应用
    - 创建并配置好你的生态系统文件
    - 安装 PM2 作为你项目的依赖，`npm install pm2`
    - 按若下修改你项目`package.json`文件里的`start`脚本
2. 部署应用：你可以像常规 Node.js 项目一样，将你的应用部署到云服务器上

```js
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production"
  }
}
```

## 【思考】Node.js 应用线上部署

### 不使用 PM2

若是不使用 PM2 来部署应用，则在上线时，需要重启应用（即先关闭应用，再启动应用），这必须会导致重启期间的一小段`downtime`，期间用户无法正常访问应用。

针对这种情况，一般会配合 Nginx 的健康检查来实现应用的`0-seconds downtime`，即应用不会存在`downtime`。若 Nginx 使用主动健康检查，一般会要求应用提供一接口，用于 Nginx 定期访问接口，若发现接口返回失败超过一定次数，则认为该服务器不可用，则在一段时间内将不会分发流量到该服务器上。这段时间过后，Nginx 会再次访问接口，若是可用，则将恢复分发流量到该服务器。

利用 Nginx 的健康检查功能，应用在重新部署时，会先通过脚本将应用的健康检查接口置为不可用状态，在延时一定时间后（在此期间，Nginx 会多次请求接口，并判断出该服务器不可用，不再分发流量到服务器上），才开始关闭应用，紧接着启动应用。应用启动后，当 Nginx 经过一段时间再次请求接口，发现接口可用，将会恢复分发流量了。

因此，配合 Nginx 的健康检查，即使不使用 PM2，也能实现应用的`0-seconds downtime`上线。

::: warning 注意
以上这种方式，仅限应用部署在多台服务器的情况下，当单台服务器不可用时，Nginx 会将流量分发到其他服务器上。
:::

### 使用 PM2 的 reload

若是使用 PM2 的`reload`命令，可直接实现应用的`0-seconds downtime`。其原理类似于 Nginx 的健康检查，只不过 PM2 内部实现了类似于 Nginx 的健康检查和负载均衡的功能。

#### 猜想

（以下内容是使用`reload`时，我关于新旧版本文件变化的猜测，未经过证实）

上线系统都会区分每次打包的版本，在上线之前都会将旧版本的文件保存起来，方便回滚，再用新版本代替旧版本，完成应用的更新。（应该是增量更新吧？）

新版本的文件有两种情况：

- 新旧版本的文件名称相同，新版本的文件会覆盖旧版本的文件
- 新旧版本的文件名称不同，增量更新，仅增加新的文件

新版本的文件覆盖/添加好之后，上线系统会执行命令，让应用重启，以使用新版本。

##### 新旧版本的文件名称相同

若新旧版本的文件名称是相同，存在以下两种情况：

- 文件是被实时读取的。这种情况下，在应用重启之前，新文件就可能已经被使用了。
- 文件在应用启动时被读取到内存。这种情况下，即使新文件覆盖了旧文件，应用在重启之前，还是会使用旧文件（因为是被读取到内存中，不会实时从文件系统读取），在应用重启之后，新文件被读取到内存里。
