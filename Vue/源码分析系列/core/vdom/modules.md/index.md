# modules 源码学习及收获

将`ref`、`directives`模块暴露出去

## 源码

```js
import directives from './directives'
import ref from './ref'

export default [
  ref,
  directives
]
```
