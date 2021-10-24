# 枚举

枚举即是值，也是类型。

## 编译后为对象

```ts
// define an enum
enum Speed {
    // 枚举的 value 为数值时，每一项的值会隐式地基于上一项累加。若第一个成员未设置值，则默认为 0
    SLOW,
    MEDIUM,
    FAST
}

// log `Speed` enum
console.log( 'Speed =>', Speed );
```

当枚举类型作为值使用时，会被编译到产出文件里，且枚举会被编译为 JavaScript 对象。

```js
// define an enum
var Speed;
(function (Speed) {
    Speed[Speed["SLOW"] = 0] = "SLOW";
    Speed[Speed["MEDIUM"] = 1] = "MEDIUM";
    Speed[Speed["FAST"] = 2] = "FAST";
})(Speed || (Speed = {}));
console.log(Speed);
```

```js
// Speed 的打印结果
{
    0: "SLOW"
    1: "MEDIUM"
    2: "FAST"
    FAST: 2
    MEDIUM: 1
    SLOW: 0
}
```

需要注意的是，当枚举的每一项的`value`为数值时，编译出的 JavaScript 对象会存在两对`key/value`的映射，另一对是原先`key/value`的逆向映射，这是为了方便我们通过枚举值来获取枚举成员名称。而当枚举成员的`value`为`string`时，则不存在逆向映射。

## 常量枚举

常量枚举，`Constant Enums`。

上一步中我们发现枚举最终会编译为 JavaScript 对象。

```ts
// enum-non-const.ts
// define a non-constant enum
enum Speed {
    SLOW = "slow",
    MEDIUM = "medium",
    FAST = "fast"
}

// define a simple object
let racer = {
    name: 'Ross Geller',
    speed: Speed.MEDIUM, // enum value
};

// log `racer` object
console.log( 'racer =>', racer );
```

可以发现，编译前`racer.speed`的值为`Speed.MEDIUM`表达式，编译后的`racer.speed`的值依然是`Speed.MEDIUM`表达式。

```js
// enum-non-const.js
// define a non-constant enum
var Speed;
(function (Speed) {
    Speed["SLOW"] = "slow";
    Speed["MEDIUM"] = "medium";
    Speed["FAST"] = "fast";
})(Speed || (Speed = {}));
// define a simple object
var racer = {
    name: 'Ross Geller',
    speed: Speed.MEDIUM
};
```

若是不想让枚举编译到产出里而是让枚举值内联到产出里，可以在枚举声明前添加`const`关键字。

```ts
// enum-const.ts
// define a constant enum
const enum Speed {
    SLOW = "slow",
    MEDIUM = "medium",
    FAST = "fast"
}

// define a simple object
let racer = {
    name: 'Ross Geller',
    speed: Speed.MEDIUM
};

// log `racer` object
console.log( 'racer =>', racer );

// Error: 'const' enums can only be used in property or index access expressions or the right hand side of an import declaration or export assignment or type query.
// console.log( "Speed => ", Speed );
```

此时，由于我们在枚举声明之前添加了`const`关键字，编译后`racer.speed`获得了字面量值`medium`，而不是`Speed.MEDIUM`，而且产出里也没有`Speed`对象。

```js
// enum-const.js
// define a simple object
var racer = {
    name: 'Ross Geller',
    speed: "medium" /* MEDIUM */
};
// log `racer` object
console.log('racer =>', racer);
```

## 计算成员

绝大多数编程语言里，枚举成员的值必须是编译时的常量值，这意味着所有的值都必须在编译时定义。

但是 TypeScript 允许表达式作为枚举成员的值，表达式将在运行时进行计算。

```ts
// define an enum
enum Speed {
    SLOW = 1, // constant member
    MEDIUM, // constant member
    FAST = parseInt( "3" ), // computed member
}
```

TypeScript 会基于值的初始化来将枚举成员分为两大类。若值在编译阶段可用，则称之为常量成员（`constant members`）；若值需要再运行时计算得出，则称之为计算成员（`computed members`）。

::: warning 注意
常量枚举不能存在计算成员，因为常量枚举的值必须在编译阶段就要确定。（常量枚举不会编译为运行时的对象）
:::

TypeScript 允许枚举成员从同一个枚举或其他枚举里引用值。你可以使用`+`/`-`/`~`等一元操作符，或者`+`/`-`/`*`/`/`/`%`/`<<`/`>>`/`>>>`/`&`/`|`/`^`等二元操作符，来构建值的初始化表达式，不过表达式只能用常量值或同一枚举/其他枚举的常量枚举成员来构建。

```ts
// define an enum
enum Speed {
    SLOW = 30,
    MEDIUM = SLOW + 30,
    FAST = MEDIUM + 40
}
```
