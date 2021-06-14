# 指令

[[toc]]

## v-model

### 自定义组件 v-model

前提知识点：[自定义组件的 v-model](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)

```js
// src/core/vdom/create-component.js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  // transform component v-model data into props & events
  // 将 v-model 数据转换为 props&events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }
  // ...
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
/**
 * 将 v-model 转换到子组件的 prop、event
 * @param {*} options 组件选项对象
 * @param {*} data 组件数据对象（从模块解析而来的数据 或 调用 createElement 传入的数据对象）
 */
function transformModel (options, data: any) {
  const prop = (options.model && options.model.prop) || 'value'
  const event = (options.model && options.model.event) || 'input'
  ;(data.props || (data.props = {}))[prop] = data.model.value
  const on = data.on || (data.on = {})
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event])
  } else {
    on[event] = data.model.callback
  }
}
```

组件上的`v-model`默认会利用名为`value`的`prop`和名为`input`的事件，但是当组件选项对象里传递了`model`属性，则会使用`model`属性的`prop`和`event`。

在模板编译阶段，会将`v-model`绑定的值传给`data.model.value`，并添加`data.model.callback`用于改变`data.model.value`的值。

```js
```

待补充内容
