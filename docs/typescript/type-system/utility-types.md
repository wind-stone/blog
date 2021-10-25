---
sidebarDepth: 1
---

# 内置工具类型

## 参考文档

- [TypeScript - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript - es5.d.ts](https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts)
- [Ts高手篇：22个示例深入讲解Ts最晦涩难懂的高级类型工具](https://juejin.cn/post/6994102811218673700)

## Partial

通过将 Type 的所有属性变成可选的，构造一个新的类型。

### 示例

```ts
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

### 实现

```ts
type Partial<Type> = {
  [P in keyof Type]?: Type[P];
}
```

- `[P in keyof Type]`通过映射类型，遍历 Type 上的所有属性
- `?:`设置属性为可选的
- `Type[P]`设置类型为原来的类型

扩展一下，将指定的`key`变成可选类型:

```ts
type PartialOptional<Type, Keys extends keyof Type> = {
  [P in Keys]?: Type[P];
}
```

## Required

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

`-?`操作符是将可能存在的可选项都变成必选项。

## Readonly

通过将 Type 的所有属性设置为`readonly`，构造出一个新的类型。

### 示例

```ts
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
// Cannot assign to 'title' because it is a read-only property.
```

### 实现

```ts
type Readonly<Type> = {
  readonly [P in keyof Type]: Type[P];
}
```

## Record<Keys, Type>

构建一个对象类型，该类型的`key`为联合类型 Keys 中的每个子类型，类型为 Type。这个工具类型可以用于将一个类型的属性映射为另一个类型。

### 示例

```ts
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

### 实现

```ts
type Record<Keys extends keyof any, Type> = {
  [P in Keys]: Type
}
```

注意，`keyof any`得到的是`string | number | symbol`，原因在于类型的`key`的类型只能为`string | number | symbol`。

## Extract<Type, Union>

通过提取联合类型 Type 里所有继承自联合类型 Union 的成员，构造出一个新类型。

### 示例

```ts
// type T0 = "a"
type T0 = Extract<"a" | "b" | "c", "a" | "f">;

// type T1 = () => void
type T1 = Extract<string | number | (() => void), Function>;
```

### 实现

```ts
/**
 * 遍历 Type 里的每个子类型，
 * 若该子类型也是 Union 的子类型，则返回该子类型，
 * 否则，返回 never 类型
 */
type Extract<Type, Union> = Type extends Union ? Type : never;
```

注意，这里涉及到联合类型 + `extends`的用法：`extends`前面的类型参数为联合类型时，会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断，然后将最终的结果组成新的联合类型。

## Exclude<Type, ExcludedUnion>

通过将联合类型 Type 里所有继承自联合类型 ExcludedUnion 的成员都移除掉，构造出一个新类型。

### 示例

```ts
// type T0 = "b" | "c"
type T0 = Exclude<"a" | "b" | "c", "a">;

// type T1 = "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;

// type T2 = string | number
type T2 = Exclude<string | number | (() => void), Function>;
```

### 实现

```ts
/**
 * 遍历 Type 里的每个子类型，
 * 若该子类型也是 ExcludedUnion 的子类型，则返回 never 类型
 * 否则，返回子类型自身
 */
type Exclude<Type, ExcludedUnion> = Type extends ExcludedUnion ? never : Type;
```

- `never`表示一个不存在的类型
- `never`与其他类型联合后，是没有`never`类型的，比如：

```ts
// type t = string | number
type t = number | string | never;
```

## Pick<Type, Keys>

Keys: 字符串字面量类型，或其联合类型。

通过从 Type 里挑选出联合类型 Keys 里的所有属性，构造成一个新的类型。

### 示例

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

// const todo: TodoPreview
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### 实现

```ts
type Pick<Type, Keys extends keyof Type> = {
    [P in Keys]: Type[P];
};
```

## Omit<Type, Keys>

Keys: 字符串字面量类型，或其联合类型。

从 Type 类型里剔除所有 Keys 里的属性，构造出一个新的类型。

注意，这里 Keys 不一定是`keyof Type`的子类型。

### 示例

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

type TodoInfo = Omit<Todo, "completed" | "createdAt">;
const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};
```

### 实现

#### 方式一: Pick 实现

```ts
type Omit<Type, Keys extends keyof any> = Pick<Type, Exclude<keyof Type, Keys>>
```

反向思考，即从 Type 里 Pick 提取出那些我们想要的属性组成一个新的类型，即`Omit = Pick<Type, 我们需要的属性联合>`

而`我们需要的属性联合`就是，从 Type 的属性联合中排出存在于联合类型 Keys 中的属性，即`Exclude<keyof Type, Keys>`。

#### 方式二: 遍历实现

```ts
type Omit<Type, Keys extends keyof any> = {
    [P in Exclude<keyof Type, Keys>]: Type[P]
}
```

类似于 Pick 的原理实现，区别在于：遍历`我们需要的属性联合`。`我们需要的属性联合`就是`Exclude<keyof Type, Keys>`。因此，遍历就是`[P in Exclude<keyof Type, Keys>`。

## Parameters

从函数类型 Type 使用的参数类型，构造出一个元组类型。

### 示例

```ts
declare function f1(arg: { a: number; b: string }): void;

// type T0 = []
type T0 = Parameters<() => string>;

// type T1 = [s: string]
type T1 = Parameters<(s: string) => void>;

// type T2 = [arg: unknown]
type T2 = Parameters<<T>(arg: T) => T>;


// type T3 = [arg: {
//     a: number;
//     b: string;
// }]
type T3 = Parameters<typeof f1>;

// type T4 = unknown[]
type T4 = Parameters<any>;

// type T5 = never
type T5 = Parameters<never>;

// Type 'string' does not satisfy the constraint '(...args: any) => any'.
// type T6 = never
type T6 = Parameters<string>;

// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
// Type 'Function' provides no match for the signature '(...args: any): any'.
// type T7 = never
type T7 = Parameters<Function>;
```

### 实现

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * @example
 * type Eg = [arg1: string, arg2: number];
 */
type Eg = Parameters<(arg1: string, arg2: number) => void>;
```

Parameters 首先约束参数 T 必须是个函数类型，所以`(...args: any) => any>`替换成`Function`也是可以的。

具体实现就是，判断 T 是否是函数类型，如果是则使用`inter P`让 TypeScript 自己推导出函数的参数类型，并将推导的结果存到类型 P 上，否则就返回`never`。

- `infer`关键词作用是让 TypeScript 自己推导类型，并将推导结果存储在其参数绑定的类型上。比如`infer P` 就是将结果存在类型P上，供使用。
- `infer`关键词只能在`extends`条件类型上使用，不能在其他地方使用。

## ConstructorParameters

`ConstructorParameters<Type>`，从构造函数类型的构造函数参数里构造出一个元组或者数组类型。这将产生一个有着所有参数类型的元组类型（当 Type 不是函数时，结果是`never`类型）。

### 示例

```ts
// type T0 = [message?: string]
type T0 = ConstructorParameters<ErrorConstructor>;

// type T1 = string[]
type T1 = ConstructorParameters<FunctionConstructor>;

// type T2 = [pattern: string | RegExp, flags?: string]
type T2 = ConstructorParameters<RegExpConstructor>;

// type T3 = unknown[]
type T3 = ConstructorParameters<any>;

// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
// Type 'Function' provides no match for the signature 'new (...args: any): any'.
// type T4 = never
type T4 = ConstructorParameters<Function>;
```

### 实现

```ts
type ConstructorParameters<
    T extends abstract new (...args: any) => any
> = T extends abstract new (...args: infer P) => any ? P : never;
```

首先约束参数 T 为拥有构造函数的类。注意这里有个`abstract`修饰符，等下会说明。实现时，判断 T 是满足约束的类时，利用`infer P`自动推导构造函数的参数类型，并最终返回该类型。

**为什么要对 T 约束为 abstract 抽象类呢？**

```ts
/**
 * 定义一个普通类
 */
class MyClass {}

/**
 * 定义一个抽象类
 */
abstract class MyAbstractClass {}

// 可以赋值
const c1: typeof MyClass = MyClass
// 报错，无法将抽象构造函数类型分配给非抽象构造函数类型
const c2: typeof MyClass = MyAbstractClass

// 可以赋值
const c3: typeof MyAbstractClass = MyClass
// 可以赋值
const c4: typeof MyAbstractClass = MyAbstractClass
```

由此看出，如果将类型定义为抽象类（抽象构造函数），则既可以赋值为抽象类，也可以赋值为普通类；而反之则不行。

**直接使用类作为类型，和使用typeof 类作为类型，有什么区别呢？**

```ts
/**
 * 定义一个类
 */
class People {
  name: number;
  age: number;
  constructor() {}
}

// p1可以正常赋值
const p1: People = new People();

// 等号后面的People报错，类型“typeof People”缺少类型“People”中的以下属性: name, age
const p2: People = People;

// p3报错，类型 "People" 中缺少属性 "prototype"，但类型 "typeof People" 中需要该属性
const p3: typeof People = new People();

// p4可以正常赋值
const p4: typeof People = People;
```

结论是这样的：

- 当把类直接作为类型时，该类型约束的是该类型必须是类的实例；即该类型获取的是该类上的实例属性和实例方法（也叫原型方法）；
- 当把`typeof 类`作为类型时，约束的满足该类的类型；即该类型获取的是该类上的静态属性和方法。

## InstanceType

通过获取一个构造函数类型的实例类型，构造一个新的类型。

### 示例

```ts
class C {
  x = 0;
  y = 0;
}

// type T0 = C
type T0 = InstanceType<typeof C>;

// type T1 = any
type T1 = InstanceType<any>;

// type T2 = never
type T2 = InstanceType<never>;

// Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
// type T3 = any
type T3 = InstanceType<string>;

// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
// Type 'Function' provides no match for the signature 'new (...args: any): any'.
// type T4 = any
type T4 = InstanceType<Function>;
```

### 实现

```ts
type InstanceType<
    T extends abstract new (...args: any) => any
> = T extends abstract new (...args: any) => infer R ? R : any;
```

## ReturnType

`ReturnType<Type>`，构造一个与函数类型 Type 的返回类型一致的新类型。

### 示例

```ts
declare function f1(): { a: number; b: string };

// type T0 = string
type T0 = ReturnType<() => string>;

// type T1 = void
type T1 = ReturnType<(s: string) => void>;

// type T2 = unknown
type T2 = ReturnType<<T>() => T>;

// type T3 = number[]
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;

// type T4 = {
//     a: number;
//     b: string;
// }
type T4 = ReturnType<typeof f1>;

// type T5 = any
type T5 = ReturnType<any>;

// type T6 = never
type T6 = ReturnType<never>;

// Type 'string' does not satisfy the constraint '(...args: any) => any'.
// type T7 = any
type T7 = ReturnType<string>;

// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
// Type 'Function' provides no match for the signature '(...args: any): any'.
// type T8 = any
type T8 = ReturnType<Function>;
```

### 实现

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

## TypeScript Compiler 内部实现的类型

::: tip 提示
`Uppercase`、`Lowercase`、`Capitalize`和`Uncapitalize`这几个工具类型内置于编译器里以获得更好的性能，而且无法在 TypeScript 的`.d.ts`里找到。

```ts
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;
```

:::

### Uppercase

Converts each character in the string to the uppercase version.

### Lowercase

Converts each character in the string to the lowercase equivalent.

### Capitalize

Converts the first character in the string to an uppercase equivalent.

### Uncapitalize

Converts the first character in the string to a lowercase equivalent.
