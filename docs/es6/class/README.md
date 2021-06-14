# Class

[[toc]]

## 严格模式

类和模块的内部，默认就是严格模式，所以不需要使用`use strict`指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。

## `name`属性

```js
class Point {}
Point.name // "Point"
```

```js
const MyClass = class Me {
};
MyClass.name // "Me"
```

`name`属性总是返回紧跟在`class`关键字后面的类名。

## `constructor`方法

- 类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加
- `constructor`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象
- 类必须使用`new`调用，否则会报错

```js
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```

```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'
```

## Class 表达式

```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

这个类的名字是`MyClass`而不是`Me`，`Me`只在 Class 的内部代码可用，指代当前类。

```js
// 如果类的内部没用到的话，可以省略 Me，也就是可以写成下面的形式
const MyClass = class { /* ... */ };
```

### 立即执行的 Class

```js
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

## 方法

- 类的所有方法都是定义在类的`prototype`属性上面
- 类的内部所有定义的方法，都是不可枚举的（non-enumerable）
- 类的属性名，可以采用表达式

```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

```js
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

## `getter`/`setter`

定义在 Class 里的`getter`/`setter`方法，实际上定义在类的原型上的，通过属性的 Descriptor 对象可以获取到。

```js
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

## 静态属性

静态属性指的是 Class 本身的属性，即`Class.propName`，而不是定义在实例对象（`this`）上的属性。

```js
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```

只有这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。

目前有一个静态属性的[提案](http://es6.ruanyifeng.com/#docs/class#Class-%E7%9A%84%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7%E5%92%8C%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)，对实例属性和静态属性都规定了新的写法。

## 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

- 如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例
- 静态方法可以与非静态方法重名
- 父类的静态方法，可以被子类继承，也可以从`super`对象上调用

```js
class Foo {
  static bar () {
    this.baz();
  }
  static baz () {
    console.log('hello');
  }
  baz () {
    console.log('world');
  }
}

Foo.bar() // hello
```

```js
class Foo {
  static classMethodHello() {
    return 'hello';
  }
  static classMethodWorld() {
    return 'world';
  }
}

class Bar extends Foo {
  static classMethodHello() {
    return super.classMethodHello() + ', from Bar';
  }
}

Bar.classMethodHello() // 'hello, from Bar'
Bar.classMethodWorld() // 'world'
```

## 不存在变量提升

```js
// 类不存在变量提升（hoist），这一点与 ES5 完全不同
new Foo(); // ReferenceError
class Foo {}
```

## new.target 属性

`new`是从构造函数生成实例对象的命令。ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令调用的，`new.target`会返回`undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

- Class 内部调用`new.target`，返回当前 Class
- 子类继承父类时，`new.target`会返回子类

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

var obj = new Rectangle(3, 4); // 输出 true
var obj = new Square(3); // 输出 false
```

## Class 的 Generator 方法

详见[Class 的 Generator 方法](http://es6.ruanyifeng.com/#docs/class#Class-%E7%9A%84-Generator-%E6%96%B9%E6%B3%95)

## 私有方法

ES6 不提供私有方法，只能通过[变通方法](http://es6.ruanyifeng.com/#docs/class#%E7%8E%B0%E6%9C%89%E7%9A%84%E6%96%B9%E6%B3%95)模拟实现。

## 私有属性

ES6 不支持私有属性，但目前有[提案](http://es6.ruanyifeng.com/#docs/class#%E7%A7%81%E6%9C%89%E5%B1%9E%E6%80%A7%E7%9A%84%E6%8F%90%E6%A1%88)

## Class 的继承

### `constructor`

- 子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错
  - 子类若没有定义`constructor`方法，`constructor`方法会被默认添加
- 在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错
  - 调用`super`之前，子类还没有自己的实例对象，调用`super`之后，基于父类的`this`对象创建出子类的实例
- ES 5 继承实质
  - 先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）
- ES 6 继承实质
  - 先创造父类的实例对象`this`（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`

```js
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError
```

```js
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

### 静态方法的继承

父类的静态方法，也会被子类继承。

```js
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {
}

B.hello()  // hello world
```

### Object.getPrototypeOf()

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```js
Object.getPrototypeOf(ColorPoint) === Point // true

// 注意 __proto__ 不是标准属性
ColorPoint.__proto__ === Point // true
```

### `super`关键字

`super`这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

## 当作函数使用

- `super`作为函数调用时，代表父类的构造函数
- `super()`只能用在子类的构造函数之中，用在其他地方就会报错

```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```

`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是`B`，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

### 当作对象使用

`super`作为对象时，

- 在普通方法中，指向父类的原型对象
  - 通过`super`调用父类的方法时，方法内部的`this`指向子类
  - 通过`super`对某个属性赋值，这时`super`就是`this`，赋值的属性会变成子类实例的属性
- 在静态方法中，指向父类

```js
// 普通方法里
class A {
  constructor() {
    this.p = 3;
    this.x = 4;
  }
  getNum() {
    return 2;
  }
  getP() {
    console.log(this.p);
  }
}
A.prototype.proX = 1;

class B extends A {
  constructor() {
    super();

    // 普通方法中：
    // super.getNum() 就相当于 A.prototype.getNum()
    // super.proX 相当于 A.prototype.proX
    console.log(super.getNum()); // 2
    console.log(super.proX) // 1

    this.p = 33;

    // 通过 super 对某个属性赋值，这时 super 就是 this，赋值的属性会变成子类实例的属性
    // super.x 读取的是 A.prototype.x，因此是 undefined
    this.x = 44;
    super.x = 444;
    console.log(super.x) // undefined
    console.log(this.x) // 444
  }
  getP() {
    super.getP()
  }
}

let b = new B();
b.getP() // 33
```

```js
// 静态方法里
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

其中，`super`关键字还可以用在普通对象的方法之中，表示原型对象，详见“对象”一节。

### 显式指定`super`类型

使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

```js
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // 报错
  }
}
```

```js
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super.valueOf() instanceof B); // true
  }
}

let b = new B();
```

上面代码中，`super.valueOf()`表明`super`是一个对象，因此就不会报错。同时，由于`super`使得`this`指向`B`，所以`super.valueOf()`返回的是一个`B`的实例。

### 任意对象里使用`super`

最后，由于对象总是继承其他对象的，所以可以在任意一个对象中，使用`super`关键字。

```js
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```

### `prototype`属性和`__proto__`属性

大多数浏览器的 ES5 实现之中，每一个对象都有`__proto__`属性，指向对应的构造函数的`prototype`属性。Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链。

- 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。

- 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。

```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

这样的结果是因为，类的继承是按照下面的模式实现的。

```js
class A {
}

class B {
}

// B 的实例继承 A 的实例（用于方法、属性的继承）
Object.setPrototypeOf(B.prototype, A.prototype);

// B 的实例继承 A 的静态属性（用于静态方法、属性的继承）
Object.setPrototypeOf(B, A);

const b = new B();
```

这两条继承链，可以这样理解：

- 作为一个对象，子类的原型（`__proto__`属性）是父类；
- 作为一个构造函数，子类的原型对象（`prototype`属性）是父类的原型对象（`prototype`属性）的实例。

### 原生构造函数的继承

ES5 无法继承原生的构造函数，ES 6 可以继承原生的构造函数。

[原生构造函数的继承](http://es6.ruanyifeng.com/#docs/class-extends#%E5%8E%9F%E7%94%9F%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%9A%84%E7%BB%A7%E6%89%BF)
