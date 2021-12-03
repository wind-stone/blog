# new 操作符

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
