# ClickHouse

## 常用函数

### concat

```sql
SELECT
    $timeSeries as t,
    sum(`count`),
    concat('字符串第一部分', first, '，字符串第二部分', extra2)
FROM $table
WHERE
    `timestamp` >= toDateTime($from)
    AND `timestamp` < toDateTime($to)
    AND dt >= toDate($from)
    AND dt <= toDate($to)
GROUP BY t, concat('字符串第一部分', first, '，字符串第二部分', extra2)
ORDER BY t
```

### JSONExtractString

```sql
SELECT
    $timeSeries as t,
    JSONExtractString(person, 'name') as name,
    count() AS c
FROM $table
WHERE $timeFilter
AND ...
GROUP BY t, name
ORDER BY t
```
