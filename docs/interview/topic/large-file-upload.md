# 大文件上传及断点续传

参考文章：[字节跳动面试官：请你实现一个大文件上传和断点续传](https://juejin.cn/post/6844904046436843527)，如下内容皆来自于此文章，[代码示例](https://github.com/yeyan1996/file-upload)。

## 重难点

- 分片上传（前端、后端）
- 断点续传
  - 文件 hash
  - 暂停上传
  - 恢复上传
- 进度条显示

## 核心思路

### 分片上传

分片上传的核心是，将要上传的大文件通过利用`Blob.prototype.slice 方法`分割成多个切片，携带切片顺序并行上传，由服务端合并切片重组成大文件。

#### 前端部分

- 用户选择文件后，将文件分割成多个切片，比如每个切片 10M，并携带切片顺序并行上传
- 所有切片上传后，发送切片合并请求

```js
const SIZE = 10 * 1024 * 1024;
const container = {
    file: null
}
let data;

// 选择文件
function handleFileChange(e) {
    const [file] = e.target.files;
    if (!file) return;
    container.file = file;
}

// 分割成切片
function createFileChunk(file, size = SIZE) {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
    }
    return fileChunkList;
},

// 上传切片
function async uploadChunks() {
   const requestList = data
     .map(({ chunk，hash }) => {
       const formData = new FormData();
       formData.append("chunk", chunk);
       formData.append("hash", hash);
       formData.append("filename", container.file.name);
       return { formData };
     })
     .map(({ formData }) =>
       request({
         url: "http://localhost:3000",
         data: formData
       })
     );
    // 并发请求
    await Promise.all(requestList);
}

// 上传
async handleUpload() {
    if (!container.file) return;
    const fileChunkList = createFileChunk(container.file);
    data = fileChunkList.map(({ file }，index) => ({
        chunk: file,
        // 文件名 + 数组下标
        hash: this.container.file.name + "-" + index
    }));
    await uploadChunks();
}
```

#### 后端部分

- 接收到切片后，将切片文件临时存储下来，文件名为：原始 hash + 顺序
- 接口到切换合并请求，将切片组合起来，写入到一个单独的文件里

疑问：如果后端是多实例部署，如何确保能拿到所有的切片并组装？

### 断点续传

断点续传的原理在于前端/服务端需要记住已上传的切片，这样下次上传就可以跳过之前已上传的部分，有两种方案实现记忆的功能：

- 前端使用`localStorage`记录已上传的切片 hash
- 服务端保存已上传的切片 hash，前端每次上传前向服务端获取已上传的切片

第一种是前端的解决方案，第二种是服务端，而前端方案有一个缺陷，如果换了个浏览器就失去了记忆的效果，所以这里选后者。

#### 文件 hash

文件的 hash 需要做到文件名更改之后 hash 不变，因此得基于文件内容去生成文件的 hash。（Webpack 的产物 contentHash 也是基于这个思路实现的）

这里可以用[spark-md5](https://github.com/satazor/js-spark-md5)这个库，它可以直接在浏览器中运行，生成文件的 hash。

此外，因为读取文件内容计算 hash 非常耗时，且引起 UI 的阻塞，导致页面假死，因此需要使用 Web Worker 在 worker 线程计算 hash。

```js
// /public/hash.js
​
// 导入脚本
self.importScripts("/spark-md5.min.js");
​
// 生成文件 hash
self.onmessage = e => {
  const { fileChunkList } = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;
  const loadNext = index => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].file);
    reader.onload = e => {
      count++;
      spark.append(e.target.result);
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()
        });
        self.close();
      } else {
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage
        });
        // calculate recursively
        loadNext(count);
      }
    };
  };
  loadNext(0);
};
```

#### 文件秒传

所谓的文件秒传，即在服务端已经存在了上传的资源，所以当用户再次上传时会直接提示上传成功。

上传前，先计算出文件 hash，并把 hash 发送给服务端进行验证，由于 hash 的唯一性，所以一旦服务端能找到 hash 相同的文件，则直接返回上传成功的信息即可。

#### 暂停上传

断点续传顾名思义即断点 + 续传，所以第一步先实现“断点”，也就是暂停上传。

原理是使用 XMLHttpRequest 的`abort`方法，可以取消一个`xhr`请求的发送，为此需要将上传每个切片的`xhr`对象保存到 List 里（如果切片上传成功，就将其对应的`xhr`从 List 里移除），当用户点击取消上传时，遍历所有未完成切片上传的`xhr`对象，调用`abort`方法取消上传。

#### 恢复上传

当切片上传完成之后，服务端会将已上传完成的切片保存起来。

当恢复上传时，前端先调用一个接口获取已上传完成的切片序号，然后过滤这些已上传完成的切片，将剩余的未上传完成的切片发送给服务端。

### 进度条显示

使用原生 XMLHttpRequest 的`xhr.upload.onprogress`对切片上传进度的监听。
