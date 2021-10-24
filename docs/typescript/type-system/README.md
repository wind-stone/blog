# 类型系统

[[toc]]

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

## 映射类型

[映射类型](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)，`Mapped Types`。映射类型基于索引签名的语法来构建新的类型。

映射类型是一个泛型类型，它使用（通常是通过`keyof`创建的）属性键名（`PropertyKey`）的联合类型去迭代每个键名，进而创建一个类型：

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

// type FeatureOptions = {
//     darkMode: boolean;
//     newUserProfile: boolean;
// }
type FeatureOptions = OptionsFlags<FeatureFlags>;
```

### 映射修饰符

映射修饰符，`Mapping Modifiers`。

`readonly`和`?`这两个额外的修饰符可以应用到映射上，分别影响可变性和可选性。你还可以添加前缀`-`或`+`来移除或者添加修饰符，若未添加前缀，默认为`+`。

```ts
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

// type UnlockedAccount = {
//     id: string;
//     name: string;
// }
type UnlockedAccount = CreateMutable<LockedAccount>;
```

```ts
// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = {
    id: string;
    name: string;
    age: number;
}
type User = Concrete<MaybeUser>;
```

### 键名重命名 as

TypeScript 4.1 及以后，你可以使用`as`重命名映射类型里的键名。

```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

你可以利用高级特性比如[模板字面量类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)来创建新的属性名。

```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
type LazyPerson = Getters<Person>;
```

你可以通过条件类型来产生`never`来过滤键名。

```ts
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

// type KindlessCircle = {
//     radius: number;
// }
type KindlessCircle = RemoveKindField<Circle>;
```

## 参考文档

- [Understanding the TypeScript’s type system and some must-know concepts](https://medium.com/jspoint/typescript-type-system-81fdb84bba75)
- [The unknown Type in TypeScript](https://mariusschulz.com/blog/the-unknown-type-in-typescript)
