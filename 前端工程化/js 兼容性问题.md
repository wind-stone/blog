# 获取文档垂直滚动高度

## 标准模式

标准模式 | IE6 7 8 | IE9 | firefox | opera | chrome | safari
-- | -- | -- | -- | -- | -- | -- |
scrollY | undefined | undefined | 正确 | 正确 | 正确 | 正确
pageYOffset | undefined | 正确 | 正确 | 正确 | 正确 | 正确
body.scrollTop | 0 | 0 | 0 | 0 | 正确 | 正确
documentElement.scrollTop | 正确 | 正确 | 正确 | 正确 | 0 | 0

## quirk 模式
quirk 模式 | IE6 7 8 | IE9 | firefox | opera | chrome | safari
-- | -- | -- | -- | -- | -- | -- |
scrollY | undefined | undefined | 正确 | 正确 | 正确 | 正确
pageYOffset | undefined | 正确 | 正确 | 正确 | 正确 | 正确
body.scrollTop | 正确 | 正确 | 正确 | 正确 | 正确 | 正确
documentElement.scrollTop | 0 | 正确 | 0 | 0 | 0 | 0

Reference：[http://blog.sina.com.cn/s/blog_8ff228d50101n4y7.html](http://blog.sina.com.cn/s/blog_8ff228d50101n4y7.html)













