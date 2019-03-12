---
sidebarDepth: 0
---

# Nginx

[[toc]]

## 健康检查

Nginx 主要有两种主流的健康检查模式：被动检查模式、主动检查模式。

### 被动检查模式

Reference: [Nginx 官网 - 健康检查](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)

Nginx 在代理请求过程中会自动地监测每个后端服务器对请求的响应状态，若某个后端服务器在`fail_timeout`时间内累计发送请求失败或未接收到响应达到`max_fails`次时，Nginx 将会标记该服务器不可用，并在之后的`fail_timeout`时间内不往该服务器上发送请求。`fail_timeout`时间之后，Nginx 还是会转发少量的请求到该后端服务器来探测它的返回状态，以便识别该服务器是否恢复。

被动检查模式是 Nginx 内置的功能，可以直接通过参数设置来开启。

```
upstream backend {
    server backend1.example.com;
    server backend2.example.com max_fails=3 fail_timeout=30s;
}
```

- `fail_timeout`: 该参数有两个含义，默认为`10s`
  - 在该时间内，若 Nginx 请求失败或未接收到请求达到`max_fails`次，Nginx 将标记该服务器不可用
  - 表示服务器被标记为不可用的持续时间。该时间后，Nginx 将再次发送请求来检查服务器状态
- `max_fails`: 设置 Nginx 请求失败或未接收到请求的最大次数，达到该次数，服务器将被标记为不可用。默认是 1 次

### 主动检查模式

Nginx 服务端会按照设定的时间间隔`interval`主动向后端服务器发出检查请求，来验证后端服务器的可用状态。若某个服务器返回失败超过设定的次数，Nginx 就会将该服务器标记为异常，在此次`interval`期间将不再分发流量到该服务器，而是分发到其他服务器上。经过`interval`间隔之后，Nginx 会再次发出检查请求，若此时服务器可用，Nginx 将会标记该服务器为正常，进而继续向该服务器分发流量。

使用这种方式，一般需要后端服务器为 Nginx 提供一个低消耗的接口，用于检查该服务器状态。
