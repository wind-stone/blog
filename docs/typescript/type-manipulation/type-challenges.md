# TypeScript 类型体操

- [github - type-challenges](https://github.com/type-challenges/type-challenges)
- 具体答案可参考: [TypeScript 类型体操姿势合集<通关总结>--刷完](https://juejin.cn/post/6999280101556748295)

## 简单

### 实现 Pick

[4・实现 Pick](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.zh-CN.md)

```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```

### 实现 Readonly

[7・实现 Readonly](https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.zh-CN.md)

```ts
type MyReadonly<T> = {
  +readonly [key in keyof T]: T[key]
}
```

### 元组转换为对象

[11・元组转换为对象](https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.zh-CN.md)

前提知识：[const
assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

```ts
type TupleToObject<T extends readonly any[]> = {
  [key in T[number]]: key
}
```

### 第一个元素

[14・第一个元素](https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.zh-CN.md)

```ts
type First<T extends any[]> = T extends [] ? never : T[0]

// 这种方式也行，但是上面的方法更好
type First<T extends any[]> = T[0] extends T[number] ? T[0] : never
```

知识点：

```ts
type EmptyArray = []
type FirstElement = EmptyArray[0] // Tuple type '[]' of length '0' has no element at index '0'.
```

### Exclude

[43・Exclude](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.zh-CN.md)

```ts
type MyExclude<T, U> = T extends U ? never : T

type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

知识点：[Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)，即在`X extends Y`的条件类型语句中，若`X`是联合类型，则会将联合类型的每一个成员代入进行独立计算，再将结果组合成联合类型。

### Awaited

[189・Awaited](https://github.com/type-challenges/type-challenges/blob/main/questions/00189-easy-awaited/README.zh-CN.md)

```ts
interface MyPromiseLike<T> { then: (onfulfilled: (arg: T) => any) => any }

type MyAwaited<T extends MyPromiseLike<any>> = T extends MyPromiseLike<infer R>
  ? R extends MyPromiseLike<any>
    ? MyAwaited<R>
    : R
  : T;
```

知识点：[PromiseLike](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.promiselike.html)

需要确保：

- 传给`MyAwaited`的类型是`PromiseLike`的子类型
- 递归处理`MyAwaited<Promise<Promise<string | number>>>`的情况

### If

[268・If](https://github.com/type-challenges/type-challenges/blob/main/questions/00268-easy-if/README.zh-CN.md)

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
```

### Concat

[533・Concat](https://github.com/type-challenges/type-challenges/blob/main/questions/00533-easy-concat/README.zh-CN.md)

```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```

知识点：[Tuple](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)类型可以扩展运算符（`...`）来创建新的类型。

### Includes

[898・Includes](https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/README.zh-CN.md)

```ts
type IEqual<T,U> =
  (<X>()=>X extends T ? 1 : 2) extends
  (<X>()=>X extends U ? 1 : 2) ? true :false

type Includes<T extends readonly any[], U> = T extends [infer V, ...infer R]
  ? IEqual<V, U> extends true
    ? true
    : Includes<R, U>
  : false;
```

知识点：

- 如何判断两个类型相等？[Feature request - type level equal operator](https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650)
- 通过 infer + IEqual 递归调用，确定 U 与 T 里的某个类型相等。

### Push/Unshift

- [3057・Push](https://github.com/type-challenges/type-challenges/blob/main/questions/03057-easy-push/README.zh-CN.md)
- [3060・Unshift](https://github.com/type-challenges/type-challenges/blob/main/questions/03060-easy-unshift/README.md)

```ts
type Push<T extends any[], U> = [...T, U]
type Unshift<T extends any[], U> = [U, ...T];
```

知识点：同 Concat

### Parameters

[3312・Parameters](https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.md)

```ts
const foo = (arg1: string, arg2: number): void => {};

// 实现
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer Args extends any[]) => any
  ? Args
  : never

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

## 中等

### Get Return Type

[2・Get Return Type](https://github.com/type-challenges/type-challenges/blob/main/questions/00002-medium-return-type/README.md)

```ts
const fn = (v: boolean) => {
    if (v)
        return 1;
    else
        return 2;
};

// 实现
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type a = MyReturnType<typeof fn> // should be "1 | 2"
```

### Omit

[3・Omit](https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md)

```ts
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

// 实现
type MyOmit<T, K extends keyof T> = {
    [key in Exclude<keyof T, K>]: T[key]
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
    completed: false,
};
```
