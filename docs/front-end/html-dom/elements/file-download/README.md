---
sidebarDepth: 0
---

# a 标签 - 文件下载

## 实现方式

- [前端如何实现文件下载？](https://yugasun.com/post/optimize-download-files-in-frontend.html)

## `<a>`标签中`download`属性

### `<a>`标签中`download`属性无法使用重命名下载文件名

浏览器的兼容性问题：

- Firefox 考虑到安全问题，该下载文件必须是从自己的服务器或域名中的，否则将在浏览器中打开。
- 在 Chrome 和 Opear 中，如果说下载文件不是在子集的服务器或域名中，这些浏览器会忽视`download`属性，换句话来说，文件名不变。
- 其他浏览器还不支持

Reference: [`<a>`标签中download属性无法使用重命名下载文件名怎么解决?](https://www.zhihu.com/question/51032333)

## 结合`<a>`标签的`download`属性 + `window.open`

`<a>`标签的`download`属性浏览器兼容性不好，因此可以先判断浏览器是否支持。支持的话，使用`download`属性；否则，使用`window.open`打开新页面下载。

根据以上描述，基于 Vue 2.0+ 创建了`download-link`组件，调用方式如下：

- 仅显示文本

```html
<download-link :url="excelTemplateUrl" text="素材 Excel 文件规范" name="素材 Excel 文件规范"></download-link>
```

- 显示 slot

```html
<download-link :url="excelTemplateUrl" name="素材 Excel 文件规范">
  <span>素材 Excel 文件规范</span>
</download-link>
```

其中，

- `url`：下载链接
- `name`：下载时默认的文件名称（`download`属性支持且不跨域，此字段才有效）
- `text`：`<a>`显示的文本

### vue 组件

<<< @/docs/front-end/html-dom/elements/file-download/download-link.vue
