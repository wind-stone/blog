# TypeScript 学习笔记

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

## 类

### protected

将基类的构造函数标记为`protected`，意味着这个基类能被继承且仅可在派生类中被实例化，不能在基类和派生类之外被实例化。

因此若想创建一个不被直接实例化（但能在派生类中被实例化）的基类，可将其构造函数标记为`protected`。注意，这与抽象类不同，抽象类是即使在

```ts
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
```

## 函数

### 声明函数类型

#### 方式一: type

```ts
type LongHand = {
  (a: number): number;
};

type ShortHand = (a: number) => number;
```

以上两种方式是完全相同的，但是当用函数重载时，只能用第一种方式。

```ts
type LongHandAllowsOverloadDeclarations = {
  (a: number): number;
  (a: string): string;
};
```

#### 方式二: interface

```ts
interface justString {
  (foo: string): string;
}

// 接口提供多种调用签名，用于函数重载
interface stringOrNumber {
  (foo: string): string;
  (foo: number): number;
}
```

函数重载的示例:

```ts
interface Overloaded {
  (foo: string): string;
  (foo: number): number;
}

// 实现接口的一个例子：
function stringOrNumber(foo: number): number;
function stringOrNumber(foo: string): string;
function stringOrNumber(foo: any): any {
  if (typeof foo === 'number') {
    return foo * foo;
  } else if (typeof foo === 'string') {
    return `hello ${foo}`;
  }
}

const overloaded: Overloaded = stringOrNumber;

// 使用
const str = overloaded(''); // str 被推断为 'string'
const num = overloaded(123); // num 被推断为 'number'
```

##### 可实例化的函数

```ts
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```

### 函数类型兼容

#### 参数兼容

如何判断两个函数是兼容的？

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

要查看`x`是否能赋值给`y`，首先看它们的参数列表。 `x`的每个参数必须能在`y`里找到对应类型的参数。 注意的是参数的名字相同与否无所谓，只看它们的类型。 这里，`x`的每个参数在`y`中都能找到对应的参数，所以允许赋值。

第二个赋值错误，因为`y`有个必需的第二个参数，但是`x`并没有，所以不允许赋值。

你可能会疑惑为什么允许忽略参数，像例子`y = x`中那样。 原因是忽略额外的参数在 JavaScript 里是很常见的。 例如，`Array#forEach`给回调函数传 3 个参数：数组元素，索引和整个数组。 尽管如此，传入一个只使用第一个参数的回调函数也是很有用的：

```ts
let items = [1, 2, 3];

// Don't force these extra arguments
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach((item) => console.log(item));
```

#### 返回值兼容

下面来看看如何处理返回值类型，创建两个仅是返回值类型不同的函数：

```ts
let x = () => ({name: 'Alice'});
let y = () => ({name: 'Alice', location: 'Seattle'});

x = y; // OK
y = x; // Error, because x() lacks a location property
```

类型系统强制源函数的返回值类型必须是目标函数返回值类型的子类型。

## readonly

```ts
const foo: {
  readonly bar: number;
} = {
  bar: 123
};

function iMutateFoo(foo: { bar: number }) {
  foo.bar = 456;
}

iMutateFoo(foo);
console.log(foo.bar); // 456
```

`readonly`能确保“我”不能修改属性，但是当你把这个属性交给其他并没有这种保证的使用者（允许出于类型兼容性的原因），他们能改变它。当然，如果`iMutateFoo`明确的表示，他们的参数不可修改，那么编译器会发出错误警告：

```js
interface Foo {
  readonly bar: number;
}

let foo: Foo = {
  bar: 123
};

function iTakeFoo(foo: Foo) {
  foo.bar = 456; // Error: bar 属性只读
}

iTakeFoo(foo);
```

## 索引签名

TypeScript 的索引签名必须是`string`、`number`或`symbols`。

```ts
const obj = {
  toString() {
    return 'Hello';
  }
};

const foo: any = {};

// ERROR: 索引签名必须为 string, number....
foo[obj] = 'World';
```

## 发布和使用

发布声明文件到 NPM 主要有两种方式:

- 与 NPM 包捆绑在一起发布
- 发布到 NPM 上的[@types organization](https://www.npmjs.com/~types)

若你能控制要使用你发布的声明文件的那个 NPM 包的话，推荐第一种方式。

无论是上述哪一类发布方式，最终的使用方式都是相同的，使用`import`从 NPM 包上引入即可。

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  // `createElement` 是可推导的，但是 `render` 需要返回值类型
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

## 运算符

- 非空断言运算符`!`
  - 确定变量值一定不为空时使用，比如`m!.id`，这告诉 TypeScript `m`一定不是`null`或`undefined`
  - [Non-null assertion operator - TypeScript 2.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)
- 可选链运算符`?.`
  - 可选链运算符`?.`可以按照运算符之前的属性是否有效，链式读取对象的属性或者使整个对象链返回`undefined`。
  - 可选链运算符还可以用于函数调用，`let result = obj.customMethod?.();`
  - [可选链操作符 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE)
  - [Optional Chaining - TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)
- 空合并运算符`??`
  - `let x = foo ?? bar();`，当`foo`为`null`或`undefined`时，`x`兜底取值为`bar()`。
  - [Nullish Coalescing - TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)

## 工具类型

详情：[Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

- `Partial<Type>`: Constructs a type with all properties of Type set to optional.
