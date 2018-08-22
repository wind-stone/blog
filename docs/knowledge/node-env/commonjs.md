# Node 对 CommonJS 规范的实现

## commonjs 与 commonjs2

`commonjs`只定义了`exports`，`commonjs2`还定义了`module.exports`，而 Node.js 及许多`CommonJs`的实现都是`commonjs2`

Reference: [What is commonjs2 ? #1114](https://github.com/webpack/webpack/issues/1114)

## Node 的模块实现

Node 作为 CommonJS 规范的实现，并没有完全按照规范实现，而是对模块规范进行了一定的取舍，同时也添加了少许自身需要的特性。

Node 中引入模块，需要经历如下3个步骤：

1. 路径分析
2. 文件定位
3. 编译执行

### 自定义模块的路径分析及文件定位

现在针对自定义模块，简单说明其路径分析和文件定位是如何进行的。

#### 第一步：路径分析

在`/home/wind-stone/project/`目录下，创建`app.js`文件，其内容为`console.log(module.paths)`，在当前目录下执行`node app.js`，Linux 下，得到的输出为一数组，数组内的每一项称为模块路径，该数组的结构为：

```js
[
    '/home/wind-stone/project/node_modulse',  // 当前文件目录下的 node_modules 目录
    '/home/wind-stone/node_modulse',          // 父目录下的 node_modules 目录
    '/home/node_modulse',                     // 父目录的父目录下的 node_modules 目录
    '/node_modulse',                          // 沿路径向上逐级递归，直到根目录下的 node_modules 目录
]
```

以上即为查找自定义模块时的各级模块路径，Node 会先在当面目录的`node_modules`查找模块即定位文件，若是没找到，会沿路径向上逐级递归，直到根目录下的`node_modules`目录定位文件。

#### 第二步：文件定位

上述每查找到一`node_modules`目录时，就要进行文件定位。其过程为：

1. 文件扩展名分析：若`require()`所引用的模块标识符不包含扩展名，则 Node 会按`.js`、`.json`、`.node`的次序补足扩展名，依次尝试。
2. 目录分析和包：若是上一步没找到文件，但是得到同名的目录，此时 Node 会将目录当成一个包来处理
    - 首先，Node 会在当前目录下查找`package.json`文件，通过`JSON.parse()`解析出包描述对象里的`main`属性指定的文件名进行定位，若是文件名缺少扩展名，将会进入扩展名分析的步骤
    - 若是`package.json`文件不存在，或者`main`属性制定的文件名错误，Node 会将`index`当做默认文件名，然后做扩展名分析，即依次查找`index.js`、`index.json`、`index.node`。

若是在文件定位的过程中没有成功定位到任何文件，则自定义模块进入下一模块路径进行查找。

若是模块路径数组都被遍历完毕，依然没有查找到目标文件，则会抛出查找失败的异常。

Reference: [深入浅出 NodeJS]
