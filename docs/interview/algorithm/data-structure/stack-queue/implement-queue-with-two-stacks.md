# 【初级】用两个栈，实现一个队列

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
