
## rollup-plugin-node-resolve

Rollup 无法处理对`node_modules`里的包的依赖，增加此配置，可以让 Rollup 具有对`node_modules`的依赖处理的能力，并将其打包到输出文件里。


## rollup-plugin-commonjs

一些库导出成你可以正常导入的ES6模块，但是目前 NPM 中的大多数包都是以 CommonJS 模块的形式出现的。在它们更改之前，我们需要将 CommonJS 模块转换为 ES2015 供 Rollup 处理。该插件就是用来将 CommonJS 模块转换成 ES2015 模块的。


## rollup-plugin-babel

配置 Babel


## Reference

- [Rollup 与其他工具集成](http://www.rollupjs.com/tools/)
