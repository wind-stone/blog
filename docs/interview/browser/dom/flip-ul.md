# 【中级】ul 翻转

```html
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

```js
function reverse(ul){
    // TODO
}
```

## 参考答案

```js
function reverse(ul) {
    const len = ul.children.length;
    const fragment = document.createDocumentFragment();
    for (let i = len - 1; i >= 0; i--) {
        fragment.appendChild(ul.children[i]);
    }
    ul.appendChild(fragment);
}
```

- `children`获取的是元素的所有子元素，而`childNodes`获取的是元素的所有子节点（包含注释、文本节点）
- `fragment`
  - `fragment`不会触发 DOM 树的重新渲染，不会导致性能问题
  - `fragment`作为参数时，`append`（或`insert`）的是`fragment`的子节点，而不是`fragment`本身
  - `fragment`的所有子节点会被一次插入到文档中，而这个操作仅发生一个重渲染的操作
