## 级联下拉选择框组件

### 组件说明
级联下拉选择框组件

### 组件功能说明
- 支持默认选中
- 支持禁用
- 选择第一个选择框后，自动选择第二个选择框

### 使用方式

```js
import vueCascadeSelectboxComponent from 'vue-cascade-selectbox';

new Vue({
    el: '#j-example-ctn',
    data: {
        cascadeOptions: [
            {
                value: 110000,
                label: "北京市",
                subType: [
                    {
                        value: 110101,
                        label: "东城区"
                    },
                    {
                        value: 110102,
                        label: "西城区"
                    }
                ]
            },
            {
                value: 120000,
                label: "天津市",
                subType: [
                    {
                        value: 120101,
                        label: "和平区"
                    },
                    {
                        value: 120102,
                        label: "河东区"
                    }
                ]
            }
        ],
        value: {
            primaryValue: 120000,
            secondaryValue: 120113
        },
        keys: {
            label: 'label',
            value: 'value',
            subType: 'subType'
        }
    },
    components: {
        'vue-cascade-selectbox': vueCascadeSelectboxComponent
    },
    methods: {
        select: function (primaryType, secondaryType) {
            console.log('二级类型', secondaryType.label);
        }
    }
});

```

```html
<vue-cascade-selectbox
    :cascade-options="cascadeOptions"
    :value="value"
    :placeholder="{primaryPlaceholder: '请选择一级类目', secondaryPlaceholder: '请选择二级类目'}"
    @vue-cascade-selectbox-select="select"></vue-cascade-selectbox>
```
参数说明：
- cascade-data: 必需，Array，级联下拉选项数据，数据结构见上方
- placeholder：可选，Object，默认显示的文本，包含第一个和第二个下拉选择框的默认值，缺省值都为“请选择”，数据结构见上方
- value：可选，Object，默认选中的下拉选项的value值，包含第一个和第二个下拉选择框的默认值，数据结构见上方
- keys：可选，Object，改写下拉选项对象的属性名，默认为 option 的文字属性名为 label，值的属性名为 value，子类型对象的数组名称为 subType， 即 keys={label: 'label', value: 'value', subType: 'subType'}
- @vue-cascade-selectbox-select：下拉选项选择事件监听函数，选择下拉选项后，会派发 vue-selectbox-select 事件，参数为
    - 第一个下拉选项对象
    - 第二个下拉选择对象

