# VuePress 写作技巧

## Markdown 技巧

- 页面里有指向 blog 内部文档的链接时，优先使用相对路径/绝对路径，不要使用 URL，详见[VuePress 指南 - Markdown - 链接](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E9%93%BE%E6%8E%A5)
- 行高亮
- 行号：可在代码块添加标记来启用/禁用行号，默认开启

### 超链接引用站内文件

```bash
└─ docs
   └─ zh
      ├─ guide
      │  ├─ getting-started.md
      │  ├─ introduction.md
      │  └─ markdown.md    # <- 我们在这里
      ├─ reference
      │  └─ config.md
      └─ README.md
```

```md
<!-- 相对路径 -->

[首页](../README.md)
[配置参考](../reference/config.md)
[快速上手](./getting-started.md)

<!-- 绝对路径 -->

[指南 > 介绍](/zh/guide/introduction.md)
[配置参考 > markdown.links](/zh/reference/config.md#links)

<!-- URL -->

[GitHub](https://github.com)
```

### 导入代码块

[导入代码块](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E5%AF%BC%E5%85%A5%E4%BB%A3%E7%A0%81%E5%9D%97)

```md
<!-- 最简单的语法 -->

@[code](../foo.js)

<!-- 仅导入第 1 行至第 10 行 -->

@[code{1-10}](../foo.js)

<!-- 指定代码语言 -->

@[code js](../foo.js)

<!-- 导入 components 下的 Vue 组件 -->

@[code vue](@components/animation-effects/animation-delay/ball-translate.vue)
```

### 引入 Vue 组件

在 docs/.vuepress/components/ 目录下放置 .vue 文件，比如

blog/
├── docs/
│ └── .vuepress
│ └── components
│ └── animation-effects
│ └── gradient-shadows.vue
└── README.md

然后在 MD 文件里通过如下方式引入：

```md
<animation-effects-gradient-shadows />
```

## bug

- MD 里不能出现`process.env.NODE_ENV`，否则页面渲染不出来。因此涉及到`process.env.NODE_ENV`的地方，`process`都写成了`p rocess`
- MD 里最好不要出现 HTML 标签，比如`</body>`，否则页面渲染不出来
- MD 里的表格里不要出现`内 | 容`，若出现了需要转义，比如`内 \| 容`
