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

## Replica Set 副本集
