# 数组

## 数组类型声明

### 数组项的类型为对象

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

### 数组项包含多种类型

```ts
const zoo: (string | boolean)[] = [true, '222']
```

### 获取数组全部元素的类型

```ts
const array = ['hello', 'world'] as const

// type a = "hello" | "world"
type a = typeof array[number]
```
