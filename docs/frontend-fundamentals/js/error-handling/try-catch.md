# 错误处理 - try catch

[[toc]]

## try catch 无法捕获的错误

`try...catch`无法捕获异步错误和语法错误。

```js
window.onerror = err => {
    console.log('全局捕获错误', err)
}

// 测试异步错误
try {
    let x = 1;
    setTimeout(() => {
        x = x + y
    })
} catch (err) {
    console.log('异步错误', err)
}
// 抛错: Uncaught ReferenceError: y is not defined


// 测试语法错误
try {
    const a = '1;
} catch(err) {
    console.log('语法错误', err)
}

// 抛错: Uncaught SyntaxError: Invalid or unexpected token
```

## finally

即使`try...catch...`语句块里存在`return`，`finally`里的语句也会执行，且`finally`里的`return`会覆盖`try`里的`return`。

```js
function foo(){
  try{
    return 0;
  } catch(err) {
    // ...
  } finally {
    console.log("a")
  }
}

console.log(foo());

// 结果
// a
// 0
```

```js
function foo(){
  try{
    return 0;
  } catch(err) {

  } finally {
    console.log("a")
    return 1;
  }
}

console.log(foo());

// 结果
// a
// 1
```
