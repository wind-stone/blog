## 动态组件 is 的取值

```html
<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>
```
对于动态组件，is 可以取两种类型的值
- 字符串类型，值为已经全局/局部注册的组件的 name
- 对象类型，组件定义对象


### 组件的 name

```js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```


### 组件定义对象

```js
var Home = {
  template: '<p>Welcome home!</p>'
}
var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

