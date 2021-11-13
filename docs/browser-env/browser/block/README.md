# CSS 阻塞和 JS 阻塞

## CSS 阻塞

### CSS 文件的加载不会阻塞 DOM 树的解析

### CSS 文件的加载会阻塞 DOM 的渲染

### CSS 文件的加载会阻塞其后 JavaScript 的执行

CSS 文件的加载，会阻塞其后 JavaScript 的执行，因为 JavaScript 经常用于查询元素的 CSS 属性。

鉴于此，若 HTML 里的结构是这样的：

```html
<link rel="stylesheet" type="text/css" href="index.css" />
<script>
    console.log('JavaScript after link css');
</script>
<div class="content">内容</div>
```

此时，`index.css`的加载会阻塞其后`script`的执行，进而间接地阻塞了 DOM 的解析。

