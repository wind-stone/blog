# JavaScript 命名

JavaScript 的命名应遵循简化、语义化的原则。

## 变量

命名方法: 小驼峰式命名法（lowerCamelCase）
命名规范：前缀为形容词 （函数前缀为动词, 以此来区分函数和变量）

```js
//  好的命名方式
let maxCount = 10;
let tableTitle = '啦啦啦';

// 不好的命名方式
let setConut = 10;
let getTitle = '啦啦啦';
```

## 常量

命名方法：名词全部大写
命名规范：使用大写字母和下划线来组合命名，下划线用来分割单词。

```js
const MAX_COUNT = 10;
const URL = '//www.huifenqi.com';
```

## 函数/方法命名

命名方式：小驼峰式命名法（lowerCamelCase）
命名规范：前缀应该为动词
命名建议：常用动词约定如下。

| 动词 | 含义                   |
| ---- | ---------------------- |
| can  | 判断是否可执行某个动作 |
| has  | 判断是否包含某个值     |
| is   | 判断是否为某个值       |
| get  | 获取某个值             |
| set  | 设置某个值             |
| load | 加载某些数据           |

```js
// 是否可阅读
function canRead() {}
// 获取名称
function getName() {}
```

## 类/构造函数

命名方法：大驼峰式命名法（UpperCamelCase），首字母大写。
命名规范：前缀为名称。

```js
class Persion {
    constructor(name) {
        // ...
    }
}

let person = new Person('CXL');
```

### 类的成员

- 公共属性和方法：跟变量和函数命名一样。
- 私有属性和方法：前缀为下划线`_`, 后面跟公共属性和方法一样的命名方式。

```js
class Person {
    // 私有属性
    _name: string;
    constructor() { }

    // 公共方法
    getName() {
        return this._name;
    }
    // 公共方法
    setName(name) {
        this._name = name;
    }
}
```

## Vue 命名规范

命名方法：同函数命名法
命名建议：事件处理应以`handle`开头,如`handleBlur`
其他建议：使用`promise`或`async/await`处理异步逻辑，避免使用回调函数。

## Reference

- [js命名规范](https://www.jianshu.com/p/75591d47312a)，本文绝大部分内容参考与此。
