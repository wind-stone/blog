# npm-scripts

## 描述

`npm`支持`package.json`文件里的`scripts`属性的以下脚本：

- `prepublish`: 在包（`package`）打包发布之前运行，也在本地不带任何参数执行`npm install`时运行。（见下方）
- `prepare`: 在包打包发布之前运行，也在本地不带任何参数执行`npm install`时运行，以及在安装`git`依赖时运行（见下方）。`prepare`会在`prepublish`之后运行，但是在`prepublishOnly`之前运行。
- `prepublishOnly`: 在包打包发布之前运行，仅在`npm publish`时。（见下方）
- `prepack`: 在原始码（`tarball`）被打包（在`npm pack`、`npm publish`以及安装`git`依赖时）之前运行。
- `postpack`: 在原始码（`tarball`）被生成和移动到最终的目的地之后运行。
- `publish`、`postpublish`: 在包被发布之后运行。
- `preinstall`: 在包安装依赖之前运行。
- `install`、`postinstall`: 在包安装依赖之后运行。
- `preuninstall`、`uninstall`: 在包卸载依赖之前运行。
- `postuninstall`: 在包安装依赖之后运行。
- `preversion`: 升级包的版本之前运行。
- `version`: 升级包的版本之后运行，但是在提交之前。
- `postversion`: 在升级包的版本之后运行，但是在提交之后。
- `pretest`、`test`、`posttest`: 分别在`npm test`之前、之时、之后运行。
- `prestop`、`stop`、`poststop`: 分别在`npm stop`之前、之时、之后运行。
- `prestart`、`start`、`poststart`: 分别在`npm start`之前、之时、之后运行。
- `prerestart`、`restart`、`postrestart`: 分别在`npm restart`之前、之时、之后运行。注意，若是未提供`restart`脚本，`npm restart`将运行`stop`脚本和`start`脚本。
- `preshrinkwrap`、`shrinkwrap`、`postshrinkwrap`: 分别在`npm shrinkwrap`之前、之时、之后运行。

此外，可以通过运行`npm run-script <stage>`来执行任意脚本。匹配名称的`pre`和`post`命令也会运行（比如，`premyscript`、`myscript`、`postmyscript`）。依赖里的脚本可以通过`npm explore <pkg> -- npm run <stage>`来运行。

## prepublish 和 prepare

### 废弃说明

自从`npm@1.1.71`以来，`npm`的 CLI 会同时为`npm publish`和`npm install`运行`prepublish`脚本，因为这是一个便利的方式以在使用包之前做一些准备工作（一些常用的使用示例将在之后的部分介绍）。但在实践中，这会特别令人困惑。在`npm@4.0.0`，一个新的事件`prepare`被引入（来替代`prepublish`），且之前已存在的行为（即`prepublish`脚本）也被保留了。一个仅在`npm publish`时运行（比如，最后一次运行测试以确保其处于良好的状态）的新事件`prepublishOnly`作为过渡性策略被添加，以允许用户避开已存在的`npm`版本的困惑行为。

参见[https://github.com/npm/npm/issues/10074](https://github.com/npm/npm/issues/10074)可了解关于这个改变的更深入原因。

### 使用示例

若是你需要在包被使用之前执行一些不依赖于操作系统或者目标系统体系结构的操作，则可以使用`prepublish`脚本。比如如下一些任务:

- 将 CoffeeScript 源码编译为 JavaScript。
- 创建 JavaScript 源码的压缩版。
- 抓取你的包将使用到的远程资源。

在`prepublish`阶段做这些事情的优势是可以在单一地方一次完成，以减少复杂性和可变性。此外，这意味着:

- 你可以将`coffee-script`作为开发依赖`devDependency`，因此你的用户不需要已经安装`coffee-script`。
- 你不需要在你的包里包含压缩器`minifier`。
- 你不需要依赖你的用户在目标机器上有`curl`或`wget`或其他系统工具。

## 默认值

`npm`会基于包的内容设置一些脚本的默认值。

- `start`: `node server.js`。若是在包的根目录下有`server.js`文件，则`npm`默认会将`start`命令设置为`node server.js`。
- `install`: `node-gyp rebuild`。若是在包的根目录下有`binding.gyp`文件，且你没有定义自己的`install`和`preinstall`脚本，则`npm`默认会将`install`命令设置为`node-gyp rebuild`。

## 用户

若是`npm`以`root`权限调用，则它会将`uid`改为用户账号或者用户配置里指定的`uid`，默认为`nobody`。设置`unsafe-perm`标志以使用`root`权限运行脚本。

## 环境

包的脚本运行的环境里，有大量关于`npm`设置和进程的当前状态的信息可以使用。

### path

若你依赖了定义了可执行脚本的模块，比如测试套件，则这些可执行的脚本会被加入到`PATH`以执行这些脚本。因此，若是你的`package.json`是这样:

```json
{
    "name" : "foo",
    "dependencies": {
        "bar" : "0.1.x"
    },
    "scripts": {
        "start" : "bar ./test"
    }
}
```

则你可以运行`npm start`去执行`bar`脚本，`bar`脚本在执行`npm install`时就输出到了`node_modules/.bin`目录里。

### package.json 变量

`package.json`文件里的各个属性都以`npm_package_`前缀的显示存在在环境里。因此，若是你`package.json`文件里有`{"name": "foo", "version": "1.2.5"}`，则你的包的脚本里的`npm_package_name`环境变量的值则为`foo`，`npm_package_version`环境变量的值则为`1.2.5`。你可以在代码里使用`process.env.npm_package_name`和`process.env.npm_package_version`访问这些变量，`package.json`文件里的其他属性也是这样。

### 配置

配置参数是以`npm_config_`为前缀放入环境里的。比如，你可以通过检查`npm_config_root`环境变量来查看有效的`root`配置。

### 特殊: package.json 里的 config 对象

若是存在`<name>[@<version>]:<key>`形式的配置参数，则在环境里，`package.json`文件里的`config`对象会被覆盖。比如，若是`package.json`是这样:

```json
{
    "name": "foo",
    "config": {
        "port": "8080"
    },
    "scripts": {
        "start": "node server.js"
    }
}
```

`server.js`是这样的:

```js
http.createServer(...).listen(process.env.npm_package_config_port)
```

则用户可以通过以下方式改变这个行为:

```sh
npm config set foo:port 80
```

### 生命周期事件

最后，`npm_lifecycle_event`环境变量会被设置为正在执行的周期阶段。因此，你可以将单个脚本用于进程的不同阶段，这将基于当前阶段进行切换。

对象将以这种方式打平，因此你的`package.json`里要是有`{"scripts": {"install": "foo.js"}}`，则你将在脚本里得到:

```js
process.env.npm_package_scripts_install === "foo.js"
```

## 示例

比如，若是你的`package.json`包含如下内容:

```json
{
    "scripts": {
        "install": "scripts/install.js",
        "postinstall": "scripts/install.js",
        "uninstall": "scripts/uninstall.js"
    }
}
```

则`scripts/install.js`将在生命周期的`install`和`post-install`阶段调用，`scripts/uninstall.js`将在包`uninstall`的时候调用。由于`scripts/install.js`在两个不同的阶段运行，因此可通过`npm_lifecycle_event`环境变量来判断处于哪个阶段。

若是你想执行`make`命令，你可以这样做，这同时可以工作:

```json
{
    "scripts": {
        "preinstall" : "./configure",
        "install" : "make && make install",
        "test" : "make test"
    }
}
```

## 退出

脚本是将整行作为脚本参数传递给`sh`命令来运行的。

若是脚本以非 0 的`code`退出，则将停止进程。

需要注意的是，这些脚本文件不一定必须是`nodejs`甚至是 JavaScript 程序。它们只要是某种可执行的文件即可。

## 钩子脚本

若是你想要为所有的包在指定生命周期事件时运行指定的脚本，则你可以使用钩子脚本。将可执行文件放置在`node_modules/.hooks/{eventname}`，则针对任何安装在那个根目录下的包，当这些包经历了该包生命周期里的该阶段时，这个脚本都会执行。

钩子脚本的运行与`package.json`里的脚本完全一样。但它们是在分离的子进程里运行，都有上述描述的环境。

## 最佳实践

- 不要以非 0 的错误码退出，除非你真的了解它。除了`uninstall`脚本，这将引起`npm`行为的失败，以及存在被回滚的可能。若是这种失败是微小的或只是阻止了一些可选的特性，则更好的方式是仅仅打印一个警告，并成功退出。
- 不要尝试使用脚本去做`npm`能帮你做的事情。读一下[package.json](https://www.npmjs.cn/files/package.json/)，看看所有通过简单、适当地描述你的包就能指定和开启的事情。通常，这样会更加方便和可靠。
- 检查环境以确定将文件放置在何处。比如，若是`npm_config_binroot`环境变量设置为`/home/user/bin`，则不要试图往`/usr/local/bin`里安装可执行文件。用户如此设置可能是有理由的。
- 不要以`sudo`前缀执行你的脚本命令。若是因为一些原因需要`root`权限，且因为没有`root`权限而失败，则用户将根据提示切换权限来执行`npm`命令。
- 不要使用`install`脚本。使用一个`.gyp`文件来编译，其他任何情况都使用`prepublish`。你几乎应该从来不要明确地设置`preinstall`或`install`脚本。若是你设置了，请考虑下是否有其他的选择。唯一合理地使用`install`或`preinstall`脚本，是为了要在目标体系结构里必须要完成某项编译的情况下。
