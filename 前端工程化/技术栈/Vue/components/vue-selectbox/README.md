## 下拉选择框组件

### 组件说明
模拟原生的下拉选择框

### 组件功能说明
- 支持默认选中
- 支持禁用

### 使用方式

```js
import vueSelectboxComponent from 'vue-selectbox';

new Vue({
    el: '#j-example-ctn',
    data: {
        options: [
            {
                label: '语文',
                value: 'Chinese'
            },
            {
                label: '数学',
                value: 'Mathematics'
            },
            {
                label: '英语',
                value: 'English'
            }
        ]
    },
    components: {
        'vue-selectbox': vueSelectboxComponent
    },
    methods: {
        selectOption: function (option) {
            console.log(option.label);
        }
    }
});
```

```html
<vue-selectbox :disabled="false"
               :options="options"
               placeholder="请选择科目"
               value="Mathematics"
               :keys="{label: 'label2', value="value2"}"
               @vue-selectbox-select="selectOption"></vue-selectbox>
```
参数说明：
- disabled: 可选，Boolean，组件是否禁用，默认不禁用
- options：必需，Array，下拉选项列表数组，数据结构见下方
- placeholder：可选，String，默认显示的文本，缺省值为“请选择”
- value：可选，任何类型，默认选中的下拉选项的value值
- keys：可选，Object，改写下拉选项对象的属性名，默认为 option 的文字属性名为 label，值的属性名为 value，即 keys={label: 'label', value: 'value'}
- @vue-selectbox-select：下拉选项选择事件监听函数，选择下拉选项后，会派发 vue-selectbox-select 事件，参数为下拉选项对象 option
#### keys 的详细使用说明
如果从服务器端获取的 options 为如下数据结构：
```
[
    {
        label2: '语文',
        value2: 'Chinese'
    },
    {
        label2: '数学',
        value2: 'Mathematics'
    },
    {
        label2: '英语',
        value2: 'English'
    }
]
```
则可以如下使用组件：
```
<vue-selectbox :keys="{label: 'label2', value="value2"}"></vue-selectbox>
```

