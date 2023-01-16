# 类型操作

详见[Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

TypeScript 的类型系统是非常强大的，因为它允许基于其他类型来表达（`express`）新的类型。

最简单的形式就是泛型，我们实际上有大量的类型操作符可以使用。同时，我们还可以基于已有的值来表达新的类型。

通过结合各种类型操作符，我们能够通过简明、可维护的方式，来表达复杂的操作符和值。以下是使用已有类型或值来表达一个新类型的方式：

- `Generics`，泛型，这是一种可以拥有参数的类型。
- `Keyof`类型操作符，使用`keyof`操作符来创建新的类型。
- `Typeof`类型操作符，使用`typeof`操作符来创建新的类型。
- 索引访问类型（`Indexed Access Types`），使用`Type['a']`语法来访问一个类型的子集。
- 条件类型（`Conditional Types`），在类型系统里类似`if`语句的类型。
- 映射类型（`Mapped Types`），通过映射一个已存在的类型的每一个属性，来创建新类型。
- 模板字面量类型（`Template Literal Types`），Mapped types which change properties via template literal strings。

## keyof

针对`keyof`操作符，需要额外注意的是，JavaScript 对象的属性名称，总是强制对应一个字符串，因此`obj[0]`总是与`obj['0']`相同。

```ts
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;

type M = string | number
```

## 条件类型 Conditional Types

详见[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

条件类型的形式看起来类似于 JavaScript 的条件表达式（`condition ? trueExpression : falseExpression`）。

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

当`extends`左边的类型是右边类型的子类型时，你将获取到第一个分支（即`TrueType`），否则将获取到后面的分支（即`FalseType`）。

### infer 类型推断

::: tip 提示
`infer`关键词只能在`extends`条件类型上使用，不能在其他地方使用。
:::

条件类型使用`infer`关键字给我们提供了一个方法，可以从 TrueType 分支中参与比较的类型里推断出类型。比如，我们可以从 Flatten 里推断出元素类型，而不是手动通过索引访问提取出类型。

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

// 代替这种写法：
type Flatten<T> = T extends any[] ? T[number] : T;
```

这里，我们使用`infer`关键字声明式地引入一个名为`Item`的新的泛型类型变量，而不是在 TrueType 分支里提取出 T 的元素类型。这让我们免于考虑如何挖掘和探查类型里我们感兴趣的结构。

我们可以通过`infer`关键字写出一些有用的帮助类型别名。比如，我们可以从函数类型里提取出返回类型：

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

// type Num = number
type Num = GetReturnType<() => number>;

// type Str = string
type Str = GetReturnType<(x: string) => string>;

// type Bools = boolean[]
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the last signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

// type T1 = string | number
type T1 = ReturnType<typeof stringOrNum>;
```

### 可分配的条件类型

若`extends`前面的类型是泛型，且泛型传入的是联合类型时，则此时的条件类型是可分配的：即会依次判断该联合类型的所有子类型是否可以`extends`后面的类型（是一个分发的过程），然后将最终的结果组成新的联合类型。

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

// type StrArrOrNumArr = string[] | number[]
type StrArrOrNumArr = ToArray<string | number>;
```

为了阻止这种行为，你可以在`extends`的两侧都加上中括号以形成元组类型：

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
// type StrArrOrNumArr = (string | number)[]
type StrArrOrNumArr = ToArrayNonDist<string | number>;
```

## 映射类型 Mapped Types

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
