---
sidebarDepth: 0
---

# 类型系统

[[toc]]

## 类型分类

### 基本类型

基本类型（`primitive type`）: `A primitive type is an individual type that can not be broken down further`。

TypeScript 内置的基本数据类型有:

- `boolean`
- `number`
- `string`
- `symbol`
- `undefined`
- `null`
- `void`，可将`undefined`赋值给`void`类型的变量
- `never`
- `object`，该类型的值包含对象、数组、函数等等
- `any`，可以包含任何值
- `unknown`

当设置`strictNullChecks`为`true`时，会告知 TypeScript 编译器不允许将`null`和`undefined`赋值给变量。

- 若变量已经声明为给定类型（不包含`null`或`undefined`），则不允许将变量重新赋值为`null`或`undefined`
- 若变量未设置初始值，则不允许使用
- 不能将`null`赋值给`undefined`类型的变量，或将`undefined`赋值给`null`类型的变量

### 抽象类型

抽象类型（`abstract type`），`An abstract type is a type that is composed of primitive types`。

- `Array`
- `Tuple`，比如: `let student: [ string, number, boolean ] = [ 'Ross Geller', 27, true ]`

## 函数

### 函数类型的双向推导

```ts
// declare a function (using function expression)
const sum = ( a: number, b: number ): number => a + b;
```

我们定义`sum`是个函数表达式，该函数表达式接受两个`number`类型的参数且返回类型也是`number`。尽管我们没有显式地声明变量`sum`的类型，但是 TypeScript 可以根据赋值给`sum`的函数表达式推导出来`sum`的类型，即`(a: number, b: number) => number`。

```ts
// declare a variable of type function
let sum: ( a: number, b: number ) => number;

// assign a (function) value to `sum`
sum = ( a: number, b: number ): number => a + b; // redundant

sum = ( a, b ) => a + b;
```

我们首先声明了变量为函数类型，该函数类型接受两个`number`类型的参数且返回也是`number`类型。

之后，当我们将赋值函数表达式赋值给变量时，可以省略函数表达式的参数类型、返回类型，因为 TypeScript 可以根据变量`sum`的类型，自动推导出来该函数表达式的类型。
