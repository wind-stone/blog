---
sidebarDepth: 0
---

# 未分类

[[toc]]

## 编写原生 JavaScript 插件

### 插件需要满足的条件

一个可复用的插件需要满足以下条件：

- 插件自身的作用域与用户当前的作用域相互独立，也就是插件内部的私有变量不能影响使用者的环境变量；
- 插件需具备默认设置参数；
- 插件除了具备已实现的基本功能外，需提供部分API，使用者可以通过该API修改插件功能的默认参数，从而实现用户自定义插件效果；
- 插件需提供监听入口，及针对指定元素进行监听，使得该元素与插件响应达到插件效果；
- 插件支持链式调用。

Reference:

- [原生JavaScript插件编写指南](http://geocld.github.io/2016/03/10/javascript_plugin/)
- [如何定义一个高逼格的原生JS插件](https://www.jianshu.com/p/e65c246beac1)

## Completion Record

关于 Completion Record，可以学习 Winter 的这篇文章：[JavaScript执行（四）：try里面放return，finally还会执行吗？](https://time.geekbang.org/column/article/83860)

![控制语句与 break 、continue 、return 、throw 结合](./images/completion-record.png)

“穿透”就是指不在当前这一层处理，向外逐层寻找可以“消费”的那一层，直到最后都没找到就报错，比如：`function`里面有`while`，`while`里面有`switch`，`switch`里面又有`continue`，按图表来看，`switch-continue`应该是穿透，向上层寻找消费，碰到`while-contine`，那就是消费，再如`switch`里面是`return`，`switch-return`穿透，向上层`whlie-return`穿透，最后`function-return`是消费。

### try..catch..finally

```js
function foo(){
  try{
    return 0;
  } catch(err) {

  } finally {
    console.log("a")
  }
}

console.log(foo());

// 结果
// a
// 0
```

即使`try`语句块里存在`return`，`finally`里的语句也会执行，且`finally`里的`return`会覆盖`try`里的`return`。

```js
function foo(){
  try{
    return 0;
  } catch(err) {

  } finally {
    console.log("a")
    return 1;
  }
}

console.log(foo());

// 结果
// a
// 1
```
