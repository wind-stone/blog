# 【高级】深拷贝

## 手写深拷贝方法，要考虑到非基本类型情况，比如正则、方法等？

B-能写出基本类型深拷贝 + 对象递归

A-能解决对象（循环）引用问题

S-解决对象引用问题并考虑各种类型的拷贝方法，比如正则拷贝方法，可以追问细节比

参考答案：[https://github.com/lukeed/klona/blob/master/src/index.js](https://github.com/lukeed/klona/blob/master/src/index.js)

可以不用考虑方法的深拷贝
