# 发布

发布声明文件到 NPM 主要有两种方式:

- 与 NPM 包捆绑在一起发布
- 发布到 NPM 上的[@types organization](https://www.npmjs.com/~types)

若你能控制要使用你发布的声明文件的那个 NPM 包的话，推荐第一种方式。

无论是上述哪一类发布方式，最终的使用方式都是相同的，使用`import`从 NPM 包上引入即可。

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  // `createElement` 是可推导的，但是 `render` 需要返回值类型
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```
