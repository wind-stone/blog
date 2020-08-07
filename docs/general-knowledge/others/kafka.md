# Kafka

精读了以下文章：

- [入门级理解kafka 一篇文章就够了](https://blog.csdn.net/Forward__/article/details/80137563)

## 疑问

- 针对 Topic，根据什么来分 Partition？Partition 是怎么制定的？
- Consumer 同时消费一个 Partition 或多个？如何保持时序？

## 基本知识点

- 同一 Topic 下的消息，会分布式地存储在该 Topic 下的不同 Partition 里，同一条消息只会出现在一个 Partition 里。但是同一 
- Kafka 中的数据不会因被 Consumer 消费后而丢失，而是通过配置指定消息保存时长。

### Replication

Replication 机制主要用于容错，会将同一 Partition 复制多份 Replication 存储在不同的 Broker 上，可防止因为某一 Partition 数据丢失而导致错误。

这些 Replication 中有且只有一个 Leader 角色，其余 Replication 皆为 Follower。Producer 发布消息都是由 Leader 负责写入，并同步到其他的 Follower 分区中。如果 Leader 失效，则某个 Follower 会自动替换，成为新的 Leader。此时，Follower可能落后于 Leader，所以从所有 Follower 中选择一个”up-to-date”的分区。

关于性能方面，考虑 Leader 不但承载了客户的连接与消息写入，还负责将消息同步至不同的 Follower 分区上，性能开销较大。因此，不同 Partition 的 Leader Replication 分布在不同的 Kafka 节点上，从而防止某个节点压力过载。
