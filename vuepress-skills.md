# VuePress 写作技巧

## Markdown 技巧

- 页面里有指向 blog 内部文档的链接时，优先使用相对路径/绝对路径，不要使用 URL，详见[VuePress 指南 - Markdown - 链接](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E9%93%BE%E6%8E%A5)
- 行高亮
- 行号：可在代码块添加标记来启用/禁用行号，默认开启
- [导入代码块](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E5%AF%BC%E5%85%A5%E4%BB%A3%E7%A0%81%E5%9D%97)

## bug

- MD 里不能出现`process.env.NODE_ENV`，否则页面渲染不出来。因此涉及到`process.env.NODE_ENV`的地方，`process`都写成了`p rocess`
- MD 里最好不要出现 HTML 标签，比如`</body>`，否则页面渲染不出来
- MD 里的表格里不要出现`内 | 容`，若出现了需要转义，比如`内 \| 容`
