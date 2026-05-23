# 声明文件

[[toc]]

## 参考文档

- 【强烈推荐】[A quick introduction to “Type Declaration” files and adding type support to your JavaScript packages](https://medium.com/jspoint/typescript-type-declaration-files-4b29077c43)

## 零散知识点

- 常规的 TypeScript 文件`.ts`既能包含值，也能包含类型
- 声明文件`.d.ts`里仅包含类型声明，而不能包含任何值。这些声明文件只是在开发过程中提供帮助，而不会成为编译产出的一部分。
- 你可以使用`import`语句从类型声明文件里引入类型，TypeScript 会在编译时将所有`import`类型声明文件的语句都移除掉，因为`import`声明文件不会包含被用于运行时的值
- 若是模块没有提供类型声明文件，则每个引入的值都会有个默认类型`any`

## 全局声明文件

- 全局声明文件不需要显示引入，就可以用于项目里的任何地方。
- 在全局声明文件中，是不允许出现`import`/`export`关键字的。一旦出现了，那么他就会被视为一个 NPM 包或 UMD 库，就不再是全局声明文件了。

### 引入全局声明文件

#### 标准库

标准库是一些内置的全局声明文件的集合。TypeScript 编译器通过编译选项的`lib`或`target`（若`lib`未提供，则使用`target`）来确定使用哪些标准库，并将标准库的全局声明文件隐式导入，并对每一个 TypeScript 项目生效。

#### 手动引入

若是想手动引入全局声明文件，我们需要设置编译选项[typeRoots](https://www.typescriptlang.org/tsconfig#typeRoots)或[types](https://www.typescriptlang.org/tsconfig#types)，以告知 TypeScript 编译器如何获取这些手动引入的全局声明文件。

若不设置编译选项`typeRoots`或`types`，所有`node_modules/@types/`目录里的声明文件都会被引入，包括：

- `./node_modules/@types/`
- `../node_modules/@types/`
- `../../node_modules/@types/`
- ...

若是指定了`typeRoots`或`types`，只会引入`typeRoots`或`types`指定的声明文件，不会引入`node_modules/@types/`目录里的声明文件。

::: warning 注意
`typeRoots`配置一个路径列表，这些路径下的包都将作为声明包被隐式引入。

`types`配置一个包的列表，这些包都将作为声明包被隐式引入。

尤其需要注意的是，无论是设置`typeRoots`还是`types`，最终被引入的都是声明包（`declaration package`），即引入的是该包`package.json`的`typings`字段指定的`.d.ts`文件或包根目录下的`index.d.ts`文件，而不是该包下的所有`.d.ts`文件。
:::

##### 推荐配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "./types", // 自定义的全局声明文件的目录，里面的每个子文件夹都是一个声明模块
      "node_modules/@types/" // 因为默认的 node_modules/@types/ 被 typeRoots 选项覆盖了，因此若是想使用 node_modules 里的第三方模块的声明文件，需要加上这一行
    ]
  }
}
```

## 第三方声明文件

### @types 模块下的声明文件

DefinitelyTyped 社区将为如下的库或平台编写声明包，这些声明包将在 NPM 的`@types`组织下发布。

- 原代码未使用 TypeScript 编写的库，比如`lodash`
- `node`这种有自己全局 API（`cosnole.log`、`require`等）和标准库模块（`fs`、`path`等）的 JavaScript 运行时

因此在使用时，需要这样安装库的声明包：`npm install -D @types/lodash`

### 模块绑定的声明文件

每个 NPM 包的目录结构一般是这样的：

```txt
person
  └── person.d.ts
  ├── package.json
  └── person.js
```

`person`包里包含了`package.json`文件，其中`main`字段指向了包目录里的`person.js`文件。当在运行期间遇到项目其他模块里存在`import 'person'`语句时，运行时（`runtime`）将执行`person.js`文件将被结果导入到其他模块。

若是 TypeScript 的编译选项`allowJs`设置为`true`，`person.js`文件也会被 TypeScript 用于分析包的 API。

```json
// person/package.json
{
    "name": "person",
    "version": "1.0.0",
    "main": "./person.js",
    "typings": "./person.d.ts"
}
```

`typings`（或`types`）字段指向一个声明文件（`.d.ts`），这个声明文件将代替`main`字段指向的文件，来提供给 TypeScript 编译器去了解该包的 API。

### 为第三方模块编写声明文件

假设第三方模块没有提供类型声明文件，我们可以在项目为该模块编写一个类型声明文件。（当然，最好的方式是编写后发布到 NPM 的`@types`里）

第三方模块的内容为:

```js
// human/index.js
export class Human {
    static className = 'Human';

    constructor(firstName, lastName, height) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.height = height;
    }
    getHeightInCm() {
        return this.height * 100;
    }
}

export function getFullName(human) {
    return `${human.firstName} ${human.lastName}`;
}

export default 'v1.0.0';
```

类型声明文件：

```ts
// 项目根目录下 types/human/index.d.ts
// 这个类型声明文件也可以定义在别的目录下，比如 types/human-type/index.d.ts，目录的名称不一定要是 human，只要在声明模块时，模块名为 human 即可
declare module "human" {
  // export a class
  export class Human {
    static className: string;
    public firstName: string;
    public lastName: string;
    public height: number;
    constructor(firstName: string, lastName: string, height: number);
    getHeightInCm(): number;
  }

  // export default value
  var version: string;
  export default version;

  export function getFullName(Human: Human | Student): string;
}
```

在上述的类型声明文件里，`declare module "<module-name>"`声明了一个环境模块，这意味着告诉 TypeScript 编译器这个模块在运行时是存在的。

最后，将`types`目录添加到`tsconfig.json`的`typeRoots`里。

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "./types", // 自定义的全局声明文件的目录，里面的每个子文件夹都是一个声明模块
      "node_modules/@types/" // 因为默认的 node_modules/@types/ 被 typeRoots 选项覆盖了，因此若是想使用 node_modules 里的第三方模块的声明文件，需要加上这一行
    ]
  }
}
```

## 文章里的其他内容

[A quick introduction to “Type Declaration” files and adding type support to your JavaScript packages](https://medium.com/jspoint/typescript-type-declaration-files-4b29077c43)里还有如下内容：

- 模块化声明（`Modularizing Declarations`），即将声明写在多个文件里最终合并成一个声明文件对外提供。
- 环境声明（`Ambient declarations`），即将只可能出现在运行时的环境里的值如`window`作为环境声明，告知 TypeScript 编译器以免报错。
- 命名空间声明（`Namespaced Declarations`），将声明的类型都放置在命名空间里，防止被其他声明包覆盖或影响其他声明包。命令空间是全局可用的。
- 扩展声明（`Extending Declarations`），即针对全局已经存在的`interface`和`namespace`，我们可以重新声明来扩展它们。
  - 注意，若是在模块里对全局类型声明进行扩展，则扩展会失效，且扩展的声明在模块内会覆盖全局类型声明，在该模块之外，全局类型声明不受影响。
  - 若是想在模块里对全局类型声明进行扩展，要使用`declare global`。
  - `global`关键字指向了一个 TypeScript 里隐式定义的命名空间，包含了所有的全局值包括浏览器里的`window`和 Node.js 里的`process`。
- 本地类型声明（`Local Type Declarations`），即`.ts`和`.d.ts`文件在一块，可以在`.ts`里`import '.d.ts'`。
