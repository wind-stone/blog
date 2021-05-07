# 类型系统

## 类型推导

## 类型断言

两种使用方式：

- `value as Type`
- `<Type>value`

## 字面量类型

## 类型守卫

类型守卫（`Type Guard`）。

可用于类型守卫的运算符：

- `switch/case`，当联合类型里的各个类型都存在一个相同名称的字面量类型的属性，且字面量类型各不相同
- `if/else` + `in`，当联合类型里的某个类型存在一个独有的属性
- `if/else` + `typeof`
- `instanceof`，检查是否是联合类型里某个类类型的实例
- `==`、`!=`、`===`、`!==`，用这些操作符与字面量的值比较时
- [自定义守卫](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

### 类型收窄

类型收窄，`Type Narrowing`
