# stylus 重点

[[toc]]

## 选择器

- 不仅可以引用父选择器，还可以通过`^[N]`引用整个选择器链上的任意选择器。
- `~/`相当于`^[0]`
- 相对引用`../`
- 根应用`/`
- 内置函数`selector()`获取当前编译的选择器
- 内置函数`selectors()`获取在当前层级的嵌套选择器列表，以逗号分隔

## 变量

- 变量的值里可以包含其他变量
- 通常在标志符前加个`$`字符，来表示变量

## 插值

插值可用于属性名、选择器等。

## 运算符

### 常规支持的运算符

```styl
 .
 []
 ! ~ + -
 is defined
 ** * / %
 + -
 ... ..
 <= >= < >
 in
 == is != is not isnt
 is a
 && and || or
 ?:
 = := ?= += -= *= /= %=
 not
 if unless
```

### %

```styl
div
  padding-bottom "calc(%s + env(safe-area-inset-bottom))" % 15px
```

运算符`%`内部是将参数传递给`s()`内置函数的，也就是说，其内部使用`s()`实现的。

## mixin

- `mixin`和函数以相同的方式定义，但是应用的地方不一样。
- `mixin`可以像属性一样调用。

```styl
stripe(even = #fff, odd = #eee)
  tr
    background-color odd
  tr.even
  tr:nth-child(even)
    background-color even


<!-- 调用 -->
table
  stripe #fff #000

<!-- 或者 -->
table
  stripe(#303030, #494848)
```

- `mixin`里可以包含`mixin`

## 函数

函数和`mixin`定义相同，但是函数会返回一个值。
