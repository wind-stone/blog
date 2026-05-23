# TypeScript 面试题目

## DeepPartial

定义一个类型 DeepPartial，用于递归地将对象的所有属性变为可选

```ts
types DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
}
```
