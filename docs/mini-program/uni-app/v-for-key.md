# 列表循环里的 key 不生效

## 测试示例

`uni-app`测试代码：

```vue
<template>
    <ul class="list">
        <li v-for="item in list" :key="item.id">
            <span>姓名：{{ item.name }}，</span>
            <span :class="{ 'gender-other': isGenderOther(item.gender) }">性别：{{ item.gender }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Index extends Vue {
    list = [
        {
            id: 1,
            gender: 'male',
            name: '张三',
        },
        {
            id: 2,
            gender: 'female',
            name: '李四',
        },
        {
            id: 3,
            gender: 'other',
            name: '王五',
        },
    ]
    isGenderOther(gender) {
        return gender === 'other';
    }
};
</script>
```

编译后的小程序`wxml`：

````wxml
<view class="list _ul">
    <block wx:for="{{$root.l0}}" wx:for-item="item" wx:for-index="__i0__" wx:key="id">
        <view class="_li">
            <label class="_span">{{"姓名："+item.$orig.name+"，"}}</label>
            <label class="{{['_span',(item.m0)?'gender-other':'']}}">{{"性别："+item.$orig.gender}}</label>
        </view>
    </block>
</view>
````

编译后的小程序`js`部分代码:

```js
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var l0 = _vm.__map(_vm.list, function(item, __i0__) {
    var m0 = _vm.isGenderOther(item.gender)
    return {
      $orig: _vm.__get_orig(item),
      m0: m0
    }
  })

  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l0: l0
      }
    }
  )
}
```

编译后的`wxml`里`item`对应的结构是

```js
{
    $orig: _vm.__get_orig(item),
    m0: m0
}
```

而这个`item`里并没有`id`属性，因此最终会导致设置的`key`并没有起到作用。

可以发现，当在`uni-app`的模板的列表循环里调用组件上的函数时，会导致编译成小程序代码时对`list`进行了一层封装，其原因是微信小程序里不支持在`wxml`里调用组件里的方法，因此`uni-app`在编译成微信小程序时会对`list`做一层封装，并将函数调用的结果挂在封装后的对象的属性上。

## 解决方案

### 方案一

当将模板里的`isGenderOther(item.gender)`改为`item.gender === 'other'`时，编译后的小程序`wxml`就正常了。

```wxml
<view class="list _ul">
    <block wx:for="{{list}}" wx:for-item="item" wx:for-index="__i0__" wx:key="id">
        <view class="_li">
            <label class="_span">{{"姓名："+item.name+"，"}}</label>
            <label class="{{['_span',(item.gender==='other')?'gender-other':'']}}">{{"性别："+item.gender}}</label>
        </view>
    </block>
</view>
```

该解决办法是避免`uni-app`编译时对`list`进行封装，此时最终的`item`上是有`id`属性的。

### 方案二

该示例里的使用函数的逻辑比较简单，咱们可以将`isGenderOther(item.gender)`改为`item.gender === 'other'`，而针对某些复杂的情况，必须要在模板的列表循环里使用函数，又想让`key`生效，应该怎么办？

可以将`key`的取值也变成函数调用：

```vue
<template>
    <ul class="list">
        <li v-for="item in list" :key="getItemKey(item)">
            <span>姓名：{{ item.name }}，</span>
            <span :class="{ 'gender-other': isGenderOther(item.gender) }">性别：{{ item.gender }}</span>
        </li>
    </ul>
</template>
```

编译后的小程序`wxml`：

```wxml
<view class="list _ul">
    <block wx:for="{{$root.l0}}" wx:for-item="item" wx:for-index="__i0__" wx:key="m0">
        <view class="_li">
            <label class="_span">{{"姓名："+item.$orig.name+"，"}}</label>
            <label class="{{['_span',(item.m1)?'gender-other':'']}}">{{"性别："+item.$orig.gender}}</label>
        </view>
    </block>
</view>
```

编译后的小程序`js`部分代码:

```js
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var l0 = _vm.__map(_vm.list, function(item, __i0__) {
    var m0 = _vm.getItemKey(item)
    var m1 = _vm.isGenderOther(item.gender)
    return {
      $orig: _vm.__get_orig(item),
      m0: m0,
      m1: m1
    }
  })

  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l0: l0
      }
    }
  )
}
```

编译后的`wxml`里`item`对应的结构是

```js
{
    $orig: _vm.__get_orig(item),
    m0: m0,
    m1: m1
}
```

`key`的取值变成函数调用之后，编译后的`wxml`里`key`的取值变成了`m0`，而`m0`是存在在封装后的`item`上的，这样就符合了微信小程序里关于`key`的使用规则了。
