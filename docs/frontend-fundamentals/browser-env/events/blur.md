# blur 事件

## 阻止 blur 事件

日常开发中经常会有这样的需求：

1. 输入框聚焦，且有已输入字符时，显示关闭按钮
2. 输入框失焦，不显示关闭按钮
3. 点击关闭按钮，清空输入

根据以上要求，实现的结果为：

<browser-env-events-blur-stop-blur-before></browser-env-events-blur-stop-blur-before>

可以发现，第 1 和 2 条已经实现，但 第 3 条实现存在问题：点击清空按钮时，输入框的内容并没有清空。

代码实现如下：

@[code vue](@components/browser-env/events/blur/stop-blur-before.vue)

究其原因，点击`.clear-icon`时，会先触发`.input`的`blur`事件导致`.clear-icon`元素先消失，因此`.clear-icon`元素并没有触发`click`事件。

要想解决这个问题，只需阻止`.clear-icon`元素的`mousedown`事件的默认行为。

```vue
<i
    v-show="isClearIconVisible"
    class="clear-icon"
    @mousedown.prevent
    @click="clear"
>×</i>
```

修复后的效果：

<browser-env-events-blur-stop-blur-after></browser-env-events-blur-stop-blur-after>

原理解释：当点击`.clear-icon`元素时会先触发它的`mousedown`事件，而`mousedown`事件的默认行为就是使当前点击元素之外的有焦点的元素失去焦点，如果阻止`.clear-icon`元素的`mousedown`事件的默认行为，就能阻止`.input`元素失去焦点，`.clear-icon`元素就不会消失，也能触发`click`事件了。

