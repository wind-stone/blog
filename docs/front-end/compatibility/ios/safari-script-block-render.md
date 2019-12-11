# Mobile Safari 页面底部脚本下载会阻塞首屏渲染

前端项目里，页面的`script`标签通常会放在`body`标签的底部，以防止先加载`script`文件而阻塞了页面的渲染。

而且，在前端渲染的 SPA 项目里，甚至可能在底部的`script`标签之前添加一段`loading`的代码，这样在加载`script`文件时，页面就会显示`loading`而不是空白。

但是在实践中发现，当前所有版本的 iOS Safari（包括所有基于 iOS WebView 的浏览器）都存在一个 bug，下载中的`script`会阻塞页面的`loading`显示，无论脚本是否在页面底部或是否有`defer`或`async`属性。详情可见这篇文章[脚本下载会阻塞 Mobile Safari 首屏渲染](https://zhuanlan.zhihu.com/p/68290048)。

解决方法：

如下代码是[滴滴出行 WebApp 首页](http://common.diditaxi.com.cn/general/webEntry?debug=1&debugall=1&from=wlwebapp&channel=1020000001&fromlat=40.049580000000006&fromlng=116.28365000000001#/)，这是个使用了 Vue SPA 的项目，在首页底部的`script`脚本加载时，滴滴出行的 Logo 就会显示。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8>
    <meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
    <meta name=x5-cache content=disable>
    <meta name=format-detection content="telephone=yes">
    <link rel="shortcut icon" href=//static.udache.com/favicon.ico>
    <title>滴滴出行</title>
    <link href=//static.udache.com/shield/webapp5.0-homepage/css/vendor~253ae210.fa43af9a3f7ed0d6a51b.css rel=stylesheet>
    <link href=//static.udache.com/shield/webapp5.0-homepage/css/vendor~d939e436.12c697d10932d7960839.css rel=stylesheet>
    <link href=//static.udache.com/shield/webapp5.0-homepage/css/app~06837ae4.56e57c840ed01f9395f3.css rel=stylesheet>
</head>
<body>
    <div id=app-cover style=position:fixed;left:0;right:0;top:0;bottom:0;background-color:#FFF;z-index:999;>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAABKVBMVEX////8kVNkZGR5eXn+xaTCwsLd3d3g4ODk5OT9rH3Hx8evr6+0tLRubm5mZma9vb18fHz9lVl2dnZzc3Onp6f+/f2Ojo6EhITKysqtra3a2tro6OjMzMzx8fGqqqqBgYG3t7dwcHBnZ2ft7e3X19dpaWn7+/v29vb+wJyamppra2v09PTv7+/i4uL/5te5ubmxsbGHh4fr6+vJycn+0ridnZ3V1dWjo6OgoKCLi4v5+fnT09P9s4j4+PjR0dHExMSVlZXOzs6SkpL9mV/s7Oz/8Of9sYSYmJjZ2dm/v7/8/Pz/+/jz8/P/9e+2trZ4eHj9pHH9m2P/3cr+2sX+zrL9qHf6+vr/9/P+1r7+upP+to39oWv/7eL/4tF+fn7+yar/7+X/6dz/8ekbrCCfAAAHc0lEQVRo3uzXPa6cMBiF4XMkN5Qu2IMrKko6CzcICRgQMMxo7s3+F5EmhQ2TG2MzmeSKZwG85uczgNM/YJxEiA6RbppBFCIZvincvissz/AZPsPfLNwkvkRmucWGe3jLaSliwx/vCpdn+Ayf4f8+nMHbIzasabnAm6Lliv2WwL3axL6qhsADNLSI2A/6BL4qSUuO/QRtNTx1tN2x38Sgpc8B63XdaDPwk2pa2vifJ1nCy4W2GSFm7p/IdKHf+Psvntnu/ZJyRIhKc+9EjXp1lcIoOh4+sx83TO5z7X/HBB0LQhV0yE+PybdMwEGnrDN8IZd0NCmCzXTJHL+TKq50CFdrrqgKT9WGKwViXLjWTtiqHpIrukaUKzeaLoVjzFtuXBCnaril567CL3VuJLcEYpWaz8gluQpxHTSfMoiXSe6WVHhLebC6UWXNXYoKBykX+pM9jjMa+mrvOFQu6WWocbDSeF3mFMe7N3/KzjVeoxu+yqofeJ1MaT419DVeK+1UQ5c0/Qf+ivHeKzMsbdskhZg+U5x+tl9nPWpCUQDHT45hCagQAXHFHaODcYuKGtc0sWMm7Vsf5/t/jJ57AXGsTG3avrTzexCGq/ePwNzJfPjw4cOHv6nb7xchWbnfH0KCXX4Gd7T3MwvusXbXx58QTbjmKm/CiGlIoGLq3vQ6/4RWf2NNh3w8dpPD1h577jthyTDEH8KeYWwhpGHuG20a+Aa7NmnE1xakQjnETLQvADERx08v94YrQETEzz+EW4iF6NY1UAEiaG/Mg3PCnBxOmuMM2vv69asQzoe6RMN0sHEZbtBw4ZHwAm1ItMs22ZWxDOwBd0AsxcN17Iu0WfXRCd+PKAN5IFzAjgzJKtPwk00PmCPqcEVYhyef2QAzxjE8Fp5kUICfmyCqQLws1u8MS4gaEBlReCxs2bgHcM9wj5veBNWRaWaw4ZA84swZicB00y7wmmqaHcyx4SWi76SlB8JQOj7BnP1wxwn1AZAU3pLZOeexVman18AbzVZy+NNVy3rFlCUrt7agdLCjAHQRj+s5yWK6RDTEHZB6FjNr/vvrs9EDosaG04iH5PAQsRL/HqNCB27ZbAlAdKAanWQzmNHK4jMw6wxm6+y+iuH60gbg5zmNwv1MoIPZYKePiOVoQcpgzQJZuCgipmnDIq1XNFm44kmEHiy2gSgMcg7TPNyiw23EZ9oMNpdw8yKL2AkZGoT826WuFJ8UPUAWD4+u7mAchlYdeHgRD+dWLHyjiDrcUjA5zPGwJJAs+mwTh0kQFunwENGhzXTzWFhmV11N/sZhOLzH/F7zcDx8e49X4SOhpey74f1YYO/SsaYnh1ed0+ReWABu0vG9xHAaM3fDOZ4r65lJDYtJ4c+IpSA8NAz298EwcldhBXEShIt8uGEYNmweCoMrQw2dpHAaO+cgrGLfJilsXoUXaAAPs8WaDecw92CYUNhMCh9xCVHYBjJ9E65h7xI+AhlSePUnwg1U3wmvmvj8e+FFQniAOH8bVrATh9eI8o/hDb39d8N1zG4uYcMkNfwah02a+hLO0ehCR/uXwn5CeEnzhOF6gzNeC3FYx2MUdsLh2vynYeMqPINrn6PwpolmFI5MZFlAVMI/rfUoHCnL8hBx+05YZAtl/GyGrPP53HUQW8BsqXgbriHJ8hMTEEu34RSSjheEMRuhg1e7pctcp3haLg+BQbpKry/9/gEis/F4vN8GZymqLl90+3H4xIbnECyZMf1K/vIt7IwPoUWeodyHD/+qb0DkIYRWwAzL8LCDB+AKEKq24MbTAWITiEhjbzQazVL0wg/2hiXaTc1GIwHumAwiXeAqwtgXhGJK2AFX3MEqzQyAbLdUaNDOsxy8ewH+ktnSmNZSjq1Wsdhy+QXwJ63xtjXJlatwh2aaZm5vkgFwsiRJ5kwiwNRTe6climL7qwIkPQrD+zX/8rVuvPBaUJ32lULq2QNilQFKs2NhZJcsSJBvQ8yjL5cf00sQrmYmTgXAzatwJ+xXniBSz78szIOzLwyX/IP2rtsoHFK7wpK/9VMv8iUOK/LVIyLLsuPTSzDlpAYmncJJhSCsuq7YcF03mK0q2tIXTgCYyjPFOY6L2xow3bpnK47hqMUpkPOnSPUqPF6KENho5Jhnry0gUx/yleGwYdLURKHF2W7Sy4lfY1dXPJF0xAGdozVrW4WiWw3C3zzPBsuunimcfKkPegW4s0ScvUj41Kb6spTbbeO5zU9NcNk/Z+yOzoEUO1tg+kBqk1nb7/XGT0F4ffLsQf500t4Ng+VBYEdOS4WsgMjGSaNNSgIu8xKGlR6Q4eJwCXcNmLXHVdBfgnBx6NklHw7Fd8Ox9nxe6He09XrtBj9jKTkMZuES3u4pvHfUfPiNx5JnS3m1pzwYhpVSm5Z0WgS4c36hl98JK5ewplGYtsKSD1mvlmezCzEzpEfC5aU9eqH60Nb5XZw5IA4FrfMpDDuq6vdVVV0Wg/COpi4IRrimuezxfIKQVeUHv0ESuRvvxx9b8b0B2ytUaMOJHD1/MnBricLTQhn+Q98Bf1kN8ncrXQ4AAAAASUVORK5CYII="
            style="width:60px;height:60px;display:block;margin:197px auto 0 auto;" alt=滴滴出行>
    </div>
    <div id=app></div>
    <script src=//static.udache.com/activity-tools/lib/zeptoWithDeferred.min.js crossorigin=anonymous></script>
    <script type=text/javascript src=//static.udache.com/shield/webapp5.0-homepage/js/manifest.bd073697a4b51b6d84e7.js crossorigin=anonymous></script>
    <script type=text/javascript src=//static.udache.com/shield/webapp5.0-homepage/js/vendor~253ae210.c534b4e9c2e78d4367ba.js
        crossorigin=anonymous></script>
    <script type=text/javascript src=//static.udache.com/shield/webapp5.0-homepage/js/vendor~d939e436.59c4f6ed193a2f125630.js
        crossorigin=anonymous></script>
    <script type=text/javascript src=//static.udache.com/shield/webapp5.0-homepage/js/app~06837ae4.fd64c40729d39f99cdd4.js
        crossorigin=anonymous></script>
</body>
</html>
```

需要注意的是，参考滴滴出行首页代码之前，我曾写过一个版本，不同的地方有：

- 标签的内联样式改放在`head`的`style`标签里
- 将`img`标签改成其他标签并使用背景图片来代替`img`

但是，就因为这两个问题，导致最终在`script`文件加载时，`loading`没有显示出来。因此，若是遇到相同的情况，可严格按照滴滴出行首页的代码格式来实现。
