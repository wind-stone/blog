# Webpack 配置实践

[[toc]]

## splitChunks

### 默认配置

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

说明:

- `splitChunks.cacheGroups`下的每个属性对象，都会继承或覆盖`splitChunks.*`，但`test`、`priority`和`reuseExistingChunk`是`splitChunks.cacheGroups`专有的属性

因此，对于`vendors`这个缓存组来说，实际上是这样的：

```js
module.exports = {
  //...
  optimization: {
    // ...
    splitChunks: {
      // ...
      cacheGroups: {
        vendors: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          automaticNameMaxLength: 30,
          name: true,
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
        // ...
      }
    }
  }
}
```

- `chunks`确定参与分离的`chunk`有哪些
- `test`确定参与分离的`chunk`里的哪些模块会位于这个缓存组
- `name`确定模块最终属于哪个`split chunk`

可以看到，splitChunks 的默认分组配置里，`vendors`和`default`分组的`priority`分别为`-10`和`-20`，这是为了方便用户自定义的分组能够有更高的优先级（自定义分组的默认`priority`是`0`）。
