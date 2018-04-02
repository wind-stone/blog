## package-lock.json

`package-lock.json`是在执行`npm install`时自动生成的文件，记录了`node_modules`文件夹下实际安装的依赖的版本。

如果项目里存在`package-lock.json`文件且还未安装依赖，执行`npm install`时，将按照`package-lock.json`文件里记录的版本进行安装，保证每个使用者安装完全一样的依赖。之后，所有导致 node_modules 里依赖改变的 npm 操作如`npm update`等都会导致更新`package-lock.json`文件。

Reference:
- [https://docs.npmjs.com/files/package-lock.json](https://docs.npmjs.com/files/package-lock.json)