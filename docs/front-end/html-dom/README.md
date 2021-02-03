# HTML-DOM

## 查找元素

DOM 提供了查找元素的能力。比如:

- `querySelector`
- `querySelectorAll`
- `getElementById`
- `getElementsByName`
- `getElementsByTagName`
- `getElementsByClassName`

需要注意，以下的这几个 API 的性能都高于`querySelector`。

- `getElementById`
- `getElementsByName`
- `getElementsByTagName`
- `getElementsByClassName`

此外，以下的这几个 API 获取的集合并非数组，而是一个能够动态更新的集合。

- `getElementsByName`
- `getElementsByTagName`
- `getElementsByClassName`

```html
<div class="wind-stone"></div>

<script>
const divs = document.getElementsByClassName('wind-stone');
console.log(divs.length); // 1
const div = document.createElement('div');
div.setAttribute('class', 'wind-stone')
document.documentElement.appendChild(div)
console.log(divs.length); // 2
</script>
```
