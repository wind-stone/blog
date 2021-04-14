# TypeScript 实践

## 数组

### 数组元素类型为对象

```ts
interface Persion {
  name: string
  age: number
}

const arr: Array<Persion> = [];
// 或
// const arr: Persion[] = [];
```

或者

```ts
const arr: { name: string, age: number }[] = [];

arr.push({
    name: '222',
    age: 1
})
```

## 对象

### 给对象动态增加属性

```ts
interface Obj {
  a: string;
}

const obj: Obj = {
  a: "1",
};

obj.b = 2;
```

此时会出现错误提示`Property 'b' does not exist on type 'Obj'`。要想解决这个问题，要使用索引签名。

```ts
interface Obj {
  a: string;
  [index: string]: string | number;
}

const obj: Obj = {
  a: "1",
};

obj.b = 2;
```

## 其他

### 第三方库没有 ts 声明文件

```sh
npm i somePackage --save
```

```ts
import somePackage from 'somePackage';
```

此时会出现错误提示`Cannot find module 'somePackage' or its corresponding type declarations.`

要想解决这个问题，你可以在项目根目录下新建`index.d.ts`，编写如下代码:

```ts
declare module 'somePackage';
// ...
```
