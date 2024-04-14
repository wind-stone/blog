# 【初级】this 指向输出题

```js
var name = '123';
var obj = {
    name: '456',
    getName: function () {
        function printName () {
            console.log(this.name);
        }
        printName();
    }
}

obj.getName();
```

参考答案：

- 非严格模式，123
- 严格模式，报错 TypeError: Cannot read properties of undefined (reading 'name')
