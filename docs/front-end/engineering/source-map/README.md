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
    "mappings": "AAgBC,SAAQ,CAAEA"
}
```

- `version`：Source Map 的版本，目前为`3`。
- `file`：转换后的文件名。
-`sourceRoot`：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
-`sources`：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
-`names`：转换前的所有变量名和属性名。
-`mappings`：记录位置信息的字符串。

`mappings`属性的内容是这样的：

```txt
mappings: "AAAAA,BBBBB;CCCCC"
```

就表示，转换后的源码分成两行，第一行有两个位置，第二行有一个位置。

每个位置使用五位，表示五个字段。

从左边算起，

- 第一位，表示这个位置在（转换后的代码的）的第几列。
- 第二位，表示这个位置属于`sources`属性中的哪一个文件。
- 第三位，表示这个位置属于转换前代码的第几行。
- 第四位，表示这个位置属于转换前代码的第几列。
- 第五位，表示这个位置属于`names`属性中的哪一个变量。

### Base VLQ 编码是如何让 Source Map 文件尽量小的？

- 通过`;`来分隔每一行，因此可以省略打包后文件的行号
- 通过第二位指明是`sources`里的哪一个文件，通过第五位指名是`names`里的哪一个变量
- 使用相对偏移，将原先较大的数字变为较小的数字

更多内容可参考：

- [阮一峰 - JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
- [Source Maps under the hood – VLQ, Base64 and Yoda](https://docs.microsoft.com/en-us/archive/blogs/davidni/source-maps-under-the-hood-vlq-base64-and-yoda)，这篇文章非常详细地说明了编码过程。

Q: 每个 Base64 的字符是 6 比特，代表一个 VLQ 的二进制组（`binary group`），在这个 6 比特的二进制组里第一位是连续的指示符（`0`为不连续，`1`为连续），最后一位是符号位（`0`为正，`1`为负），只有剩下的 4 位表示一个数字，这意味着 Source Map 里的最大偏移量为 16 ？

A: 不会，若偏移超过 16，则会用 2 个及以上二进制组来表示，因此一个偏移量可能会产生多个 Base64 字符。因此`mappings`里的每个位置上的字符数可能不止 5 个，但是其所代表的信息最多 5 个，也就是说，里面的多个字符可能代表 1 个信息。

实例：

`program.ts`:

```ts
const aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = 1;
```

经过 TypeScript Compiler 编译后，产生`program.js`和`program.js.map`。

`program.js`:

```js
"use strict";
var aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = 1;
//# sourceMappingURL=program.js.map
```

`program.js.map`:

```json
{
    "version":3,
    "file":"program.js",
    "sourceRoot":"",
    "sources":["../src/program.ts"],
    "names":[],
    "mappings":";AAAA,IAAM,oCAAoC,GAAG,CAAC,CAAC"
}
```

其中的`mappings`经过[Base64 VLQ 解码](https://www.murzwin.com/base64vlq.html)后，得到:

```txt
1) [0,0,0,0], [4,0,0,6], [36,0,0,36], [3,0,0,3], [1,0,0,1], [1,0,0,1]
```

注意，上面的数字都是表示偏移。

```txt
Format: (([from_position](source_index)=>[to_position]))
([0,0](#0)=>[1,0]) | ([0,6](#0)=>[1,4]) | ([0,42](#0)=>[1,40]) | ([0,45](#0)=>[1,43]) | ([0,46](#0)=>[1,44]) | ([0,47](#0)=>[1,45])
```

可以发现，`oCAAoC`里的第一个`oC`只代表第一位，即转换后的列号，`oC`是对`36`的编码；第二个`oC`是转换前的列号。

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
