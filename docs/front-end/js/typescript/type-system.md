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
