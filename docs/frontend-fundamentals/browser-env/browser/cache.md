# 缓存机制

[[toc]]

## 参考文档

- [MDN - HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [RFC 7234: Hypertext Transfer Protocol (HTTP/1.1): 4.2.2.  Calculating Heuristic Freshness](https://datatracker.ietf.org/doc/html/rfc7234#section-4.2.2)

## 浏览器默认过期时间（启发式新鲜度检查）

A 页面 HTML 的响应头：

```sh
# Response headers
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Wed, 29 Dec 2021 10:41:07 GMT
Transfer-Encoding: chunked
```

B 页面 HTML 的响应头：

```sh
# Response headers
Connection: keep-alive
Date: Wed, 29 Dec 2021 10:39:40 GMT
ETag: "61cadb92-1cf6"
Last-Modified: Tue, 28 Dec 2021 09:40:34 GMT
```

问：浏览器会缓存页面 A、B 的 HTML 吗？

答：浏览器会缓存页面 B 的 HTML，但不会缓存页面 A 的 HTML。

以上两个 HTML 的响应头里都没有`Cache-Control`和`Expires`，且响应头里也不包含其他缓存相关的限制，因此浏览器默认会采用一个启发式的算法, 通常会取响应头的`Date`值 - `Last-Modified`值的`10%`作为缓存时间。

MDN 原文如下：

> Heuristic freshness checking
>
> If an origin server does not explicitly specify freshness (for example, using Cache-Control or Expires header) then a heuristic approach may be used.
>
> If this is the case, look for a Last-Modified header. If the header is present, then the cache's freshness lifetime is equal to the value of the Date header minus the value of the Last-modified header divided by 10. The expiration time is computed as follows:
>
> > expirationTime = responseTime + freshnessLifetime - currentAge
>
> where responseTime is the time at which the response was received according to the browser. For more information see [RFC 7234: Hypertext Transfer Protocol (HTTP/1.1): 4.2.2.  Calculating Heuristic Freshness](https://datatracker.ietf.org/doc/html/rfc7234#section-4.2.2)
