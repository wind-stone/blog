# 本地 Mock 数据

本地 mock 数据主要依赖于`webpack-dev-server`的能力。

第一步：与`src`同级新建一个`mock`目录，目录里创建`index.js`文件，内容如下。

```js
// src/mock/index.js
const path = require('path');
const fs = require('fs');

// 设置 mock api 的根目录
const rootDir = path.resolve(__dirname, 'rest');

// 获取所有需要 mock 的 api 列表，比如 ['/rest/a', '/rest/path/b']
const getApiList = (dir) => {
  let apiPaths = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (dirent) {
    const filePath = path.join(dir, dirent.name);
    if (dirent.isFile()) {
      if (filePath.endsWith('.js')) {
        const api = filePath.replace(__dirname, '').replace('.js', '');
        apiPaths.push(api);
      }
    } else if (dirent.isDirectory()) {
      const subApiPaths = getApiList(filePath);
      apiPaths = apiPaths.concat(subApiPaths);
    }
  });
  return apiPaths;
};

const apiList = getApiList(rootDir);

module.exports = (app) => {
  apiList.forEach((api) => {
    ['get', 'post'].forEach((method) => {
      app[method](api, (req, res) => {
        const fileName = path.resolve(__dirname, api.slice(1) + '.js');
        const fileContent = fs.readFileSync(fileName, 'utf-8');
        let fnStr = fileContent.replace(/\s*module.exports\s*=\s*/, ''); // 函数的字符串格式

        // 删去函数闭合标签之后的内容，否则会报错
        let lastRightBraceIndex = fnStr.lastIndexOf('}');
        fnStr = fnStr.substring(0, lastRightBraceIndex + 1);

        // 将字符串函数转换成函数
        const fn = eval(`(false || (${fnStr}))`);

        // 返回函数执行结果
        res.json(fn(req, res));
      });
    });
  });
};
```

第二步，在`mock`目录下新建`rest`目录（这个目录可以随便换，但是上一步代码里的`rootDir`也要跟着换）。每个接口都要新建一个`js`文件来放置想要 Mock 返回的数据。比如

```js
// rest/a.js
module.exports = (req, res) => {
    // 这里可以根据 params 动态返回数据
    const { url, method, params } = req;
    return {
        code: 0,
        data: {
        a: 1,
        },
    };
};
```

```js
// rest/path/b.js
module.exports = function (req) {
  const { url, method, params } = req;
  return {
    code: 1,
    errorMsg: '出错啦'
  };
};
```

第三步：在 Webpack 的`devServer`里配置`before`钩子，当启动项目且存在环境变量`MOCK`为`true`时，就是启用 Mock 数据。

```js
// vue.config.js
module.exports = {
    // ...
    devServer: {
        // ...
        before: process.env.MOCK === 'true' && require('./mock')
    }
}
```

第四步：添加脚本，以后本地开发项目想 mock 数据时，执行`yarn run mock`

```json
// package.json
{
    "scripts": {
        "mock": "MOCK=true vue-cli-service serve"
    }
}
```
