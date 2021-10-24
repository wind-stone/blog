# 接口

## 索引签名

```ts
interface Obj {
  a: string;
}

const obj: Obj = {
  a: "1",
};

obj.b = 2;
```

此时会出现错误提示`Property 'b' does not exist on type 'Obj'`。要想解决这个问题，要使用索引签名。

```ts
interface Obj {
  a: string;
  [index: string]: string | number;
}

const obj: Obj = {
  a: "1",
};

obj.b = 2;
```

## 接口里的方法

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

## 用接口描述函数

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

## 带属性声明的函数类型

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

## 构造函数

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

### 纯对象

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

## 接口继承

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
