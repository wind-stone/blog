# 校验规则

[[toc]]

## 身份证有效性校验

<<< @/docs/js/code-snippet/validate/idcard.js

## 中文名称校验

```js
/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
```

UTF-8 (Unicode)编码里，中文的编码范围是 u4e00-u9fa5，中文名称包含汉字以及 ·
