# Shell 脚本

## 常用代码

```sh
#!/bin/bash

# 判断是否传入了第一个参数
if [ -z "$1" ]; then
    echo "未传入第一个参数"
else
    echo "传入了第一个参数"
fi
```

`-z`: 检测字符串长度是否为`0`，为`0`则返回`true`。
