# 类型系统

[[toc]]

## 索引访问

[Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

我们可以使用一个索引访问类型去查询另一个类型指定属性的类型。

### 索引不存在的属性

```ts
type Person = { age: number; name: string; alive: boolean };
// Property 'alve' does not exist on type 'Person'.
type I1 = Person["alve"];
```

若是索引不存在的属性，将得到报错。

### 获取数组元素的类型

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

// type Person = {
//     name: string;
//     age: number;
// }
type Person = typeof MyArray[number];

// type Age = number
type Age = typeof MyArray[number]["age"];
```

注意，`typeof MyArray[number]`实际上是`(typeof MyArray)[number]`，`typeof MyArray`获取`MyArray`的类型，得到数组类型`{name: string; age: number;}[]`，最后获取数组项的类型。

### T[K]

- `T[K]`，获取 T 中`key`为 K 的类型组成的联合类型，其中 K 是字面量类型或其联合类型。
- `T[keyof T]`，可以获取到 T 中所有`key`的类型组成的联合类型。
- `T[keyof K]`，获取到的是 T 中同时存在于 T 和 K 的`key`的类型组成的联合类型。

注意：如果`[]`中的`key`有不存在 T 中的，则该`key`的类型是`any`；因为 TypeScript 也不知道该`key`最终是什么类型，所以是`any`，且也会报错。

## 类型推导

## 类型断言

两种使用方式：

- `value as Type`
- `<Type>value`

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

## 参考文档

- [Understanding the TypeScript’s type system and some must-know concepts](https://medium.com/jspoint/typescript-type-system-81fdb84bba75)
