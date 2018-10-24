## 多城市选择器

### 组件说明
城市选择器，可按照 省-市 选择多个城市

### 组件功能说明

### 使用方式

```js
import vueCityComponent from 'vue-city';

new Vue({
    el: '#j-example-ctn',
    data: {
        cityType: '1',
        wholeCity: [
            {
                areaId: 110000,
                areaName: "北京市",
                citys: [
                    {
                        areaId: 110101,
                        areaName: "东城区"
                    },
                    {
                        areaId: 110102,
                        areaName: "西城区"
                    },
                    {
                        areaId: 110105,
                        areaName: "朝阳区"
                    }
                ]
            },
            {
                areaId: 120000,
                areaName: "天津市",
                citys: [
                    {
                        areaId: 120101,
                        areaName: "和平区"
                    },
                    {
                        areaId: 120102,
                        areaName: "河东区"
                    }
                    {
                        areaId: 120225,
                        areaName: "蓟县"
                    }
                ]
            }
        ],
        selectedCity: []
    },
    components: {
        'vue-city': vueCityComponent
    },
    methods: {
        vueCitySelected: function (cityType, selectedCity) {
            this.cityType = cityType;
            this.selectedCity = selectedCity;
        }
    }
});

```

```html
<vue-city
    :city-type="1"
    :whole-city="wholeCity"
    :selected-city="selectedCity"
    @vue-city-select="vueCitySelected"
    placeholder="请选择"></vue-city>
```
参数说明：
- city-type: 可选，Number，0：全部城市，1：部分城市，默认为'none'，即不选择
- whole-city：可选，Array，全部城市省市数据，数据结构见上方示例，默认为[]
- selected-city：可选，Object，已选择的城市数据，数据结构见上方，默认为[]
- @vue-city-select：选择事件的监听函数，选择城市后，会派发 vue-city-select 事件，参数为
    - cityType：城市类型，Number，0：全部城市，1：部分城市
    - selectedCity：选择的城市数组

