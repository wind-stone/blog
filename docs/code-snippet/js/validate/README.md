# 校验方法

## 中文名称校验

```js
/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
```

UTF-8 (Unicode)编码里，中文的编码范围是 u4e00-u9fa5，中文名称包含汉字以及 ·