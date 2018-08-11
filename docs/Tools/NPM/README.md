---
sidebarDepth: 0
---

# 知识点

[[toc]]

## 局部安装的 NPM 包，执行命令

某 NPM 包是局部安装在项目的`node_modules`目录下，比如

```sh
npm i babel-cli -D
```

若想通过命令行调用，可以在项目根目录的`package.json`文件里添加：

```js
{
  // ...
  "devDependencies": {
    "babel-cli": "^6.0.0"
  },
  "scripts": {
    "build": "babel src -d lib"
  },
}
```

如此，执行`npm run build`时，就会间接执行`babel src -d lib`
