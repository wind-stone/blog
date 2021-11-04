# MongoDB

目前 MongoDB 数据库安装在`/usr/local/mongodb`目录

## 常用命令

### 启动

```sh
cd /usr/local/mongodb/bin

./mongod --config mongod.conf
```

## mongo shell

### 连接数据库

```sh
cd /usr/local/mongodb/bin
./mongos --host "mongodb://172.29.79.26:40105"
```

### 数据库操作

```sh
# 查看当前正在使用的数据库，默认返回数据库 test
db

# 列出所有可用的数据库
show dbs

# 切换数据库
use <database>

# 显示结合列表
show collections
```

### 数据操作

```sh
# 删除集合里的所有数据，可增加筛选条件
db.collectionName.deleteMany({})
```

### 数据操作示例

#### 通过 _id 查询记录

```sh
db.operationlogs.find({
    _id: ObjectId('6155934750c863001ad44c9f')
})
```

#### 统计查询结果数量

```sh
db.collectionName.find({
    groupKey: 'mpSearchKeyword',
    createTime: {
        $gte: new Date('2021-10-09'),
        $lte: new Date('2021-10-12')
    }
}).count() // 统计查询结果数量
```

## WriteConcern/ReadConcern

## Replica Set 副本集

## 分片集群

- [Difference between Sharding And Replication on MongoDB](https://dba.stackexchange.com/questions/52632/difference-between-sharding-and-replication-on-mongodb)

分片集群是将数据分成多份（每份数据相互不重复）存储在不同的集群上，类似于 Kafka 的分区。

副本集是为要储存的数据做备份，类似于 Kafka 的副本。

针对大型应用来说，首先会将数据分成相互独立的 n 份，分布式储存在分片集群的 n 个分片上，每个分片上的数据量约为总数据量的 1/n。
其次，每个分片都是个副本集，会为该分片上的数据做 m 个备份。

## 事务

- 事务里，若是先插入一条数据，再查询这条数据，能查到吗？

能，但是要设置 writeConcern 和 readConcern，

```js
// 写入时保证大多数节点写入成功
db.order.insert({"id": "123456789"}, {writeConern: {w: "majority"}})

// 读取时保证这条数据已在大多数节点存在
db.order.find({"id": "123456789"}).readPref("secondaryPreferred").readConcern("majority")
```

## 参考文档

- 公司内的“初识MongoDB”
- 公司内的“MongoDB中的可调一致性”
- [MongoDB 事务 —— 基础入门篇](https://juejin.cn/post/6844904066049392654)
- [MongoDB 事务 —— 多文档事务实践篇](https://juejin.cn/post/6844904073573957646)
