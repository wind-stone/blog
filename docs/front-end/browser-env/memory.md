---
sidebarDepth: 0
---

# 内存

[[toc]]

## 执行上下文（Execution Context）

执行上下文是 ECMAScript 标准中定义的抽象概念，用来记录代码运行的环境，可以是代码最开始执行的全局上下文，也可以是执行进入某个函数体内的上下文。

需要注意的是，程序自始至终只能进入一个执行上下文。通常，浏览器用“栈”来维护执行上下文。“栈”遵循“后进先出”的原则。当前起作用的执行上下文位于栈顶，当它内部的代码执行完毕之后出栈，然后将下一个元素作为当前的上下文。

ECMAScript 中已经做出规定，每个执行上下文都有用来追踪执行过程各种状态的记录器。包括：
- 代码执行状态（Code evaluation state）：在当前执行上下文中用来记录代码执行、暂停、重新执行的状态
- 函数（Function）：当前上下文正在执行的函数体（如果当前上下文是脚本或者模块，函数则为 null）
- 范畴（Realm）：内部对象集合，全局运行环境极其作用域下的所有代码，其他相关的状态、资源
- 词法环境（Lexical Environmnet）：用来解决当前上下文中的标识符引用问题
- 变量环境（Variable Environment）：包含环境记录（Environment Record）的词法环境，而环境记录是由变量声明所产生的


## 词法环境（Lexical Environmnet）

ECMAScript 6 中明确定义：词法环境是用来定义标识符和具体变量之间的关系以及基于词法嵌套结构的函数，它包括环境记录和指向外部词法环境的引用（有可能指向 null）。通常词法环境跟一些具体语法结构有关，比如

- 函数声明（Function Declaration）
- 块语句声明（Block Statement）
- Try/Catch 语句，

这些代码在执行的时候都会生成一个新的词法环境。

具体解读如下：

- 用来定义标识符的值：词法环境的目的就是管理代码中的数据。也就是说，它给标识符赋值，让标识符变得有意义。词法环境通过环境记录将标识符和具体的值联系在一起
- 词法环境包含环境记录：环境记录完美地记录了词法环境中所有标识符和具体值之间的联系，并且每个词法环境都有自己的环境记录
- 词法嵌套结构：内部环境引用包含它的外部环境，外部环境还可以有自己的外部环境。因此，一个环境可以作为多个内部环境的外部环境。全局环境是唯一一个没有外部环境的环境。

用伪代码抽象表示为：

```
LexicalEnviroment = {
    EnvironmnetRecord: {
        // 标识符的赋值操作
    },

    // 外部环境的引用
    outer: <>
}
```

总而言之，每个执行上下文都对应一个词法环境。这个词法环境中记录着变量和它对应的值，还有指向外部环境的引用。它可以是全局环境，模块环境（包括模块之间的引用关系），或函数环境（因函数调用而创建的环境）。


## 作用域链

基于上述词法环境的定义，我们知道一个环境可以访问它的外部环境，它的外部环境又可以继续访问自己的外部环境，以此类推。每个环境能访问到的标识符集合，我们称之为“作用域”。我们将作用域一层一层嵌套，形成了“作用域链”。

这个作用域链，或者说函数的环境链，在函数创建的时候就保存起来了，也就是说，它是由源代码的位置静态定义的。（这就是我们所熟悉的词法作用域 Lexical Scope）


### 给作用于链顶端添加活动对象的方法
- 新建闭包
- catch
- with


### 变量的寻找顺序


### 函数在定义它的作用域中执行，而不是在调用它的作用域里执行

示例代码：
```
function fn () {
    function innerFn() {
        alert(name);
    };
    var name = "inner";
    return innerFn; 
}
var name = "out";
var outerFn = fn();
outerFn();   //  "inner"
```
    
当定义一个函数时，它实际上保存一个作用域链。当调用这个函数时，它创建一个新的对象来存储它的局部变量，并将这个对象添加至保存的作用域链上，同时创建一个新的更长的表示函数调用作用域的“链”。--<JavaScript 权威指南（第 6 版）> P59


### 动态作用域 vs 静态作用域

动态作用域的实现是基于栈结构，局部变量和函数参数都保存在栈里。因此，变量的具体值是由运行时的当前的栈顶的执行上下文决定的。

而静态作用域是指变量在创建的时候就决定了它的值，也就是说，源代码的位置决定了变量的值。

可通过以下示例帮助理解。

```
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


# 闭包

闭包是指那些能够访问自由变量（既不是本地定义也不可作为参数的那些变量）的函数。换句话说，这些函数可以“记住”它被创建时的环境。定义在封闭函数中，即使在该封闭函数执行完之后仍然能被访问到。

## 原理

以上关于执行上下文、词法环境、作用域链的知识，是理解闭包所有的全部知识点：

每个函数都有一个包含词法环境的执行上下文，它的词法坏境确定了函数内的变量赋值一级对外部环境的引用。对外部环境的引用使得所有的内部函数能访问到外部作用域的所有变量，无论这些内部函数是在它创建时的作用域内调用还是作用域外调用。

看上去函数“记住”了外部环境，但事实上是这个函数有个指向外部环境的引用。

为了实现闭包，我们不能用动态作用域的动态堆栈来存储变量。如果是这样，当函数返回时，变量就必须出栈，而不再存在，这与最初闭包的定义是矛盾的。事实上，外部环境的闭包数据被存在了“堆” 中，这样才使得即使函数返回之后内部的变量仍然一直存在（即使它的执行上下文已经出栈）。

```
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

```
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


## 优缺点
### 优点
- 保护内部变量，加强封装性
- 减少不必要的全局变量

### 缺点
- 闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存
- 过度使用闭包可能会导致内存占用过多。
    - 解决方法是，在退出函数之前，将不使用的局部变量全部删除。
- 闭包会在父函数外部，改变父函数内部变量的值

## 理论角度/实践角度讨论
- 从理论角度来说，所有的函数都是闭包：因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
- 从实践角度，以下函数才算是闭包：
即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
在代码中引用了自由变量

## 考查代码能力
- 实现列表 ul 里有10个里列表项 li，点击出 0~10
    1. 在各 li 上绑定事件，使用 立即执行函数表达式 锁定 i
    2. 在各 li 上绑定事件，使用 li 的属性绑定 i（li.index = i）
    3. 在各 li 上绑定事件，使用 let 声明变量 i
    4. 事件委托，通过递归记录 li 的 previousSibling 的数目，确定 li 的 index 值
    5. 事件委托，循环判断所有 li 是否与当前 target 相等，记录 li 的 index 值

```
<ul id=”test”>
    <li>这是第一条</li>
    <li>这是第二条</li>
    ...
    <li>这是第十条</li>
</ul>
```




# 垃圾回收机制
- 标记清除（主流）
- 引用计数


## 标记清除（Mark-and-Sweep）（主流）
The most popular form of garbage collection for JavaScript is called mark-and-sweep. When a variable comes into context, such as when a variable is declared inside a function, it is flagged as being in context. Variables that are in context, logically, should never have their memory freed, because they may be used as long as execution continues in that context. When a variable goes out of context, it is also fl agged as being out of context. Variables can be flagged in any number of ways. There may be a specific bit that is flipped when a variable is in context, or there may be an “in-context” variable list and an “out-of-context” variable list between which variables are moved. The implementation of the flagging is unimportant; it's really the theory that is key.

When the garbage collector runs, it marks all variables stored in memory (once again, in any number of ways). It then clears its mark off of variables that are in context and variables that are referenced by in-context variables. The variables that are marked after that are considered ready for deletion, because they can’t be reached by any in-context variables. The garbage collector then does a memory sweep, destroying each of the marked values and reclaiming the memory associated with them. As of 2008, Internet Explorer, Firefox, Opera, Chrome, and Safari all use mark-and-sweep garbage collection (or variations thereof) in their JavaScript implementations, though the timing of garbage collection differs.


## 引用计数（旧版 IE 4-6）


## 造成内存泄漏的原因
- 循环引用（ IE9 之前的浏览器里 BOM 和 DOM 中的对象是以 COM 对象的形式出现的，而 COM 对象的垃圾收集机制采用的就是引用计数策略，相关知识参见 JavaScript 高级程序设计 第三版 P78 垃圾收集）
- 内部函数引用（闭包）
- 页面交叉泄漏
- 貌似泄漏
