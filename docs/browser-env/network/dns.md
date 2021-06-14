# DNS

[[toc]]

最近一段时间在尝试往谷歌云上部署 NodeJS 的项目，并配置自定义域名，指向谷歌云上的 NodeJS 项目。

自已的域名`windstone.cc`是在阿里云购买的，在谷歌云控制台上配置自定义域名时，需要在域名提供商（阿里云）那里配置 DNS 记录，以证明我拥有该域名的所有权。再次过程中，学习了一些 DNS 记录相关的内容。

## DNS 记录类型

常见的几种 DNS 记录类型有：

- A 记录：指定域名的 IPV4 地址
- AAAA 记录：指定域名的 IPV6 地址
- CNAME 记录：将域名指向另一个域名，类似于域名重定向
- NS 记录：为子域名指定其他 DNS 解析服务器
- TXT 记录：一般指某个主机名或域名的说明，也可用于其他用途

Reference：

- [dns和常见dns记录类型介绍](https://blog.csdn.net/u013920085/article/details/42552987)
- [阮一峰 - DNS 原理入门](http://www.ruanyifeng.com/blog/2016/06/dns.html)
