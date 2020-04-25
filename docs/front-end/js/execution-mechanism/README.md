# JavaScript 执行机制

PS:

- 该文章几乎所有的内容来自于[极客时间-浏览器工作原理与实践](https://time.geekbang.org/column/intro/216)
- 该文章里说的 JavaScript 执行机制指的是浏览器里的 JavaScript 执行机制。

JavaScript 会先编译再执行，经过编译后，会生成两部分内容：执行上下文（Execution context）和可执行代码。

- 函数只有在被调用的时候，才会被编译。

## 动态语言 & 弱类型语言

声明变量时定义其数据类型的语言称为静态语言；与之相反，在运行过程中需要检查数据类型的语言称为动态语言。

支持隐式类型转换的语言称为弱类型语言；不支持隐式类型转换的语言称为强类型语言。

JavaScript 是一种弱类型的、动态的语言。

- 弱类型，意味着你不需要告诉 JavaScript 引擎这个或那个变量是什么数据类型，JavaScript 引擎在运行代码的时候自己会计算出来。
- 动态，意味着你可以使用同一个变量保存不同类型的数据。

![语言类型图](./img/language-type.png)

## 变量提升

变量提升（`hoisting`），是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。变量被提升后，会给变量设置默认值`undefined`。

在变量提升过程中，

- 若声明了两个同名的函数，则最终生效的是最后声明的函数。
- 若声明的变量和函数同名，那么在编译阶段，变量的声明会被忽略。

### 为什么要设计变量提升

ES6 之前是不支持块级作用域的，因为当初设计这门语言的时候，并没有想到 JavaScript 会火起来，所以只是按照最简单的方式来设计。没有了块级作用域，再把作用域内部的变量统一提升无疑是最快速、最简单的设计，不过这也直接导致了函数中的变量无论是在哪里声明的，在编译阶段都会被提取到执行上下文的变量环境中，所以这些变量在整个函数体内部的任何地方都是能被访问的，这也就是 JavaScript 中的变量提升。变量提升所带来的问题

## 执行上下文

当一段代码被执行时，JavaScript 引擎先会对其进行编译，并创建执行上下文。一般情况下，有这么三种情况会创建执行上下文：

- 当 JavaScript 执行全局代码的时候，会编译全局代码并创建全局执行上下文，而且在整个页面的生存周期内，全局执行上下文只有一份。
- 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般情况下，函数执行结束之后，创建的函数执行上下文会被销毁。
- 当使用`eval`函数的时候，`eval`的代码也会被编译，并创建执行上下文。

执行上下文里包含的内容有：

- 变量环境：主要维护编译阶段通过`var`声明的变量和函数声明
- 词法环境：主要维护执行阶段块级作用域产生的变量和环境

### 调用栈（执行上下文栈）

### 变量环境

### 词法环境

### 作用域

作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。

在 ES6 之前，ES 的作用域只有两种：全局作用域和函数作用域。

- **全局作用域**中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。
- **函数作用域**就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。

ES6 开始，增加了**块级作用域**。

#### 作用域链

在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为`outer`。而`outer`这个执行上下文里也会指向它自己的`outer`执行上下文，如此便形成了作用域链。

#### 词法作用域

在 JavaScript 执行过程中，其作用域链是由词法作用域决定的。

**词法作用域**就是指作用域是由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。

##### 动态作用域 vs 静态作用域

PS: JavaScript 采用的是词法作用域，即静态作用域。

动态作用域的实现是基于栈结构，局部变量和函数参数都保存在栈里。因此，变量的具体值是由运行时的当前的栈顶的执行上下文决定的。

而静态作用域是指变量在创建的时候就决定了它的值，也就是说，源代码的位置决定了变量的值。

可通过以下示例帮助理解。

```js
var myVar = 100;

function foo() {
    console.log(myVar);
}

foo(); // 静态作用域：100；动态作用域：100

(function () {
    var myVar = 50;
    foo(); // 静态作用域：100；动态作用域：50
})();
```

动态作用域经常带来不确定性，它不能确定变量的值到底来自哪个作用域的。

#### 闭包

闭包是指那些能够访问自由变量（既不是本地定义也不可作为参数的那些变量）的函数。换句话说，这些函数可以“记住”它被创建时的环境。定义在封闭函数中，即使在该封闭函数执行完之后仍然能被访问到。

##### 原理

以上关于执行上下文、词法环境、作用域链的知识，是理解闭包所有的全部知识点：

每个函数都有一个包含词法环境的执行上下文，它的词法坏境确定了函数内的变量赋值一级对外部环境的引用。对外部环境的引用使得所有的内部函数能访问到外部作用域的所有变量，无论这些内部函数是在它创建时的作用域内调用还是作用域外调用。

看上去函数“记住”了外部环境，但事实上是这个函数有个指向外部环境的引用。

为了实现闭包，我们不能用动态作用域的动态堆栈来存储变量。如果是这样，当函数返回时，变量就必须出栈，而不再存在，这与最初闭包的定义是矛盾的。事实上，外部环境的闭包数据被存在了“堆” 中，这样才使得即使函数返回之后内部的变量仍然一直存在（即使它的执行上下文已经出栈）。

```js
function mysteriousCalculator(a, b) {
    var mysteriousVariable = 3;
    return {
        add: function () {
            var result = a + b + mysteriousVariable;
            return toFixedTwoPlaces(result);
        },
        substract: function () {
            var result = a - b -mysteriousVariable;
            return toFixedTwoPlaces(result);
        }
    };
}

function toFixedTwoPlaces(value) {
    return value.toFixed(2);
}

var myCalculator = mysteriousCalculator(10, 2);
myCalculator.add(); // 15
myCalculator.substract(); // 5
```

基于我们对运行机制的理解，上述例子的环境定义可以抽象为如下（伪代码）：

```js
GlobalEnviroment = {
    EnvironmnetRecord: {
        // 内置标识符
        Array: '<func>',
        Object: '<func>',
        // 等等...

        // 自定义标识符
        mysteriousCalculator: '<func>',
        toFixedTwoPlaces: '<func>'
    },
    outer: null
};

mysteriousCalculatorEnvironment = {
    EnvironmnetRecord: {
        a: 10,
        b: 2,
        mysteriousVariable: 3
    },
    outer: GlobalEnviroment
};

addEnvironment = {
    EnvironmnetRecord: {
        result: 15
    },
    outer: mysteriousCalculatorEnvironment
};

substractEnvironment = {
    EnvironmnetRecord: {
        result: 5
    },
    outer: mysteriousCalculatorEnvironment
};
```

##### 优缺点

优点

- 保护内部变量，加强封装性
- 减少不必要的全局变量

缺点

- 闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存
- 过度使用闭包可能会导致内存占用过多。解决方法是，在退出函数之前，将不使用的局部变量全部删除。
- 闭包会在父函数外部，改变父函数内部变量的值

##### 理论角度/实践角度讨论

- 从理论角度来说，所有的函数都是闭包：因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
- 从实践角度，以下函数才算是闭包：
  - 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
  - 在代码中引用了自由变量

### this

`this`是和执行上下文绑定的，也就是说每个执行上下文中都有一个`this`。

- 全局执行上下文中的`this`指向`window`（浏览器里）
- 函数执行上下文中的`this`
  - （浏览器里）默认情况下调用函数时，函数内的`this`指向全局变量`window`；严格模式下，`this`为`undefined`
  - 调用函数的`call`/`apply`/`bind`方法可改变该函数的`this`指向，其将指向调用函数`call`/`apply`/`bind`方法时传入的第一个参数
  - 使用对象来调用对象上的方法时，该方法的`this`指向该对象
  - 通过`new`操作符调用构造函数时，构造函数内的`this`指向新创建的对象

```js
function foo() {
    var myName = "极客时间"
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName:function(){
            console.log(test1)
            return myName
        },
        setName:function(newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName("极客邦")
bar.getName()
console.log(bar.getName())
```

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了（且其执行上下文也已出栈了），但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。比如外部函数是`foo`，那么这些变量的集合（这里是`test1`和`myName`）就称为`foo`函数的闭包。

## 垃圾回收

- 标记清除（主流）
- 引用计数

JavaScript 的垃圾回收，指的是回收堆空间里的引用类型，而存储在栈里（调用栈的执行上下文）的原始类型，会在执行上下文销毁时直接回收的。

### 标记清除（Mark-and-Sweep）（主流）

> The most popular form of garbage collection for JavaScript is called mark-and-sweep. When a variable comes into context, such as when a variable is declared inside a function, it is flagged as being in context. Variables that are in context, logically, should never have their memory freed, because they may be used as long as execution continues in that context. When a variable goes out of context, it is also fl agged as being out of context. Variables can be flagged in any number of ways. There may be a specific bit that is flipped when a variable is in context, or there may be an “in-context” variable list and an “out-of-context” variable list between which variables are moved. The implementation of the flagging is unimportant; it's really the theory that is key.
>
> When the garbage collector runs, it marks all variables stored in memory (once again, in any number of ways). It then clears its mark off of variables that are in context and variables that are referenced by in-context variables. The variables that are marked after that are considered ready for deletion, because they can’t be reached by any in-context variables. The garbage collector then does a memory sweep, destroying each of the marked values and reclaiming the memory associated with them. As of 2008, Internet Explorer, Firefox, Opera, Chrome, and Safari all use mark-and-sweep garbage collection (or variations thereof) in their JavaScript implementations, though the timing of garbage collection differs.
>
> -- JavaScript 高级程序设计 第三版 P78 垃圾收集

### 引用计数（旧版 IE 4-6）

引用计数可能会导致内存泄露，比如几个对象间的循环引用，但是这几个对象都没有被执行上下文里的任何变量引用，理论上这时候这几个循环引用的对象都是可以回收的，但是用引用计数的话，这几个对象还被引用着导致不能收回。所以，引用计数可能会导致内存泄露。

### 造成内存泄漏的原因

- 循环引用（ IE9 之前的浏览器里 BOM 和 DOM 中的对象是以 COM 对象的形式出现的，而 COM 对象的垃圾收集机制采用的就是引用计数策略，相关知识参见 JavaScript 高级程序设计 第三版 P78 垃圾收集）
- 内部函数引用（闭包）
- 页面交叉泄漏
- 貌似泄漏

## V8 执行 JavaScript 代码的过程

V8 执行 JavaScript 代码的过程:

- 将 JavaScript 源码转换为 AST（抽象语法树）和执行上下文
  - 先生成 AST
    - 词法分析
    - 语法分析
  - 基于 AST，生成执行上下文
- 解释器（Ignition）基于 AST 生成字节码
- 解释器解释执行字节码 & 编译器（TurboFan）编译热点代码
  - 针对常规的字节码，解释器逐条解释执行（其实最终也要编译成机器码执行）
  - 针对活跃的字节码（即重复执行多次的热点代码），编译器会将该段字节码编译为更加高效的机器码，下次就不需要再将该段字节码编译为机器码了

字节码占用内存小，但执行速度慢（因为字节码最终还是要编译成机器码才能执行）；机器码占用内存大，但执行速度快。

若是将 AST 直接全部转换成机器码，则内存占用将过大。因此先将 AST 转换为占用内存更小的字节码，解释执行字节码时，再将字节码逐条编译成机器码执行。且针对活跃的字节码，编译器会将其编译成机器码，加快执行效率（当然也会占用更多内存）。

![v8 的解释器和编译器](./img/v8-ignition-turboFan.png)

因此 V8 是综合使用了编译器和解释器来权衡内存占用和执行效率。

- 为什么不在打包时就将 JavaScript 源码转换成字节码，浏览器下载字节码文件后解释执行字节码呢？

转换后的字节码比源码体积大很多，下载字节码文件会增加加载时间，得不偿失。

- 既然字节码最终都会编译成机器码，为什么还要先转换成字节码呢？

个人理解：在逐条解释执行字节码时，仅是针对单条字节码编译成机器码，执行后之后就释放内存，再将下一条字节码编译成机器码执行，因此可以重复使用同一块内存空间。

## 疑问

### 块级作用域里声明函数

```js
debugger;
(function(){
    console.log('g:', g);
    if(true){
        console.log('hello world');
        function g(){ return true; }
    }
})();
```

执行以上代码会发现，`g`打印出来的值是`undefined`。这是为什么呢？

ECMAScript 里规定函数不能在块级作用域中声明。也就是说，下面这段代码执行会报错，但是各大浏览器都没有遵守这个标准。

```js
function foo(){
    if(true){
        console.log('hello world');
        function g(){ return true; }
    }
}
```

接下来到了 ES6 了，ES6 明确支持块级作用域，ES6 规定块级作用域内部声明的函数，和通过`let`声明变量的行为类似。

规定的是理想的，但是还要照顾实现，要是完全按照`let`的方式来修订，会影响到以前老的代码，所以为了向下兼容，各大浏览器基本是按照下面的方式来实现的：

```js
function foo(){
    if(true){
        console.log('hello world');
        var g = function(){return true;}
    }
}
```

这就解释了`g`打印出来的值为什么是`undefined`，不过还是不建议在块级作用域中定义函数，很多时候，简单的才是最好的。
