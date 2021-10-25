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

## 元组

元组类型是一个数组类型，它确切地知道该数组包含了多少元素以及元素类型。

### 具名元组

`type Eg = [arg1: string, arg2: number]`这是一个元组，但是和我们常见的元组`type tuple = [string, number]`。

官网未提到该部分文档说明，其实可以把这个作为类似命名元组，或者具名元组的意思去理解。实质上没有什么特殊的作用，比如无法通过这个具名去取值。但是从语义化的角度，个人觉得多了语义化的表达罢了。
