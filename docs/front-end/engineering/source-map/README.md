# Source Map

## 标准

[Source Map 第三版提案](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit)

## 结构

```json
{
    "version" : 3,
    "file": "out.js",
    "sourceRoot": "",
    "sources": ["foo.js", "bar.js"],
    "sourcesContent": [null, null],
    "names": ["src", "maps", "are", "fun"],
    "mappings": "A,AAAB;;ABCDE;"
}
```

- `version`：Source Map 的版本，目前为`3`。
- `file`：转换后的文件名。
-`sourceRoot`：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
-`sources`：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
-`names`：转换前的所有变量名和属性名。
-`mappings`：记录位置信息的字符串。

更多内容可参考：

- [阮一峰 - JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)



## 前提知识

- [维基百科 - Base64](https://zh.wikipedia.org/wiki/Base64)

## 疑问

### Source Map 文件是否影响网页性能？

不会影响。Source Map 只有在打开 DevTools 的情况下才会开始下载，而绝大部分用户不会打开 DevTools，因此不会有影响。

此外，Source Map 文件的请求不会显示在 Network 里（因为浏览器隐藏了），若是通过抓包工具，就能看到 Source Map 文件的请求。

### 浏览器如何知道源文件与 Source Map 文件的映射关系？

#### 方式一

```js
// 打包后的代码..
//# sourceMappingURL=bundle.js.map

// 或者
//# sourceMappingURL=http://example.com/path/to/your/bundle.js.map

// 或者
//# sourceMappingURL=base64 编码的文件内容
```

打包后的`bunlde.js`文件的末尾，会存在一行注释，指明该文件对应的 Source Map 文件的地址。详见：[MDN - Use a source map](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)。

#### 方式二

在请求打包文件`bundle.js`的响应里，添加一个响应头：

```txt
SourceMap: http://example.com/path/to/your/bundle.js.map
```

或

```txt
SourceMap: bundle.js.map
```

### 
