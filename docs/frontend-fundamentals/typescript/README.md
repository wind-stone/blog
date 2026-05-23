# 学习笔记

[[toc]]

## TypeScript 系列文章

- 【done】介绍
  - [A beginner’s guide to TypeScript (with some history of the TypeScript)](https://medium.com/jspoint/typescript-a-beginners-guide-6956fe8bcf9e)
  - [Writing your first “Hello World” program in TypeScript with ease](https://medium.com/jspoint/typescript-hello-world-program-b0826ee3d87d)
  - [Understanding the basic “Built-in Data Types” provided by TypeScript](https://medium.com/jspoint/typescript-working-with-types-f1829384851f)
- 【done】复杂的数据类型
  - [A simple guide to “function” data type and function declaration syntax in TypeScript](https://medium.com/jspoint/typescript-functions-5a2490f6a1ec)
  - [A simple guide to “interface” data type in TypeScript](https://medium.com/jspoint/typescript-interfaces-4a2af07c8070)
  - [Introduction to “class” data type and Object-Oriented Programming paradigm in TypeScript](https://medium.com/jspoint/typescript-classes-65b4712ac9c8)
  - [Working with Enumerations (Enums) in TypeScript](https://medium.com/jspoint/typescript-enums-af03567d662)
- 类型系统
  - 【done】[Understanding the TypeScript’s type system and some must-know concepts](https://medium.com/jspoint/typescript-type-system-81fdb84bba75)
  - 【done】[Taking a look at must-know “utility types” provided by TypeScript](https://medium.com/jspoint/typescript-utility-types-4d9bfc37745c)
  - 【done】[Exploring the world of “Generics” (generic data types) in TypeScript](https://medium.com/jspoint/typescript-generics-10e99078cc8)
  - [A brief introduction to “Data Immutability” in TypeScript](https://medium.com/jspoint/typescript-data-immutability-71dc3e604426)
  - [Let’s quickly understand how “Polymorphism” works in TypeScript](https://medium.com/jspoint/typescript-polymorphism-d8ea1d690d5c)
- 新的 ts/js 特性
  - [A quick introduction to “Promises” and “Async/Await” (with new features)](https://medium.com/jspoint/typescript-promises-and-async-await-b842b55ee3fd)
  - [Anatomy of TypeScript “Decorators” and their usage patterns](https://medium.com/jspoint/anatomy-of-typescript-decorators-and-their-usage-patterns-487729b34ae6)
- 【done】模块系统
  - [A comprehensive guide to “Module System” in TypeScript (with examples)](https://medium.com/jspoint/typescript-module-system-5022cac310f6)
  - [Employing “Namespaces” in TypeScript to encapsulate your data](https://medium.com/jspoint/typescript-namespaces-f43cd002c08c)
- 【done】TypeScript 编译
  - [Understanding TypeScript’s “Compilation Process” & the anatomy of “tsconfig.json” file to configure TypeScript Compiler](https://medium.com/jspoint/typescript-compilation-the-typescript-compiler-4cb15f7244bc)
  - [A brief introduction to TypeScript’s command-line interface and compiler settings](https://medium.com/jspoint/typescript-compiler-flags-3b1efebedf15)
  - [A quick introduction to “Type Declaration” files and adding type support to your JavaScript packages](https://medium.com/jspoint/typescript-type-declaration-files-4b29077c43)
  - [Integrating TypeScript with Webpack](https://medium.com/jspoint/integrating-typescript-with-webpack-4534e840a02b)

## 其他文章

- [TypeScript 源码详细解读(1)总览](https://www.cnblogs.com/xuld/p/12180913.html)

## 核心概念

### 类型

类型通过以下方式引入：

- 类型别名声明（`type sn = number | string;`）
- 接口声明（`interface I { x: number[]; }`）
- 类声明（`class C { }`）
- 枚举声明（`enum E { A, B, C }`）
- 指向某个类型的`import`声明

以上每种声明形式都会创建一个新的类型名称。

### 值

值是运行时名字，可以在表达式里引用。 比如`let x = 5;`创建一个名为`x`的值。

同样，以下方式能够创建值：

- `let`，`const`，和`var`声明
- 包含值的`namespace`或`module`声明
- `enum`声明
- `class`声明
- 指向值的`import`声明
- `function`声明

### 命名空间

类型可以存在于命名空间里。 比如，有这样的声明`let x: A.B.C`， 我们就认为`C`类型来自`A.B`命名空间。这里，`A.B`不是必需的类型或值。

### 简单的组合：一个名字，多种意义

一个给定的名字`A`，我们可以找出三种不同的意义：一个类型，一个值或一个命名空间。 要如何去解析这个名字要看它所在的上下文是怎样的。 比如，在声明`let m: A.A = A;`， `A`首先被当做命名空间，然后做为类型名，最后是值。 这些意义最终可能会指向完全不同的声明！

#### 内置组合

`class`同时出现在类型和值里。`class C {}`声明创建了两个东西: 类型`C`指向类的实例结构，值`C`指向类构造函数。枚举声明也拥有类似的行为。

#### 用户组合

假设我们写了模块文件`foo.d.ts`:

```ts
export var SomeVar: { a: SomeType };
export interface SomeType {
  count: number;
}
```

这样使用它：

```ts
import * as foo from './foo';
let x: foo.SomeType = foo.SomeVar.a;
console.log(x.count);
```

这可以很好地工作，但是我们知道`SomeType`和`SomeVar`很相关。因此我们想让他们有相同的名字。我们可以使用组合通过相同的名字`Bar`表示这两种不同的对象（值和对象）：

```ts
export var Bar: { a: Bar };
export interface Bar {
  count: number;
}
```

这提供了解构使用的机会：

```ts
import { Bar } from './foo';
let x: Bar = Bar.a;
console.log(x.count);
```

再次地，这里我们使用`Bar`做为类型和值。 注意我们没有声明`Bar`值为`Bar`类型，它们是独立的。

#### 高级组合

有一些声明能够通过多个声明组合。比如，`class C { }`和`interface C { }`可以同时存在并且都可以做为`C`类型的属性。

只要不产生冲突就是合法的。一个普通的规则是值总是会和同名的其它值产生冲突除非它们在不同命名空间里，类型冲突则发生在使用类型别名声明的情况下（`type s = string`），命名空间永远不会发生冲突。

让我们看看如何使用。

##### 利用 interface 添加

我们可以使用一个`interface`往另一个`interface`声明里添加额外成员：

```ts
interface Foo {
  x: number;
}
// ... elsewhere ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
```

这同样作用于类：

```ts
class Foo {
  x: number;
}
// ... elsewhere ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
```

注意我们不能使用接口往类型别名里添加成员（`type s = string;`）

##### 使用 namespace 添加

`namespace`声明可以用来添加新类型，值和命名空间，只要不出现冲突。

比如，我们可能添加静态成员到一个类：

```ts
class C {
}
// ... elsewhere ...
namespace C {
  export let x: number;
}
let y = C.x; // OK
```

注意在这个例子里，我们添加一个值到`C`的静态部分（它的构造函数）。这里因为我们添加了一个值，且其它值的容器是另一个值（类型包含于命名空间，命名空间包含于另外的命名空间）。

我们还可以给类添加一个命名空间类型：

```ts
class C {
}
// ... elsewhere ...
namespace C {
  export interface D { }
}
let y: C.D; // OK
```

在这个例子里，直到我们写了`namespace`声明才有了命名空间`C`。作为命名空间的`C`不会与类创建的值`C`或类型`C`相互冲突。

最后，我们可以通过`namespace`声明进行不同的合并。这不是特别实际的示例，但是可以展示所有有趣的行为。

```ts
namespace X {
  export interface Y { }
  export class Z { }
}

// ... elsewhere ...
namespace X {
  export var Y: number;
  export namespace Z {
    export class C { }
  }
}
type X = string;
```

在这个例子里，第一个代码块创建了以下名字与含义：

- 一个值`X`（因为`namespace`声明包含一个值，`Z`）
- 一个命名空间`X`（因为`namespace`声明包含一个值，`Z`）
- 在命名空间`X`里的类型`Y`
- 在命名空间`X`里的类型`Z`（类的实例结构）
- 值`X`的一个属性值`Z`（类的构造函数）

第二个代码块创建了以下名字与含义：

- 值`Y`（`number`类型），它是值`X`的一个属性
- 一个命名空间`Z`
- 值`Z`，它是值`X`的一个属性
- 在`X.Z`命名空间下的类型`C`
- 值`X.Z`的一个属性值`C`
- 类型`X`

### 使用 export= 或 import

一个重要的原则是`export`和`import`声明会导出或导入目标的所有含义。

## 其他语法

- `import q = x.y.z`
  - 简化命名空间操作的方法，给常用的`x.y.z`起个短的名字`q`
  - 详见[TypeScript - Namespaces - Aliases](https://www.typescriptlang.org/docs/handbook/namespaces.html#aliases)
