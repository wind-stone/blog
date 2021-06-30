# 类型系统

[[toc]]

## any/unknown

### any

绝大多数情况下，你不需要为实体（`entity`）提供类型，因为 TypeScript 编译器可以根据实体的初始值（比如函数参数的默认值、函数的返回值、对象属性的初始值）推断出来。

当 TypeScript 无法确定变量的类型时，它将隐式地设置变量的类型为`any`。比如`let x;`表达式声明了一个变量`x`，但是我们没有为其提供类型也没有设置初始值，因此`x`的类型被设置为`any`。

`any`类型仅存在于 TypeScript 里，它是一个集合类型（`collective type`），包含了所有存在于 JavaScript 运行时的值的类型。这意味着，`string`、`number`、`symbol`、`null`、`undefined`以及其他所有存在于 JavaScript 的值也是`any`类型。因此，`any`类型有时也称为**顶级类型**（`top type`）或**超类型**（`supertype`）。

因为`any`是所有 JavaScript 值的超类型，一个包含了`any`的联合类型将收窄为`any`类型。由于交叉类型通过结合多个类型的形状生成一个类型，一个包含了`any`的交叉类型将返回`any`类型。

```ts
// type Collection = any
type Collection = string | number | undefined | any;
// type Collection = any
type Collection = string & any;
```

这意味着你可以声明一个`any`类型的变量，并且可以将任何 JavaScript 值赋给`x`。更近一步，你还可以将`any`类型的值赋给一个已知类型的变量。

```ts
let x: any;
x = 1;
x = 'one';
x = true;

let y: boolean = x;
```

注意，这可能会在运行时导致大问题。

由于`any`类型没有确定的形状，你将无法从 IDE 上获得任何关于自动补全和智能提示的帮助。但是，你可以使用类型断言语法比如`x as Person`，将`any`类型的`x`断言为`Person`类型。

我们也可以使用类型守卫将`any`类型收窄。由于`any`类型表示许多类型的集合，就像一个联合类型，TypeScript 可以使用类型守卫来鉴别一个类型。

```ts
class Student {
    constructor(
        public name: string, public marks: number
    ){ }

    getGrade(): string {
        return (this.marks / 10).toFixed( 0 );
    }
}

class Player {
    constructor(
        public name: string, public score: number
    ){}

    getRank(): string {
        return (this.score / 10).toFixed( 0 );
    }
}

const getPosition = ( person: any ) => {
    if( person instanceof Student ) {
        // 使用 instanceof 类型守卫将 any 类型的 person 收窄为 Student
        // (parameter) person: Student
        console.log(
            `${ person.name } =>`, person.getGrade()
        );
    } else if( person instanceof Player ) {
        // 注意，这里要使用 else if 而不是 else
        // (parameter) person: Player
        console.log(
            `${ person.name } =>`, person.getRank()
        );
    }
};

getPosition( new Student( 'Ross Geller', 82 ) );
getPosition( new Student( 'Monica Geller', 71 ) );
```

`any`类型在你无法得知一个值在运行时的形状时是相当有用的。这通常发生在你正在使用第三方 API 且 TypeScript 无法获得其类型时。为了禁止 TypeScript 编译器报错，你只能使用`any`类型。

### unknown

TypeScript 3.0 引入`unknown`类型来缓解`any`有关的一些问题。最基础的，`unknown`类型告知 TypeScript 编译器，尽管值的类型是编译时是未知的（`unknown`），但是在运行时可能是任意类型。

因此，`unknown`可以表示任何`any`可以表示的值，这也让`unknown`成为**顶级类型**（`top type`）或**超类型**（`supertype`）。与`any`相似，一个包含了`unknown`类型的联合类型，将收窄为`unknown`类型，但是`any`的优先级更高。

```js
// type Collection = unknown
type Collection = string | number | undefined | unknown;
// type Collection = any
type Collection = string | number | undefined | unknown | any;
// type Collection = string
type Collection = string & unknown;
```

但是，涉及到交叉类型，`unknown`的行为跟`any`有些不一样。任何类型与`unknown`类型进行交叉，返回的是原类型本身，因为交叉类型通过结合两个类型的形状创建了一个新的类型，而`unknown`不表示任何形状。

你可以将任何 JavaScript 的值赋值给`unknown`类型的变量，包括`any`类型的值。但是你不能将`unknown`类型的值赋值给已知类型的变量。

```ts
let x: unknown;
x = 1;
x = 'one';
x = true;

// Error: Type 'unknown' is not assignable to type 'boolean'.
let y: boolean = x;
```

针对上面代码最后一行 TypeScript 编译器会报错，因为`y`只能包含`boolean`类型的值，但`unknown`类型的值在运行时可以是任何类型。你可能争论说`any`的值在运行时也可以是任何类型，但这就是`unknown`类型引入的原因。

TypeScript 不会允许你在`unknown`类型的值上执行操作，除非使用类型断言或类型守卫收窄这个类型。

```ts
let x: unknown;
// Error: Property 'a' does not exist on type 'unknown'.
console.log( x.a );
// Error: This expression is not callable.
x();
// Error: This expression is not constructable.
new x();
```

### any 和 unknown 的对比

`unknown`和`any`最大的区别是，`unknown`比`any`更加严格：

- 我们在`any`类型的值上执行操作时，不需要进行任何类型检查；
- 但是我们在`unknown`类型的值上执行绝大多数操作之前，必须要进行类型检查，以确保该类型的值可以执行对应的操作。

```ts
let value: any;

value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK
value = [];               // OK
value = {};               // OK
value = Math.random;      // OK
value = null;             // OK
value = undefined;        // OK
value = new TypeError();  // OK
value = Symbol("type");   // OK
```

```ts
let value: any;

// 以下的任何操作都是类型正确的
value.foo.bar;  // OK
value.trim();   // OK
value();        // OK
new value();    // OK
value[0][1];    // OK
```

尽管在`any`类型的值上执行任何操作都是类型正确的，但是在运行时可能会出错。`unknown`类型的产生，就是为了解决这个问题。

```ts
let value: unknown;

value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK
value = [];               // OK
value = {};               // OK
value = Math.random;      // OK
value = null;             // OK
value = undefined;        // OK
value = new TypeError();  // OK
value = Symbol("type");   // OK
```

与`any`类型类似，将任何类型的值赋值给`unknown`，都是类型正确的。

但是，将`unknown`类型的值赋值给其他已知类型（除了`any`和`unknown`）的变量时，就会报错。

```ts
let value: unknown;

let value1: unknown = value;   // OK
let value2: any = value;       // OK
let value3: boolean = value;   // Error
let value4: number = value;    // Error
let value5: string = value;    // Error
let value6: object = value;    // Error
let value7: any[] = value;     // Error
let value8: Function = value;  // Error
```

同理，在`unknown`类型的值上执行操作，也会报错。

```ts
let value: unknown;

value.foo.bar;  // Error
value.trim();   // Error
value();        // Error
new value();    // Error
value[0][1];    // Error
```

这就是`unknown`类型的主要价值：TypeScript 不允许我们在`unknown`类型的值上随意执行操作。与之相反，我们需要先执行一些类型检查（比如类型守卫或类型断言）来收窄值的类型。

#### 可在 unknown 上执行的操作

在不做类型检查的情况下，仅可在`unknown`类型的之上执行如下四种操作：

- `===`
- `==`
- `!==`
- `!=`

#### 联合类型里的 unknown

与`any`相似，包含了`unknown`的联合类型将收窄为`unknown`类型，但是`any`具有更高的优先级。

```ts
type UnionType1 = unknown | null;       // unknown
type UnionType2 = unknown | undefined;  // unknown
type UnionType3 = unknown | string;     // unknown
type UnionType4 = unknown | number[];   // unknown

type UnionType5 = unknown | any;  // any
```

#### 交叉类型里的 unknown

任何类型与`unknown`类型交叉的结果，仍然是该类型自身。

```ts
type IntersectionType1 = unknown & null;       // null
type IntersectionType2 = unknown & undefined;  // undefined
type IntersectionType3 = unknown & string;     // string
type IntersectionType4 = unknown & number[];   // number[]
type IntersectionType5 = unknown & any;        // any
```

### 与 void 和 never 的对比

`void`类型表示没有`return`语句的函数的返回类型，`never`类型表示永不返回任何值的函数的返回类型。`void`和`never`都不表示运行时的任何值，它们只是作为 TypeScript 类型系统的辅助。

基于这个事实，`void`和`never`不会表示任何`any`和`unknown`表示的值。但是，在一个包含了`void`和`never`以及`any`（或`unknown`）的联合类型里，联合类型将收窄为`any`或`unknown`。

```ts
// type Collection = any
type Collection = void | never | any;
// type Collection = unknown
type Collection = void | never | unknown;
```

## 类型推导

## 类型断言

两种使用方式：

- `value as Type`
- `<Type>value`

## 字面量类型

## 类型守卫

类型守卫（`Type Guard`）。

可用于类型守卫的运算符：

- `switch/case`，当联合类型里的各个类型都存在一个相同名称的字面量类型的属性，且字面量类型各不相同
- `if/else` + `in`，当联合类型里的某个类型存在一个独有的属性
- `if/else` + `typeof`
- `instanceof`，检查是否是联合类型里某个类类型的实例
- `==`、`!=`、`===`、`!==`，用这些操作符与字面量的值比较时
- [自定义守卫](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

### 类型收窄

类型收窄，`Type Narrowing`

## 结构化类型

TypeScript 的类型检查，是通过检查值的形状来判断的。

```ts
class Person {
    constructor(
        public firstName: string,
        public lastName: string
    ) {}
}

class Student {
    constructor(
        public firstName: string,
        public lastName: string,
        public marks: number
    ) {}
}

// print fullname of a `Person` object
function getFullName( p: Person ): string {
    return `${ p.firstName } ${ p.lastName }`;
}

var ross = new Person( 'Ross', 'Geller' );
var monica = new Student( 'Monica', 'Geller', 84 );

console.log( 'Ross =>', getFullName( ross ) );
console.log( 'Monica =>', getFullName( monica ) );
```

上述示例中，尽管我们没有显式地提及`Student`类继承了`Person`类，但是 TypeScript 允许`Student`类的实例作为`p`参数的值。这是因为`Student`类的实例`monica`具有`string`类型的`firstName`和`lastName`属性，TypeScript 在校验参数`p`时只是校验传入的值是否具有与`Person`类相同的结构，而不是校验是否是`Person`的实例。

这也证明 TypeScript 是结构化类型语言，也称为`鸭式类型`，即“如果它走起来像鸭子，叫起来像鸭子，游起来像鸭子，那么它就是个鸭子”。由于`Student`类型拥有`Person`类型的行为，因此 TypeScript 认为它也是个`Person`。

你可以将这些法则应用于类。由于 TypeScript 里的类类型隐式地定义了一个包括了类公共成员的接口，因此你可以将相同的法则应用到接口上。

```ts
interface Person {
    firstName: string;
    lastName: string;
}

interface Student {
    firstName: string;
    lastName: string;
    marks: number;
}

// print fullname of a `Person` object
function getFullName( p: Person ): string {
    return `${ p.firstName } ${ p.lastName }`;
}

var ross: Person = {
    firstName: 'Ross',
    lastName: 'Geller'
};

var monica: Student = {
    firstName: 'Monica',
    lastName: 'Geller',
    marks: 84,
};

console.log( 'Ross =>', getFullName( ross ) );
console.log( 'Monica =>', getFullName( monica ) );
```

当类型 A 具有类型 B 的所有属性，则 A 成为 B 的子类型。

上述示例里，`Student`接口即为`Person`接口的子类型。类型为`Student`的对象`monica`，可以作为类型为`Person`的参数`p`的值，这种行为称为**结构化子类型**。

但结构化子类型并不是在任何场景下都是合法的，比如：

```ts
interface Person {
    firstName: string;
    lastName: string;
}

// accept an argument of type `Person
let printPerson = ( person: Person ): void => {
    console.log( `Hello, ${ person.firstName } ${ person.lastName }.` );
};

// legal
let ross = { firstName: 'Ross', lastName: 'Geller', gender: 'Male' };
printPerson( ross );

// illegal
// Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
printPerson( { firstName: 'Ross', lastName: 'Geller', gender: 'Male' } );

// legal
let monica: Person;
let monana = { firstName: 'Monica', lastName: 'Geller', gender: 'Male' };
monica = monana;

// illegal
// Error: Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
let p: Person = { firstName: 'Ross', lastName: 'Geller', gender: 'Male' };
```

TypeScript 允许使用一个变量引用代替子类型（TypeScript 能从字面量值推导出变量的类型，因而隐式地产生子类型），但是不允许直接使用字面量值（否则容易误导）。

## void/never

`void`类型表示没有`return`语句的函数的返回类型。

`never`类型表示永不返回任何值的函数的返回类型。

这些类型都不代表运行时的任何值，它们只是作为 TypeScript 类型系统的辅助检查手段。

```ts
// type Collection = any
type Collection = void | never | any;
// type Collection = unknown
type Collection = void | never | unknown;
```

## declare

若是我们将`declare`关键字放置在变量声明之前，这不会创建一个新的变量，而是会告诉 TypeScript 编译器，这个变量会存在于运行时。

```ts
// declare Lodash interface
interface Lodash {
    tail( values: any[] ): any[]
}

// declare `_` constant of type `Lodash`
declare const _: Lodash;
```

## 参考文档

- [Understanding the TypeScript’s type system and some must-know concepts](https://medium.com/jspoint/typescript-type-system-81fdb84bba75)
- [The unknown Type in TypeScript](https://mariusschulz.com/blog/the-unknown-type-in-typescript)
