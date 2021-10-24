# tsconfig.json

[[toc]]

- 【强烈推荐】[Understanding TypeScript’s “Compilation Process” & the anatomy of “tsconfig.json” file to configure TypeScript Compiler](https://medium.com/jspoint/typescript-compilation-the-typescript-compiler-4cb15f7244bc)，文章里有对`tsconfig.json`里每一个选项的详细阐述。

TypeScript 编译器通过项目的配置文件（默认是`tsconfig.json`）来查找用于参与编译的文件以及确定如何输出编译后的文件。

执行`tsc`命令时，可通过`--project`或`-p`标志来指定配置文件的路径以代替默认的路径`tsconfig.json`。

```sh
tsc -p ./tsconfig.prod.json
```

`tsconfig.json`所在的目录称为项目的根目录。

## 根级选项

根级选项主要是关于静态类型分析以及确定哪些文件会包含在编译过程里的配置，这些选项都是与`compilerOptions`选项平级的。

- `files`和`include`选项里的文件都包含在编译过程里，而`exclude`选项里的文件将不会包含在编译过程里。
- 源码里通过`import`语句导入的模块，会自动包含在编译过程里，而不会受到`files`、`include`、`exclude`选项的影响。

### types

```json
// tsconfig.json
{
    "compilerOptions": {
        "types": [ "node", "moment" ]
    }
}
```

- TypeScript 将从`<type-root>`目录里自动引入`types`选项里的声明文件，比如`<type-root>/moment`。
- 针对通过`import`语句手动引入的包，即使该包并没有包含在`types`选项里，TypeScript 也会引入该包的类型声明文件。

## 编译选项

编译选项里的各个配置选项，用于设置 TypeScript 编译器如何处理输入文件，比如：

- 输出文件放置在哪儿
- 如何查找模块
- 是否需要输出类型声明文件、SourceMap 等
- 等等

### outFile

若是输出的模块系统不是`None`、`System`、`AMD`，而是`ES6`、`CommonJS`等，TypeScript 编译器将不会产生一个打包文件。

文件的引入位置问题，导致`CommonJS`和`ES6`模块不能打包成一个文件。若是编译后的`x.js`里存在一行导入语句`require('./src/y')`，这表明代码运行时将会从相对于`x.js`的`dir`目录导入`y.js`文件。但若是这些文件都打包到单个文件里，由于`x.js`和`y.js`现在处于同一个目录下的同一个文件里，将无法完成从`dir`目录导入`y.js`文件。像 Webpack 这样的打包器会在最终的打包文件里添加额外的模块加载代码来完成这个功能，但是 TypeScript 没有这么做。

wind-stone 注释: 从技术上来说，TypeScript 也能实现与 Webpack 类似的打包功能，但是 TypeScript 的定位不是打包器，因此并没有实现这些功能。

### paths

`paths`作模块映射时，需要注意最终编译后文件里引入的模块名称是映射前的名称。

项目目录结构:

```txt
project
├── a.ts
└── src/
   └── b.ts
```

```json
// tsconfig.json
{
    "compilerOptions": {
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "box": [ "src/b" ]
        }
    }
}
```

```ts
// a.ts
import { b } from 'box';
console.log( b );
```

```ts
// src/b.ts
export const b = 'B';
```

```js
// dist/a.js`
var box_1 = require("box");
console.log(box_1.b);
```

打包后的`dist/a.js`文件里，`require`的仍然是`box`，而不是`src/b`。解决方案可参见[Understanding TypeScript’s “Compilation Process” & the anatomy of “tsconfig.json” file to configure TypeScript Compiler](https://medium.com/jspoint/typescript-compilation-the-typescript-compiler-4cb15f7244bc)的`paths`章节。

### allowJs

`allowJs`编译选项告知 TypeScript 编译器将`.js`文件包含在编译过程里，这将应用到`files`和`include`选项以及`import`语句里的`.js`文件。

```ts
import xyz from './xyz';
```

当在`import`语句里引入`xyz`模块时，TypeScript 编译器会查找`./xyz.ts`、`./xyz.d.ts`以及`./xyz.js`文件。

### checkJs

设置`allowJs`为`true`，`.js`文件可以包含在编译过程里，但是 TypeScript 编译器并不会在编译过程里对`.js`文件里的代码做类型检查。

设置`checkJs`为`true`，TypeScript 编译器将对`.js`文件做类型检查。

### baseUrl

```ts
import world from 'src/world'
```

当设置`baseUrl`时，若`import`语音引入了一个非相对路径的模块比如`src/world`，TypeScript 编译器会首先在`baseUrl`目录里寻找`src/world`模块，如果找不到，才会去`typeRoots`设置的目录里（比如`node_modules`）查找。

### extends

从其他`tsconfig.json`文件继承配置。
