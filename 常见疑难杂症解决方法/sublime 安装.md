# 无法使用 package control 安装插件

描述：

通过 shift + command + P 打开，输入 package console: install package，几秒后弹出窗口提示 ‘Package Control  There are no packages available for installation’，打开控制台，显示信息‘Package Control: Error downloading channel. URL error [Errno 65] No route to host downloading https://packagecontrol.io/channel_v3.json’


解决方法：

1. $ ping sublime.wbond.net，可以获得IP地址50.116.34.243
2. $ sudo vi /etc/hosts，输入系统密码，按i进入insert模式，输入下面内容
```
#to solve sublime Text IPv6
50.116.34.243 sublime.wbond.net
#end
```
3. 完了之后按esc退出insert模式，:wq保存并退出

参考文档：[http://crossingmay.com/2015/12/30/sublimeipv6/](http://crossingmay.com/2015/12/30/sublimeipv6/)