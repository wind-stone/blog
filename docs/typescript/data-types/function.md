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
