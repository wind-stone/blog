# 浏览器

## 事件代理

简单实现一个事件代理:

```js
function delegate(agent,type,selctor,fn) {
  // agent.addEventListener(type,fn) 如果是这样 fn 中的 this 会指向 agent
  agent.addEventListener(type,function(e){
      let target = e.target;         // target指向实际点击的最里层的元素
      let ctarget = e.currentTarget; // ctarget会永远指向agent

      while(target != ctarget){
          if(target.matches(selctor)){
            // 改变 this 的指向
            fn.call(target, e);
            return;
          }
          target = target.parentNode;
      }
  }, false)
}
```

参考: [JavaScript事件委托原理及实现 #65](https://github.com/caistrong/Blog/issues/65)
