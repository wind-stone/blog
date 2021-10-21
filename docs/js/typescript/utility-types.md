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

## Uppercase

Converts each character in the string to the uppercase version.

::: tip 提示
`Uppercase`、`Lowercase`、`Capitalize`和`Uncapitalize`这几个工具类型内置于编译器里以获得更好的性能，而且无法在 TypeScript 的`.d.ts`里找到。
:::

## Lowercase

Converts each character in the string to the lowercase equivalent.

## Capitalize

Converts the first character in the string to an uppercase equivalent.

## Uncapitalize

Converts the first character in the string to a lowercase equivalent.
