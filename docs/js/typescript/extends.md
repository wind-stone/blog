# Extends

## 联合类型

联合类型里某一类型的子类型，也可以说是继承了该联合类型。

```ts
type strOrNum = string | number;

// type num = number
type num = 'hello' extends strOrNum ? number : boolean;
```

若`A | B`是联合类型`T`里的类型，则`T extends U ? X : Y`将分解为`(A extends U ? X : Y) | (B extends U ? X : Y)`。因为这个行为，一个泛型条件类型也称之为`distributed conditional type`。

```ts
type MyType<T> = T extends string ? string : number;
// type MyType1 = string | number
type MyType1 = MyType<'hello' | 'world' | 1 | 2>;
```

上面的示例里，`MyType1`的取值为`string | number`。这是因为，针对`'hello'`和`'world'`，三元表达式返回`string`；针对`1`和`2`，三元表达式返回`number`。因此，得到联合类型`string | string | number | number`，但 TypeScript 会将其压缩为`string | number`。
