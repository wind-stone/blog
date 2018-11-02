---
sidebarDepth: 0
---

# 服务器

[[toc]]

## 禁止缓存

Server 端返回文件时，若是不想要缓存文件（比如 HTML），可设置返回头：

```header
Cache-Control: no-cache, no-store, must-revalidate
```
