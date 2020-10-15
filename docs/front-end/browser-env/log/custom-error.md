# 自定义错误和包装异常

## 自定义错误

```js
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.customProperty = 'customProperty'; // 这里还可以添加自定义属性
    }
}

try {
    throw new ValidationError('this is a ValidationError');
} catch(error) {
    console.log('error.name:', error.name);
    console.log('error.message:', error.message);
    console.log('error.customProperty:', error.customProperty);
    console.log('error.stack:', error.stack)
}

// 打印结果
// error.name: ValidationError
// error.message: this is a ValidationError
// error.customProperty: customProperty
// error.stack: ValidationError: this is a ValidationError
//     at <anonymous>:10:11
```

以上的实现里，新实现的错误类`ValidationError`的`name`属性是通过`this.name = "ValidationError";`手动赋值的，如下实现可以根据自定义类的类型自动改写`name`属性。

```js
// 创建自定义错误的基类
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

// 基于自定义基类 CustomError，再实现新的子类
class ChildCustomError extends CustomError {
    constructor(message) {
        super(message);
        this.customProperty = 'customProperty';
    }
}

try {
    throw new ChildCustomError('this is a ChildCustomError');
} catch(error) {
    console.log('error.name:', error.name);
    console.log('error.message:', error.message);
    console.log('error.customProperty:', error.customProperty);
    console.log('error.stack:', error.stack)
}

// 打印结果
// error.name: ChildCustomError
// error.message: this is a ChildCustomError
// error.customProperty: customProperty
// error.stack: ChildCustomError: this is a ChildCustomError
//     at <anonymous>:18:11
```

注意，在`CustomError`里的`this.constructor`指的是最终`new`操作符作用的那个类，此例里是`ChildCustomError`。

## 包装异常

有时我们想要针对多个错误做统一处理，但是仍想保留原始的错误，这种情景下可将错误进行一层封装。

```js
class CustomError extends Error {
    constructor(message, originError) {
        super(message);
        this.name = 'ParentError';
        this.originError = originError;
    }
}

function fn() {
    try {
        // doSomething() ...
    } catch (err) {
        if (err instanceof ReferenceError) {
            throw new CustomError('ReferenceError', err)
        } else if (err instanceof TypeError) {
            throw new CustomError('TypeError', err)
        } else {
            throw new CustomError('OtherError', err)
        }
    }
    // ...
}


try {
    fn()
} catch (err) {
    if (err instanceof CustomError) {
        // 处理 CustomError 错误
        // console.log(err.originError)
    }
}
```

## 参考文档

- [自定义 Error，扩展 Error](https://zh.javascript.info/custom-errors)
