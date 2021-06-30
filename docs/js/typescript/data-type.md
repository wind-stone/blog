# 数据类型

[[toc]]

## 类型分类

### 基本类型

基本类型（`primitive type`）: `A primitive type is an individual type that can not be broken down further`。

TypeScript 内置的基本数据类型有:

- `boolean`
- `number`
- `string`
- `symbol`
- `undefined`
- `null`
- `void`，可将`undefined`赋值给`void`类型的变量
- `never`
- `object`，该类型的值包含对象、数组、函数等等
- `any`，可以包含任何值
- `unknown`

当设置`strictNullChecks`为`true`时，会告知 TypeScript 编译器不允许将`null`和`undefined`赋值给变量。

- 若变量已经声明为给定类型（不包含`null`或`undefined`），则不允许将变量重新赋值为`null`或`undefined`
- 若变量未设置初始值，则不允许使用
- 不能将`null`赋值给`undefined`类型的变量，或将`undefined`赋值给`null`类型的变量

### 抽象类型

抽象类型（`abstract type`），`An abstract type is a type that is composed of primitive types`。

- `Array`
- `Tuple`，比如: `let student: [ string, number, boolean ] = [ 'Ross Geller', 27, true ]`
- `interface`

### 类型兼容性

|    A\B    | boolean | number | string | symbol | undefined | null  | void  | never | unknown |  any  |
| :-------: | :-----: | :----: | :----: | :----: | :-------: | :---: | :---: | :---: | :-----: | :---: |
|  boolean  |    √    |   ×    |   ×    |   ×    |     ×     |   ×   |   ×   |   ×   |    √    |   √   |
|  number   |    ×    |   √    |   ×    |   ×    |     ×     |   ×   |   ×   |   ×   |    √    |   √   |
|  string   |    ×    |   ×    |   √    |   ×    |     ×     |   ×   |   ×   |   ×   |    √    |   √   |
|  symbol   |    ×    |   ×    |   ×    |   √    |     ×     |   ×   |   ×   |   ×   |    √    |   √   |
| undefined |    ×    |   ×    |   ×    |   ×    |     √     |   ×   |   √   |   ×   |    √    |   √   |
|   null    |    ×    |   ×    |   ×    |   ×    |     ×     |   √   |   ×   |   ×   |    √    |   √   |
|   void    |    ×    |   ×    |   ×    |   ×    |     ×     |   ×   |   √   |   ×   |    √    |   √   |
|   never   |    √    |   √    |   √    |   √    |     √     |   √   |   √   |   √   |    √    |   √   |
|  unknown  |    ×    |   ×    |   ×    |   ×    |     ×     |   ×   |   ×   |   ×   |    √    |   √   |
|    any    |    √    |   √    |   √    |   √    |     √     |   √   |   √   |   ×   |    √    |   √   |

第一列表示 A，第一行表示 B。表格里展示的是 A 是否能赋值给 B。

### 工具类型

（暂时先放置在这里）

- `Partial<Type>`
- `Required<Type>`
- `Readonly<Type>`
- `Record<U,T>`: 创建一个接口，该接口的`key`是由联合类型`U`的每一个类型映射而来，而`value`的类型为`T`。
- `Pick<I,U>`
  - `I`是已存在的接口，`U`是个单元类型，或者由单元类型组合而成的联合类型
  - 创建一个接口，该接口是`I`的子类型，其包含的`key`由`U`列表挑选而来
- `Omit<I,U>`
  - `I`是已存在的接口，`U`是个单元类型，或者由单元类型组合而成的联合类型
  - 创建一个接口，该接口是`I`的子类型，其包含的`key`会忽略`U`列表里的`key`
- `Extract<U,T>`
- `Exclude<U,T>`
- `NonNullable<U>`
- `Parameters<F>`
- `ReturnType<F>`

## 函数

### 函数类型的双向推导

```ts
// declare a function (using function expression)
const sum = ( a: number, b: number ): number => a + b;
```

我们定义`sum`是个函数表达式，该函数表达式接受两个`number`类型的参数且返回类型也是`number`。尽管我们没有显式地声明变量`sum`的类型，但是 TypeScript 可以根据赋值给`sum`的函数表达式推导出来`sum`的类型，即`(a: number, b: number) => number`。

```ts
// declare a variable of type function
let sum: ( a: number, b: number ) => number;

// assign a (function) value to `sum`
sum = ( a: number, b: number ): number => a + b; // redundant

sum = ( a, b ) => a + b;
```

我们首先声明了变量为函数类型，该函数类型接受两个`number`类型的参数且返回也是`number`类型。

之后，当我们将赋值函数表达式赋值给变量时，可以省略函数表达式的参数类型、返回类型，因为 TypeScript 可以根据变量`sum`的类型，自动推导出来该函数表达式的类型。

## 接口

### 接口里的方法

```ts
interface Student {
    firstName: string;
    lastName: string;
    age: number;
    // equals to
    // getSalary: (base: number) => number
    getSalary(base: number): number;
};
```

### 用接口描述函数

```ts
// declare a function type
interface IsSumOdd {
    ( a: number, b: number ): boolean;
}

// create a function of type `IsSumOdd`
let isSumOdd: IsSumOdd = ( x, y ) => {
    if( (x + y) % 2 === 0 ) {
        return false;
    }

    return true;
};

// make some `isSumOdd()` calls
console.log( 'isSumOdd(1, 2) =>', isSumOdd(1, 2) );
```

#### 带属性声明的函数类型

```ts
// declare a function type with properties
interface IsSumOdd {
    ( a: number, b: number ): boolean;
    type: string;
    calculate( a: number, b: number): number;
}

// create a function of type `IsSumOdd`
let isSumOdd: IsSumOdd = Object.assign(
    function( x: number, y: number ): boolean {
        return (x + y) % 2 !== 0;
    },

    // assign properties
    {
        type: 'oddChecker',
        calculate: function( x: number, y: number ): number {
            return x + y;
        }
    }
);

// log some values
console.log( 'isSumOdd(1, 2) =>', isSumOdd(1, 2) );
console.log( 'isSumOdd.type =>', isSumOdd.type );
console.log( 'isSumOdd.calculate(1, 2) =>', isSumOdd.calculate(1, 2) );
```

#### 构造函数

```ts
// define a class
class Animal {
    sound: string

    constructor( sound: string ) {
        this.sound = sound;
    }

    getSound(): string {
        return `${ this.sound }! ${ this.sound }!`;
    }
}

// define an interface to represent a constructor function
interface AnimalInterface {
    new ( sound: string ): Animal;
}

// create `Animal` factory function
let createAnimal = ( ctor: AnimalInterface, type: string ): Animal => {
    return type === 'dog' ? new ctor( 'Woof' ) : new ctor( 'Meow' );
}

// create `Animal` instance
let dog: Animal = createAnimal( Animal, 'dog' );
console.log( 'dog.getSound() =>', dog.getSound() );
```

#### 纯对象

```ts
interface SimpleObject {
  [key: string]: any;
}
```

```ts
// 这种方式定义的类型是除了基本类型之外的类型，不一定是纯对象
let simpleObj: object;

simpleObj = function (a: number, b: number) {
    return a + b;
}
```

### 接口继承

```ts
// define `Person` interface
interface Person {
    firstName: string;
    lastName: string;
}

// `Student` interface inherits `Person`
interface Student extends Person {
    rollNo: number;
}

// define `ross` object of type `Student`
let ross: Student = {
    firstName: 'Ross',
    lastName: 'Geller',
    rollNo: 100
};
```

```ts
// define `Person` interface
interface Person {
    firstName: string;
    lastName: string;
}

// define `Player` interface
interface Player {
    score: number;
}

// `Student` interface inherits `Person` and `Player`
interface Student extends Person, Player {
    rollNo: number;
}

// create `ross` object of type `Student`
let ross: Student = {
    firstName: 'Ross',
    lastName: 'Geller',
    score: 85,
    rollNo: 100,
};

// log values
console.log( 'ross =>', ross );
```

## 类

类即是值，也是类型。

### 类实现接口

```ts
// define an interface
interface PersonInterface {
    firstName: string;
    lastName: string;
    dob: Date;
    readonly name: string;
    getBirthYear(): number;
}

// class implements the interface
class Person implements PersonInterface{
    constructor(
        public firstName: string,
        public lastName: string,
        public dob: Date
    ){}

    get name(): string {
        return `${ this.firstName } ${ this.lastName }`;
    }

    getBirthYear(): number {
        return this.dob.getFullYear();
    }
}
```

### 接口描述类的类型

```ts
// `Person` as a type represents instance side of the class
class Person {
    constructor(
        public firstName: string,
        public lastName: string
    ) {}

    getFullName(): string {
        return `${ this.firstName } ${ this.lastName }`;
    }

    // static fields
    static delimiter = ' ';
    static splitName( name: string, separator: string ): string[] {
        return name.split( separator );
    }
}

// this interface represents static side of the `Person` class
interface PersonInterface{
    new ( firstName: string, lastName: string ): Person; // constructor
    delimiter: string; // static property
    splitName( name: string, separator: string ): string[]; // static method
}

// factory function
// let createPerson = function( ctor: typeof Person, name: string ) {  // 也可以不声明 PersonInterface，直接用 typeof 获取 Person 的类型
let createPerson = function( ctor: PersonInterface, name: string ): Person {
    let [ firstName, lastName ] = ctor.splitName( name, ctor.delimiter );
    return new ctor( firstName, lastName );
}

// create an instance of `Person` class
const ross: Person = createPerson( Person, 'Ross Geller' );

// print full-name of `ross`
console.log( ross.getFullName() );
```

如上代码里，`const ross: Person`这种用法，描述了`Person`的实例一面的类型（`instance side type`），因为它指出了`ross`具有`Person`类公开的那些属性和方法。

而`PersonInterface`接口描述了`Person`的静态一面的类型（`static side type`），因为它声明了`Person`构造函数的类型以及静态属性和方法的类型。

### 作为接口的类

TypeScript 里的类，也会同时定义一个隐式的接口，这就是说，TypeScript 会从类的公共成员（属性和方法）里创建出一个接口。因此，你可以通过`implements`关键字让类去实现另一个类（此时类是作为接口的角色）。

```ts
class Person {
    constructor(
        public firstName: string,
        public lastName: string
    ){}

    getFullName(): string {
        return `${ this.firstName } ${ this.lastName }`;
    }
}

// `Student` class implements the `Person` class
class Student implements Person {
    constructor(
        public firstName: string,
        public lastName: string,
        public marks: number
    ){}

    getFullName(): string {
        return `${ this.firstName } ${ this.lastName }`;
    }

    getGrade(): string {
        return (this.marks / 10).toFixed( 0 );
    }
}
```

注意，TypeScript 不允许一个类去实现另一个有`private`或`protectd`成员的类，原因可见[TypeScript class implements class with private functions](https://stackoverflow.com/questions/48953587/typescript-class-implements-class-with-private-functions/48953930#48953930)。

### 抽象类

```ts
abstract class Person {
    constructor(
        public firstName: string,
        public lastName: string
    ){}

    // abstract method declaration
    abstract getFullName(): string;
}

class Student extends Person {
    constructor(
        firstName: string,
        lastName: string,
        public marks: number
    ){
        super( firstName, lastName );
    }

    getFullName(): string {
        return `${ this.firstName } ${ this.lastName }`;
    }

    getGrade(): string {
        return (this.marks / 10).toFixed( 0 );
    }
}
```

继承抽象类的类，必须实现抽象类的抽象方法。

### 接口继承类

我们知道，接口可以通过`extends`关键字来继承另一个接口。现在我们知道一个类会定义一个隐式的接口，因此我们可以让一个接口继承一个类。

```ts
// define a class
class Person {
    constructor(
        public firstName: string,
        public lastName: string
    ){}

    getFullName(): string {
        return `${ this.firstName } ${ this.lastName }`;
    }
}

// declare an interface that extends a class
interface Student extends Person {
    marks: number;
}

// create `ross` object of type `Student`
const ross: Student = { // 此处会报错：Property 'getFullName' is missing in type '{ firstName: string; lastName: string; marks: number; }' but required in type 'Student'.
    firstName: 'Ross',
    lastName: 'Geller',
    marks: 98
};
```

## 枚举

枚举即是值，也是类型。

### 编译后为对象

```ts
// define an enum
enum Speed {
    // 枚举的 value 为数值时，每一项的值会隐式地基于上一项累加。若第一个成员未设置值，则默认为 0
    SLOW,
    MEDIUM,
    FAST
}

// log `Speed` enum
console.log( 'Speed =>', Speed );
```

当枚举类型作为值使用时，会被编译到产出文件里，且枚举会被编译为 JavaScript 对象。

```js
// define an enum
var Speed;
(function (Speed) {
    Speed[Speed["SLOW"] = 0] = "SLOW";
    Speed[Speed["MEDIUM"] = 1] = "MEDIUM";
    Speed[Speed["FAST"] = 2] = "FAST";
})(Speed || (Speed = {}));
console.log(Speed);
```

```js
// Speed 的打印结果
{
    0: "SLOW"
    1: "MEDIUM"
    2: "FAST"
    FAST: 2
    MEDIUM: 1
    SLOW: 0
}
```

需要注意的是，当枚举的每一项的`value`为数值时，编译出的 JavaScript 对象会存在两对`key/value`的映射，另一对是原先`key/value`的逆向映射，这是为了方便我们通过枚举值来获取枚举成员名称。而当枚举成员的`value`为`string`时，则不存在逆向映射。

### 常量枚举

常量枚举，`Constant Enums`。

上一步中我们发现枚举最终会编译为 JavaScript 对象。

```ts
// enum-non-const.ts
// define a non-constant enum
enum Speed {
    SLOW = "slow",
    MEDIUM = "medium",
    FAST = "fast"
}

// define a simple object
let racer = {
    name: 'Ross Geller',
    speed: Speed.MEDIUM, // enum value
};

// log `racer` object
console.log( 'racer =>', racer );
```

可以发现，编译前`racer.speed`的值为`Speed.MEDIUM`表达式，编译后的`racer.speed`的值依然是`Speed.MEDIUM`表达式。

```js
// enum-non-const.js
// define a non-constant enum
var Speed;
(function (Speed) {
    Speed["SLOW"] = "slow";
    Speed["MEDIUM"] = "medium";
    Speed["FAST"] = "fast";
})(Speed || (Speed = {}));
// define a simple object
var racer = {
    name: 'Ross Geller',
    speed: Speed.MEDIUM
};
```

若是不想让枚举编译到产出里而是让枚举值内联到产出里，可以在枚举声明前添加`const`关键字。

```ts
// enum-const.ts
// define a constant enum
const enum Speed {
    SLOW = "slow",
    MEDIUM = "medium",
    FAST = "fast"
}

// define a simple object
let racer = {
    name: 'Ross Geller',
    speed: Speed.MEDIUM
};

// log `racer` object
console.log( 'racer =>', racer );

// Error: 'const' enums can only be used in property or index access expressions or the right hand side of an import declaration or export assignment or type query.
// console.log( "Speed => ", Speed );
```

此时，由于我们在枚举声明之前添加了`const`关键字，编译后`racer.speed`获得了字面量值`medium`，而不是`Speed.MEDIUM`，而且产出里也没有`Speed`对象。

```js
// enum-const.js
// define a simple object
var racer = {
    name: 'Ross Geller',
    speed: "medium" /* MEDIUM */
};
// log `racer` object
console.log('racer =>', racer);
```

### 计算成员

绝大多数编程语言里，枚举成员的值必须是编译时的常量值，这意味着所有的值都必须在编译时定义。

但是 TypeScript 允许表达式作为枚举成员的值，表达式将在运行时进行计算。

```ts
// define an enum
enum Speed {
    SLOW = 1, // constant member
    MEDIUM, // constant member
    FAST = parseInt( "3" ), // computed member
}
```

TypeScript 会基于值的初始化来将枚举成员分为两大类。若值在编译阶段可用，则称之为常量成员（`constant members`）；若值需要再运行时计算得出，则称之为计算成员（`computed members`）。

::: warning 注意
常量枚举不能存在计算成员，因为常量枚举的值必须在编译阶段就要确定。（常量枚举不会编译为运行时的对象）
:::

TypeScript 允许枚举成员从同一个枚举或其他枚举里引用值。你可以使用`+`/`-`/`~`等一元操作符，或者`+`/`-`/`*`/`/`/`%`/`<<`/`>>`/`>>>`/`&`/`|`/`^`等二元操作符，来构建值的初始化表达式，不过表达式只能用常量值或同一枚举/其他枚举的常量枚举成员来构建。

```ts
// define an enum
enum Speed {
    SLOW = 30,
    MEDIUM = SLOW + 30,
    FAST = MEDIUM + 40
}
```

## Unit Types

## 交叉类型

交叉类型，`Intersection Types`，将已有的多个类型合并成一个类型，该类型拥有这些类型的所有特性。

```ts
interface Person {
    firstName: string;
    lastName: string;
}

interface Student {
    marks: number;
}

const student: Person & Student = {
    firstName: 'Wind',
    lastName: 'Stone',
    marks: 90
}
```
