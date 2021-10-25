# 函数

## 声明函数类型

### 方式一: type

```ts
type LongHand = {
  (a: number): number;
};

type ShortHand = (a: number) => number;
```

以上两种方式是完全相同的，但是当用函数重载时，只能用第一种方式。

```ts
type LongHandAllowsOverloadDeclarations = {
  (a: number): number;
  (a: string): string;
};
```

### 方式二: interface

```ts
interface justString {
  (foo: string): string;
}

// 接口提供多种调用签名，用于函数重载
interface stringOrNumber {
  (foo: string): string;
  (foo: number): number;
}
```

函数重载的示例:

```ts
interface Overloaded {
  (foo: string): string;
  (foo: number): number;
}

// 实现接口的一个例子：
function stringOrNumber(foo: number): number;
function stringOrNumber(foo: string): string;
function stringOrNumber(foo: any): any {
  if (typeof foo === 'number') {
    return foo * foo;
  } else if (typeof foo === 'string') {
    return `hello ${foo}`;
  }
}

const overloaded: Overloaded = stringOrNumber;

// 使用
const str = overloaded(''); // str 被推断为 'string'
const num = overloaded(123); // num 被推断为 'number'
```

#### 可实例化的函数

```ts
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```

## 函数类型兼容

### 参数兼容

如何判断两个函数是兼容的？

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

要查看`x`是否能赋值给`y`，首先看它们的参数列表。 `x`的每个参数必须能在`y`里找到对应类型的参数。 注意的是参数的名字相同与否无所谓，只看它们的类型。 这里，`x`的每个参数在`y`中都能找到对应的参数，所以允许赋值。

第二个赋值错误，因为`y`有个必需的第二个参数，但是`x`并没有，所以不允许赋值。

你可能会疑惑为什么允许忽略参数，像例子`y = x`中那样。 原因是忽略额外的参数在 JavaScript 里是很常见的。 例如，`Array#forEach`给回调函数传 3 个参数：数组元素，索引和整个数组。 尽管如此，传入一个只使用第一个参数的回调函数也是很有用的：

```ts
let items = [1, 2, 3];

// Don't force these extra arguments
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach((item) => console.log(item));
```

### 返回值兼容

下面来看看如何处理返回值类型，创建两个仅是返回值类型不同的函数：

```ts
let x = () => ({name: 'Alice'});
let y = () => ({name: 'Alice', location: 'Seattle'});

x = y; // OK
y = x; // Error, because x() lacks a location property
```

类型系统强制源函数的返回值类型必须是目标函数返回值类型的子类型。

## 函数类型的双向推导

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
