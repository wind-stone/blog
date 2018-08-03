# Node Server


## 禁止缓存

Server 端返回文件时，若是不想要缓存文件（比如 HTML），可设置返回头：

```
Cache-Control: no-cache, no-store, must-revalidate
```