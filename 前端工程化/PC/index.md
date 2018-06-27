# PC

## 下载

- [前端如何实现文件下载？](https://yugasun.com/post/optimize-download-files-in-frontend.html)


### `<a>`标签中download属性无法使用重命名下载文件名

浏览器的兼容性问题：
- Firefox考虑到安全问题，该下载文件必须是从自己的服务器或域名中的，否则将在浏览器中打开。
- 在Chrome和Opear中，如果说下载文件不是在子集的服务器或域名中，这些浏览器会忽视download属性，换句话来说，文件名不变。
- 其他浏览器还不支持

Reference: [<a>标签中download属性无法使用重命名下载文件名怎么解决?](https://www.zhihu.com/question/51032333)


## Vue 相关

### element-ui

- [el-input 响应 v-on:keyup.enter](https://github.com/ElemeFE/element/issues/2333)