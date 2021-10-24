# 类型操作符

## typeof

获取一个标识符（变量/属性等）的类型，详见[Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)。

## keyof

获取类型所有`key`的名称组成一个联合类型（每个成员都是字面量类型），详见[Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

### keyof any

```ts
// type T = string | number | symbol
type T = keyof any
```

`keyof any`的结果是`string | number | symbol`，原因是任何类型的`key`的类型只能为`string | number | symbol`。

## extends

条件判断，类似于三元运算符。当`extends`前面的条件满足，返回问号后的第一个参数，否则返回第二个参数。

```ts
/**
 * @example
 * type A1 = 1
 */
type A1 = 'x' extends 'x' ? 1 : 2;

/**
 * @example
 * type A2 = 2
 */
type A2 = 'x' | 'y' extends 'x' ? 1 : 2;

/**
 * @example
 * type A3 = 1 | 2
 */
type P<T> = T extends 'x' ? 1 : 2;
type A3 = P<'x' | 'y'>
```

为什么 A2 和 A3 的值不一样？

- 如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型
- 若`extends`前面的类型是泛型，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给`extends`后面的类型（是一个分发的过程）。

总结，就是`extends`前面的参数为联合类型时则会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断。然后将最终的结果组成新的联合类型。

如果不想被分解（即阻止`extends`关键词对于联合类型的分发特性），做法也很简单，可以通过简单的元组类型包裹一下：

```ts
type P<T> = [T] extends ['x'] ? 1 : 2;
/**
 * type A4 = 2;
 */
type A4 = P<'x' | 'y'>
```

## 操作符

- 非空断言运算符`!`
  - 确定变量值一定不为空时使用，比如`m!.id`，这告诉 TypeScript `m`一定不是`null`或`undefined`
  - [Non-null assertion operator - TypeScript 2.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)
- 可选链运算符`?.`
  - 可选链运算符`?.`可以按照运算符之前的属性是否有效，链式读取对象的属性或者使整个对象链返回`undefined`。
  - 可选链运算符还可以用于函数调用，`let result = obj.customMethod?.();`
  - [可选链操作符 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE)
  - [Optional Chaining - TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)
- 空合并运算符`??`
  - `let x = foo ?? bar();`，当`foo`为`null`或`undefined`时，`x`兜底取值为`bar()`。
  - [Nullish Coalescing - TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)
