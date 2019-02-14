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

## pm2

```sh
<!-- 查看有哪些 node 服务 -->
pm2 list

<!-- 重启 node-growth-dev1 服务 -->
pm2 reload node-growth-dev1

<!-- 查看服务 node-growth-dev1 的实时日志 -->
pm2 logs node-growth-dev1

history | grep node-growth-dev1
```
