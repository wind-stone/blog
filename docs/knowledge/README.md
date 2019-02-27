# 简介

这里将记录前端的主要知识点，包括：

- JavaScript
- CSS
- HTML-DOM
- 浏览器环境
- Node 环境

## 常用词语的翻译

- kebab-case: 短横线隔开
- camelCased: 驼峰命名，分为大驼峰（CamelCased 或 PascalCase）和小驼峰（camelCased）

## 其他配置

### 配置本地 hosts 文件

在浏览器中输入`www.baidu.com`域名，操作系统会先检查自己本地的`hosts`文件查看是否有这个网址映射关系，如果有，就先调用这个 IP 地址映射，完成域名解析。完整的 DNS 解析过程，请查看[知乎 - DNS解析的过程是什么，求详细的？](https://www.zhihu.com/question/23042131)

#### MAC 电脑

1. 打开`Finder`在菜单中选择`前往` --> `前往文件夹`，或使用快捷键`Command + Shift + G`
2. 输入跳转路径`/private/etc/`，点击`前往`
3. 找到`hosts`文件
4. 以下两种方式，任选其一：
    - 选择用`VS Code`打开，添加`IP <-> 域名`映射关系，保存。此时`VS Code`右下角会提示`无法保存“hosts”: 权限不足。选择“以管理员身份覆盖”可作为管理员重试。`，按提示操作即可。
    - 将`hosts`文件复制到桌面，打开并编辑映射关系，保存。将桌面上的`hosts`文件拖拽到`/private/etc/`文件夹下替换原来的`hosts`文件，此时系统为防止误覆盖，系统会要求你输入密码，输入密码即可。
