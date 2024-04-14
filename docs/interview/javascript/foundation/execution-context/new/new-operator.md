# new 操作符

## 【初级】考查 new 操作符，输出结果

```js
function Foo() {
  this.a = 1;
  return {
    a: 4,
    b: 5,
  };
}

Foo.prototype.a = 6;
Foo.prototype.b = 7;
Foo.prototype.c = 8;

var o = new Foo();

console.log(o.a);
console.log(o.b);
console.log(o.c);
```

参考答案：

```js
4
5
undefined
```

追问：

- 去掉`return`后，输出结果是？
  - `1 7 8`
- `new`的过程是怎样的？`this`指向谁？
  - 创建一个新对象
  - 新对象的`__proto__`指向`fn.prototype`
  - 将构造函数的作用域赋给新对象（因此`this`就指向了这个新对象）
  - 执行构造函数中的代码（为这个新对象添加属性）
  - 返回新对象（如果`fn`执行后不返回，则默认返回新对象；如果返回了其他对象，则返回值为其他对象）

- B-能说出`new`操作符的大概作用
- A-能比较准备描述`new`操作符整个工作流程
- S-能自己实现一个`new`

## 【中级】模拟new的实现

（不需要兼容`class`，因为`class`在 ECMA 规范中未实现`[[Call]]`）

参考答案：[风动之石的博客 - new 操作符](https://blog.windstone.cc/es6/polyfill/object/new.html)

```js
function newOperator(Constructor){
    if(typeof Constructor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }

    // 使用 new 操作符时，构造函数内的 new.target 会指向操作函数。
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target
    // 下面这一行其实没啥必要，因为用 newOperator 函数去模拟 new 操作符时，构造函数内部也不会使用 newOperator.target 去替换 new.target
    // newOperator.target = Constructor;


    // 1、创建新对象，修改 __proto__ 指向
    var newObj = {};
    newObj.__proto__ = Constructor.prototype;

    // 2、在新对象上调用 Constructor 函数，绑定 this 为新对象
    var args = [].slice.call(arguments, 1);
    var result = Constructor.apply(newObj, args);

    // 3、判断是返回 Constructor 的执行结果，还是返回新对象
    var isObject = typeof result === 'object' && result !== null;
    var isFunction = typeof result === 'function';
    if(isObject || isFunction){
        return result;
    }

    return newObj;
}
```
