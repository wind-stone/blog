## 搜索框组件

### 组件说明
将搜索框的输入框和搜索按钮独立为组件，增加可复用性

### 组件功能说明

### 使用方式

```js
import vueSearchboxComponent from 'vue-searchbox';

new Vue({
    el: '#j-example-ctn',
    data: {

    },
    components: {
        'vue-searchbox': vueSearchboxComponent
    },
    methods: {
        search(keyword) {
            alert('搜索词是 ' + keyword);
        }
    }
});
```

```html
<vue-searchbox placeholder="这里写placeholder.." btn-type="img" @vue-searchbox-search="search"></vue-searchbox>
```
参数说明：
- placeholder: 可选，描述输入字段预期值的提示信息，默认值为 "请搜索查询词"
- btn-type: 可选，表示搜索按钮是显示文字还是图标，可选值为"text"、"img"，默认值为 text
- @vue-searchbox-search：搜索事件监听函数，点击搜索按钮/敲回车的时候，会出发 vue-searchbox-search 事件，参数为搜索词