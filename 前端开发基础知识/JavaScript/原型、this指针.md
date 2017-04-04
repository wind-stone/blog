# 原型

## 关于 instanceof
```
obj  instanceof  Fn;
```
> 实际上 instanceof 运算符并不会检查 obj 是否是由 Fn() 构造函数初始化而来，而会检查 obj 是否继承自 Fn.prototype 。
-- 《JavaScript 权威指南 第3版》P205

```
<script type="text/javascript">
    function FirstSon() {
    }
    function SecondSon() {
    }
    function Father () {
    }
    var father = new Father();
    FirstSon.prototype = father;
    SecondSon.prototype = father;
    var firstSon = new FirstSon();
    alert(firstSon instanceof SecondSon);  //  true
</script>
```

### Object.getPrototypeOf() 和 Function.prototype 
构造函数 fn 的原型，即构造函数 fn 的 protoype 属--fn.prototype，仅当函数 fn 作为构造函数时，fn.prototype 才有存在的意思，fn.prototype 存在默认值，但可以被改写

每个对象都会有个内置的__proto__属性（非标准），ES5 提供了 Object.getPrototypeOf() 方法来获取对象上的 __proto__属性，该属性指向产生该对象的构造函数的 prototype 属性，比如 var obj = new Object(), 这里 Object.getPrototypeOf(obj) 的值即为 Object.prototype

```
function Super() {}
var superInstance = new Super();
var Sub = new Function();
Sub.prototype = superInstance;
Object.getPrototypeOf(superInstance) === Super.prototype;  // true
Object.getPrototypeOf(Sub) === Function.prototype;             // true
Sub.prototype === superInstance;                           // true
Sub.prototype === Object.getPrototypeOf(Sub);              // false
```

## 原型继承
待补充..




# this 指针

## 函数有哪几种调用方式可以导致 this 不同？
- 作为普通函数调用
- 作为方法调用
- 作为构造函数调用
- 作为 apply、call 调用


## new fn() 的过程
使用 new 操作符调用构造函数创建新对象的过程
- 创建一个新对象
- 新对象的 __proto__指向 fn.prototype
- 将构造函数的作用域赋给新对象（因此this 就指向了这个新对象）
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新对象（如果fn执行后不返回，则默认返回新对象；如果返回了其他对象，则返回值为其他对象）


## apply 和 call 方法

### apply 与 call 的区别
apply 和 call 的第1个参数都是将要绑定的 this 对象，不同的是：
- apply 第2个是数组，数组里的每一项将作为函数的参数
- call 第2~第n个参数，依次作为函数的第1~第n-1个参数


### 常用示例
- 如何将伪数组转换成数组？
    - Array.prototype.slice.call(arg);
- 如何判断一个参数是对象？
    - Object.prototype.toString.call(obj);
- 如果将数组变成数组？
    - Array.prototype.slice.call(arr)








