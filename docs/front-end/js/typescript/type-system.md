---
sidebarDepth: 0
---

# 类型系统

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
