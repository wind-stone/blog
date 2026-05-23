# 队列函数迭代执行

常常会遇到这样的场景：

- 队列里有多个函数
- 队列里的每个函数会有一个`next`函数
- 队列里的函数按序执行，执行后会调用`next`以确定队列里的下一个函数是否继续执行

## 实现

### 队列执行器

```js
/**
 * 队列执行器
 * @param queen 函数队列
 * @param iterator 迭代器，真正执行“各个队列函数”的函数
 * @param cb 队列里的函数执行完毕后的回调函数
 */
function runQueen(queen, iterator, cb) {
  const step = (index) => {
    if (index >= queen.length) {
      cb()
    } else {
      // 需要判断队列里的索引为 index 的元素是否存在
      if (queen[index]) {
        // 把队列里的函数交给迭代器去执行，由迭代器判断是否要继续往下执行
        iterator(queen[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }

  // 执行队列里的第一个函数
  step(0)
}
```

### 迭代器

```js
let sum = 0

/**
 * 迭代器，在此内真正执行队列里的每个函数，
 * 并根据函数执行结果，判断是否继续调用队列里的下一个函数
 *（可以在此过程中，给 queenFn 注入除了 next 之外的参数）
 * @param queenFn 队列里的每个函数
 * @param next 执行该函数，会继续调用队列里的下一个函数
 */
function iterator(queenFn, next) {
  queenFn(sum, rst => {
    if (rst !== false) {
      sum += rst
      next()
    }
  })
}
```

### 测试

```js
const queen = [
  function (value, next) {
    console.log('队列里第一个函数的 value 参数为: ' + value)
    next(1)
  },

  function (value, next) {
    console.log('队列里第二个函数的 value 参数为: ' + value)
    next(2)
  },

  // 第三个函数为空
  ,

  function (value, next) {
    console.log('队列里第四个函数的 value 参数为: ' + value)
    next(4)
  },

  function (value, next) {
    console.log('队列里第五个函数的 value 参数为: ' + value)
    next(5)
  },

  function (value, next) {
    console.log('队列里第六个函数的 value 参数为: ' + value)
    // next(false) 将停止调用队列里的下一个函数
    next(false)
  },

  function (value, next) {
    console.log('队列里第七个函数的 value 参数为: ' + value)
    next()
  }
]

runQueen(queen, iterator, () => {
  console.log('sum: ', sum)
})
```
