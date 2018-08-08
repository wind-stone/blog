# NPM

## npm install 缩写

```sh
<!-- npm install xxx --save -->
npm install xxx -S
<!-- npm install xxx --save-dev -->
npm install xxx -D
```

Reference:
[Shorthands and Other CLI Niceties](https://docs.npmjs.com/misc/config#shorthands-and-other-cli-niceties)

## npm config

### registry

获取/设置 npm 镜像源

```sh
npm config get registry
npm config set registry https://registry.npm.taobao.org
```

## 发布

```sh
npm init
npm adduser --registry=https://registry.npmjs.org/
npm publish --registry=https://registry.npmjs.org/
```

如果本地设置的 registry 是公司的镜像源的话，命令后面添加 `--registry=https://registry.npmjs.org/`

## version

### 升级版本

 ```sh
 npm version [patch/minor/major]
 ```

 运行命令后，`package.json`中`的version`将被修改。

- patch: bug的修复和小的修改
- minor: 增添了新的特性，但不破坏之前的特性
- major: 项目大的调整，修改了之前的特性。

详情可参考：[http://semver.org/](http://semver.org/)

### package.json 里 version 使用说明

- 指定版本：比如 1.2.2，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。
- ~ 波浪号（tilde）+指定版本：比如~1.2.2，表示安装1.2.x的最新版本（不低于1.2.2），但是不安装1.3.x，也就是说安装时不改变大版本号和次要版本号。
- ^ 插入号（caret）+指定版本：比如ˆ1.2.2，表示安装1.x.x的最新版本（不低于1.2.2），但是不安装2.x.x，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
- latest：安装最新版本。
