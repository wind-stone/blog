# 类

类即是值，也是类型。

## protected

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

## 类实现接口

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

## 接口描述类的类型

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
// 也可以不声明 PersonInterface，直接用 typeof 获取 Person 的类型
// let createPerson = function( ctor: typeof Person, name: string ) {
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

::: tip 提示
声明类的类型是比较麻烦的，你可以通过`typeof`直接获取类的类型，比如`typeof Person`获取`Person`类的类型。`typeof Person`返回的是个接口，包含了类的静态属性/方法和构造函数。
:::

## 作为接口的类

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

## 抽象类

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

## 接口继承类

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
