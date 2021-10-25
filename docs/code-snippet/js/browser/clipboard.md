# 复制内容到剪贴板

```js
// Reference: https://juejin.im/post/5a94f8eff265da4e9b593c29
const btn = document.querySelector('#btn');
btn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', 'hello world');
  document.body.appendChild(input);
  input.setSelectionRange(0, 9999);
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    console.log('复制成功');
  }
  document.body.removeChild(input);
});
```
