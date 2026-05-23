# Date

[[toc]]

## 已知年月，计算该月天数

以求 2019 年 2 月有多少天为例。

- 方式一

新建日期对象传入年月日参数时，如果传入的`day`超过该月的最大天数，则日期将自动前进。

```js
new Date(2019, 1, 32).toLocaleDateString()  // 2019/3/4
```

上面示例的意思是，2019 年 2 月第 32 日，因为 2019 年 2 月只有 28 天，因此 2 月第 32 天，即是 3 月 4 日。

因此，可通过下列函数计算某年某月的天数。

```js
function getMonthCountDay (year, month) {
  return 32 - new Date(year, month, 32).getDate()
}
```

- 方式二

类似于方式一，若传入的`day`是 0 或负数，则日期将自动倒退。

```js
new Date(2019, 1, 0).toLocaleDateString()   // 2019/1/31
new Date(2019, 1, -1).toLocaleDateString()  // 2019/1/30
```

上面示例的意思是，2019 年 2 月第 0 天，即是 2019 年 1 月 31 日。2 月第 -1 天，即是 1 月 30 日。

因此，可通过下列函数计算某年某月的天数。

```js
function getMonthCountDay (year, month) {
  return new Date(year, month + 1, 0).getDate()
}
```

Date API 处理日期溢出时的规则，类似于加法进位，减法退位。

- `new Date(2019, 0, 50)`，其中0代表1月，1月只有31天，则多出来的19天会被加到2月，结果是2019年2月19日
- `new Date(2019, 20, 10)`，1年只有12个月，多出来的9个月会被加到2020年，结果是2020年9月10日
- `new Date(2019, -2, 10)`，2019年1月10日往前推2个月，结果为2018年11月10日
- `new Date(2019, 2, -2)`，2019年3月1日往前推2天，结果为2019年2月26日

Reference: [小技巧：已知年月，求该月共多少天？](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/41)
