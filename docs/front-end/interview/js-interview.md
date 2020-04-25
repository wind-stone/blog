# JavaScript 面试题

## 执行机制

### 变量提升

```js
function varTest() {
  var x = 1;
  if (true) {
    var x = 2;  // 同样的变量!
    console.log(x);  // 2
  }
  console.log(x);  // 2
}
```

### 调用栈

以下这段代码，可能存在什么问题？如何改进？

```js
function runStack (n) {
  if (n === 0) return 100;
  return runStack( n- 2);
}
runStack(50000)
```

答：会导致栈溢出。改为:

```js
function runStack (n) {
  if (n === 0) return 100;
  return runStack.bind(null, n - 2); // 返回一个新的函数，且预置参数
}
// 蹦床函数，避免递归
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
trampoline(runStack(1000000))
```

## 原型/继承

```js
function Parent() {
    this.a = 1;
    this.b = [1, 2, this.a];
    this.c = { demo: 5 };
    this.show = function () {
      console.log(this.a , this.b , this.c.demo);
    }
}

function Child() {
    this.a = 2;
    this.change = function () {
      this.b.push(this.a);
      this.a = this.b.length;
      this.c.demo = this.a++;
    }
}

Child.prototype = new Parent();
var parent = new Parent();
var child = new Child();

child.a = 10;

parent.show(); // 1  [1, 2, 1] 5
child.show();  // 10 [1, 2, 1] 5

child.change();

parent.show(); // 1 [1, 2, 1] 5
child.show(); //  5 [1, 2, 1, 10] 4
```

## 算法类

### 使用

```js
// 题目已知部分，栈的实现
class Stack {
    items = [];
    push(item) {
        return this.items.push(item);
    }
    pop() {
        return this.items.pop();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

const stack1 = new Stack();
const stack2 = new Stack();
```

答:

```js
// 队列的实现
class Queue {
    push(item) {
        stack1.push(item);
    }
    pop() {
        if (stack1.isEmpty() && stack2.isEmpty()) {
            console.log('the queue is empty')
        }
        if (stack2.isEmpty()) {
            while(!stack1.isEmpty()) {
                stack2.push(stack1.pop());
            }
        }
        return stack2.pop();
    }
}

// 测试输出
const queue = new Queue();
queue.push(1);
queue.push(2);
queue.push(3);
queue.push(4);
console.log(queue.pop());
console.log(queue.pop());
queue.push(5);
queue.push(6);
queue.push(7);
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
```

### 二分查找

输入一个已排序的数组如`[a, c, f]`（至少两个不同字母，可能存在重复的字符），一个字符如`b`或`c`，找出大于所给字符的最小字母，如果没有，则返回第一个字母。

```js
function getFirstBiggerChar(arr, ch) {
    if (arr.length < 2) {
        return;
    }
    let left = 0;
    let right = arr.length - 1;

    if (ch < arr[left] || ch >= arr[right] ) {
        // 比第一个小、比最后一个大，说明不存在，返回第一个
        return arr[0];
    } if (ch === arr[left]) {
        // 跟第一个相等，返回第二个
        return arr[left + 1];
    }

    while (left < right) {
        const middle = Math.floor((left + right) / 2);
        if (ch > arr[middle]) {
            left = middle + 1;
        } else {
            right = middle;
        }
    }
    return arr[right];
}
```
