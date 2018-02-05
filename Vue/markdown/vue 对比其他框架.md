## React 和 Vue 有许多相似之处
- 使用 Virtual DOM
- 提供了响应式（Reactive）和组件化（Composable）的视图组件。
- 将注意力集中保持在核心库，伴随于此，有配套的路由和负责处理全局状态管理的库。
都支持 JSX


## vue的优势
### 模板
- Vue
    - 模板是基于 html 之上进行扩展的，任何 html 语法都有效，模板写出来一目了然
    - 以 html 为中心，将 js 放在 html 里
- React 
    - JSX 是使用 XML 语法编写 Javascript 的一种语法糖，最终会被编译成 JavaScript
    - JSX 在逻辑表达能力上虽然完爆模板，但是很容易写出凌乱的 render 函数
    - JSX 的优势
        - 标签与代码混写在同一个文件中，输入一个组件的函数或者变量时可以自动补全
        - 敲错变量时，JSX 编译器会指出你手抖的具体行号
    - 以 js 为中心，将 html 放在 js 里
### 学习曲线
- vue 易学易上手，文档友好
- React，需要知道 JSX、ES2015，学习构建系统，学习曲线陡峭

### 数据流
- vue：双向绑定
- React：单向数据流

### 中文文档更新及时

### .vue 单文件组件
配合 webpack + vue-loader，每个组件都是一个单独的文件，可以全局注册和局部注册

### vue-cli
一键生成项目

## React
### 优势
### 劣势
- render 函数、getInitialState 函数等，与自定义处理函数在同一位置定义，不好区分

### 其他内容
vue：表单的双向绑定，说到底不过是 （value 的单向绑定 + onChange 事件侦听）的一个语法糖