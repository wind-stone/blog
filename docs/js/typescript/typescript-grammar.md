# TypeScript 类型语法

## 类型操作符

- `typeof`，获取一个标识符（变量/属性）的类型，详见[Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- `keyof`，获取接口所有`key`的名称组成一个联合类型（每个成员都是字面量类型），详见[Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

## 类型操作

### 映射类型

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

#### 映射修饰符

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

#### 键名重命名 as

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

### 模板字面量类型

[模板字面量类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)，`Template Literal Types`。

## 表达式

### [P in K]: T[P]

`[P in K]: T[P]`表达式告知 TypeScript 编译器去迭代`K`的值，类似于`for in`循环，`T[P]`将提取接口`T`的`P`属性的类型。

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

## 内置类型及实现

- [TypeScript - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript - es5.d.ts](https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts)

### Partial

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

### Required

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

`-?`操作符是将可能存在的可选项都变成必选项。

### Uppercase

Converts each character in the string to the uppercase version.

::: tip 提示
`Uppercase`、`Lowercase`、`Capitalize`和`Uncapitalize`这几个工具类型内置于编译器里以获得更好的性能，而且无法在 TypeScript 的`.d.ts`里找到。
:::

### Lowercase

Converts each character in the string to the lowercase equivalent.

### Capitalize

Converts the first character in the string to an uppercase equivalent.

### Uncapitalize

Converts the first character in the string to a lowercase equivalent.

## 类型示例

### 获取数组全部元素的类型

```ts
const array = ['hello', 'world'] as const

// type a = "hello" | "world"
type a = typeof array[number]
```
