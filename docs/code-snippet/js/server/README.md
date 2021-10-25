# 服务器环境

[[toc]]

## 获取本机 IPv4 地址

```js
/**
 * 获取本机 IPv4 地址
 * Reference: https://nodejs.org/dist/latest-v6.x/docs/api/os.html#os_os_networkinterfaces
 */
exports.getIPv4Addr = function() {
    const networkInterfaces = require('os').networkInterfaces();
    const addresses = [];

    Object.keys(networkInterfaces).forEach(function(networkInterface) {
        networkInterfaces[networkInterface].forEach(function(address) {
            if (address.internal === false && address.family === 'IPv4') {
                addresses.push(address.address);
            }
        });
    });
    return addresses.length > 0 ? addresses[0] : 'localhost';
};
```
