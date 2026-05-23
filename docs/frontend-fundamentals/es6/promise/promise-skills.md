# Promise 使用技巧

[[toc]]

## 单例 Promise

有些时候我们在进行某种操作之前需要先进行初始化，初始化完成之后才能进行操作。比如在查询数据库之前，需要先连接到数据库。此时，若是并行执行多个查询，可能会多次连接数据库，导致出现问题。

```js
class DbClient {
  private isConnected: boolean;

  constructor() {
    this.isConnected = false;
  }

  private async connect() {
    if (this.isConnected) {
      return;
    }

    await connectToDatabase(); // stub
    this.isConnected = true;
  }

  public async getRecord(recordId: string) {
    await this.connect();
    return getRecordFromDatabase(recordId); // stub
  }
}

// 并发查询
const db = new DbClient();
const [record1, record2] = await Promise.all([
  db.getRecord('record1'),
  db.getRecord('record2'),
]);
```

使用单例 Promise 可以解决这个问题。

```js
class DbClient {
  private connectionPromise: Promise<void> | null;

  constructor() {
    this.connectionPromise = null;
  }

  private async connect() {
    if (!this.connectionPromise) {
      this.connectionPromise = connectToDatabase(); // stub
    }

    return this.connectionPromise;
  }

  public async getRecord(recordId: string) {
    await this.connect();
    return getRecordFromDatabase(recordId); // stub
  }
}
```

## Promise 缓存

当我们去调用基于 Promise 的异步方法，并且想要将每次调用的结果缓存起来方便以后使用，要怎么处理呢？比如请求获取用户信息的 API:

```js
const getUserById = async (userId: string): Promise<User> => {
  const user = await request.get(`https://users-service/${userId}`);
  return user;
};
```

简单的解决方案：

```js
const usersCache = new Map<string, User>();

const getUserById = async (userId: string): Promise<User> => {
  if (!usersCache.has(userId)) {
    const user = await request.get(`https://users-service/${userId}`);
    usersCache.set(userId, user);
  }

  return usersCache.get(userId);
};
```

但是这种实现，是在调用完成之后分配缓存，无法解决并发场景的问题：

```js
await Promise.all([
  getUserById('user1'),
  getUserById('user1')
]);
```

因此我们不能缓存调用结果，而是应该缓存调用 API 时返回的 Promise。

```js
const userPromisesCache = new Map<string, Promise<User>>();

const getUserById = (userId: string): Promise<User> => {
  if (!userPromisesCache.has(userId)) {
    const userPromise = request.get(`https://users-service/v1/${userId}`);
    userPromisesCache.set(userId, userPromise);
  }

  return userPromisesCache.get(userId)!;
};
```

此时，一旦 API 请求创建了，我们就将该请求的 Promise 缓存起来，在并发场景下再次请求时，返回的就是第一次请求缓存的 Promise。

### lodash.memoize 实现

使用[lodash.memoize](https://www.lodashjs.com/docs/lodash.memoize)可以将上面最后一个解决方案简化为：

```js
import _ from 'lodash';

const getUserById = _.memoize(async (userId: string): Promise<User> => {
  const user = await request.get(`https://users-service/${userId}`);
  return user;
});
```

`lodash.memoize`会将缓存函数的返回缓存下来，而`async`函数的返回，正好是个 Promise。

### 错误处理

对于 API 客户端，我们应该考虑操作可能失败的可能性。如果我们的内存实现已缓存了被拒绝的 Promise ，则所有将来的调用都将以同样的失败 Promise 被拒绝！

幸运的是，[memoizee](https://github.com/medikoo/memoizee)库支持[仅缓存`resolved`的 Promise](https://github.com/medikoo/memoizee#memoizing-asynchronous-functions)。我们的最后一个示例变为：

```js
import memoize from 'memoizee';

const getUserById = memoize(async (userId: string): Promise<User> => {
  const user = await request.get(`https://users-service/${userId}`);
  return user;
}, { promise: true});
```

## Reference

- [Advanced Async Patterns: Singleton Promises](https://www.jonmellman.com/posts/singleton-promises)
- [Advanced Promise Patterns: Promise Memoization](https://www.jonmellman.com/posts/promise-memoization)
