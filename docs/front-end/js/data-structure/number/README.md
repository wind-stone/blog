# Number

## 精度

### parseInt(0.0000008) === 8

`parseInt` 的第一个类型是字符串，所以会将传入的参数转换成字符串，但是小于`0.0000001（1e-7）`的数字转换成 String 时，会变成科学记号法，也就是`String(0.0000008)`的结果为`8e-7`。`parseInt`并没有将`e`视为一个数字，所以在转换到 8 后就停止了，最终 `parseInt(0.0000008) === 8`

Referrence: [http://justjavac.com/javascript/2015/01/08/why-parseint-0-00000008-euqal-8-in-js.html](http://justjavac.com/javascript/2015/01/08/why-parseint-0-00000008-euqal-8-in-js.html)

## 关于 3.toString()

- `3.toString()`会按照从左到右的顺序解析
- `3.`会被计算成`3`

所以`3.toString()`等同于`(3)toString()`，这显然是语法有问题。

而`3..toString()`会被计算成`(3.).toString()`，OK！

`3...toString()`等同于`(3.)..toString()`，语法问题。
