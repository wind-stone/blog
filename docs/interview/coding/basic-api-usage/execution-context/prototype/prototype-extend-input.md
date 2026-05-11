# 【中级】原型、继承输出题

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
