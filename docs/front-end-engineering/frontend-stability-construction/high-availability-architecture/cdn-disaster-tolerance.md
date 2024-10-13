# CDN 容灾

CDN 域名容灾，详见：[从0到1：美团端侧CDN容灾解决方案](https://tech.meituan.com/2022/01/13/phoenix-cdn.html)

## 目标

- CDN 容灾
  - 某个 CDN 域名异常（比如 DNS 劫持、解析异常）时，可快速切换到新的域名
- 实现 CDN 负载均衡、全局最优调度
  - 防止 QPS 过高导致将 CDN 厂商打挂引起雪崩
